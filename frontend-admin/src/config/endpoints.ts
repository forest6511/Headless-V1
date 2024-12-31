export const ADMIN_API_ENDPOINTS = {
  AUTH: {
    SIGNUP: '/api/admin/auth/signup',
    SIGNIN: '/api/admin/auth/signin',
    REFRESH_TOKEN: '/api/admin/auth/refresh',
  },
  CATEGORY: {
    CATEGORY: '/api/admin/categories',
  },
  POST: {
    POST: '/api/admin/posts',
  },
  MEDIA: {
    POST: '/api/admin/medias',
    SWR: '/api/admin/medias'
  },
} as const
