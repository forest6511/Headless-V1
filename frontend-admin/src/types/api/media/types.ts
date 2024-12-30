export interface MediaFile {
  id: string
  filePath: string
  fileType: string
  originalSize: number
  title?: string
  altText?: string
  uploadedBy: string
  thumbnailUrl: string
  thumbnailSize: number
  smallUrl: string
  smallSize: number
  mediumUrl: string
  mediumSize: number
  uploadedAt: string
}
