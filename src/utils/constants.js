const API_URL = 'http://localhost:4000'
export const API_ROUTES = {
  SIGN_UP: `${API_URL}/auth/register`,
  SIGN_IN: `${API_URL}/auth/login`,
  GET_USER: `${API_URL}/auth/me`,
  CONTACTS: `${API_URL}/contacts`,
}

export const APP_ROUTES = {
  SIGN_UP: '/register',
  SIGN_IN: '/login',
  DASHBOARD: '/dashboard',
}