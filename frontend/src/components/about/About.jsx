import React from 'react'

const About = () => {
  return (
    <section className="mx-auto max-w-5xl">
      <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 p-6 text-white shadow-lg">
        <p className="text-xs uppercase tracking-widest text-white/70">About Care Box</p>
        <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Your personal hub for safe, simple medication tracking.</h1>
        <p className="mt-3 max-w-2xl text-sm text-white/80 sm:text-base">
          Care Box helps patients stay on top of the medicines prescribed by their doctor, with clear schedules,
          reminders, and a single place to review what to take and when.
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">What Care Box does</h2>
          <p className="mt-2 text-sm text-slate-600">
            Keep a list of your current medications, view schedules for each one, and stay aligned with your doctor’s plan.
            Everything is organized so you can focus on your health, not paperwork.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Why it matters</h2>
          <p className="mt-2 text-sm text-slate-600">
            Missing a dose or taking the wrong medicine can be risky. Care Box makes medication tracking effortless,
            especially for patients managing multiple prescriptions.
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="grid gap-6 sm:grid-cols-3">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-400">Track</h3>
            <p className="mt-2 text-sm text-slate-600">
              See all prescribed medications in one place with clear labels and details.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-400">Schedule</h3>
            <p className="mt-2 text-sm text-slate-600">
              Know exactly when to take each medicine, with timelines that match your care plan.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-400">Stay safe</h3>
            <p className="mt-2 text-sm text-slate-600">
              Reduce mistakes by keeping everything consistent and easy to check.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-3xl bg-slate-900 p-6 text-white shadow-lg">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl font-semibold">Built for patients, guided by doctors.</h2>
            <p className="mt-2 text-sm text-white/70">
              Care Box supports everyday health routines so you can feel confident and in control.
            </p>
          </div>
          <div className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white/90">
            Care Box
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
