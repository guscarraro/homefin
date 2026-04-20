import { Navigate, Route, Routes } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import WelcomePage from '../pages/WelcomePage'
import DashboardPage from '../pages/DashboardPage'
import LaunchPage from '../pages/LaunchPage'
import SalariesPage from '../pages/SalariesPage'
import GoalsPage from '../pages/GoalsPage'
import EntriesPage from '../pages/EntriesPage'
import SettingsPage from '../pages/SettingsPage'

function AppRouter() {
  const { selectedUser } = useUser()

  if (!selectedUser) {
    return <WelcomePage />
  }

  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/launch" element={<LaunchPage />} />
      <Route path="/salaries" element={<SalariesPage />} />
      <Route path="/goals" element={<GoalsPage />} />
      <Route path="/entries" element={<EntriesPage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRouter