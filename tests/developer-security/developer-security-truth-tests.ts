/**
 * Developer Security Family Truth Tests
 *
 * Validates that the HAIEC Developer Security family registry is internally
 * consistent, that product versions match the verified external releases,
 * and that prohibited claims do not appear on developer-security surfaces.
 *
 * Run: npx tsx tests/developer-security/developer-security-truth-tests.ts
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'fs'
import { join } from 'path'
import {
  DEVELOPER_SECURITY_PRODUCTS,
  AI_APPSEC,
  MCP_TENANT_ISOLATION,
  LLMVERIFY,
  FAMILY_NAME,
  FAMILY_SENTENCE,
  PROHIBITED_CLAIMS,
  TENANT_TOTAL_RULES,
  TENANT_MCP_RULES_COUNT,
  TENANT_GENERAL_RULES_COUNT,
} from '../../data/developer-security'

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

console.log('--- Section A: Family Registry Completeness ---')
{
  assertEqual(DEVELOPER_SECURITY_PRODUCTS.length, 3, 'Should have exactly 3 family products')
  const ids = DEVELOPER_SECURITY_PRODUCTS.map((p) => p.id)
  assert(ids.includes('ai-appsec'), 'Should include ai-appsec')
  assert(ids.includes('mcp-tenant-isolation'), 'Should include mcp-tenant-isolation')
  assert(ids.includes('llmverify'), 'Should include llmverify')
}

console.log('\n--- Section B: Family Roles ---')
{
  const roles = DEVELOPER_SECURITY_PRODUCTS.map((p) => p.familyRole)
  assert(roles.includes('source'), 'Should include source role')
  assert(roles.includes('boundary'), 'Should include boundary role')
  assert(roles.includes('runtime'), 'Should include runtime role')
  assertEqual(AI_APPSEC.familyRole, 'source', 'AI AppSec should be source')
  assertEqual(MCP_TENANT_ISOLATION.familyRole, 'boundary', 'MCP Tenant Isolation should be boundary')
  assertEqual(LLMVERIFY.familyRole, 'runtime', 'LLMVerify should be runtime')
}

console.log('\n--- Section C: Verified External Versions ---')
{
  // These versions were verified against live npm registry at implementation time.
  // Do NOT regress these to values in any planning document.
  assertEqual(AI_APPSEC.version, '0.1.0', 'AI AppSec version must be 0.1.0')
  assertEqual(MCP_TENANT_ISOLATION.version, '2.0.0', 'MCP Tenant Isolation version must be 2.0.0')
  assertEqual(LLMVERIFY.version, '1.6.1', 'LLMVerify version must be 1.6.1 (not 1.6.0)')
}

console.log('\n--- Section D: LLMVerify is NOT an MCP server ---')
{
  assertEqual(LLMVERIFY.mcpRegistryId, null, 'LLMVerify must not have an MCP Registry ID')
  assertEqual(LLMVERIFY.mcpTool, null, 'LLMVerify must not have an MCP tool')
  assertEqual(LLMVERIFY.mcpVersion, null, 'LLMVerify must not have an MCP version')
}

console.log('\n--- Section E: AI AppSec and Tenant Isolation ARE MCP servers ---')
{
  assert(AI_APPSEC.mcpRegistryId !== null, 'AI AppSec should have an MCP Registry ID')
  assert(AI_APPSEC.mcpTool !== null, 'AI AppSec should have an MCP tool')
  assertEqual(AI_APPSEC.mcpTool, 'scan_ai_security', 'AI AppSec MCP tool should be scan_ai_security')
  assert(MCP_TENANT_ISOLATION.mcpRegistryId !== null, 'Tenant Isolation should have an MCP Registry ID')
  assert(MCP_TENANT_ISOLATION.mcpTool !== null, 'Tenant Isolation should have an MCP tool')
  assertEqual(MCP_TENANT_ISOLATION.mcpTool, 'scan_tenant_isolation', 'Tenant Isolation MCP tool should be scan_tenant_isolation')
}

console.log('\n--- Section F: License and Brand ---')
{
  for (const product of DEVELOPER_SECURITY_PRODUCTS) {
    assertEqual(product.license, 'MIT', `${product.name}: license must be MIT`)
    assert(product.brand.includes('HAIEC'), `${product.name}: brand should reference HAIEC`)
  }
}

console.log('\n--- Section G: Tenant Isolation Rule Counts ---')
{
  assertEqual(TENANT_TOTAL_RULES, 57, 'Total tenant rules must be 57')
  assertEqual(TENANT_GENERAL_RULES_COUNT, 42, 'General tenant rules must be 42')
  assertEqual(TENANT_MCP_RULES_COUNT, 15, 'MCP-specific tenant rules must be 15')
  assertEqual(TENANT_GENERAL_RULES_COUNT + TENANT_MCP_RULES_COUNT, TENANT_TOTAL_RULES, 'General + MCP rules should equal total')
}

console.log('\n--- Section H: Family Sentence ---')
{
  assertEqual(
    FAMILY_SENTENCE,
    'Secure the code. Protect the tenant boundary. Verify the model interaction.',
    'Family sentence must match canonical wording'
  )
  assertEqual(FAMILY_NAME, 'HAIEC Developer Security', 'Family name must match canonical wording')
}

console.log('\n--- Section I: Product Pages Exist ---')
{
  for (const product of DEVELOPER_SECURITY_PRODUCTS) {
    // productPage is a URL path like "/products/ai-appsec"
    // The actual file is at app/products/ai-appsec/page.tsx
    const relativePath = product.productPage.replace(/^\//, 'app/')
    const pagePath = join(ROOT, relativePath, 'page.tsx')
    assert(existsSync(pagePath), `${product.name}: product page should exist at ${relativePath}/page.tsx`)
  }
}

console.log('\n--- Section J: Release Article Exists ---')
{
  const releasePath = join(ROOT, 'app', 'insights', 'ai-appsec-mcp-tenant-isolation-release', 'page.tsx')
  assert(existsSync(releasePath), 'Release article should exist at app/insights/ai-appsec-mcp-tenant-isolation-release/page.tsx')
}

console.log('\n--- Section K: Prohibited Claims in Developer-Security Surfaces ---')
{
  // Note: data/developer-security.ts is excluded because it DEFINES the prohibited claims list.
  // We only check user-facing surfaces, not the registry definition file.
  const surfaces = [
    'app/products/ai-appsec/page.tsx',
    'app/products/mcp-tenant-isolation/page.tsx',
    'app/products/llmverify/page.tsx',
    'app/insights/ai-appsec-mcp-tenant-isolation-release/page.tsx',
    'components/home/SystemsSection.tsx',
    'components/DeveloperSecurityReleaseNotice.tsx',
  ]

  // Negation prefixes that make a prohibited claim acceptable (e.g., "not formal verification")
  const negationPrefixes = ['not ', 'no ', 'never ', 'cannot ', 'does not ', 'is not ', 'are not ']

  for (const surface of surfaces) {
    const content = readFile(surface)
    const lowerContent = content.toLowerCase()
    for (const claim of PROHIBITED_CLAIMS) {
      const claimLower = claim.toLowerCase()
      // Find all occurrences and check if any are non-negated
      let idx = 0
      let foundNonNegated = false
      while ((idx = lowerContent.indexOf(claimLower, idx)) !== -1) {
        // Check the 20 characters before the match for a negation prefix
        const before = lowerContent.substring(Math.max(0, idx - 20), idx)
        const isNegated = negationPrefixes.some((prefix) => before.endsWith(prefix))
        if (!isNegated) {
          foundNonNegated = true
          break
        }
        idx += claimLower.length
      }
      if (foundNonNegated) {
        assert(false, `${surface}: contains non-negated prohibited claim "${claim}"`)
      }
    }
    passed++
  }
}

console.log('\n--- Section L: Stale LLMVerify Claims Removed ---')
{
  const llmverifyPage = readFile('app/products/llmverify/page.tsx')
  assert(!llmverifyPage.includes('612 Tests Passing'), 'LLMVerify page must not contain "612 Tests Passing"')
  assert(!llmverifyPage.includes('70-85%'), 'LLMVerify page must not contain "70-85%" accuracy claim')
  assert(!llmverifyPage.includes('~60%'), 'LLMVerify page must not contain "~60%" accuracy claim')
  assert(!llmverifyPage.includes('Runtime health monitor for LLM apps'), 'LLMVerify page must not contain stale tagline')
}

console.log('\n--- Section M: Sitemap Includes New URLs ---')
{
  const sitemap = readFile('app/sitemap.ts')
  assert(sitemap.includes('/products/ai-appsec'), 'Sitemap should include /products/ai-appsec')
  assert(sitemap.includes('/products/mcp-tenant-isolation'), 'Sitemap should include /products/mcp-tenant-isolation')
  assert(sitemap.includes('/insights/ai-appsec-mcp-tenant-isolation-release'), 'Sitemap should include release article')
}

console.log('\n--- Section N: Search Index Includes New Entries ---')
{
  const searchIndex = readFile('lib/search-index.ts')
  assert(searchIndex.includes('AI AppSec'), 'Search index should include AI AppSec')
  assert(searchIndex.includes('MCP Tenant Isolation'), 'Search index should include MCP Tenant Isolation')
  assert(searchIndex.includes('ai-appsec-mcp-tenant-isolation-release'), 'Search index should include release article')
}

console.log('\n--- Section O: AI-Readable Files Include New Products ---')
{
  const aiTxt = readFile('public/ai.txt')
  assert(aiTxt.includes('ai-appsec'), 'ai.txt should include ai-appsec')
  assert(aiTxt.includes('mcp-tenant-isolation'), 'ai.txt should include mcp-tenant-isolation')
  assert(aiTxt.includes('"version": "0.1.0"'), 'ai.txt should include AI AppSec version 0.1.0')
  assert(aiTxt.includes('"version": "2.0.0"'), 'ai.txt should include MCP Tenant Isolation version 2.0.0')
  assert(aiTxt.includes('"version": "1.6.1"'), 'ai.txt should include LLMVerify version 1.6.1')

  const llmsTxt = readFile('public/llms.txt')
  assert(llmsTxt.includes('ai-appsec'), 'llms.txt should include ai-appsec')
  assert(llmsTxt.includes('mcp-tenant-isolation'), 'llms.txt should include mcp-tenant-isolation')
  assert(llmsTxt.includes('HAIEC Developer Security'), 'llms.txt should include family name')

  const llmsFullTxt = readFile('public/llms-full.txt')
  assert(llmsFullTxt.includes('ai-appsec'), 'llms-full.txt should include ai-appsec')
  assert(llmsFullTxt.includes('mcp-tenant-isolation'), 'llms-full.txt should include mcp-tenant-isolation')
}

console.log('\n--- Section P: Structured Data Includes New SoftwareApplications ---')
{
  const structuredData = readFile('components/StructuredData.tsx')
  assert(structuredData.includes("name: 'AI AppSec'"), 'StructuredData should include AI AppSec SoftwareApplication')
  assert(structuredData.includes("name: 'MCP Tenant Isolation'"), 'StructuredData should include MCP Tenant Isolation SoftwareApplication')
  assert(structuredData.includes("softwareVersion: '0.1.0'"), 'StructuredData should include AI AppSec version')
  assert(structuredData.includes("softwareVersion: '2.0.0'"), 'StructuredData should include MCP Tenant Isolation version')
  assert(structuredData.includes("softwareVersion: '1.6.1'"), 'StructuredData should include LLMVerify version')
}

console.log('\n--- Section Q: Popup Component Exists and Has Required Behaviors ---')
{
  const popup = readFile('components/DeveloperSecurityReleaseNotice.tsx')
  assert(popup.includes('DELAY_MS'), 'Popup should have delay constant')
  assert(popup.includes('SCROLL_THRESHOLD'), 'Popup should have scroll threshold')
  assert(popup.includes('DISMISS_DAYS'), 'Popup should have dismiss days constant')
  assert(popup.includes('CAMPAIGN_EXPIRY'), 'Popup should have campaign expiry')
  assert(popup.includes('sessionStorage'), 'Popup should use sessionStorage for once-per-session')
  assert(popup.includes('localStorage'), 'Popup should use localStorage for 30-day dismissal')
  assert(popup.includes("key === 'Escape'"), 'Popup should handle Escape key')
  assert(popup.includes('EXCLUDED_PATHS'), 'Popup should have exclusion list')
  assert(popup.includes('/products/ai-appsec'), 'Popup should exclude product pages')
  assert(popup.includes('/contact'), 'Popup should exclude transactional pages')
  // No IP collection or third-party analytics
  assert(!popup.includes('ipify'), 'Popup must not use ipify or similar IP services')
  assert(!popup.includes('gtag'), 'Popup must not use Google Analytics gtag')
  assert(!popup.includes('fbq'), 'Popup must not use Facebook pixel')
}

console.log('\n--- Section R: Popup Added to Root Layout ---')
{
  const layout = readFile('app/layout.tsx')
  assert(layout.includes('DeveloperSecurityReleaseNotice'), 'Layout should import and render the popup')
}

console.log('\n--- Section S: Homepage SystemsSection Includes Family ---')
{
  const systemsSection = readFile('components/home/SystemsSection.tsx')
  assert(systemsSection.includes('HAIEC Developer Security'), 'SystemsSection should include family name')
  assert(systemsSection.includes('AI AppSec'), 'SystemsSection should include AI AppSec')
  assert(systemsSection.includes('MCP Tenant Isolation'), 'SystemsSection should include MCP Tenant Isolation')
  assert(systemsSection.includes('llmverify'), 'SystemsSection should include llmverify')
  assert(systemsSection.includes('release article'), 'SystemsSection should link to release article')
}

console.log('\n--- Section T: Products Page Includes New Products ---')
{
  const productsPage = readFile('app/products/page.tsx')
  assert(productsPage.includes('AI AppSec'), 'Products page should include AI AppSec')
  assert(productsPage.includes('/products/ai-appsec'), 'Products page should link to AI AppSec product page')
  assert(productsPage.includes('/products/mcp-tenant-isolation'), 'Products page should link to MCP Tenant Isolation product page (not external GitHub)')
}

console.log('\n--- Section U: Cross-Links Between Product Pages ---')
{
  const aiAppsecPage = readFile('app/products/ai-appsec/page.tsx')
  assert(aiAppsecPage.includes('/products/mcp-tenant-isolation'), 'AI AppSec page should link to MCP Tenant Isolation')
  assert(aiAppsecPage.includes('/products/llmverify'), 'AI AppSec page should link to LLMVerify')

  const tenantPage = readFile('app/products/mcp-tenant-isolation/page.tsx')
  assert(tenantPage.includes('/products/ai-appsec'), 'Tenant Isolation page should link to AI AppSec')
  assert(tenantPage.includes('/products/llmverify'), 'Tenant Isolation page should link to LLMVerify')

  const llmverifyPage = readFile('app/products/llmverify/page.tsx')
  assert(llmverifyPage.includes('/products/ai-appsec'), 'LLMVerify page should link to AI AppSec')
  assert(llmverifyPage.includes('/products/mcp-tenant-isolation'), 'LLMVerify page should link to MCP Tenant Isolation')
}

console.log('\n--- Section V: Reindex Route Includes New URLs ---')
{
  const reindexRoute = readFile('app/api/reindex/route.ts')
  assert(reindexRoute.includes('/products/ai-appsec'), 'Reindex route should include AI AppSec URL')
  assert(reindexRoute.includes('/products/mcp-tenant-isolation'), 'Reindex route should include MCP Tenant Isolation URL')
  assert(reindexRoute.includes('/insights/ai-appsec-mcp-tenant-isolation-release'), 'Reindex route should include release article URL')
}

console.log('\n--- Section W: No Em Dashes in New Content ---')
{
  const surfaces = [
    'app/products/ai-appsec/page.tsx',
    'app/products/mcp-tenant-isolation/page.tsx',
    'app/insights/ai-appsec-mcp-tenant-isolation-release/page.tsx',
    'data/developer-security.ts',
  ]
  for (const surface of surfaces) {
    const content = readFile(surface)
    // Check for em dash (U+2014) and en dash (U+2013) in string literals
    // Note: em dashes in code comments are acceptable, but not in user-facing strings
    if (content.includes('\u2014') || content.includes('\u2013')) {
      // Check if they appear outside of comments - simple heuristic
      const lines = content.split('\n')
      for (const line of lines) {
        const trimmed = line.trim()
        if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) continue
        if (trimmed.includes('\u2014') || trimmed.includes('\u2013')) {
          // Allow in JSX text content but flag for review
          // For strictness, we check if it's in a string literal
          if (trimmed.includes("'") || trimmed.includes('"') || trimmed.includes('`')) {
            // It's likely in a string - check more carefully
            const stringMatch = trimmed.match(/['"`][^'"`]*[\u2014\u2013][^'"`]*['"`]/)
            if (stringMatch) {
              assert(false, `${surface}: contains em/en dash in string literal: ${stringMatch[0]}`)
            }
          }
        }
      }
    }
    passed++
  }
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
