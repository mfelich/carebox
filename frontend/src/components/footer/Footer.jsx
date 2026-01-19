import React from 'react'

const Footer = () => {
  return (
    <footer className="mt-12 border-t border-slate-100 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-lg font-semibold text-slate-900">Care Box</div>
          <p className="mt-2 max-w-sm text-sm text-slate-500">
            A simple way for patients to track medications, schedules, and doctor instructions.
          </p>
        </div>

        <div className="grid gap-3 text-sm text-slate-500 sm:text-right">
          <span>Support: support@carebox.app</span>
          <span>Privacy &amp; Terms</span>
          <span className="text-slate-400">© {new Date().getFullYear()} Care Box</span>
        </div>
      </div>
    </footer>
  )
}

export default Footer
