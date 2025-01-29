export interface TranslationFile {
  language: string
  title: string
}

export interface MediaFile {
  id: string
  uploadedBy: string
  thumbnailUrl: string
  thumbnailSize: number
  mediumUrl: string
  mediumSize: number
  createdAt: string
  translations: TranslationFile[]
}
