import React, { useEffect, useMemo, useState } from 'react'
import { getMedicationsForCurrentUser, getSchedulesForPatient } from '../../services/medicationsService'
import { getAuth, getStoredUser } from '../../services/authService'
import { showErrorToast } from '../ui/Toast'

const Medications = () => {
  const [meds, setMeds] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [userName, setUserName] = useState('')
  const [userRole, setUserRole] = useState('')
  const [schedules, setSchedules] = useState([])

  const loadUserName = () => {
    const user = getStoredUser()
    if (user) {
      const label = [user.firstName, user.lastName].filter(Boolean).join(' ')
      setUserName(label || user.email || '')
      setUserRole(user.role || '')
    }
    return user
  }

  const fetchMeds = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getMedicationsForCurrentUser()
      setMeds(Array.isArray(data) ? data : [])
      const user = loadUserName()
      const role = user?.role
      if (role === 'PATIENT') {
        try {
          const auth = getAuth()
          const patientId = user?.id || auth?.userId
          if (patientId) {
            const sched = await getSchedulesForPatient(patientId)
            setSchedules(Array.isArray(sched) ? sched : [])
          }
        } catch (e) {
          setSchedules([])
        }
      }
    } catch (e) {
      const message = e?.response?.data?.message || e?.message || 'Failed to load medications'
      setError(message)
      showErrorToast(message)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchMeds()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const schedulesByMedication = useMemo(() => {
    const map = new Map()
    schedules.forEach((item) => {
      const medId = item?.medicationDto?.id
      if (!medId) return
      const list = map.get(medId) || []
      list.push(item)
      map.set(medId, list)
    })
    return map
  }, [schedules])

  const formatDays = (days) => {
    if (!days) return ''
    if (Array.isArray(days)) return days.join(', ')
    if (typeof days === 'string') return days
    return ''
  }

  return (
    <section className="mx-auto max-w-5xl">
      <div className="mb-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-900 p-6 text-white shadow-lg">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-white/70">Medications</p>
            <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">Your current prescriptions</h2>
            <p className="mt-1 text-sm text-white/70">
              {userName ? `Patient: ${userName}` : 'Manage medications assigned to your profile.'}
            </p>
          </div>
          <button
            type="button"
            onClick={fetchMeds}
            className="inline-flex items-center justify-center rounded-full border border-white/30 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/60"
            disabled={loading}
          >
            {loading ? 'Refreshing...' : 'Refresh list'}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading && <div className="text-sm text-slate-500">Loading medications...</div>}

      {!loading && meds.length === 0 && !error && (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm">
          No medications found for this account.
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {meds.map((m) => (
          <div key={m.id || m.name} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-semibold text-slate-900">{m.name || 'Medication'}</h3>
                <p className="mt-1 text-xs text-slate-500">ID: {m.id ?? 'N/A'}</p>
              </div>
              <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600">Active</span>
            </div>
            {m.dosage && (
              <p className="mt-3 text-sm text-slate-600">Dosage: {m.dosage}</p>
            )}
            {m.frequency && (
              <p className="mt-1 text-sm text-slate-600">Frequency: {m.frequency}</p>
            )}
            {userRole === 'PATIENT' && schedulesByMedication.get(m.id)?.length > 0 && (
              <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Schedule</p>
                <div className="mt-2 space-y-2">
                  {schedulesByMedication.get(m.id).map((s) => (
                    <div key={s.id} className="text-xs text-slate-600">
                      <span className="font-semibold text-slate-700">{s.time || 'Time TBA'}</span>
                      {s.dosage && <span className="ml-2 text-slate-500">Dose: {s.dosage}</span>}
                      {s.daysOfWeek && (
                        <div className="mt-1 text-slate-400">Days: {formatDays(s.daysOfWeek)}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}

export default Medications
