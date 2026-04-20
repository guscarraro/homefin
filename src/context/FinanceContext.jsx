import { createContext, useContext, useMemo } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { DEFAULT_DATA } from '../services/mockData'
import {
  buildMonthlyProjection,
  buildSuggestions,
  getCategoryTotalsForMonth,
  getInstallmentsForMonth
} from '../utils/finance'
import { addMonthsToMonthKey, getMonthKeyFromDate } from '../utils/date'

const FinanceContext = createContext(null)

export function FinanceProvider({ children }) {
  const [financeData, setFinanceData] = useLocalStorage('homefin:data', DEFAULT_DATA)

  function addEntry(entry) {
    const totalAmount = Number(entry.amount || 0)
    const isInstallment = Boolean(entry.isInstallment)
    const installmentCount = isInstallment ? Number(entry.installmentCount || 1) : 1

    const originMonth = getMonthKeyFromDate(entry.date)

    let installmentStartMonth = null

    if (isInstallment) {
      installmentStartMonth =
        entry.paymentMethod === 'Crédito'
          ? addMonthsToMonthKey(originMonth, 1)
          : originMonth
    }

    const nextEntry = {
      ...entry,
      id: `entry-${Date.now()}`,
      type: 'expense',
      amount: totalAmount,
      isInstallment,
      installmentCount,
      installmentAmount: isInstallment
        ? Number((totalAmount / installmentCount).toFixed(2))
        : totalAmount,
      installmentStartMonth
    }

    setFinanceData({
      ...financeData,
      entries: [nextEntry, ...financeData.entries]
    })
  }

  function saveMonthSalary(payload) {
    const remaining = []

    for (const item of financeData.salaries) {
      if (item.month !== payload.month) {
        remaining.push(item)
      }
    }

    setFinanceData({
      ...financeData,
      salaries: [...remaining, payload]
    })
  }

  function addGoal(goal) {
    const nextGoal = {
      ...goal,
      id: `goal-${Date.now()}`
    }

    setFinanceData({
      ...financeData,
      goals: [nextGoal, ...financeData.goals]
    })
  }

  const projection = useMemo(() => buildMonthlyProjection(financeData), [financeData])

  const suggestions = useMemo(
    () => buildSuggestions(projection, financeData.goals),
    [projection, financeData.goals]
  )

  const categoryTotals = useMemo(
    () => getCategoryTotalsForMonth(financeData.entries),
    [financeData.entries]
  )

  const currentMonthInstallments = useMemo(
    () => getInstallmentsForMonth(financeData.entries),
    [financeData.entries]
  )

  const value = useMemo(
    () => ({
      financeData,
      addEntry,
      saveMonthSalary,
      addGoal,
      projection,
      suggestions,
      categoryTotals,
      currentMonthInstallments
    }),
    [financeData, projection, suggestions, categoryTotals, currentMonthInstallments]
  )

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>
}

export function useFinance() {
  return useContext(FinanceContext)
}