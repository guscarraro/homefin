import { createContext, useContext, useMemo } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

const UserContext = createContext(null)

export function UserProvider({ children }) {
  const [selectedUser, setSelectedUser] = useLocalStorage('homefin:selected-user', null)

  function chooseUser(userId) {
    setSelectedUser(userId)
  }

  function clearUser() {
    setSelectedUser(null)
  }

  const value = useMemo(() => ({
    selectedUser,
    chooseUser,
    clearUser
  }), [selectedUser])

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export function useUser() {
  return useContext(UserContext)
}