import { create } from 'zustand'
import { api } from '../services/api'

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoggingIn: false,
  loginError: null,

  login: async (credentials) => {
    set({ isLoggingIn: true, loginError: null })
    try {
      const data = await api('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      })
      localStorage.setItem('token', data.token)
      set({
        user: data.user,
        token: data.token,
        isAuthenticated: true,
        isLoggingIn: false,
        loginError: null,
      })
    } catch (err) {
      set({ isLoggingIn: false, loginError: err.message })
      throw err
    }
  },

  register: async (data) => {
    set({ isLoggingIn: true, loginError: null })
    try {
      const res = await api('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      })
      localStorage.setItem('token', res.token)
      set({
        user: res.user,
        token: res.token,
        isAuthenticated: true,
        isLoggingIn: false,
        loginError: null,
      })
    } catch (err) {
      set({ isLoggingIn: false, loginError: err.message })
      throw err
    }
  },

  logout: () => {
    localStorage.removeItem('token')
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoggingIn: false,
      loginError: null,
    })
  },

  initAuth: async () => {
    const token = localStorage.getItem('token')
    if (!token) return
    try {
      const data = await api('/api/users/me')
      set({
        user: data,
        token,
        isAuthenticated: true,
      })
    } catch {
      localStorage.removeItem('token')
      set({
        user: null,
        token: null,
        isAuthenticated: false,
      })
    }
  },
}))
