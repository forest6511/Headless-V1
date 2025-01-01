// ファイルサイズのフォーマット関数
export const formatFileSize = (size: number): string => {
  if (!size || size === 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  const base = 1024
  const exponent = Math.floor(Math.log(size) / Math.log(base))
  const value = size / Math.pow(base, exponent)
  return `${value.toFixed(2)} ${units[exponent]}`
}
