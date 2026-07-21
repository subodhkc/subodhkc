/**
 * Sanitize HTML content from external sources (BabyLoveGrowth API).
 * Strips: script tags, event handlers (on*), javascript: URLs, style attributes.
 * Keeps: semantic HTML tags, images, links, tables, lists, blockquotes, code.
 */
export function sanitizeHtml(html: string): string {
  if (!html) return ""

  let result = html

  // Remove <script> tags and their content
  result = result.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")

  // Remove <iframe> tags
  result = result.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")

  // Remove <object>, <embed>, <applet> tags
  result = result.replace(/<(object|embed|applet)\b[^<]*(?:(?!<\/\1>)<[^<]*)*<\/\1>/gi, "")

  // Remove on* event handler attributes (onclick, onload, onerror, etc.)
  result = result.replace(/\s+on\w+\s*=\s*"[^"]*"/gi, "")
  result = result.replace(/\s+on\w+\s*=\s*'[^']*'/gi, "")
  result = result.replace(/\s+on\w+\s*=\s*[^\s>]+/gi, "")

  // Remove javascript: URLs in href and src
  result = result.replace(/href\s*=\s*"javascript:[^"]*"/gi, 'href="#"')
  result = result.replace(/href\s*=\s*'javascript:[^']*'/gi, "href='#'")
  result = result.replace(/src\s*=\s*"javascript:[^"]*"/gi, 'src="#"')
  result = result.replace(/src\s*=\s*'javascript:[^']*'/gi, "src='#'")

  // Remove data: URLs in src (potential XSS vector)
  result = result.replace(/src\s*=\s*"data:[^"]*"/gi, 'src="#"')
  result = result.replace(/src\s*=\s*'data:[^']*'/gi, "src='#'")

  // Remove style attributes (prevent CSS injection)
  result = result.replace(/\s+style\s*=\s*"[^"]*"/gi, "")
  result = result.replace(/\s+style\s*=\s*'[^']*'/gi, "")

  // Remove class attributes (we control styling via .blog-content)
  result = result.replace(/\s+class\s*=\s*"[^"]*"/gi, "")
  result = result.replace(/\s+class\s*=\s*'[^']*'/gi, "")

  // Remove id attributes (prevent DOM manipulation)
  result = result.replace(/\s+id\s*=\s*"[^"]*"/gi, "")
  result = result.replace(/\s+id\s*=\s*'[^']*'/gi, "")

  return result
}

/**
 * Calculate estimated reading time from HTML content.
 * Average reading speed: 200 words per minute.
 * Returns minutes (minimum 1).
 */
export function calculateReadingTime(html: string): number {
  if (!html) return 1

  // Strip HTML tags to get plain text
  const text = html.replace(/<[^>]+>/g, " ").trim()
  const words = text.split(/\s+/).filter(Boolean).length
  const minutes = Math.ceil(words / 200)

  return Math.max(1, minutes)
}
