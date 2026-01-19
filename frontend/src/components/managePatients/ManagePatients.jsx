import React, { useEffect, useMemo, useState } from 'react'
import { fetchCurrentUser, getAccessToken, getStoredUser } from '../../services/authService'
import {
  addPatientToDoctor,
  getPatientsForDoctor,
  removePatientFromDoctor,
} from '../../services/doctorService'
import {
  addMedicationToPatient,
  createScheduleForMedication,
  deleteMedication,
  getMedicationsForUser,
} from '../../services/medicationsService'
import { showErrorToast, showSuccessToast } from '../ui/Toast'

const API_BASE_URL = import.meta?.env?.VITE_API_URL || 'http://localhost:8080'

const ManagePatients = () => {
  const [isDoctor, setIsDoctor] = useState(false)
  const [doctorId, setDoctorId] = useState('')

  const [assignedPatients, setAssignedPatients] = useState([])
  const [allPatients, setAllPatients] = useState([])
  const [selectedPatientId, setSelectedPatientId] = useState('')

  const [medications, setMedications] = useState([])
  const [loadingAssigned, setLoadingAssigned] = useState(false)
  const [loadingAll, setLoadingAll] = useState(false)
  const [loadingMeds, setLoadingMeds] = useState(false)
  const [error, setError] = useState(null)
  const [patientError, setPatientError] = useState(null)

  const [medName, setMedName] = useState('')
  const [scheduleTime, setScheduleTime] = useState('')
  const [scheduleDose, setScheduleDose] = useState('')
  const [scheduleDays, setScheduleDays] = useState(new Set())
  const [patientToAdd, setPatientToAdd] = useState('')

  const selectedPatient = useMemo(
    () => assignedPatients.find((p) => String(p.id) === String(selectedPatientId)),
    [assignedPatients, selectedPatientId],
  )

  const availablePatients = useMemo(() => {
    const assignedIds = new Set(assignedPatients.map((p) => String(p.id)))
    return allPatients.filter((p) => !assignedIds.has(String(p.id)))
  }, [allPatients, assignedPatients])

  const loadAssignedPatients = async (id) => {
    if (!id) return
    setLoadingAssigned(true)
    setError(null)
    try {
      const data = await getPatientsForDoctor(id)
      console.log('Doctor patients response:', data)
      setAssignedPatients(Array.isArray(data) ? data : [])
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || 'Failed to load doctor patients'
      setError(message)
      showErrorToast(message)
    }
    setLoadingAssigned(false)
  }

  const loadAllPatients = async () => {
    setLoadingAll(true)
    setError(null)
    try {
      const token = getAccessToken()
      const res = await fetch(`${API_BASE_URL}/api/users/all`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      })
      const data = await res.json()
      console.log('Users response:', data)
      if (!res.ok) {
        throw new Error(data?.message || 'Failed to load users')
      }
      const items = Array.isArray(data) ? data : data?.content || []
      const onlyPatients = items.filter((u) => u?.role === 'PATIENT')
      setAllPatients(onlyPatients.length ? onlyPatients : items)
    } catch (err) {
      const message = err?.message || 'Failed to load users'
      setError(message)
      showErrorToast(message)
    }
    setLoadingAll(false)
  }

  const loadMedications = async (patientId) => {
    if (!patientId) return
    setLoadingMeds(true)
    setError(null)
    try {
      const data = await getMedicationsForUser(patientId)
      console.log('Medications response:', data)
      setMedications(Array.isArray(data) ? data : [])
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || 'Failed to load medications'
      setError(message)
      showErrorToast(message)
    }
    setLoadingMeds(false)
  }

  useEffect(() => {
    const init = async () => {
      let user = getStoredUser()
      if (!user) {
        try {
          user = await fetchCurrentUser()
        } catch (e) {
          user = null
        }
      }
      const doctor = user?.role === 'DOCTOR'
      setIsDoctor(doctor)
      const id = user?.id ? String(user.id) : ''
      setDoctorId(id)
      if (doctor && id) {
        loadAssignedPatients(id)
        loadAllPatients()
      }
    }
    init()
  }, [])

  useEffect(() => {
    if (selectedPatientId) {
      loadMedications(selectedPatientId)
    } else {
      setMedications([])
    }
  }, [selectedPatientId])

  const toggleDay = (day) => {
    setScheduleDays((prev) => {
      const next = new Set(prev)
      if (next.has(day)) next.delete(day)
      else next.add(day)
      return next
    })
  }

  const handleAddPatient = async (e) => {
    e.preventDefault()
    if (!patientToAdd) return
    setError(null)
    setPatientError(null)
    try {
      const data = await addPatientToDoctor(patientToAdd)
      console.log('Add patient response:', data)
      if (data) {
        setAssignedPatients((prev) => [data, ...prev])
      }
      setPatientToAdd('')
      showSuccessToast('Patient added successfully.')
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || 'Failed to add patient'
      setError(message)
      setPatientError(message)
      showErrorToast(message)
    }
  }

  const handleRemovePatient = async (patientId) => {
    setError(null)
    try {
      const data = await removePatientFromDoctor(patientId)
      console.log('Remove patient response:', data)
      setAssignedPatients((prev) => prev.filter((p) => String(p.id) !== String(patientId)))
      if (String(selectedPatientId) === String(patientId)) {
        setSelectedPatientId('')
      }
      showSuccessToast('Patient removed.')
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || 'Failed to remove patient'
      setError(message)
      showErrorToast(message)
    }
  }

  const handleAddMedication = async (e) => {
    e.preventDefault()
    if (!selectedPatientId || !medName.trim()) return
    setError(null)
    try {
      const data = await addMedicationToPatient(selectedPatientId, { name: medName.trim() })
      console.log('Add medication response:', data)
      if (data?.id && scheduleTime) {
        try {
          const schedulePayload = {
            time: scheduleTime,
            dose: scheduleDose || undefined,
            days: Array.from(scheduleDays).map((day) => {
              const map = {
                MON: 'MONDAY',
                TUE: 'TUESDAY',
                WED: 'WEDNESDAY',
                THU: 'THURSDAY',
                FRI: 'FRIDAY',
                SAT: 'SATURDAY',
                SUN: 'SUNDAY',
              }
              return map[day] || day
            }),
          }
          const scheduleRes = await createScheduleForMedication(data.id, schedulePayload)
          console.log('Create schedule response:', scheduleRes)
          showSuccessToast('Medication and schedule created.')
        } catch (err) {
          const message = err?.response?.data?.message || err?.message || 'Failed to create schedule'
          setError(message)
          showErrorToast(message)
        }
      }
      setMedications((prev) => [data, ...prev])
      setMedName('')
      setScheduleTime('')
      setScheduleDose('')
      setScheduleDays(new Set())
      if (!scheduleTime) {
        showSuccessToast('Medication added.')
      }
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || 'Failed to add medication'
      setError(message)
      showErrorToast(message)
    }
  }

  const handleDeleteMedication = async (medicationId) => {
    if (!medicationId) return
    setError(null)
    try {
      const data = await deleteMedication(medicationId)
      console.log('Delete medication response:', data)
      setMedications((prev) => prev.filter((m) => m.id !== medicationId))
      showSuccessToast('Medication deleted.')
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || 'Failed to delete medication'
      setError(message)
      showErrorToast(message)
    }
  }

  return (
    <section className="mx-auto max-w-6xl">
      <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 p-6 text-white shadow-lg">
        <p className="text-xs uppercase tracking-widest text-white/70">Manage Patients</p>
        <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Doctor workspace</h1>
        <p className="mt-2 max-w-2xl text-sm text-white/75">
          Assign patients and manage their medications. Schedule UI is ready and will be wired to backend soon.
        </p>
      </div>

      {!isDoctor && (
        <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          This page is only available for doctors.
        </div>
      )}

      {isDoctor && (
        <div className="mt-6 grid gap-6 lg:grid-cols-[320px_1fr]">
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-900">Assigned patients</h2>
                <button
                  type="button"
                  onClick={() => doctorId && loadAssignedPatients(doctorId)}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                >
                  Refresh
                </button>
              </div>

              {loadingAssigned && <div className="mt-3 text-sm text-slate-500">Loading patients...</div>}
              {!loadingAssigned && assignedPatients.length === 0 && (
                <div className="mt-3 text-sm text-slate-500">No patients assigned.</div>
              )}

              <div className="mt-3 space-y-2">
                {assignedPatients.map((patient) => {
                  const active = String(patient.id) === String(selectedPatientId)
                  return (
                    <div
                      key={patient.id}
                      className={`rounded-xl border px-3 py-2 text-sm transition ${
                        active
                          ? 'border-indigo-200 bg-indigo-50 text-indigo-900'
                          : 'border-slate-100 bg-white text-slate-700 hover:border-indigo-100 hover:bg-indigo-50/40'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => setSelectedPatientId(patient.id)}
                        className="w-full text-left"
                      >
                        <div className="font-semibold">
                          {patient.firstName || patient.lastName
                            ? `${patient.firstName || ''} ${patient.lastName || ''}`.trim()
                            : patient.email}
                        </div>
                        <div className="text-xs text-slate-400">{patient.email}</div>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemovePatient(patient.id)}
                        className="mt-2 text-xs font-semibold text-red-600 hover:text-red-700"
                      >
                        Remove patient
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-900">Add patient</h2>
                <button
                  type="button"
                  onClick={loadAllPatients}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                >
                  Refresh
                </button>
              </div>

              {loadingAll && <div className="mt-3 text-sm text-slate-500">Loading list...</div>}
              {!loadingAll && availablePatients.length === 0 && (
                <div className="mt-3 text-sm text-slate-500">No more patients to add.</div>
              )}

              <form onSubmit={handleAddPatient} className="mt-3 space-y-3">
                <select
                  value={patientToAdd}
                  onChange={(e) => setPatientToAdd(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
                  disabled={availablePatients.length === 0}
                >
                  <option value="">Select patient</option>
                  {availablePatients.map((patient) => (
                    <option key={patient.id} value={patient.id}>
                      {patient.firstName || patient.lastName
                        ? `${patient.firstName || ''} ${patient.lastName || ''}`.trim()
                        : patient.email}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  disabled={!patientToAdd}
                  className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Add patient
                </button>
                {patientError && (
                  <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                    {patientError}
                  </div>
                )}
              </form>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">Add medication</h2>
              <p className="mt-1 text-sm text-slate-500">
                {selectedPatient
                  ? `Adding for ${selectedPatient.firstName || selectedPatient.email}`
                  : 'Select a patient to begin.'}
              </p>

              <form onSubmit={handleAddMedication} className="mt-4 space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700">Medication name</label>
                  <input
                    value={medName}
                    onChange={(e) => setMedName(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
                    placeholder="e.g. Amoxicillin"
                    disabled={!selectedPatientId}
                    required
                  />
                </div>

                <div className="rounded-xl border border-dashed border-slate-200 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-slate-700">Schedule (UI only)</p>
                    <span className="text-xs text-slate-400">Backend support coming soon</span>
                  </div>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">Time</label>
                      <input
                        type="time"
                        value={scheduleTime}
                        onChange={(e) => setScheduleTime(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
                        disabled={!selectedPatientId}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">Dose</label>
                      <input
                        value={scheduleDose}
                        onChange={(e) => setScheduleDose(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
                        placeholder="e.g. 1 tablet"
                        disabled={!selectedPatientId}
                      />
                    </div>
                  </div>
                  <div className="mt-3">
                    <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">Days</label>
                    <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                      {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((day) => (
                        <button
                          key={day}
                          type="button"
                          onClick={() => toggleDay(day)}
                          disabled={!selectedPatientId}
                          className={`rounded-lg border px-2 py-1 text-xs font-semibold transition ${
                            scheduleDays.has(day)
                              ? 'border-indigo-200 bg-indigo-50 text-indigo-700'
                              : 'border-slate-200 text-slate-500 hover:border-indigo-200'
                          }`}
                        >
                          {day}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!selectedPatientId}
                  className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Add medication
                </button>
              </form>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">Current medications</h2>
                {loadingMeds && <span className="text-xs text-slate-400">Loading...</span>}
              </div>

              {error && (
                <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error}
                </div>
              )}

              {!loadingMeds && medications.length === 0 && (
                <div className="mt-4 text-sm text-slate-500">
                  {selectedPatient ? 'No medications for this patient.' : 'Select a patient to view medications.'}
                </div>
              )}

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {medications.map((med) => (
                  <div key={med.id} className="rounded-xl border border-slate-100 bg-slate-50/40 p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{med.name}</p>
                        <p className="text-xs text-slate-400">ID: {med.id}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteMedication(med.id)}
                        className="text-xs font-semibold text-red-600 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default ManagePatients
