import { createContext, useCallback, useContext, useMemo } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

const UserContext = createContext(null)

export function UserProvider({ children }) {
  const [selectedUser, setSelectedUser] = useLocalStorage('homefin:selected-user', null)

  const chooseUser = useCallback((userId) => {
    setSelectedUser(userId)
  }, [setSelectedUser])

  const clearUser = useCallback(() => {
    setSelectedUser(null)
  }, [setSelectedUser])

  const value = useMemo(() => ({
    selectedUser,
    chooseUser,
    clearUser
  }), [selectedUser, chooseUser, clearUser])

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export function useUser() {
  return useContext(UserContext)
}
