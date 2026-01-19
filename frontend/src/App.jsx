import './App.css'
import React, { useState } from 'react'
import Navbar from './components/navbar/Navbar'
import Login from './components/login/Login'
import Register from './components/login/Register'
import Medications from './components/medications/Medications'
import About from './components/about/About'
import Footer from './components/footer/Footer'
import Toast from './components/ui/Toast'
import ManagePatients from './components/managePatients/ManagePatients'
import Home from './components/home/Home'
import Devices from './components/devices/Devices'
import AdminPanel from './components/admin/AdminPanel'

function App() {
  const [authModal, setAuthModal] = useState(null) // 'login' | 'register' | null
  const [view, setView] = useState('home') // 'home' | 'medications' | 'about' | 'managePatients' | 'devices' | 'admin'

  const openAuth = (type) => setAuthModal(type)
  const closeAuth = () => setAuthModal(null)

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onOpenAuth={openAuth} onNavigate={(v) => setView(v)} currentView={view} />
      {authModal === 'login' && <Login onClose={closeAuth} onSwitch={openAuth} />}
      {authModal === 'register' && <Register onClose={closeAuth} onSwitch={openAuth} />}

      <main className="flex-1 p-6">
        {view === 'home' && <Home onNavigate={setView} />}
        {view === 'medications' && <React.Suspense fallback={<div>Loading...</div>}><Medications /></React.Suspense>}
        {view === 'about' && <About />}
        {view === 'managePatients' && <ManagePatients />}
        {view === 'devices' && <Devices />}
        {view === 'admin' && <AdminPanel />}
      </main>
      <Footer />
      <Toast />
    </div>
  )
}

export default App
