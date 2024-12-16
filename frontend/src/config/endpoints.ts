export const ADMIN_API_ENDPOINTS = {
  AUTH: {
    SIGNUP: '/api/admin/auth/signup',
    SIGNIN: '/api/admin/auth/signin',
    REFRESH_TOKEN: '/api/admin/auth/refresh',
  },
  CATEGORY: {
    CATEGORIES: '/api/admin/categories/categories',
    CATEGORY: '/api/admin/categories/category',
    DELETE: '/api/admin/categories',
  },
  POST: {
    POST: '/api/admin/posts/post',
    LIST: '/api/admin/posts/list',
  },
} as const
