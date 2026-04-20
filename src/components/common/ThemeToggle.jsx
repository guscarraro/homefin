import { FiMoon, FiSun } from 'react-icons/fi'
import Button from './Button'
import { useThemeMode } from '../../context/ThemeContext'

function ThemeToggle() {
  const { mode, toggleTheme } = useThemeMode()

  return (
    <Button type="button" onClick={toggleTheme}>
      {mode === 'dark' ? <FiSun /> : <FiMoon />} {mode === 'dark' ? 'Claro' : 'Escuro'}
    </Button>
  )
}

export default ThemeToggle