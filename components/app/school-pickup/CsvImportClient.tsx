'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Upload, FileText, CheckCircle2, XCircle, AlertCircle } from 'lucide-react'
import type { SchoolContext } from '@/lib/auth/school-resolver'

interface CsvImportClientProps {
  ctx: SchoolContext
}

interface ParsedRow {
  first_name: string
  last_name: string
  external_student_id: string
  classroom_name: string
  valid: boolean
  error?: string
}

export function CsvImportClient({ ctx }: CsvImportClientProps) {
  const router = useRouter()
  const apiBase = `/api/school-pickup/${ctx.organization.organization.slug}/${ctx.site.slug}`
  const basePath = `/app/${ctx.organization.organization.slug}/school-pickup/${ctx.site.slug}`

  const [csvText, setCsvText] = useState('')
  const [rows, setRows] = useState<ParsedRow[]>([])
  const [parsing, setParsing] = useState(false)
  const [importing, setImporting] = useState(false)
  const [results, setResults] = useState<{ created: number; updated: number; errors: number; total: number } | null>(null)
  const [error, setError] = useState<string | null>(null)

  function parseCsv(text: string): ParsedRow[] {
    const lines = text.trim().split(/\r?\n/).filter(l => l.trim())
    if (lines.length === 0) return []

    // Detect header
    const firstLine = lines[0].toLowerCase()
    const hasHeader = firstLine.includes('first_name') || firstLine.includes('first name')
    const dataLines = hasHeader ? lines.slice(1) : lines

    return dataLines.map((line, idx) => {
      const parts = parseCsvLine(line)
      const first_name = (parts[0] || '').trim()
      const last_name = (parts[1] || '').trim()
      const external_student_id = (parts[2] || '').trim()
      const classroom_name = (parts[3] || '').trim()

      const rowError: string[] = []
      if (!first_name) rowError.push('first_name required')
      if (!last_name) rowError.push('last_name required')

      return {
        first_name,
        last_name,
        external_student_id,
        classroom_name,
        valid: rowError.length === 0,
        error: rowError.join('; '),
      }
    })
  }

  function parseCsvLine(line: string): string[] {
    const result: string[] = []
    let current = ''
    let inQuotes = false

    for (let i = 0; i < line.length; i++) {
      const char = line[i]
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"'
          i++
        } else {
          inQuotes = !inQuotes
        }
      } else if (char === ',' && !inQuotes) {
        result.push(current)
        current = ''
      } else {
        current += char
      }
    }
    result.push(current)
    return result
  }

  function handleParse() {
    setParsing(true)
    setError(null)
    setResults(null)
    try {
      const parsed = parseCsv(csvText)
      setRows(parsed)
    } catch {
      setError('Failed to parse CSV. Please check the format.')
    } finally {
      setParsing(false)
    }
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const text = ev.target?.result as string
      setCsvText(text)
      const parsed = parseCsv(text)
      setRows(parsed)
      setResults(null)
    }
    reader.readAsText(file)
  }

  async function handleImport() {
    const validRows = rows.filter(r => r.valid)
    if (validRows.length === 0) return

    setImporting(true)
    setError(null)

    try {
      const res = await fetch(`${apiBase}/students/import`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          students: validRows.map(r => ({
            first_name: r.first_name,
            last_name: r.last_name,
            external_student_id: r.external_student_id || null,
            classroom_name: r.classroom_name || null,
          })),
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.detail || data.error || 'Import failed')
        return
      }

      const data = await res.json()
      setResults(data.summary)
    } catch {
      setError('Network error during import')
    } finally {
      setImporting(false)
    }
  }

  const validCount = rows.filter(r => r.valid).length
  const errorCount = rows.filter(r => !r.valid).length

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-2">
        <Link href={`${basePath}/students`} className="p-2 hover:bg-accent rounded-md">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="text-2xl font-bold">Import Students (CSV)</h1>
      </div>

      {/* Instructions */}
      <div className="border rounded-lg p-4 bg-accent/10 space-y-2 text-sm">
        <h2 className="font-semibold">CSV Format</h2>
        <p className="text-muted-foreground">
          Columns: <code className="bg-card px-1 rounded">first_name, last_name, external_student_id, classroom_name</code>
        </p>
        <p className="text-muted-foreground">
          First two columns are required. External ID and classroom name are optional.
          Include a header row for best results.
        </p>
        <p className="text-muted-foreground">
          Max 500 rows per import. Students with existing external IDs will be updated.
        </p>
      </div>

      {/* Upload or paste */}
      {!results && (
        <>
          <div className="border rounded-lg p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Upload CSV File</label>
              <input
                type="file"
                accept=".csv,text/csv"
                onChange={handleFileUpload}
                className="block w-full text-sm file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary file:text-primary-foreground file:cursor-pointer hover:file:opacity-90"
              />
            </div>

            <div className="text-center text-sm text-muted-foreground">or paste CSV:</div>

            <div>
              <textarea
                value={csvText}
                onChange={(e) => {
                  setCsvText(e.target.value)
                  setRows([])
                  setResults(null)
                }}
                placeholder="first_name,last_name,external_student_id,classroom_name&#10;Jane,Doe,ST001,Room 1"
                rows={6}
                className="w-full px-3 py-2 bg-card border rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <button
              onClick={handleParse}
              disabled={!csvText.trim() || parsing}
              className="flex items-center gap-1.5 px-4 py-2 border rounded-lg text-sm hover:bg-accent/50 disabled:opacity-50"
            >
              <FileText className="h-4 w-4" />
              Preview
            </button>
          </div>

          {/* Preview */}
          {rows.length > 0 && (
            <div className="border rounded-lg p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold">Preview ({rows.length} rows)</h2>
                <div className="flex gap-3 text-sm">
                  <span className="text-accent flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4" /> {validCount} valid
                  </span>
                  {errorCount > 0 && (
                    <span className="text-destructive flex items-center gap-1">
                      <XCircle className="h-4 w-4" /> {errorCount} errors
                    </span>
                  )}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-accent/30">
                    <tr>
                      <th className="text-left px-3 py-2 font-medium">First</th>
                      <th className="text-left px-3 py-2 font-medium">Last</th>
                      <th className="text-left px-3 py-2 font-medium">Ext ID</th>
                      <th className="text-left px-3 py-2 font-medium">Classroom</th>
                      <th className="text-left px-3 py-2 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.slice(0, 50).map((r, i) => (
                      <tr key={i} className="border-t">
                        <td className="px-3 py-2">{r.first_name || '-'}</td>
                        <td className="px-3 py-2">{r.last_name || '-'}</td>
                        <td className="px-3 py-2 text-muted-foreground">{r.external_student_id || '-'}</td>
                        <td className="px-3 py-2 text-muted-foreground">{r.classroom_name || '-'}</td>
                        <td className="px-3 py-2">
                          {r.valid ? (
                            <span className="text-accent text-xs">OK</span>
                          ) : (
                            <span className="text-destructive text-xs" title={r.error}>
                              {r.error}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {rows.length > 50 && (
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    Showing first 50 of {rows.length} rows
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleImport}
                  disabled={validCount === 0 || importing}
                  className="flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50"
                >
                  <Upload className="h-4 w-4" />
                  {importing ? 'Importing...' : `Import ${validCount} student${validCount !== 1 ? 's' : ''}`}
                </button>
                <button
                  onClick={() => { setRows([]); setCsvText('') }}
                  className="px-4 py-2 border rounded-lg text-sm hover:bg-accent/50"
                >
                  Clear
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="border border-destructive/50 rounded-lg p-3 text-sm text-destructive flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}
        </>
      )}

      {/* Results */}
      {results && (
        <div className="border rounded-lg p-6 space-y-4">
          <h2 className="font-semibold">Import Complete</h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="border rounded-lg p-4">
              <p className="text-2xl font-bold text-accent">{results.created}</p>
              <p className="text-xs text-muted-foreground">Created</p>
            </div>
            <div className="border rounded-lg p-4">
              <p className="text-2xl font-bold text-blue-600">{results.updated}</p>
              <p className="text-xs text-muted-foreground">Updated</p>
            </div>
            <div className="border rounded-lg p-4">
              <p className="text-2xl font-bold text-destructive">{results.errors}</p>
              <p className="text-xs text-muted-foreground">Errors</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link
              href={`${basePath}/students`}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90"
            >
              View Students
            </Link>
            <button
              onClick={() => { setResults(null); setRows([]); setCsvText('') }}
              className="px-4 py-2 border rounded-lg text-sm hover:bg-accent/50"
            >
              Import More
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
