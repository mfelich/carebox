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

export const setUserToDoctor = async (userId) => {
  const token = getAccessToken()
  if (!token) {
    const err = new Error('Missing access token.')
    err.response = { data: { message: err.message } }
    throw err
  }
  const res = await fetch(`${API_BASE_URL}/api/admin/${userId}/set-to-doctor`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) {
    throw await toError(res)
  }
  return res.json()
}

export const getAllUsers = async () => {
  const token = getAccessToken()
  if (!token) {
    const err = new Error('Missing access token.')
    err.response = { data: { message: err.message } }
    throw err
  }
  const res = await fetch(`${API_BASE_URL}/api/users/all`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) {
    throw await toError(res)
  }
  return res.json()
}
