export const API_ENDPOINTS = {
  AUTH: {
    SIGNUP: '/api/auth/signup',
    SIGNIN: '/api/auth/signin',
    REFRESH_TOKEN: '/api/auth/refresh',
  },
  CATEGORY: {
    CATEGORIES: '/api/categories/categories',
    CATEGORY: '/api/categories/category',
  },
  POST: {
    POST: '/api/posts/post',
    LIST: '/api/posts/list',
  },
} as const
