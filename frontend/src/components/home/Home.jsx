import React, { useEffect, useState } from 'react'
import { getAuth, getStoredUser, fetchCurrentUser } from '../../services/authService'

const Home = ({ onNavigate }) => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const init = async () => {
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
    }
    init()
  }, [])

  const isDoctor = user?.role === 'DOCTOR'
  const primaryAction = isDoctor ? 'managePatients' : 'medications'
  const primaryLabel = isDoctor ? 'Manage patients' : 'View medications'

  return (
    <section className="mx-auto max-w-6xl">
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 px-6 py-12 text-white shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.3),transparent_55%)]" />
        <div className="absolute -right-16 top-10 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="relative z-10 max-w-2xl">
          <p className="text-xs uppercase tracking-[0.3em] text-white/60">Care Box</p>
          <h1 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl">
            Your medication plan, always clear and on time.
          </h1>
          <p className="mt-3 text-sm text-white/70 sm:text-base">
            Care Box helps patients track prescribed medicines and schedules, while doctors keep care plans up to date.
            Everything stays connected in one place.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate && onNavigate(primaryAction)}
              className="rounded-full bg-indigo-500 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-400"
            >
              {primaryLabel}
            </button>
            <button
              type="button"
              onClick={() => onNavigate && onNavigate('about')}
              className="rounded-full border border-white/20 px-5 py-2 text-sm font-semibold text-white/80 transition hover:border-white/40"
            >
              Learn more
            </button>
          </div>
        </div>
      </div>

      <div className="mt-10 grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Built for real-world routines</h2>
          <p className="mt-3 text-sm text-slate-600">
            Patients can review medications, doses, and times in a single glance. Doctors can assign treatments, track
            updates, and keep every patient on a clear schedule.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {[
              { title: 'Medication list', desc: 'Keep every prescription organized.' },
              { title: 'Daily schedule', desc: 'See when it is time to take each dose.' },
              { title: 'Doctor oversight', desc: 'Doctors can adjust and monitor plans.' },
              { title: 'Clear communication', desc: 'Reduce confusion and missed doses.' },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-slate-100 bg-slate-50/40 p-4">
                <h3 className="text-sm font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-xs text-slate-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl bg-gradient-to-b from-indigo-50 via-white to-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Quick actions</h2>
          <p className="mt-2 text-sm text-slate-600">Jump directly to the most important pages.</p>
          <div className="mt-4 space-y-3">
            <button
              type="button"
              onClick={() => onNavigate && onNavigate(primaryAction)}
              className="w-full rounded-xl border border-indigo-100 bg-white px-4 py-3 text-left text-sm font-semibold text-slate-800 shadow-sm transition hover:border-indigo-200"
            >
              {primaryLabel}
              <span className="mt-1 block text-xs font-normal text-slate-500">
                {isDoctor ? 'Assign patients and manage treatments.' : 'Review your medicine schedule.'}
              </span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate && onNavigate('about')}
              className="w-full rounded-xl border border-slate-100 bg-white px-4 py-3 text-left text-sm font-semibold text-slate-800 shadow-sm transition hover:border-indigo-200"
            >
              About Care Box
              <span className="mt-1 block text-xs font-normal text-slate-500">
                Learn how the platform supports your care.
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Home
