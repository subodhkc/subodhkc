import { createServiceClient } from '@/lib/supabase'

/**
 * Generate a signed upload URL for a file in the org-files bucket.
 * The path must start with the org_id as the first folder segment.
 */
export async function createSignedUploadUrl(opts: {
  orgId: string
  filePath: string
  contentType: string
}): Promise<{ url: string; path: string } | null> {
  const serviceClient = createServiceClient()
  if (!serviceClient) return null

  const { orgId, filePath, contentType } = opts
  const fullPath = `${orgId}/${filePath}`

  const { data, error } = await serviceClient
    .storage
    .from('org-files')
    .createSignedUploadUrl(fullPath, {
      upsert: false,
    })

  if (error || !data) {
    console.error('Signed upload URL error:', error)
    return null
  }

  return { url: data.signedUrl, path: fullPath }
}

/**
 * Generate a signed download URL for a file in the org-files bucket.
 */
export async function createSignedDownloadUrl(opts: {
  orgId: string
  filePath: string
  expiresIn?: number
}): Promise<string | null> {
  const serviceClient = createServiceClient()
  if (!serviceClient) return null

  const { orgId, filePath, expiresIn = 3600 } = opts
  const fullPath = `${orgId}/${filePath}`

  const { data, error } = await serviceClient
    .storage
    .from('org-files')
    .createSignedUrl(fullPath, expiresIn)

  if (error || !data) {
    console.error('Signed download URL error:', error)
    return null
  }

  return data.signedUrl
}

/**
 * List files in an organization's folder.
 */
export async function listOrgFiles(opts: {
  orgId: string
  folder?: string
}): Promise<Array<{ name: string; id: string; size: number; lastModified: string }> | null> {
  const serviceClient = createServiceClient()
  if (!serviceClient) return null

  const { orgId, folder } = opts
  const path = folder ? `${orgId}/${folder}` : orgId

  const { data, error } = await serviceClient
    .storage
    .from('org-files')
    .list(path, {
      limit: 100,
      sortBy: { column: 'created_at', order: 'desc' },
    })

  if (error || !data) {
    console.error('List files error:', error)
    return null
  }

  return data
    .filter((f) => f.id !== null)
    .map((f) => ({
      name: f.name,
      id: f.id as string,
      size: f.metadata?.size || 0,
      lastModified: f.updated_at || f.created_at || '',
    }))
}

/**
 * Delete a file from the org-files bucket.
 */
export async function deleteOrgFile(opts: {
  orgId: string
  filePath: string
}): Promise<boolean> {
  const serviceClient = createServiceClient()
  if (!serviceClient) return false

  const { orgId, filePath } = opts
  const fullPath = `${orgId}/${filePath}`

  const { error } = await serviceClient
    .storage
    .from('org-files')
    .remove([fullPath])

  if (error) {
    console.error('Delete file error:', error)
    return false
  }

  return true
}
