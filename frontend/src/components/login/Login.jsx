import React, { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { fetchCurrentUser, login } from '../../services/authService'
import { showErrorToast, showSuccessToast } from '../ui/Toast'

const Login = ({ onClose, onSwitch }) => {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const data = await login(form)
      showSuccessToast('Login successful.')
      if (data?.userId) {
        fetchCurrentUser().catch(() => {})
      }
      setLoading(false)
      if (onClose) onClose()
    } catch (err) {
      setLoading(false)
      const message = err?.response?.data?.message || err?.message || 'Login failed'
      setError(message)
      showErrorToast(message)
    }
  }

  return (
    <Dialog.Root open onOpenChange={(open) => { if (!open && onClose) onClose() }}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 w-[92%] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-slate-900/10">
          <div className="mb-5 flex items-start justify-between">
            <div>
              <Dialog.Title className="text-xl font-semibold text-slate-900">Welcome back</Dialog.Title>
              <p className="mt-1 text-sm text-slate-500">Sign in to access your carebox account.</p>
            </div>
            <Dialog.Close className="rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700" aria-label="Close">
              x
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-slate-700">Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
                placeholder="you@email.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Password</label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
                placeholder="********"
                required
              />
            </div>

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => onSwitch && onSwitch('register')}
                className="text-sm font-medium text-slate-500 hover:text-slate-700"
              >
                Need an account?
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export default Login
