const fs = require('fs')
const path = require('path')

const postsDir = path.join(__dirname, '..', 'data', 'blog', 'posts')

// 1. Add cross-link from EU AI Act logging post to SOC 2 audit trail post
const euLogPath = path.join(postsDir, 'build-a-logging-pipeline-for-eu-ai-act-compliance.json')
const euLog = JSON.parse(fs.readFileSync(euLogPath, 'utf-8'))
if (!euLog.contentHtml.includes('implementing-immutable-audit-trails-for-soc-2-ai-compliance')) {
  const crossLink = '<p>For SOC 2-specific audit trail architecture with cryptographic integrity, see <a href="/blog/implementing-immutable-audit-trails-for-soc-2-ai-compliance">immutable audit trails for SOC 2 AI compliance</a>.</p>'
  // Insert before the last h2 (FAQ section)
  const lastH2Idx = euLog.contentHtml.lastIndexOf('<h2>')
  if (lastH2Idx > -1) {
    euLog.contentHtml = euLog.contentHtml.slice(0, lastH2Idx) + crossLink + '\n' + euLog.contentHtml.slice(lastH2Idx)
  } else {
    euLog.contentHtml += '\n' + crossLink
  }
  fs.writeFileSync(euLogPath, JSON.stringify(euLog, null, 2))
  console.log('Added cross-link in EU AI Act logging post -> SOC 2 audit trail post')
} else {
  console.log('Cross-link already exists in EU AI Act logging post')
}

// 2. Add cross-link from SOC 2 audit trail post to EU AI Act logging post
const soc2Path = path.join(postsDir, 'implementing-immutable-audit-trails-for-soc-2-ai-compliance.json')
const soc2 = JSON.parse(fs.readFileSync(soc2Path, 'utf-8'))
if (!soc2.contentHtml.includes('build-a-logging-pipeline-for-eu-ai-act-compliance')) {
  const crossLink = '<p>For EU AI Act Article 12 logging pipeline implementation, see <a href="/blog/build-a-logging-pipeline-for-eu-ai-act-compliance">logging pipeline for EU AI Act compliance</a>.</p>'
  const lastH2Idx = soc2.contentHtml.lastIndexOf('<h2>')
  if (lastH2Idx > -1) {
    soc2.contentHtml = soc2.contentHtml.slice(0, lastH2Idx) + crossLink + '\n' + soc2.contentHtml.slice(lastH2Idx)
  } else {
    soc2.contentHtml += '\n' + crossLink
  }
  fs.writeFileSync(soc2Path, JSON.stringify(soc2, null, 2))
  console.log('Added cross-link in SOC 2 audit trail post -> EU AI Act logging post')
} else {
  console.log('Cross-link already exists in SOC 2 audit trail post')
}

// 3. Differentiate RAG blog post - add a note at the top clarifying scope
const ragBlogPath = path.join(postsDir, 'production-rag-architecture-patterns-for-hybrid-search.json')
const ragBlog = JSON.parse(fs.readFileSync(ragBlogPath, 'utf-8'))
if (!ragBlog.contentHtml.includes('secure-enterprise-rag-architecture')) {
  const noteLink = '<p>This article focuses on hybrid search implementation patterns (BM25 + vector search). For overall RAG security architecture, see <a href="/secure-enterprise-rag-architecture">secure enterprise RAG architecture</a>.</p>'
  // Insert after the first paragraph
  const firstPEnd = ragBlog.contentHtml.indexOf('</p>') + 4
  if (firstPEnd > 4) {
    ragBlog.contentHtml = ragBlog.contentHtml.slice(0, firstPEnd) + '\n' + noteLink + ragBlog.contentHtml.slice(firstPEnd)
  } else {
    ragBlog.contentHtml = noteLink + '\n' + ragBlog.contentHtml
  }
  fs.writeFileSync(ragBlogPath, JSON.stringify(ragBlog, null, 2))
  console.log('Added differentiation note in RAG hybrid search blog post')
} else {
  console.log('Differentiation note already exists in RAG hybrid search post')
}

console.log('Cannibalization fixes complete.')
