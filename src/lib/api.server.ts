import { getRequest } from '@tanstack/react-start/server'
import { api } from './api'

api.interceptors.request.use(async (config) => {
  try {
    const request = getRequest()
    const cookieHeader = request.headers.get('cookie')
    if (cookieHeader) {
      config.headers.set('Cookie', cookieHeader)
    }
  } catch {
    // Not in a request context
  }
  return config
})
