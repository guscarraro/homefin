import { useState } from 'react'

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const stored = localStorage.getItem(key)

    if (stored !== null) {
      try {
        return JSON.parse(stored)
      } catch {
        return stored
      }
    }

    return initialValue
  })

  function saveValue(newValue) {
    setValue(newValue)
    localStorage.setItem(key, JSON.stringify(newValue))
  }

  return [value, saveValue]
}