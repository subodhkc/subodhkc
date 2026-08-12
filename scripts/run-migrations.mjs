#!/usr/bin/env node
/**
 * Migration runner for SubodhKC Supabase project.
 * 
 * Tracks applied migrations in a `schema_migrations` table.
 * Reads .sql files from supabase/migrations/ in alphabetical order.
 * Only applies migrations that haven't been recorded yet.
 *
 * Usage:
 *   node scripts/run-migrations.mjs              # Apply pending migrations (direct DB)
 *   node scripts/run-migrations.mjs --status     # Show migration status
 *   node scripts/run-migrations.mjs --dry-run    # Show what would be applied
 *   node scripts/run-migrations.mjs --track      # Record manually-applied migrations via REST API
 *   node scripts/run-migrations.mjs --combine    # Generate combined SQL for SQL Editor
 *
 * Requires SUPABASE_DB_URL for direct mode.
 * Requires SUPABASE_SERVICE_ROLE_KEY for --track mode.
 */

import { readFileSync, readdirSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { config } from 'dotenv'
import { execSync } from 'child_process'

// Load .env.local
config({ path: '.env.local' })

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const projectRoot = join(__dirname, '..')
const migrationsDir = join(projectRoot, 'supabase', 'migrations')

const DB_URL = process.env.SUPABASE_DB_URL
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

// Parse connection string (handles optional brackets in password)
function parseDbUrl(url) {
  const match = url.match(/^postgresql:\/\/([^:]+):\[?([^\]\@]+)\]?@([^:]+):(\d+)\/(.+)$/)
  if (!match) {
    console.error('ERROR: Invalid SUPABASE_DB_URL format')
    console.error('Expected: postgresql://user:password@host:port/database')
    process.exit(1)
  }
  return {
    user: match[1],
    password: match[2],
    host: match[3],
    port: parseInt(match[4]),
    database: match[5],
  }
}

// Resolve hostname to IP, handling Windows IPv6 DNS issues
function resolveHost(hostname) {
  try {
    const output = execSync(`nslookup ${hostname}`, { encoding: 'utf8', timeout: 10000 })
    const lines = output.split('\n')
    for (let i = lines.length - 1; i >= 0; i--) {
      const line = lines[i].trim()
      if (line.startsWith('Address:') && !line.includes('127.0.0.1')) {
        const ip = line.split(':').slice(1).join(':').trim()
        if (ip && ip !== hostname) return ip
      }
    }
  } catch {}
  return hostname
}

// Use pg module for database connection
let pg
try {
  pg = await import('pg')
} catch {
  console.error('ERROR: pg module not installed. Run: npm install pg')
  process.exit(1)
}

const { Client } = pg
const dbConfig = parseDbUrl(DB_URL)

// ============================================
// Migration tracking table SQL
// ============================================
const TRACKING_TABLE_SQL = `
create table if not exists public.schema_migrations (
  filename text primary key,
  applied_at timestamptz default now(),
  checksum text not null,
  execution_ms integer
);
`

// ============================================
// Helper: compute simple checksum
// ============================================
function checksum(content) {
  let hash = 0
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return `h_${Math.abs(hash).toString(36)}`
}

// ============================================
// Helper: get migration files
// ============================================
function getMigrationFiles() {
  const files = readdirSync(migrationsDir)
    .filter(f => f.endsWith('.sql'))
    .sort()
  return files
}

