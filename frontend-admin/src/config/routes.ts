export const ROUTES = {
  HOME: '/',
  DASHBOARD: {
    BASE: '/dashboard',
    CATEGORIES: {
      BASE: '/dashboard/categories',
      NEW: '/dashboard/categories/new',
      EDIT: (categoryId: string) => `/dashboard/categories/edit/${categoryId}`,
    },
    POSTS: {
      BASE: '/dashboard/posts',
      NEW: '/dashboard/posts/new',
      EDIT: (postId: string) => `/dashboard/posts/edit/${postId}`,
    },
  },
}
