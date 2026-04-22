import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import {
  buildMonthlyProjection,
  buildSuggestions,
  getCategoryTotalsForMonth,
  getInstallmentsForMonth,
  getMonthlyEntriesList
} from '../utils/finance'
import { addMonthsToMonthKey, getMonthKeyFromDate } from '../utils/date'
import {
  getEntries,
  createEntry,
  deleteEntry,
  getFixedCosts,
  createFixedCost,
  deleteFixedCost,
  getGoals,
  createGoal,
  deleteGoal,
  getSalaries,
  saveSalary
} from '../services/api'

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

function normalizeFixedCost(item) {
  return {
    ...item,
    skippedMonths: item.skippedMonths || []
  }
}

export function FinanceProvider({ children }) {
  const [financeData, setFinanceData] = useState({
    salaries: [],
    fixedCosts: [],
    entries: [],
    goals: []
  })
  const [selectedMonth, setSelectedMonth] = useLocalStorage(
    'homefin:selected-month',
    getMonthKeyFromDate(new Date())
  )
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadFinanceData() {
      const token = localStorage.getItem('token')

      if (!token) {
        setFinanceData({
          salaries: [],
          fixedCosts: [],
          entries: [],
          goals: []
        })
        setLoading(false)
        return
      }

      try {
        setLoading(true)

        const [entriesData, fixedCostsData, goalsData, salariesData] = await Promise.all([
          getEntries(),
          getFixedCosts(),
          getGoals(),
          getSalaries()
        ])

        const normalizedEntries = []
        for (const entry of entriesData || []) {
          normalizedEntries.push(normalizeEntry(entry))
        }

        const normalizedFixedCosts = []
        for (const item of fixedCostsData || []) {
          normalizedFixedCosts.push(normalizeFixedCost(item))
        }

        setFinanceData({
          salaries: salariesData || [],
          fixedCosts: normalizedFixedCosts,
          entries: normalizedEntries,
          goals: goalsData || []
        })
      } catch (error) {
        console.error('Erro ao carregar dados financeiros:', error)
        setFinanceData({
          salaries: [],
          fixedCosts: [],
          entries: [],
          goals: []
        })
      } finally {
        setLoading(false)
      }
    }

    loadFinanceData()
  }, [])

  async function reloadFinanceData() {
    const [entriesData, fixedCostsData, goalsData, salariesData] = await Promise.all([
      getEntries(),
      getFixedCosts(),
      getGoals(),
      getSalaries()
    ])

    const normalizedEntries = []
    for (const entry of entriesData || []) {
      normalizedEntries.push(normalizeEntry(entry))
    }

    const normalizedFixedCosts = []
    for (const item of fixedCostsData || []) {
      normalizedFixedCosts.push(normalizeFixedCost(item))
    }

    setFinanceData({
      salaries: salariesData || [],
      fixedCosts: normalizedFixedCosts,
      entries: normalizedEntries,
      goals: goalsData || []
    })
  }

  async function addEntry(entry) {
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

    const payload = {
      ...entry,
      type: entryType,
      category,
      amount: totalAmount,
      isInstallment,
      installmentCount,
      installmentAmount: isInstallment
        ? Number((totalAmount / installmentCount).toFixed(2))
        : totalAmount,
      installmentStartMonth,
      isRecurring
    }

    const createdEntry = await createEntry(payload)

    const normalizedCreatedEntry = normalizeEntry(createdEntry)

    setFinanceData(previous => ({
      ...previous,
      entries: [normalizedCreatedEntry, ...previous.entries]
    }))
  }

  async function saveMonthSalary(payload) {
    const normalizedMonth =
      payload.month?.length === 7
        ? payload.month
        : getMonthKeyFromDate(payload.month || new Date())

    const gustavo = Number(payload.gustavo || 0)
    const marccella = Number(payload.marccella || 0)

    const nextSalary = await saveSalary({
      month: normalizedMonth,
      gustavo,
      marccella,
      amount: gustavo + marccella
    })

    setFinanceData(previous => {
      const remaining = []

      for (const item of previous.salaries || []) {
        if (item.month !== normalizedMonth) {
          remaining.push(item)
        }
      }

      return {
        ...previous,
        salaries: [...remaining, nextSalary]
      }
    })
  }

  async function addGoal(goal) {
    const createdGoal = await createGoal(goal)

    setFinanceData(previous => ({
      ...previous,
      goals: [createdGoal, ...previous.goals]
    }))
  }

  async function addFixedCost(payload) {
    const createdFixedCost = await createFixedCost({
      title: payload.title,
      amount: Number(payload.amount || 0),
      dueDay: Number(payload.dueDay || 1),
      active: true,
      category: payload.category || 'Casa'
    })

    const normalizedCreatedFixedCost = normalizeFixedCost(createdFixedCost)

    setFinanceData(previous => ({
      ...previous,
      fixedCosts: [normalizedCreatedFixedCost, ...previous.fixedCosts]
    }))
  }

  async function removeEntry(entryId) {
    await deleteEntry(entryId)

    setFinanceData(previous => {
      const nextEntries = []

      for (const entry of previous.entries || []) {
        if (entry.id !== entryId) {
          nextEntries.push(entry)
        }
      }

      return {
        ...previous,
        entries: nextEntries
      }
    })
  }

  function skipRecurringEntryMonth(entryId, monthKey) {
    setFinanceData(previous => {
      const nextEntries = []

      for (const entry of previous.entries || []) {
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

      return {
        ...previous,
        entries: nextEntries
      }
    })
  }

  async function removeFixedCost(fixedCostId) {
    await deleteFixedCost(fixedCostId)

    setFinanceData(previous => {
      const nextFixedCosts = []

      for (const item of previous.fixedCosts || []) {
        if (item.id !== fixedCostId) {
          nextFixedCosts.push(item)
        }
      }

      return {
        ...previous,
        fixedCosts: nextFixedCosts
      }
    })
  }

  function skipFixedCostMonth(fixedCostId, monthKey) {
    setFinanceData(previous => {
      const nextFixedCosts = []

      for (const item of previous.fixedCosts || []) {
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

      return {
        ...previous,
        fixedCosts: nextFixedCosts
      }
    })
  }

  async function removeGoal(goalId) {
    await deleteGoal(goalId)

    setFinanceData(previous => {
      const nextGoals = []

      for (const goal of previous.goals || []) {
        if (goal.id !== goalId) {
          nextGoals.push(goal)
        }
      }

      return {
        ...previous,
        goals: nextGoals
      }
    })
  }

  const projection = useMemo(
    () => buildMonthlyProjection(financeData, selectedMonth),
    [financeData, selectedMonth]
  )

  const suggestions = useMemo(
    () => buildSuggestions(projection, financeData.goals),
    [projection, financeData.goals]
  )

  const categoryTotals = useMemo(
    () => getCategoryTotalsForMonth(financeData.entries, selectedMonth),
    [financeData.entries, selectedMonth]
  )

  const currentMonthInstallments = useMemo(
    () => getInstallmentsForMonth(financeData.entries, selectedMonth),
    [financeData.entries, selectedMonth]
  )

  const visibleEntries = useMemo(
    () => getMonthlyEntriesList(financeData, selectedMonth),
    [financeData, selectedMonth]
  )

  const value = useMemo(
    () => ({
      financeData,
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
      removeGoal,
      projection,
      suggestions,
      categoryTotals,
      currentMonthInstallments,
      loading,
      reloadFinanceData
    }),
    [
      financeData,
      selectedMonth,
      visibleEntries,
      projection,
      suggestions,
      categoryTotals,
      currentMonthInstallments,
      loading
    ]
  )

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>
}

export function useFinance() {
  return useContext(FinanceContext)
}