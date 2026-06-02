import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthUser {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  is_staff: boolean
  is_superuser: boolean
}

interface AuthState {
  user: AuthUser | null
  token: string | null
  refresh: string | null
  isAuthenticated: boolean
  login: (user: AuthUser, token: string, refresh: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      refresh: null,
      isAuthenticated: false,
      login: (user, token, refresh) => set({ user, token, refresh, isAuthenticated: true }),
      logout: () => set({ user: null, token: null, refresh: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
    },
  ),
)

export type { AuthUser }
