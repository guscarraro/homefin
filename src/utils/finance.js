import {
  addMonthsToMonthKey,
  getCurrentMonthKey,
  getMonthKeyFromDate,
  getRemainingDaysInMonth,
  getRemainingWeeksInMonth
} from './date'

export function getMonthSalary(salaries, monthKey = getCurrentMonthKey()) {
  for (const item of salaries) {
    if (item.month === monthKey) {
      return item
    }
  }

  return null
}

export function getTotalSalaryForMonth(salaries, monthKey = getCurrentMonthKey()) {
  const salary = getMonthSalary(salaries, monthKey)

  if (!salary) {
    return 0
  }

  return Number(salary.gustavo || 0) + Number(salary.marccella || 0)
}

export function sumFixedCosts(fixedCosts) {
  let total = 0

  for (const item of fixedCosts) {
    if (item.active) {
      total += Number(item.amount || 0)
    }
  }

  return total
}

export function getExpenseValueForMonth(entry, monthKey) {
  if (entry.type !== 'expense') {
    return 0
  }

  if (!entry.isInstallment) {
    const entryMonth = getMonthKeyFromDate(entry.date)
    return entryMonth === monthKey ? Number(entry.amount || 0) : 0
  }

  const startMonth = entry.installmentStartMonth
  const installmentCount = Number(entry.installmentCount || 1)
  const installmentAmount = Number(entry.installmentAmount || 0)

  for (let index = 0; index < installmentCount; index += 1) {
    const currentInstallmentMonth = addMonthsToMonthKey(startMonth, index)

    if (currentInstallmentMonth === monthKey) {
      return installmentAmount
    }
  }

  return 0
}

export function sumExpensesForMonth(entries, monthKey = getCurrentMonthKey()) {
  let total = 0

  for (const item of entries) {
    total += getExpenseValueForMonth(item, monthKey)
  }

  return total
}

export function getCategoryTotalsForMonth(entries, monthKey = getCurrentMonthKey()) {
  const totals = {}

  for (const item of entries) {
    const value = getExpenseValueForMonth(item, monthKey)

    if (value <= 0) {
      continue
    }

    if (!totals[item.category]) {
      totals[item.category] = 0
    }

    totals[item.category] += value
  }

  const result = []

  for (const category in totals) {
    result.push({
      name: category,
      value: totals[category]
    })
  }

  return result
}

export function getInstallmentsForMonth(entries, monthKey = getCurrentMonthKey()) {
  const result = []

  for (const item of entries) {
    if (!item.isInstallment) {
      continue
    }

    const installmentCount = Number(item.installmentCount || 1)

    for (let index = 0; index < installmentCount; index += 1) {
      const installmentMonth = addMonthsToMonthKey(item.installmentStartMonth, index)

      if (installmentMonth === monthKey) {
        result.push({
          id: `${item.id}-${index + 1}`,
          title: item.note || item.category,
          category: item.category,
          amount: Number(item.installmentAmount || 0),
          currentInstallment: index + 1,
          totalInstallments: installmentCount,
          account: item.account,
          userId: item.userId
        })
      }
    }
  }

  return result
}

export function buildMonthlyProjection(data) {
  const currentMonth = getCurrentMonthKey()
  const nextMonth = addMonthsToMonthKey(currentMonth, 1)

  const salaryTotal = getTotalSalaryForMonth(data.salaries, currentMonth)

  if (!salaryTotal) {
    return {
      hasSalary: false,
      currentMonth,
      nextMonth,
      salaryTotal: 0,
      expenses: 0,
      fixedCosts: 0,
      investmentSuggested: 0,
      leisureSuggested: 0,
      availableToSpend: 0,
      dailyLimit: 0,
      weeklyFoodLimit: 0,
      nextMonthCommitted: 0,
      nextMonthInstallments: 0,
      nextMonthFixedCosts: 0
    }
  }

  const expenses = sumExpensesForMonth(data.entries, currentMonth)
  const fixedCosts = sumFixedCosts(data.fixedCosts)
  const investmentSuggested = salaryTotal * 0.1
  const leisureSuggested = salaryTotal * 0.08

  const availableToSpend =
    salaryTotal -
    expenses -
    fixedCosts -
    investmentSuggested -
    leisureSuggested

  const dailyLimit = availableToSpend / getRemainingDaysInMonth()
  const weeklyFoodLimit = Math.max(availableToSpend * 0.22 / getRemainingWeeksInMonth(), 0)

  const nextMonthInstallments = sumExpensesForMonth(data.entries, nextMonth)
  const nextMonthFixedCosts = sumFixedCosts(data.fixedCosts)
  const nextMonthCommitted = nextMonthInstallments + nextMonthFixedCosts

  return {
    hasSalary: true,
    currentMonth,
    nextMonth,
    salaryTotal,
    expenses,
    fixedCosts,
    investmentSuggested,
    leisureSuggested,
    availableToSpend,
    dailyLimit,
    weeklyFoodLimit,
    nextMonthCommitted,
    nextMonthInstallments,
    nextMonthFixedCosts
  }
}