// ============================================
// Main: apply migrations
// ============================================
// ============================================
// REST API mode: track migrations via Supabase REST API
// ============================================
async function trackViaRest() {
  if (!SUPABASE_URL || !SERVICE_KEY) {
    console.error('ERROR: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY required for --track mode')
    process.exit(1)
  }

  const headers = {
    'apikey': SERVICE_KEY,
    'Authorization': `Bearer ${SERVICE_KEY}`,
    'Content-Type': 'application/json',
  }

  // Check which migrations are already tracked
  const resp = await fetch(`${SUPABASE_URL}/rest/v1/schema_migrations?select=filename,checksum,applied_at&order=filename`, { headers })
  
  if (!resp.ok) {
    if (resp.status === 404) {
      console.error('ERROR: schema_migrations table not found.')
      console.error('Run the combined migration SQL in Supabase SQL Editor first:')
      console.error('  node scripts/run-migrations.mjs --combine')
      process.exit(1)
    }
    console.error(`ERROR: REST API returned ${resp.status}`)
    process.exit(1)
  }

  const applied = await resp.json()
  const appliedMap = new Map(applied.map(r => [r.filename, r]))
  const files = getMigrationFiles()

  console.log('\nMigration Status (via REST API):')
  console.log('─'.repeat(70))
  for (const file of files) {
    const status = appliedMap.has(file) ? 'APPLIED' : 'PENDING'
    const info = appliedMap.get(file)?.applied_at ? ` (${appliedMap.get(file).applied_at})` : ''
    console.log(`  ${status.padEnd(8)} ${file}${info}`)
  }
  console.log('─'.repeat(70))
  console.log(`Total: ${files.length} | Tracked: ${applied.length} | Untracked: ${files.length - applied.length}`)

  const untracked = files.filter(f => !appliedMap.has(f))
  if (untracked.length === 0) {
    console.log('\nAll migrations are tracked.')
    return
  }

  console.log(`\nTracking ${untracked.length} untracked migrations...`)
  for (const file of untracked) {
    const content = readFileSync(join(migrationsDir, file), 'utf8')
    const cs = checksum(content)
    const insertResp = await fetch(`${SUPABASE_URL}/rest/v1/schema_migrations`, {
      method: 'POST',
      headers: { ...headers, 'Prefer': 'return=minimal' },
      body: JSON.stringify({ filename: file, checksum: cs }),
    })
    if (insertResp.ok) {
      console.log(`  Tracked: ${file} (checksum: ${cs})`)
    } else {
      console.error(`  FAILED to track: ${file} (${insertResp.status})`)
    }
  }
  console.log('\nDone. All migrations tracked.')
}

// ============================================
// Combine mode: generate single SQL file for SQL Editor
// ============================================
function combineMigrations() {
  const files = getMigrationFiles()
  let combined = '-- ============================================\n-- SubodhKC Multi-Tenant Schema - Combined Migration\n-- Run this in Supabase SQL Editor (Dashboard > SQL Editor)\n-- Project: shnbyttoswxhfnurdnxo\n-- ============================================\n\n'
  for (const f of files) {
    const content = readFileSync(join(migrationsDir, f), 'utf8')
    combined += `-- ============================================\n-- File: ${f}\n-- ============================================\n${content}\n\n`
  }
  const outPath = join(projectRoot, 'supabase', 'combined-migration.sql')
  writeFileSync(outPath, combined)
  console.log(`Combined migration written: ${outPath} (${combined.length} bytes, ${files.length} files)`)
  console.log('\nNext steps:')
  console.log('  1. Open Supabase Dashboard > SQL Editor')
  console.log('  2. Copy and paste the contents of supabase/combined-migration.sql')
  console.log('  3. Click Run')
  console.log('  4. After successful execution, run: node scripts/run-migrations.mjs --track')
}

