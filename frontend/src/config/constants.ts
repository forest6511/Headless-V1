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
  { name: '作成日時', uid: 'createAt' },
  { name: '最終更新日時', uid: 'updateAt' },
  { name: 'ステータス', uid: 'status' },
  { name: 'アクション', uid: 'actions' },
] as const
