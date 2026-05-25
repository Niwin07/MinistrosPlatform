import { create } from 'zustand'

const MOCK_USER = {
  id: '1',
  name: 'Carlos Méndez',
  email: 'carlos@iglesia.com',
  role: 'LÍDER',
}

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoggingIn: false,
  loginError: null,

  login: async (credentials) => {
    set({ isLoggingIn: true, loginError: null })
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      set({
        user: MOCK_USER,
        token: 'mock-jwt-token',
        isAuthenticated: true,
        isLoggingIn: false,
        loginError: null,
      })
    } catch (err) {
      set({ isLoggingIn: false, loginError: err.message })
      throw err
    }
  },

  logout: () => set({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoggingIn: false,
    loginError: null,
  }),
}))
