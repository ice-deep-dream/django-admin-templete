import apiClient from './client'

export interface LoginResponse {
  access: string
  refresh: string
  user: {
    id: number
    username: string
    email: string
    first_name: string
    last_name: string
    is_staff: boolean
    is_superuser: boolean
  }
}

export interface UserMe {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  is_staff: boolean
  is_superuser: boolean
}

export const authApi = {
  login: (username: string, password: string, captchaToken: string, captchaCode: string) =>
    apiClient.post<LoginResponse>('/auth/login/', { username, password, captcha_token: captchaToken, captcha_code: captchaCode }),

  getMe: () => apiClient.get<UserMe>('/auth/me/'),

  logout: () => apiClient.post('/auth/logout/'),
}
