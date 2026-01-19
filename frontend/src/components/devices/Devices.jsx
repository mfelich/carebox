import React, { useEffect, useState } from 'react'
import { fetchCurrentUser, getAuth, getStoredUser } from '../../services/authService'
import { getDevicesForUser, registerDevice } from '../../services/devicesService'
import { showErrorToast, showSuccessToast } from '../ui/Toast'

const Devices = () => {
  const [user, setUser] = useState(null)
  const [devices, setDevices] = useState([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [form, setForm] = useState({
    name: '',
    deviceUuid: '',
    ipAddress: '',
  })

  const initUser = async () => {
    let stored = getStoredUser()
    if (!stored) {
      const auth = getAuth()
      if (auth?.userId) {
        try {
          stored = await fetchCurrentUser()
        } catch (e) {
          stored = null
        }
      }
    }
    setUser(stored)
    return stored
  }

  const loadDevices = async (userId) => {
    if (!userId) return
    setLoading(true)
    setError(null)
    try {
      const data = await getDevicesForUser(userId)
      setDevices(Array.isArray(data) ? data : [])
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || 'Failed to load devices'
      setError(message)
      showErrorToast(message)
    }
    setLoading(false)
  }

  useEffect(() => {
    const run = async () => {
      const current = await initUser()
      if (current?.id) {
        loadDevices(current.id)
      }
    }
    run()
  }, [])

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    if (!user?.id) return
    setSubmitting(true)
    setError(null)
    try {
      const payload = {
        name: form.name.trim(),
        deviceUuid: form.deviceUuid.trim(),
        ipAddress: form.ipAddress.trim(),
        userId: user.id,
      }
      const data = await registerDevice(payload)
      setDevices((prev) => [data, ...prev])
      setForm({ name: '', deviceUuid: '', ipAddress: '' })
      showSuccessToast('Uredjaj je povezan.')
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || 'Failed to register device'
      setError(message)
      showErrorToast(message)
    }
    setSubmitting(false)
  }

  return (
    <section className="mx-auto max-w-5xl">
      <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 p-6 text-white shadow-lg">
        <p className="text-xs uppercase tracking-widest text-white/70">Povezani uredjaji</p>
        <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Upravljanje povezanim uredjajima</h1>
        <p className="mt-2 max-w-2xl text-sm text-white/75">
          Povezi ESP uredjaj kako bi dobijao notifikacije kada je vrijeme za uzimanje lijeka.
        </p>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Registruj uredjaj</h2>
          <p className="mt-1 text-sm text-slate-500">Unesi podatke sa ESP uredjaja.</p>

          <form onSubmit={handleRegister} className="mt-4 space-y-3">
            <div>
              <label className="text-sm font-medium text-slate-700">Naziv uredjaja</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
                placeholder="npr. ESP Kitchen"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Device UUID</label>
              <input
                name="deviceUuid"
                value={form.deviceUuid}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
                placeholder="uuid-1234..."
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">IP adresa</label>
              <input
                name="ipAddress"
                value={form.ipAddress}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
                placeholder="192.168.1.12"
              />
            </div>

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? 'Povezujem...' : 'Povezi uredjaj'}
            </button>
          </form>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Moji uredjaji</h2>
            <button
              type="button"
              onClick={() => user?.id && loadDevices(user.id)}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
              disabled={loading}
            >
              Refresh
            </button>
          </div>

          {loading && <div className="mt-3 text-sm text-slate-500">Ucitavam uredjaje...</div>}
          {!loading && devices.length === 0 && (
            <div className="mt-3 text-sm text-slate-500">Nema povezanih uredjaja.</div>
          )}

          <div className="mt-4 space-y-3">
            {devices.map((device) => (
              <div key={device.id || device.deviceUuid} className="rounded-xl border border-slate-100 bg-slate-50/40 p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{device.name || 'ESP device'}</p>
                    <p className="mt-1 text-xs text-slate-500">UUID: {device.deviceUuid}</p>
                    {device.ipAddress && (
                      <p className="mt-1 text-xs text-slate-500">IP: {device.ipAddress}</p>
                    )}
                  </div>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-600">
                    Linked
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Devices