export function simulateGoal(goal, projection) {
  const monthlyNeed =
    Number(goal.targetAmount || 0) / Math.max(Number(goal.targetMonths || 1), 1)

  const suggestedReserve = Math.max(projection.availableToSpend * 0.3, 0)
  const isViable = suggestedReserve >= monthlyNeed

  let gap = 0

  if (monthlyNeed > suggestedReserve) {
    gap = monthlyNeed - suggestedReserve
  }

  let estimatedMonths = 0

  if (suggestedReserve > 0) {
    estimatedMonths = Math.ceil(Number(goal.targetAmount || 0) / suggestedReserve)
  }

  return {
    monthlyNeed,
    suggestedReserve,
    isViable,
    gap,
    estimatedMonths
  }
}

export function buildSuggestions(projection, goals) {
  if (!projection.hasSalary) {
    return [
      {
        id: 'salary-missing',
        tone: 'warning',
        icon: 'wallet',
        title: 'Sem projeção liberada',
        text: 'Cadastrem os salários do mês para o app calcular quanto ainda dá para gastar com segurança.'
      }
    ]
  }

  const suggestions = []

  if (projection.availableToSpend >= 2000) {
    suggestions.push({
      id: 'status-safe',
      tone: 'success',
      icon: 'shield',
      title: 'Mês sob controle',
      text: 'Vocês ainda têm uma folga boa. Dá para viver o mês sem aperto, desde que não inventem moda de última hora.'
    })
  } else if (projection.availableToSpend > 0) {
    suggestions.push({
      id: 'status-attention',
      tone: 'warning',
      icon: 'alert',
      title: 'Atenção no restante do mês',
      text: 'Ainda existe saldo, mas já vale segurar gasto por impulso e compras emocionais.'
    })
  } else {
    suggestions.push({
      id: 'status-danger',
      tone: 'danger',
      icon: 'danger',
      title: 'Orçamento no vermelho técnico',
      text: 'O saldo livre acabou ou ficou negativo. Aqui o ideal é travar lazer e cortar o que não for essencial.'
    })
  }

  suggestions.push({
    id: 'food-plan',
    tone: projection.weeklyFoodLimit > 0 ? 'success' : 'warning',
    icon: 'food',
    title: 'Meta semanal de comida',
    text: `Para alimentação, tentem ficar perto de R$ ${projection.weeklyFoodLimit.toFixed(2).replace('.', ',')} por semana até fechar o mês.`
  })

  suggestions.push({
    id: 'invest-plan',
    tone: 'info',
    icon: 'target',
    title: 'Reserva sugerida',
    text: `O app sugere separar R$ ${projection.investmentSuggested.toFixed(2).replace('.', ',')} para investimento e R$ ${projection.leisureSuggested.toFixed(2).replace('.', ',')} para lazer.`
  })

  suggestions.push({
    id: 'next-month',
    tone: projection.nextMonthCommitted > projection.salaryTotal * 0.65 ? 'warning' : 'info',
    icon: 'calendar',
    title: 'Próximo mês já comprometido',
    text: `No próximo mês vocês já entram com R$ ${projection.nextMonthCommitted.toFixed(2).replace('.', ',')} comprometidos entre fixos e parcelas.`
  })

  if (goals.length > 0) {
    const firstGoal = goals[0]
    const simulation = simulateGoal(firstGoal, projection)

    if (simulation.isViable) {
      suggestions.push({
        id: 'goal-ok',
        tone: 'success',
        icon: 'goal',
        title: `Meta possível: ${firstGoal.title}`,
        text: `Mantendo a reserva de R$ ${simulation.suggestedReserve.toFixed(2).replace('.', ',')} por mês, vocês conseguem bater essa meta no prazo.`
      })
    } else {
      suggestions.push({
        id: 'goal-gap',
        tone: 'warning',
        icon: 'goal',
        title: `Meta apertada: ${firstGoal.title}`,
        text: `Para bater essa meta no prazo, falta encaixar mais R$ ${simulation.gap.toFixed(2).replace('.', ',')} por mês no orçamento.`
      })
    }
  }

  return suggestions
}