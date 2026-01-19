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

export const getPatientsForDoctor = async (doctorId) => {
  const token = getAccessToken()
  if (!token) {
    const err = new Error('Missing access token.')
    err.response = { data: { message: err.message } }
    throw err
  }
  const res = await fetch(`${API_BASE_URL}/api/doctors/${doctorId}/patients`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) {
    throw await toError(res)
  }
  return res.json()
}

export const addPatientToDoctor = async (patientId) => {
  const token = getAccessToken()
  if (!token) {
    const err = new Error('Missing access token.')
    err.response = { data: { message: err.message } }
    throw err
  }
  const res = await fetch(`${API_BASE_URL}/api/doctor/add-patient/${patientId}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) {
    throw await toError(res)
  }
  return res.json()
}

export const removePatientFromDoctor = async (patientId) => {
  const token = getAccessToken()
  if (!token) {
    const err = new Error('Missing access token.')
    err.response = { data: { message: err.message } }
    throw err
  }
  const res = await fetch(`${API_BASE_URL}/api/doctors/remove/patient/${patientId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) {
    throw await toError(res)
  }
  return res.text()
}
