
import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  timeout: 15000,
})
console.info('API URL:', api.defaults.baseURL)

if (import.meta.env.VITE_USE_MOCK === '1') {
  import('@/mocks/server').then(mod => {
    mod.enableMock(api)
    console.info('[MOCK] API mock habilitado')
  })
}

export function setAuthToken(token?: string) {
  if (token) api.defaults.headers.common.Authorization = `Bearer ${token}`
  else delete api.defaults.headers.common.Authorization
}
