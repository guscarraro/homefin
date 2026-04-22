import { createContext, useContext, useMemo } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { DEFAULT_DATA } from '../services/mockData'
import {
  buildMonthlyProjection,
  buildSuggestions,
  getCategoryTotalsForMonth,
  getInstallmentsForMonth,
  getMonthlyEntriesList
} from '../utils/finance'
import { addMonthsToMonthKey, getMonthKeyFromDate } from '../utils/date'

const FinanceContext = createContext(null)

function normalizeEntry(entry) {
  const category = String(entry.category || '').trim()
  const isInvestmentCategory = category.toLowerCase() === 'investimento'

  return {
    ...entry,
    type: isInvestmentCategory ? 'investment' : entry.type || 'expense',
    category: category || 'Geral',
    skippedMonths: entry.skippedMonths || []
  }
}

export function FinanceProvider({ children }) {
  const [financeData, setFinanceData] = useLocalStorage('homefin:data', DEFAULT_DATA)
  const [selectedMonth, setSelectedMonth] = useLocalStorage(
    'homefin:selected-month',
    getMonthKeyFromDate(new Date())
  )

  const normalizedEntries = useMemo(() => {
    const result = []

    for (const entry of financeData.entries || []) {
      result.push(normalizeEntry(entry))
    }

    return result
  }, [financeData.entries])

  const normalizedFixedCosts = useMemo(() => {
    const result = []

    for (const item of financeData.fixedCosts || []) {
      result.push({
        ...item,
        skippedMonths: item.skippedMonths || []
      })
    }

    return result
  }, [financeData.fixedCosts])

  const normalizedFinanceData = useMemo(
    () => ({
      ...financeData,
      entries: normalizedEntries,
      fixedCosts: normalizedFixedCosts
    }),
    [financeData, normalizedEntries, normalizedFixedCosts]
  )

  function addEntry(entry) {
    const totalAmount = Number(entry.amount || 0)
    const category = String(entry.category || 'Geral').trim()
    const isInvestmentCategory = category.toLowerCase() === 'investimento'
    const entryType = isInvestmentCategory ? 'investment' : entry.type || 'expense'
    const isInstallment = Boolean(entry.isInstallment) && entryType === 'expense'
    const installmentCount = isInstallment ? Number(entry.installmentCount || 1) : 1
    const isRecurring = Boolean(entry.isRecurring)

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
      type: entryType,
      category,
      amount: totalAmount,
      isInstallment,
      installmentCount,
      installmentAmount: isInstallment
        ? Number((totalAmount / installmentCount).toFixed(2))
        : totalAmount,
      installmentStartMonth,
      isRecurring,
      skippedMonths: []
    }

    setFinanceData({
      ...financeData,
      entries: [nextEntry, ...financeData.entries]
    })
  }

  function saveMonthSalary(payload) {
    const normalizedMonth =
      payload.month?.length === 7
        ? payload.month
        : getMonthKeyFromDate(payload.month || new Date())

    const gustavo = Number(payload.gustavo || 0)
    const marccella = Number(payload.marccella || 0)

    const nextSalary = {
      month: normalizedMonth,
      gustavo,
      marccella,
      amount: gustavo + marccella
    }

    const remaining = []

    for (const item of financeData.salaries) {
      if (item.month !== normalizedMonth) {
        remaining.push(item)
      }
    }

    setFinanceData({
      ...financeData,
      salaries: [...remaining, nextSalary]
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

  function addFixedCost(payload) {
    const nextFixedCost = {
      id: `fixed-${Date.now()}`,
      title: payload.title,
      amount: Number(payload.amount || 0),
      dueDay: Number(payload.dueDay || 1),
      active: true,
      category: payload.category || 'Casa',
      skippedMonths: []
    }

    setFinanceData({
      ...financeData,
      fixedCosts: [nextFixedCost, ...(financeData.fixedCosts || [])]
    })
  }

  function removeEntry(entryId) {
    const nextEntries = []

    for (const entry of financeData.entries || []) {
      if (entry.id !== entryId) {
        nextEntries.push(entry)
      }
    }

    setFinanceData({
      ...financeData,
      entries: nextEntries
    })
  }

  function skipRecurringEntryMonth(entryId, monthKey) {
    const nextEntries = []

    for (const entry of financeData.entries || []) {
      if (entry.id !== entryId) {
        nextEntries.push(entry)
        continue
      }

      const skippedMonths = entry.skippedMonths ? [...entry.skippedMonths] : []
      let alreadyExists = false

      for (const skippedMonth of skippedMonths) {
        if (skippedMonth === monthKey) {
          alreadyExists = true
        }
      }

      if (!alreadyExists) {
        skippedMonths.push(monthKey)
      }

      nextEntries.push({
        ...entry,
        skippedMonths
      })
    }

    setFinanceData({
      ...financeData,
      entries: nextEntries
    })
  }

  function removeFixedCost(fixedCostId) {
    const nextFixedCosts = []

    for (const item of financeData.fixedCosts || []) {
      if (item.id !== fixedCostId) {
        nextFixedCosts.push(item)
      }
    }

    setFinanceData({
      ...financeData,
      fixedCosts: nextFixedCosts
    })
  }

  function skipFixedCostMonth(fixedCostId, monthKey) {
    const nextFixedCosts = []

    for (const item of financeData.fixedCosts || []) {
      if (item.id !== fixedCostId) {
        nextFixedCosts.push(item)
        continue
      }

      const skippedMonths = item.skippedMonths ? [...item.skippedMonths] : []
      let alreadyExists = false

      for (const skippedMonth of skippedMonths) {
        if (skippedMonth === monthKey) {
          alreadyExists = true
        }
      }

      if (!alreadyExists) {
        skippedMonths.push(monthKey)
      }

      nextFixedCosts.push({
        ...item,
        skippedMonths
      })
    }

    setFinanceData({
      ...financeData,
      fixedCosts: nextFixedCosts
    })
  }

  const projection = useMemo(
    () => buildMonthlyProjection(normalizedFinanceData, selectedMonth),
    [normalizedFinanceData, selectedMonth]
  )

  const suggestions = useMemo(
    () => buildSuggestions(projection, normalizedFinanceData.goals),
    [projection, normalizedFinanceData.goals]
  )

  const categoryTotals = useMemo(
    () => getCategoryTotalsForMonth(normalizedFinanceData.entries, selectedMonth),
    [normalizedFinanceData.entries, selectedMonth]
  )

  const currentMonthInstallments = useMemo(
    () => getInstallmentsForMonth(normalizedFinanceData.entries, selectedMonth),
    [normalizedFinanceData.entries, selectedMonth]
  )

  const visibleEntries = useMemo(
    () => getMonthlyEntriesList(normalizedFinanceData, selectedMonth),
    [normalizedFinanceData, selectedMonth]
  )

  const value = useMemo(
    () => ({
      financeData: normalizedFinanceData,
      selectedMonth,
      setSelectedMonth,
      visibleEntries,
      addEntry,
      saveMonthSalary,
      addGoal,
      addFixedCost,
      removeEntry,
      skipRecurringEntryMonth,
      removeFixedCost,
      skipFixedCostMonth,
      projection,
      suggestions,
      categoryTotals,
      currentMonthInstallments
    }),
    [
      normalizedFinanceData,
      selectedMonth,
      visibleEntries,
      projection,
      suggestions,
      categoryTotals,
      currentMonthInstallments
    ]
  )

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>
}

export function useFinance() {
  return useContext(FinanceContext)
}