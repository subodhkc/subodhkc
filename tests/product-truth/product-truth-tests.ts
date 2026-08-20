/**
 * Product Truth Tests
 *
 * Validates that the canonical product fact registry is internally consistent
 * and that forbidden legacy terms do not appear in customer-facing files.
 *
 * Run: npx tsx tests/product-truth/product-truth-tests.ts
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'fs'
import { join, relative } from 'path'
import {
  PRODUCT_FACTS,
  validateRegistryConsistency,
  findForbiddenClaims,
  findLegacyTermsInPublicCopy,
  FORBIDDEN_CLAIMS,
  LEGACY_TERMS_IN_PUBLIC_COPY,
} from '../../lib/commercial/product-facts'

// ─── Test Framework ──────────────────────────────────────────────────

let passed = 0
let failed = 0
const failures: string[] = []

function assert(condition: boolean, message: string) {
  if (condition) {
    passed++
  } else {
    failed++
    failures.push(message)
    console.log(`  FAIL: ${message}`)
  }
}

function assertEqual(actual: unknown, expected: unknown, message: string) {
  const actualStr = JSON.stringify(actual)
  const expectedStr = JSON.stringify(expected)
  if (actualStr === expectedStr) {
    passed++
  } else {
    failed++
    failures.push(`${message} (expected ${expectedStr}, got ${actualStr})`)
    console.log(`  FAIL: ${message}`)
    console.log(`    expected: ${expectedStr}`)
    console.log(`    actual:   ${actualStr}`)
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────

const ROOT = join(__dirname, '..', '..')

function readFile(path: string): string {
  return readFileSync(join(ROOT, path), 'utf-8')
}

function listFiles(dir: string, ext: string[]): string[] {
  const fullPath = join(ROOT, dir)
  if (!existsSync(fullPath)) return []
  const results: string[] = []
  for (const entry of readdirSync(fullPath)) {
    const entryPath = join(fullPath, entry)
    const stat = statSync(entryPath)
    if (stat.isDirectory()) {
      results.push(...listFiles(join(dir, entry), ext))
    } else if (ext.some((e) => entry.endsWith(e))) {
      results.push(join(dir, entry))
    }
  }
  return results
}

// ─── Tests ───────────────────────────────────────────────────────────

console.log('--- Section A: Registry Internal Consistency ---')
{
  const errors = validateRegistryConsistency()
  assertEqual(errors.length, 0, 'Registry should have 0 discrepancies with offers.ts')
  for (const error of errors) {
    console.log(`  ${error}`)
  }
}

console.log('\n--- Section B: Product Fact Completeness ---')
{
  const expectedKeys = [
    'ai_advisor_desk',
    'ai_automation_blueprint',
    'fractional_ai_advisor',
    'managed_voice',
    'ai_security_compliance',
    'saas_security_review',
  ]
  const actualKeys = Object.keys(PRODUCT_FACTS)
  assertEqual(actualKeys.length, expectedKeys.length, 'Should have 6 product facts')
  for (const key of expectedKeys) {
    assert(key in PRODUCT_FACTS, `Product fact "${key}" should exist`)
  }
}

console.log('\n--- Section C: Required Fields ---')
{
  for (const [key, fact] of Object.entries(PRODUCT_FACTS)) {
    assert(fact.publicName.length > 0, `${key}: publicName should not be empty`)
    assert(fact.internalName.length > 0, `${key}: internalName should not be empty`)
    assert(fact.priceLabel.length > 0, `${key}: priceLabel should not be empty`)
    assert(fact.factualDescription.length > 0, `${key}: factualDescription should not be empty`)
    assert(fact.landingPage.startsWith('/'), `${key}: landingPage should start with /`)
    assert(
      fact.category === 'relationship' || fact.category === 'transaction' || fact.category === 'custom_scoped',
      `${key}: category should be valid`
    )
  }
}

console.log('\n--- Section D: Work Order Relationship Requirement ---')
{
  const workOrder = PRODUCT_FACTS['ai_automation_blueprint']
  assert(
    workOrder.requiresActiveRelationship === true,
    'AI Work Order should require an active relationship'
  )
  assert(
    workOrder.trialingEligible === false,
    'AI Work Order should not be trialing eligible'
  )
  assert(
    workOrder.category === 'transaction',
    'AI Work Order should be category "transaction"'
  )
  assertEqual(workOrder.priceLabel, '$500', 'AI Work Order price should be $500')
}

console.log('\n--- Section E: Advisor Desk Pricing ---')
{
  const advisor = PRODUCT_FACTS['ai_advisor_desk']
  assertEqual(advisor.priceLabel, '$99/month', 'AI Advisor Desk price should be $99/month')
  assert(
    advisor.requiresActiveRelationship === false,
    'AI Advisor Desk should not require active relationship'
  )
  assert(advisor.trialingEligible === true, 'AI Advisor Desk should be trialing eligible')
}

console.log('\n--- Section F: Fractional Advisor Pricing ---')
{
  const fractional = PRODUCT_FACTS['fractional_ai_advisor']
  assertEqual(fractional.priceLabel, '$1,250/month', 'Fractional AI Advisor price should be $1,250/month')
  assert(
    fractional.requiresActiveRelationship === false,
    'Fractional AI Advisor should not require active relationship (it IS the relationship)'
  )
}

console.log('\n--- Section G: Forbidden Claims in Customer-Facing Files ---')
{
  const customerFacingDirs = [
    'app/privacy',
    'app/terms',
    'app/service-terms',
    'app/ai-advisor',
    'app/ai-automation',
    'app/advisory',
    'app/services',
    'app/about',
    'app/contact',
  ]

  for (const dir of customerFacingDirs) {
    const files = listFiles(dir, ['.tsx', '.ts'])
    for (const file of files) {
      const content = readFile(file)
      const found = findForbiddenClaims(content)
      if (found.length > 0) {
        assert(false, `${file}: contains forbidden claims: ${found.join(', ')}`)
      } else {
        passed++
      }
    }
  }
}

console.log('\n--- Section H: Legacy Terms in Customer-Facing Copy ---')
{
  const customerFacingDirs = [
    'app/privacy',
    'app/terms',
    'app/service-terms',
    'app/ai-advisor',
    'app/ai-automation',
    'app/advisory',
    'app/services',
    'app/about',
    'app/contact',
  ]

  for (const dir of customerFacingDirs) {
    const files = listFiles(dir, ['.tsx', '.ts'])
    for (const file of files) {
      const content = readFile(file)
      const found = findLegacyTermsInPublicCopy(content)
      if (found.length > 0) {
        assert(false, `${file}: contains legacy terms: ${found.join(', ')}`)
      } else {
        passed++
      }
    }
  }
}

console.log('\n--- Section I: Structured Data Legacy Terms ---')
{
  const structuredData = readFile('components/StructuredData.tsx')
  const found = findLegacyTermsInPublicCopy(structuredData)
  if (found.length > 0) {
    assert(false, `StructuredData.tsx: contains legacy terms: ${found.join(', ')}`)
  } else {
    passed++
  }

  // Also check for "AI Opportunity Assessment" specifically
  if (structuredData.includes('AI Opportunity Assessment')) {
    assert(false, 'StructuredData.tsx: contains "AI Opportunity Assessment"')
  } else {
    passed++
  }
}

console.log('\n--- Section J: Homepage Commercial Section Legacy Terms ---')
{
  const commercialSection = readFile('components/home/CommercialDecisionSection.tsx')
  const found = findLegacyTermsInPublicCopy(commercialSection)
  if (found.length > 0) {
    assert(false, `CommercialDecisionSection.tsx: contains legacy terms: ${found.join(', ')}`)
  } else {
    passed++
  }

  // Check that "Start My Assessment" is not present
  if (commercialSection.includes('Start My Assessment')) {
    assert(false, 'CommercialDecisionSection.tsx: still contains "Start My Assessment"')
  } else {
    passed++
  }
}

console.log('\n--- Section K: Services Page No Shallow/Deep ---')
{
  const servicesPage = readFile('app/services/page.tsx')
  if (servicesPage.includes('>Shallow<')) {
    assert(false, 'Services page: still contains "Shallow" label')
  } else {
    passed++
  }
  if (servicesPage.includes('>Deep<')) {
    assert(false, 'Services page: still contains "Deep" label')
  } else {
    passed++
  }
}

console.log('\n--- Section L: CSM6 Not in App Directory ---')
{
  const appFiles = listFiles('app', ['.tsx', '.ts'])
  for (const file of appFiles) {
    const content = readFile(file)
    if (content.includes('CSM6')) {
      assert(false, `${file}: contains retired "CSM6" term`)
    } else {
      passed++
    }
  }
}

console.log('\n--- Section M: Advisor Desk Page Removed ---')
{
  const advisorDeskPath = join(ROOT, 'app', 'advisor-desk', 'page.tsx')
  assert(!existsSync(advisorDeskPath), 'app/advisor-desk/page.tsx should not exist')
}

// ─── Results ─────────────────────────────────────────────────────────

console.log(`\n=== Results: ${passed} passed, ${failed} failed ===`)
if (failed > 0) {
  console.log('\nFailures:')
  for (const f of failures) {
    console.log(`  - ${f}`)
  }
  process.exit(1)
}
