export const ROUTES = {
  HOME: '/',
  ADMIN: {
    BASE: '/admin',
    DASHBOARD: {
      BASE: '/admin/dashboard',
      CATEGORIES: {
        BASE: '/admin/dashboard/categories',
        NEW: '/admin/dashboard/categories/new',
        EDIT: (categoryId: string) =>
          `/admin/dashboard/categories/edit/${categoryId}`,
      },
      POSTS: {
        BASE: '/admin/dashboard/posts',
        NEW: '/admin/dashboard/posts/new',
        EDIT: (postId: string) => `/admin/dashboard/posts/edit/${postId}`,
      },
    },
  },
}