// ============================================
// Direct DB mode: apply migrations via PostgreSQL connection
// ============================================
async function applyViaDirectDb() {
  if (!DB_URL) {
    console.error('ERROR: SUPABASE_DB_URL not set in environment')
    console.error('Alternative: run "node scripts/run-migrations.mjs --combine" and execute SQL in Supabase SQL Editor')
    process.exit(1)
  }

  // Resolve hostname (Windows IPv6 workaround)
  const resolvedHost = resolveHost(dbConfig.host)
  if (resolvedHost !== dbConfig.host) {
    console.log(`Resolved ${dbConfig.host} -> ${resolvedHost}`)
  }

  const client = new Client({
    user: dbConfig.user,
    password: dbConfig.password,
    host: resolvedHost,
    port: dbConfig.port,
    database: dbConfig.database,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 30000,
  })

  try {
    await client.connect()
    console.log(`Connected to ${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`)

    // Ensure tracking table exists
    await client.query(TRACKING_TABLE_SQL)

    // Get applied migrations
    const { rows: applied } = await client.query(
      'select filename, applied_at, checksum, execution_ms from public.schema_migrations order by filename'
    )
    const appliedMap = new Map(applied.map(r => [r.filename, r]))

    // Get all migration files
    const files = getMigrationFiles()
    if (files.length === 0) {
      console.log('No migration files found in supabase/migrations/')
      return
    }

    // Status report
    console.log('\nMigration Status:')
    console.log('─'.repeat(70))
    for (const file of files) {
      const status = appliedMap.has(file) ? 'APPLIED' : 'PENDING'
      const appliedAt = appliedMap.get(file)?.applied_at
      const info = appliedAt ? ` (${appliedAt.toISOString()})` : ''
      console.log(`  ${status.padEnd(8)} ${file}${info}`)
    }
    console.log('─'.repeat(70))
    console.log(`Total: ${files.length} | Applied: ${applied.length} | Pending: ${files.length - applied.length}`)

    if (isStatusOnly) return

    const pending = files.filter(f => !appliedMap.has(f))
    if (pending.length === 0) {
      console.log('\nAll migrations already applied.')
      return
    }

    console.log(`\n${isDryRun ? '[DRY RUN] ' : ''}Pending migrations: ${pending.length}`)

    if (isDryRun) {
      for (const file of pending) {
        const content = readFileSync(join(migrationsDir, file), 'utf8')
        const lines = content.split('\n').length
        console.log(`  Would apply: ${file} (${lines} lines, checksum: ${checksum(content)})`)
      }
      return
    }

    // Apply each pending migration in a transaction
    for (const file of pending) {
      const content = readFileSync(join(migrationsDir, file), 'utf8')
      const cs = checksum(content)
      const startTime = Date.now()

      console.log(`\nApplying: ${file}`)
      console.log(`  Checksum: ${cs}`)

      try {
        await client.query('begin')
        await client.query(content)
        const elapsed = Date.now() - startTime
        await client.query(
          'insert into public.schema_migrations (filename, checksum, execution_ms) values ($1, $2, $3)',
          [file, cs, elapsed]
        )
        await client.query('commit')
        console.log(`  Done in ${elapsed}ms`)
      } catch (err) {
        await client.query('rollback')
        console.error(`  FAILED: ${err.message}`)
        console.error(`  Migration rolled back. Fix the issue and re-run.`)
        process.exit(1)
      }
    }

    console.log(`\nAll ${pending.length} pending migrations applied successfully.`)

    // Verify checksums
    const { rows: allApplied } = await client.query(
      'select filename, checksum from public.schema_migrations order by filename'
    )
    let driftDetected = false
    for (const row of allApplied) {
      const filePath = join(migrationsDir, row.filename)
      try {
        const content = readFileSync(filePath, 'utf8')
        const cs = checksum(content)
        if (cs !== row.checksum) {
          console.warn(`  WARNING: Checksum drift detected for ${row.filename}`)
          console.warn(`    Recorded: ${row.checksum} | Current: ${cs}`)
          driftDetected = true
        }
      } catch {
        console.warn(`  WARNING: Migration file ${row.filename} is missing but was applied`)
      }
    }
    if (!driftDetected) {
      console.log('No checksum drift detected.')
    }

  } finally {
    await client.end()
  }
}

async function main() {
  const args = process.argv.slice(2)
  const isStatusOnly = args.includes('--status')
  const isDryRun = args.includes('--dry-run')
  const isTrackMode = args.includes('--track')
  const isCombineMode = args.includes('--combine')

  if (isCombineMode) {
    combineMigrations()
    return
  }

  if (isTrackMode) {
    await trackViaRest()
    return
  }

  await applyViaDirectDb()
}

main().catch(err => {
  console.error('Fatal error:', err.message)
  process.exit(1)
})
