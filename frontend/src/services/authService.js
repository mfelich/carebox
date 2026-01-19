import { clearKey, getJson, notifyStorage, setJson } from './storage'

const API_BASE_URL = import.meta?.env?.VITE_API_URL || 'http://localhost:8080'
const AUTH_KEY = 'auth'
const USER_KEY = 'user'

const sanitizeAuth = (auth) => {
  if (!auth || typeof auth !== 'object') return null
  const { accessToken, userId, tokenType, expiresAt, expiresIn } = auth
  if (!accessToken || !userId) return null
  return { accessToken, userId, tokenType, expiresAt, expiresIn }
}

const sanitizeUser = (user) => {
  if (!user || typeof user !== 'object') return null
  const { id, email, username, firstName, lastName, role } = user
  return { id, email, username, firstName, lastName, role }
}

const toError = async (res) => {
  let message = 'Request failed'
  try {
    const data = await res.json()
    if (data && typeof data === 'object' && data.message) {
      message = data.message
    } else if (typeof data === 'string' && data.trim()) {
      message = data
    }
  } catch (e) {
    try {
      const text = await res.text()
      if (text) message = text
    } catch (err) {
      // ignore
    }
  }
  const error = new Error(message)
  error.response = { data: { message } }
  return error
}

const requestJson = async (path, options = {}) => {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  })

  if (!res.ok) {
    throw await toError(res)
  }

  return res.json()
}

const storeAuth = (auth) => {
  const safeAuth = sanitizeAuth(auth)
  setJson(AUTH_KEY, safeAuth)
}

const storeUser = (user) => {
  const safeUser = sanitizeUser(user)
  setJson(USER_KEY, safeUser)
}

export const getAuth = () => {
  return getJson(AUTH_KEY)
}

export const getStoredUser = () => {
  return getJson(USER_KEY)
}

export const getAccessToken = () => {
  const auth = getAuth()
  return auth?.accessToken || null
}

export const clearAuth = () => {
  clearKey(AUTH_KEY, { notify: false })
  clearKey(USER_KEY, { notify: false })
  notifyStorage()
}

export const fetchCurrentUser = async () => {
  const auth = getAuth()
  if (!auth?.userId) return null
  const token = getAccessToken()
  const res = await fetch(`${API_BASE_URL}/api/users/${auth.userId}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  })
  if (!res.ok) {
    throw await toError(res)
  }
  const data = await res.json()
  storeUser(data)
  return data
}

export const login = async ({ email, password }) => {
  const data = await requestJson('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
  storeAuth(data)
  return data
}

export const register = async ({ email, username, password, firstName, lastName }) => {
  const data = await requestJson('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, username, password, firstName, lastName }),
  })
  storeUser(data)
  return data
}
