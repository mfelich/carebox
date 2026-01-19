import { getAccessToken } from './authService'

const API_BASE_URL = import.meta?.env?.VITE_API_URL || 'http://localhost:8080'

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

export const getDevicesForUser = async (userId) => {
  const token = getAccessToken()
  const res = await fetch(`${API_BASE_URL}/api/devices/user/${userId}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  })
  if (!res.ok) {
    throw await toError(res)
  }
  return res.json()
}

export const registerDevice = async (payload) => {
  const token = getAccessToken()
  const res = await fetch(`${API_BASE_URL}/api/devices/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    throw await toError(res)
  }
  return res.json()
}
