export interface TranslationFile {
  language: string
  title: string
}

export interface MediaFile {
  id: string
  uploadedBy: string
  thumbnailUrl: string
  thumbnailSize: number
  smallUrl: string
  smallSize: number
  largeUrl: string
  largeSize: number
  createdAt: string
  translations: TranslationFile[]
}
