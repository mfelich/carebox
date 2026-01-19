import { getAccessToken, getAuth, getStoredUser } from './authService'

const API_BASE_URL = import.meta?.env?.VITE_API_URL || 'http://localhost:8080'

const getCurrentUserId = () => {
  const auth = getAuth()
  if (auth?.userId) return auth.userId
  const user = getStoredUser()
  if (user?.id) return user.id
  return null
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

export const getMedicationsForCurrentUser = async () => {
  const userId = getCurrentUserId()
  if (!userId) {
    const err = new Error('User not found. Please login.')
    err.response = { data: { message: err.message } }
    throw err
  }

  const token = getAccessToken()
  const res = await fetch(`${API_BASE_URL}/api/medications/user/${userId}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  })
  if (!res.ok) {
    throw await toError(res)
  }
  return res.json()
}

export const getMedicationsForUser = async (userId) => {
  const token = getAccessToken()
  const res = await fetch(`${API_BASE_URL}/api/medications/user/${userId}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  })
  if (!res.ok) {
    throw await toError(res)
  }
  return res.json()
}

export const addMedicationToPatient = async (userId, payload) => {
  const token = getAccessToken()
  const res = await fetch(`${API_BASE_URL}/api/medications/${userId}`, {
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

export const deleteMedication = async (medicationId) => {
  const token = getAccessToken()
  const res = await fetch(`${API_BASE_URL}/api/medications/${medicationId}`, {
    method: 'DELETE',
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  })
  if (!res.ok) {
    throw await toError(res)
  }
  return res.text()
}

export const getSchedulesForPatient = async (patientId) => {
  const token = getAccessToken()
  if (!token) {
    const err = new Error('Missing access token.')
    err.response = { data: { message: err.message } }
    throw err
  }
  const res = await fetch(`${API_BASE_URL}/api/medications/schedule/patient/${patientId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) {
    throw await toError(res)
  }
  return res.json()
}

export const createScheduleForMedication = async (medicationId, payload) => {
  const token = getAccessToken()
  if (!token) {
    const err = new Error('Missing access token.')
    err.response = { data: { message: err.message } }
    throw err
  }
  const res = await fetch(`${API_BASE_URL}/api/medications/schedule/${medicationId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    throw await toError(res)
  }
  return res.json()
}
