export const API_ENDPOINTS = {
  AUTH: {
    SIGNUP: '/api/auth/signup',
    SIGNIN: '/api/auth/signin',
    REFRESH_TOKEN: '/api/auth/refresh',
  },
  TAXONOMY: {
    CATEGORIES: '/api/taxonomies/categories',
    CATEGORY: '/api/taxonomies/category',
  },
  POST: {
    POST: '/api/posts/post',
  },
} as const
