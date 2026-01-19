const canUseSessionStorage = () => {
  if (typeof window === 'undefined') return false
  try {
    const testKey = '__cb_storage_test__'
    window.sessionStorage.setItem(testKey, '1')
    window.sessionStorage.removeItem(testKey)
    return true
  } catch (e) {
    return false
  }
}

const storage = canUseSessionStorage() ? window.sessionStorage : null
const memoryStore = new Map()

const readItem = (key) => {
  if (storage) return storage.getItem(key)
  return memoryStore.get(key) || null
}

const writeItem = (key, value) => {
  if (storage) {
    storage.setItem(key, value)
  } else {
    memoryStore.set(key, value)
  }
}

const removeItem = (key) => {
  if (storage) {
    storage.removeItem(key)
  } else {
    memoryStore.delete(key)
  }
}

export const notifyStorage = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('storage'))
  }
}

export const getJson = (key) => {
  const raw = readItem(key)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch (e) {
    return null
  }
}

export const setJson = (key, value, { notify = true } = {}) => {
  if (value === null || value === undefined) {
    removeItem(key)
  } else {
    writeItem(key, JSON.stringify(value))
  }
  if (notify) notifyStorage()
}

export const clearKey = (key, { notify = true } = {}) => {
  removeItem(key)
  if (notify) notifyStorage()
}
