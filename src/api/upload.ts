import { requestData } from '@/utils/request'

export interface UploadImageResult {
  id: number | null
  bucket: string
  objectKey: string
  fileName: string
  publicUrl: string
  mimeType: string
  fileSize: number
  hash: string
  etag?: string
}

export async function uploadImage(file: File, usage = 'uploads') {
  const formData = new FormData()
  formData.append('file', file)

  return requestData<UploadImageResult>(`/api/admin/uploads/image?usage=${encodeURIComponent(usage)}`, {
    method: 'POST',
    body: formData,
  })
}
