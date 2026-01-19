import React, { useState } from 'react'
import { fetchCurrentUser, login, register } from '../../services/authService'

const SignUp = ({ onClose }) => {
  const [form, setForm] = useState({ email: '', username: '', password: '', firstName: '', lastName: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await register(form)

      try {
        const auth = await login({ email: form.email, password: form.password })
        if (auth?.userId) {
          await fetchCurrentUser()
        }
      } catch (e) {
        // ignore login-after-register errors
      }

      setLoading(false)
      if (onClose) onClose()
    } catch (err) {
      setLoading(false)
      setError('Registration failed')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Sign Up</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">X</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm text-gray-600">First name</label>
            <input name="firstName" value={form.firstName} onChange={handleChange} className="mt-1 w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm text-gray-600">Last name</label>
            <input name="lastName" value={form.lastName} onChange={handleChange} className="mt-1 w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm text-gray-600">Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} className="mt-1 w-full border rounded px-3 py-2" required />
          </div>
          <div>
            <label className="block text-sm text-gray-600">Username</label>
            <input name="username" value={form.username} onChange={handleChange} className="mt-1 w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm text-gray-600">Password</label>
            <input name="password" type="password" value={form.password} onChange={handleChange} className="mt-1 w-full border rounded px-3 py-2" required />
          </div>

          {error && <div className="text-red-600">{error}</div>}

          <div className="flex justify-end">
            <button type="submit" disabled={loading} className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
              {loading ? 'Signing up...' : 'Sign Up'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SignUp
