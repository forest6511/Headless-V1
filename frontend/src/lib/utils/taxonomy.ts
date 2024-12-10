import { TaxonomyWithPostRefsResponse } from '@/types/api/taxonomy/response'

export interface CategoryOption {
  value: string
  label: string
}

export function buildCategoryOptions(
  taxonomies: TaxonomyWithPostRefsResponse[]
): CategoryOption[] {
  if (!taxonomies || taxonomies.length === 0) return []

  const categoryMap: Record<string, TaxonomyWithPostRefsResponse[]> = {}
  let roots: TaxonomyWithPostRefsResponse[] = []

  // カテゴリをIDベースで分類
  taxonomies.forEach((category) => {
    if (category.parentId) {
      if (!categoryMap[category.parentId]) {
        categoryMap[category.parentId] = []
      }
      categoryMap[category.parentId].push(category)
    } else {
      roots.push(category)
    }
  })

  // 親カテゴリを名前順にソート
  roots = roots.sort((a, b) => a.name.localeCompare(b.name))

  const buildBreadcrumbLabels = (
    node: TaxonomyWithPostRefsResponse,
    parentLabel: string
  ): CategoryOption[] => {
    const currentLabel = parentLabel
      ? `${parentLabel} / ${node.name}`
      : node.name
    const children = (categoryMap[node.id] || []).sort((a, b) =>
      a.name.localeCompare(b.name)
    )

    if (children.length === 0) {
      return [{ value: node.id, label: currentLabel }]
    }

    return children.flatMap((child) =>
      buildBreadcrumbLabels(child, currentLabel)
    )
  }

  return roots.flatMap((root) => buildBreadcrumbLabels(root, ''))
}
