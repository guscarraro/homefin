import { BrowserRouter } from 'react-router-dom'
import AppRouter from './routes/AppRouter'
import { ThemeProviderWrapper } from './context/ThemeContext'
import { FinanceProvider } from './context/FinanceContext'
import GlobalStyles from './styles/GlobalStyles'

function App() {
  return (
    <ThemeProviderWrapper>
      <FinanceProvider>
        <BrowserRouter>
          <GlobalStyles />
          <AppRouter />
        </BrowserRouter>
      </FinanceProvider>
    </ThemeProviderWrapper>
  )
}

export default App