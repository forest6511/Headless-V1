import { t } from '@/lib/translations'
import { Language } from '@/types/api/common/types'
/**
 * CATEGORY_COLUMNS: カテゴリ一覧画面のテーブルヘッダー定義
 * - name: テーブルの表示名
 * - uid: データフィールドの一意な識別子
 */
export const createCategoryColumns = (language: Language) =>
  [
    { name: t(language, 'categories.columns.name'), uid: 'name' },
    { name: t(language, 'categories.columns.breadcrumb'), uid: 'breadcrumb' },
    { name: t(language, 'categories.columns.description'), uid: 'description' },
    { name: t(language, 'categories.columns.slug'), uid: 'slug' },
    { name: t(language, 'categories.columns.count'), uid: 'count' },
    { name: t(language, 'categories.columns.actions'), uid: 'actions' },
  ] as const

/**
 * POST_COLUMNS: 投稿一覧画面のテーブルヘッダー定義
 * - name: テーブルの表示名
 * - uid: データフィールドの一意な識別子
 */
export const createPostColumns = (language: Language) =>
  [
    { name: t(language, 'posts.columns.title'), uid: 'name' },
    { name: t(language, 'posts.columns.slug'), uid: 'slug' },
    { name: t(language, 'posts.columns.category'), uid: 'category' },
    { name: t(language, 'posts.columns.tag'), uid: 'tag' },
    { name: t(language, 'posts.columns.createdAt'), uid: 'createAt' },
    { name: t(language, 'posts.columns.updatedAt'), uid: 'updateAt' },
    { name: t(language, 'posts.columns.status'), uid: 'status' },
    { name: t(language, 'posts.columns.actions'), uid: 'actions' },
  ] as const

// メディア一覧テーブルのカラム定義
export const createMediaListColumns = (language: Language) =>
  [
    { name: t(language, 'media.columns.thumbnail'), uid: 'thumbnail' },
    { name: t(language, 'media.columns.title'), uid: 'title' },
    { name: t(language, 'media.columns.uploadDate'), uid: 'uploadDate' },
    { name: t(language, 'media.columns.thumbnailSize'), uid: 'thumbnailSize' },
    { name: t(language, 'media.columns.smallSize'), uid: 'smallSize' },
    { name: t(language, 'media.columns.largeSize'), uid: 'largeSize' },
  ] as const

// メディアグリッドの定数設定
export const MEDIA_GRID_CONFIG = {
  ITEMS_PER_PAGE: 20, // ページごとに読み込むアイテム数
  SCROLL_THRESHOLD: 2200, // スクロール時の追加読み込みの閾値 (値を大きくするとよりスムーズになる)
  DEBOUNCE_DELAY: 25, // スクロールイベントのデバウンス遅延 (値を小さくすると遅延なし)
}

export const HIGHLIGHT_COLORS = [
  { label: 'Yellow', value: '#fef08a' },
  { label: 'Green', value: '#bbf7d0' },
  { label: 'Blue', value: '#bfdbfe' },
  { label: 'Pink', value: '#fecdd3' },
  { label: 'Purple', value: '#e9d5ff' },
]
