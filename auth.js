import { create } from 'zustand'
import api from '../services/api'

const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('qb_token') || '',
  setAuth: (user, token) => {
    if (token) localStorage.setItem('qb_token', token)
    set({ user, token })
  },
  logout: () => { localStorage.removeItem('qb_token'); set({ user: null, token: '' }) },
  login: async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password })
    set({ user: data.user, token: data.token })
    localStorage.setItem('qb_token', data.token)
    return data
  },
  signup: async (payload) => {
    const { data } = await api.post('/auth/signup', payload)
    set({ user: data.user, token: data.token })
    localStorage.setItem('qb_token', data.token)
    return data
  }
}))

export default useAuthStore
