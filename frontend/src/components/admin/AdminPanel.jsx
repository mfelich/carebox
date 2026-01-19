import React, { useEffect, useMemo, useState } from 'react'
import { fetchCurrentUser, getStoredUser } from '../../services/authService'
import { getAllUsers, setUserToDoctor } from '../../services/adminService'
import { showErrorToast, showSuccessToast } from '../ui/Toast'

const AdminPanel = () => {
  const [user, setUser] = useState(null)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')

  const loadUsers = async () => {
    setLoading(true)
    try {
      const data = await getAllUsers()
      const list = Array.isArray(data) ? data : data?.content || []
      const filtered = list.filter((u) => u?.role === 'PATIENT' || u?.role === 'DOCTOR')
      setUsers(filtered)
    } catch (err) {
      showErrorToast(err?.response?.data?.message || err?.message || 'Failed to load users')
    }
    setLoading(false)
  }

  useEffect(() => {
    const init = async () => {
      let stored = getStoredUser()
      if (!stored) {
        try {
          stored = await fetchCurrentUser()
        } catch (e) {
          stored = null
        }
      }
      setUser(stored)
      if (stored?.role === 'ADMIN') {
        loadUsers()
      }
    }
    init()
  }, [])

  const filteredUsers = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return users
    return users.filter((u) => {
      const label = `${u.firstName || ''} ${u.lastName || ''}`.trim().toLowerCase()
      return label.includes(term) || (u.email || '').toLowerCase().includes(term)
    })
  }, [users, search])

  const handleSetDoctor = async (userId) => {
    try {
      const updated = await setUserToDoctor(userId)
      showSuccessToast('User promoted to doctor.')
      setUsers((prev) => prev.map((u) => (u.id === userId ? updated : u)))
    } catch (err) {
      showErrorToast(err?.response?.data?.message || err?.message || 'Failed to update role')
    }
  }

  return (
    <section className="mx-auto max-w-6xl">
      <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 p-6 text-white shadow-lg">
        <p className="text-xs uppercase tracking-widest text-white/70">Admin Panel</p>
        <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">User management</h1>
        <p className="mt-2 max-w-2xl text-sm text-white/75">
          Promote users to doctors and keep the care team organized.
        </p>
      </div>

      {user?.role !== 'ADMIN' && (
        <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          This page is only available for admins.
        </div>
      )}

      {user?.role === 'ADMIN' && (
        <div className="mt-6 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">All users</h2>
              <p className="text-sm text-slate-500">Select a user and promote to doctor.</p>
            </div>
            <div className="flex w-full gap-2 sm:w-auto">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or email"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 shadow-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
              />
              <button
                type="button"
                onClick={loadUsers}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 hover:border-indigo-200"
              >
                Refresh
              </button>
            </div>
          </div>

          {loading && <div className="mt-4 text-sm text-slate-500">Loading users...</div>}

          {!loading && filteredUsers.length === 0 && (
            <div className="mt-4 text-sm text-slate-500">No users found.</div>
          )}

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {filteredUsers.map((u) => (
              <div key={u.id} className="rounded-xl border border-slate-100 bg-slate-50/40 p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {u.firstName || u.lastName ? `${u.firstName || ''} ${u.lastName || ''}`.trim() : u.email}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">{u.email}</p>
                    <p className="mt-1 text-xs text-slate-400">Role: {u.role}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSetDoctor(u.id)}
                    disabled={u.role === 'DOCTOR'}
                    className="rounded-lg border border-indigo-100 bg-white px-3 py-1 text-xs font-semibold text-indigo-600 shadow-sm transition hover:border-indigo-200 disabled:cursor-not-allowed disabled:text-slate-400"
                  >
                    {u.role === 'DOCTOR' ? 'Doctor' : 'Set as doctor'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}

export default AdminPanel
