import React, { useEffect, useState } from 'react'
import { clearAuth, fetchCurrentUser, getAuth, getStoredUser } from '../../services/authService'

const Navbar = ({ onOpenAuth, onNavigate, currentView }) => {
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const u = getStoredUser()
    if (u) setUser(u)

    const onStorage = () => {
      const u2 = getStoredUser()
      if (u2) {
        setUser(u2)
        return
      }
      setUser(null)
      const auth = getAuth()
      if (auth?.userId) {
        fetchCurrentUser().then((data) => {
          if (data) setUser(data)
        }).catch(() => {})
      }
    }
    window.addEventListener('storage', onStorage)
    if (!u) {
      const auth = getAuth()
      if (auth?.userId) {
        fetchCurrentUser().then((data) => {
          if (data) setUser(data)
        }).catch(() => {})
      }
    }
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const handleLogout = () => {
    clearAuth()
    setUser(null)
    import('../ui/Toast').then(({ showSuccessToast }) => {
      showSuccessToast('Logged out successfully.')
    }).catch(() => {})
  }

  const isDoctor = user?.role === 'DOCTOR'
  const isPatient = user?.role === 'PATIENT'
  const isAdmin = user?.role === 'ADMIN'

  const linkClass = (view) => (
    view === currentView
      ? 'text-indigo-600'
      : 'text-gray-700 hover:text-indigo-600'
  )

  const MenuLinks = (
    <>
      <button onClick={() => onNavigate && onNavigate('home')} className={`${linkClass('home')} px-3 py-2 rounded-md text-sm font-medium`}>
        Home
      </button>
      {user && !isDoctor && !isAdmin && (
        <button onClick={() => onNavigate && onNavigate('medications')} className={`${linkClass('medications')} px-3 py-2 rounded-md text-sm font-medium`}>
          Medications
        </button>
      )}
      {user && isDoctor && (
        <button onClick={() => onNavigate && onNavigate('managePatients')} className={`${linkClass('managePatients')} px-3 py-2 rounded-md text-sm font-medium`}>
          Manage Patients
        </button>
      )}
      {user && isAdmin && (
        <button onClick={() => onNavigate && onNavigate('admin')} className={`${linkClass('admin')} px-3 py-2 rounded-md text-sm font-medium`}>
          Admin Panel
        </button>
      )}
      {user && isPatient && (
        <button onClick={() => onNavigate && onNavigate('devices')} className={`${linkClass('devices')} px-3 py-2 rounded-md text-sm font-medium`}>
          Povezani uredjaji
        </button>
      )}
      <button onClick={() => onNavigate && onNavigate('about')} className={`${linkClass('about')} px-3 py-2 rounded-md text-sm font-medium`}>
        About
      </button>
    </>
  )

  return (
    <nav className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex-shrink-0">
            <a href="/" className="text-2xl font-extrabold text-indigo-600 tracking-tight">
              carebox
            </a>
          </div>

          <div className="flex-1 hidden md:flex justify-center">
            <div className="flex items-center space-x-4">{MenuLinks}</div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="hidden sm:flex sm:items-center sm:space-x-2">
              {!user ? (
                <>
                  <button onClick={() => onOpenAuth('login')} className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm">
                    Login
                  </button>
                  <button onClick={() => onOpenAuth('register')} className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
                    Sign Up
                  </button>
                </>
              ) : (
                <>
                  <span className="text-gray-700 px-3 py-2 text-sm">Hello, {user.firstName || user.email}</span>
                  <button onClick={handleLogout} className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700">
                    Logout
                  </button>
                </>
              )}
            </div>

            <div className="md:hidden">
              <button
                onClick={() => setOpen(!open)}
                aria-label="Toggle menu"
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-indigo-600"
              >
                {open ? (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t">
          <div className="px-2 pt-2 pb-3 space-y-1 flex flex-col">
            {MenuLinks}
            <div className="mt-2 border-t pt-2 flex flex-col space-y-2 px-2">
              {!user ? (
                <>
                  <button onClick={() => onOpenAuth('login')} className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm text-left">
                    Login
                  </button>
                  <button onClick={() => onOpenAuth('register')} className="inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
                    Sign Up
                  </button>
                </>
              ) : (
                <>
                  <span className="text-gray-700 px-3 py-2 text-sm">Hello, {user.firstName || user.email}</span>
                  <button onClick={handleLogout} className="inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700">
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
