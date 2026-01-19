import React, { useEffect, useRef, useState } from 'react'

const listeners = new Set()

const emitToast = (toast) => {
  listeners.forEach((listener) => listener(toast))
}

export const showSuccessToast = (message) => {
  emitToast({ type: 'success', message })
}

export const showErrorToast = (message) => {
  emitToast({ type: 'error', message })
}

const Toast = () => {
  const [toasts, setToasts] = useState([])
  const timeouts = useRef(new Map())

  useEffect(() => {
    const handler = (toast) => {
      const id = typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random()}`
      setToasts((prev) => [...prev, { id, ...toast }])
      const timeoutId = setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
        timeouts.current.delete(id)
      }, 3500)
      timeouts.current.set(id, timeoutId)
    }

    listeners.add(handler)
    return () => {
      listeners.delete(handler)
      timeouts.current.forEach((timeoutId) => clearTimeout(timeoutId))
      timeouts.current.clear()
    }
  }, [])

  const dismiss = (id) => {
    const timeoutId = timeouts.current.get(id)
    if (timeoutId) clearTimeout(timeoutId)
    timeouts.current.delete(id)
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <div className="pointer-events-none fixed inset-x-4 top-4 z-50 flex flex-col items-end gap-3 sm:inset-auto sm:right-6 sm:top-6">
      {toasts.map((toast) => {
        const isError = toast.type === 'error'
        const baseStyles = isError
          ? 'border-red-200 bg-red-50 text-red-900'
          : 'border-emerald-200 bg-emerald-50 text-emerald-900'
        return (
          <div
            key={toast.id}
            className={`pointer-events-auto w-full max-w-sm rounded-2xl border px-4 py-3 shadow-lg ${baseStyles}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold">
                  {isError ? 'Something went wrong' : 'Success'}
                </p>
                <p className="mt-1 text-sm text-slate-700">{toast.message}</p>
              </div>
              <button
                type="button"
                onClick={() => dismiss(toast.id)}
                className="rounded-full px-2 text-sm text-slate-500 hover:text-slate-700"
                aria-label="Dismiss"
              >
                x
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default Toast
