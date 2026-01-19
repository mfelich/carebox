import React, { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { register } from '../../services/authService'
import { showErrorToast, showSuccessToast } from '../ui/Toast'

const Register = ({ onClose, onSwitch }) => {
  const [form, setForm] = useState({
    email: '',
    username: '',
    password: '',
    firstName: '',
    lastName: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await register(form)
      showSuccessToast('Account created successfully.')
      setLoading(false)
      if (onClose) onClose()
    } catch (err) {
      setLoading(false)
      const message = err?.response?.data?.message || err?.message || 'Registration failed'
      setError(message)
      showErrorToast(message)
    }
  }

  return (
    <Dialog.Root open onOpenChange={(open) => { if (!open && onClose) onClose() }}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 w-[92%] max-w-xl -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-slate-900/10">
          <div className="mb-5 flex items-start justify-between">
            <div>
              <Dialog.Title className="text-xl font-semibold text-slate-900">Create your account</Dialog.Title>
              <p className="mt-1 text-sm text-slate-500">Join carebox to manage your health in one place.</p>
            </div>
            <Dialog.Close className="rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700" aria-label="Close">
              x
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-700">First name</label>
                <input
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
                  placeholder="Aida"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Last name</label>
                <input
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
                  placeholder="Begovic"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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
                <label className="block text-sm font-medium text-slate-700">Username</label>
                <input
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
                  placeholder="carebox_user"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Password</label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
                placeholder="Create a strong password"
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
                onClick={() => onSwitch && onSwitch('login')}
                className="text-sm font-medium text-slate-500 hover:text-slate-700"
              >
                Already have an account?
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? 'Creating...' : 'Create account'}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export default Register
