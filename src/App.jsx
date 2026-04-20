import { BrowserRouter } from 'react-router-dom'
import AppRouter from './routes/AppRouter'
import { ThemeProviderWrapper } from './context/ThemeContext'
import { UserProvider } from './context/UserContext'
import { FinanceProvider } from './context/FinanceContext'
import GlobalStyles from './styles/GlobalStyles'

function App() {
  return (
    <ThemeProviderWrapper>
      <UserProvider>
        <FinanceProvider>
          <BrowserRouter>
            <GlobalStyles />
            <AppRouter />
          </BrowserRouter>
        </FinanceProvider>
      </UserProvider>
    </ThemeProviderWrapper>
  )
}

export default App