/**
 * CATEGORY_COLUMNS: カテゴリ一覧画面のテーブルヘッダー定義
 * - name: テーブルの表示名
 * - uid: データフィールドの一意な識別子
 */
export const CATEGORY_COLUMNS = [
  { name: 'カテゴリ名', uid: 'name' },
  { name: 'パンくず', uid: 'breadcrumb' },
  { name: '説明', uid: 'description' },
  { name: 'スラッグ', uid: 'slug' },
  { name: '投稿数', uid: 'count' },
  { name: 'アクション', uid: 'actions' },
] as const

/**
 * POST_COLUMNS: 投稿一覧画面のテーブルヘッダー定義
 * - name: テーブルの表示名
 * - uid: データフィールドの一意な識別子
 */
export const POST_COLUMNS = [
  { name: 'タイトル', uid: 'name' },
  { name: 'スラッグ', uid: 'slug' },
  { name: 'カテゴリ', uid: 'category' },
  { name: 'タグ', uid: 'tag' },
  { name: '作成日時', uid: 'createAt' },
  { name: '最終更新日時', uid: 'updateAt' },
  { name: 'ステータス', uid: 'status' },
  { name: 'アクション', uid: 'actions' },
] as const

// メディアグリッドの定数設定
export const MEDIA_GRID_CONFIG = {
  ITEMS_PER_PAGE: 20, // ページごとに読み込むアイテム数
  SCROLL_THRESHOLD: 2200, // スクロール時の追加読み込みの閾値 (値を大きくするとよりスムーズになる)
  DEBOUNCE_DELAY: 25 // スクロールイベントのデバウンス遅延 (値を小さくすると遅延なし)
}
