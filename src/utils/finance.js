import {
  addMonthsToMonthKey,
  getMonthKeyFromDate,
  getNextMonthKey,
  getTodayDayOfMonth,
  getDaysInMonthFromKey,
  padMonth
} from './date'

function getSalaryForMonth(salaries, monthKey) {
  let total = 0

  for (const item of salaries || []) {
    if (item.month === monthKey) {
      total += Number(item.amount || 0)
    }
  }

  return total
}

function hasSkippedMonth(item, monthKey) {
  if (!item?.skippedMonths?.length) {
    return false
  }

  for (const skippedMonth of item.skippedMonths) {
    if (skippedMonth === monthKey) {
      return true
    }
  }

  return false
}

function getActiveFixedCostsTotal(fixedCosts, monthKey) {
  let total = 0

  for (const item of fixedCosts || []) {
    if (!item.active) {
      continue
    }

    if (monthKey && hasSkippedMonth(item, monthKey)) {
      continue
    }

    total += Number(item.amount || 0)
  }

  return total
}

function isEntryVisibleInMonth(entry, monthKey) {
  const entryMonth = getMonthKeyFromDate(entry.date)

  if (entry.isRecurring && entryMonth <= monthKey && !hasSkippedMonth(entry, monthKey)) {
    return true
  }

  if (entry.isInstallment) {
    const startMonth = entry.installmentStartMonth || entryMonth
    const totalInstallments = Number(entry.installmentCount || 1)

    for (let index = 0; index < totalInstallments; index += 1) {
      const installmentMonth = addMonthsToMonthKey(startMonth, index)

      if (installmentMonth === monthKey && !hasSkippedMonth(entry, monthKey)) {
        return true
      }
    }
  }

  return entryMonth === monthKey
}

function getInstallmentPositionInMonth(entry, monthKey) {
  if (!entry.isInstallment) {
    return 1
  }

  const entryMonth = getMonthKeyFromDate(entry.date)
  const startMonth = entry.installmentStartMonth || entryMonth
  const totalInstallments = Number(entry.installmentCount || 1)

  for (let index = 0; index < totalInstallments; index += 1) {
    const installmentMonth = addMonthsToMonthKey(startMonth, index)

    if (installmentMonth === monthKey) {
      return index + 1
    }
  }

  return 1
}

function getInstallmentAmountInMonth(entry, monthKey) {
  if (!entry.isInstallment) {
    return Number(entry.amount || 0)
  }

  const entryMonth = getMonthKeyFromDate(entry.date)
  const startMonth = entry.installmentStartMonth || entryMonth
  const totalInstallments = Number(entry.installmentCount || 1)

  for (let index = 0; index < totalInstallments; index += 1) {
    const installmentMonth = addMonthsToMonthKey(startMonth, index)

    if (installmentMonth === monthKey && !hasSkippedMonth(entry, monthKey)) {
      return Number(entry.installmentAmount || 0)
    }
  }

  return 0
}

function buildVirtualFixedCostDate(monthKey, dueDay) {
  const [year, month] = monthKey.split('-')
  const day = padMonth(Number(dueDay || 1))
  return `${year}-${month}-${day}`
}

export function getEntriesForMonthView(entries, monthKey) {
  const result = []

  for (const entry of entries || []) {
    if (!isEntryVisibleInMonth(entry, monthKey)) {
      continue
    }

    const visibleAmount = getInstallmentAmountInMonth(entry, monthKey)
    const installmentNumber = getInstallmentPositionInMonth(entry, monthKey)

    result.push({
      ...entry,
      visibleAmount,
      installmentNumber,
      installmentLabel: entry.isInstallment
        ? `${installmentNumber}/${Number(entry.installmentCount || 1)}`
        : null
    })
  }

  return result
}

function getMonthlyGoalsNeed(goals) {
  let total = 0

  for (const goal of goals || []) {
    const targetAmount = Number(goal.targetAmount || 0)
    const targetMonths = Number(goal.targetMonths || 0)

    if (targetAmount > 0 && targetMonths > 0) {
      total += targetAmount / targetMonths
    }
  }

  return Number(total.toFixed(2))
}

function getTotals(entriesForMonth, fixedCosts, monthKey) {
  let variableExpenses = 0
  let investments = 0
  let goalPayments = 0

  for (const entry of entriesForMonth) {
    const amount = Number(entry.visibleAmount || entry.amount || 0)

    if (entry.type === 'investment') {
      investments += amount
      continue
    }

    if (entry.category === 'Meta') {
      goalPayments += amount
    }

    variableExpenses += amount
  }

  const fixedCostsTotal = getActiveFixedCostsTotal(fixedCosts, monthKey)

  return {
    fixedCosts: Number(fixedCostsTotal.toFixed(2)),
    variableExpenses: Number(variableExpenses.toFixed(2)),
    investments: Number(investments.toFixed(2)),
    goalPayments: Number(goalPayments.toFixed(2)),
    expenses: Number((fixedCostsTotal + variableExpenses).toFixed(2))
  }
}

function getCategorySpent(entriesForMonth, categories) {
  const totals = {}

  for (const category of categories) {
    totals[category] = 0
  }

  for (const entry of entriesForMonth) {
    if (entry.type !== 'expense') {
      continue
    }

    const category = entry.category || 'Outros'
    const amount = Number(entry.visibleAmount || entry.amount || 0)

    if (totals[category] === undefined) {
      totals[category] = 0
    }

    totals[category] += amount
  }

  return totals
}

function clampBudget(value, minValue, maxValue) {
  if (value < minValue) return minValue
  if (value > maxValue) return maxValue
  return value
}

function buildLifestyleBudgets(salary, availableAfterGoals) {
  if (salary <= 0 || availableAfterGoals <= 0) {
    return {
      marketBudget: 0,
      foodBudget: 0,
      leisureBudget: 0,
      transportBudget: 0,
      otherBudget: 0
    }
  }

  const marketBase = salary * 0.1
  const foodBase = salary * 0.05
  const leisureBase = salary * 0.06
  const transportBase = salary * 0.08
  const otherBase = salary * 0.04

  const totalBase =
    marketBase +
    foodBase +
    leisureBase +
    transportBase +
    otherBase

  const pressureFactor =
    totalBase > 0
      ? Math.min(1, availableAfterGoals / totalBase)
      : 1

  const marketBudget = clampBudget(
    Number((marketBase * pressureFactor).toFixed(2)),
    0,
    Number((salary * 0.12).toFixed(2))
  )

  const foodBudget = clampBudget(
    Number((foodBase * pressureFactor).toFixed(2)),
    0,
    Number((salary * 0.06).toFixed(2))
  )

  const leisureBudget = clampBudget(
    Number((leisureBase * pressureFactor).toFixed(2)),
    0,
    Number((salary * 0.08).toFixed(2))
  )

  const transportBudget = clampBudget(
    Number((transportBase * pressureFactor).toFixed(2)),
    0,
    Number((salary * 0.1).toFixed(2))
  )

  const otherBudget = clampBudget(
    Number((otherBase * pressureFactor).toFixed(2)),
    0,
    Number((salary * 0.05).toFixed(2))
  )

  return {
    marketBudget,
    foodBudget,
    leisureBudget,
    transportBudget,
    otherBudget
  }
}

function getSuggestedInvestment(salary, fixedCosts, variableExpenses) {
  if (salary <= 0) {
    return {
      minimumInvestment: 0,
      recommendedInvestment: 0,
      aggressiveInvestment: 0
    }
  }

  const minimumInvestment = Number((salary * 0.1).toFixed(2))
  const committedBeforeInvestment = fixedCosts + variableExpenses
  const remainingBeforeInvestment = salary - committedBeforeInvestment

  if (remainingBeforeInvestment <= 0) {
    return {
      minimumInvestment,
      recommendedInvestment: 0,
      aggressiveInvestment: 0
    }
  }

  let recommendedPercent = 0.15

  if (fixedCosts > salary * 0.35) {
    recommendedPercent = 0.12
  }

  if (fixedCosts > salary * 0.45) {
    recommendedPercent = 0.1
  }

  const recommendedInvestment = Math.max(
    minimumInvestment,
    Number((salary * recommendedPercent).toFixed(2))
  )

  const aggressiveInvestment = Number((salary * 0.2).toFixed(2))

  return {
    minimumInvestment,
    recommendedInvestment: Math.min(recommendedInvestment, remainingBeforeInvestment),
    aggressiveInvestment: Math.min(aggressiveInvestment, remainingBeforeInvestment)
  }
}

export function buildMonthlyProjection(financeData, monthKey) {
  const salary = getSalaryForMonth(financeData.salaries, monthKey)
  const entriesForMonth = getEntriesForMonthView(financeData.entries, monthKey)
  const totals = getTotals(entriesForMonth, financeData.fixedCosts || [], monthKey)
  const monthlyGoalsNeed = getMonthlyGoalsNeed(financeData.goals || [])

  const investmentPlan = getSuggestedInvestment(
    salary,
    totals.fixedCosts,
    totals.variableExpenses
  )

  const investmentSuggested = investmentPlan.minimumInvestment
  const recommendedInvestment = Number(investmentPlan.recommendedInvestment.toFixed(2))
  const aggressiveInvestment = Number(investmentPlan.aggressiveInvestment.toFixed(2))

  const investmentActual = totals.investments
  const remainingInvestmentGoal = Math.max(
    0,
    Number((investmentSuggested - investmentActual).toFixed(2))
  )

  const availableToSpend = Number((salary - totals.expenses - totals.investments).toFixed(2))
  const availableAfterGoals = Number((availableToSpend - monthlyGoalsNeed).toFixed(2))

  const daysInMonth = getDaysInMonthFromKey(monthKey)
  const todayDay = getTodayDayOfMonth(monthKey)
  const remainingDays = Math.max(1, daysInMonth - todayDay + 1)

  const weeklyBudget = availableAfterGoals > 0 ? Number((availableAfterGoals / 4).toFixed(2)) : 0
  const dailyLimit = availableAfterGoals > 0 ? Number((availableAfterGoals / remainingDays).toFixed(2)) : 0

  const lifestyleBudgets = buildLifestyleBudgets(salary, availableAfterGoals)

  const categorySpent = getCategorySpent(entriesForMonth, [
    'Mercado',
    'Alimentação',
    'Lazer',
    'Transporte',
    'Combustível',
    'Outros',
    'Compras'
  ])

  const nextMonthKey = getNextMonthKey(monthKey)
  const nextMonthEntries = getEntriesForMonthView(financeData.entries, nextMonthKey)

  let nextMonthCommitted = getActiveFixedCostsTotal(financeData.fixedCosts || [], nextMonthKey)
  let nextMonthInstallments = 0

  for (const entry of nextMonthEntries) {
    const amount = Number(entry.visibleAmount || entry.amount || 0)

    if (entry.type === 'expense') {
      nextMonthCommitted += amount

      if (entry.isInstallment) {
        nextMonthInstallments += amount
      }
    }

    if (entry.type === 'investment' && entry.isRecurring) {
      nextMonthCommitted += amount
    }
  }

  const investedAboveMinimum = Math.max(
    0,
    Number((investmentActual - investmentSuggested).toFixed(2))
  )

  return {
    month: monthKey,
    hasSalary: salary > 0,
    salary,
    expenses: totals.expenses,
    fixedCosts: totals.fixedCosts,
    variableExpenses: totals.variableExpenses,
    investments: totals.investments,
    goalPayments: totals.goalPayments,
    investmentSuggested,
    recommendedInvestment,
    aggressiveInvestment,
    investedAboveMinimum,
    remainingInvestmentGoal,
    monthlyGoalsNeed,
    availableToSpend,
    availableAfterGoals,
    weeklyBudget,
    dailyLimit,
    marketBudget: lifestyleBudgets.marketBudget,
    foodBudget: lifestyleBudgets.foodBudget,
    leisureBudget: lifestyleBudgets.leisureBudget,
    transportBudget: lifestyleBudgets.transportBudget,
    otherBudget: lifestyleBudgets.otherBudget,
    marketSpent: Number((categorySpent.Mercado || 0).toFixed(2)),
    foodSpent: Number((categorySpent.Alimentação || 0).toFixed(2)),
    leisureSpent: Number((categorySpent.Lazer || 0).toFixed(2)),
    transportSpent: Number(
      (((categorySpent.Transporte || 0) + (categorySpent.Combustível || 0))).toFixed(2)
    ),
    otherSpent: Number(
      (((categorySpent.Outros || 0) + (categorySpent.Compras || 0))).toFixed(2)
    ),
    nextMonthCommitted: Number(nextMonthCommitted.toFixed(2)),
    nextMonthInstallments: Number(nextMonthInstallments.toFixed(2))
  }
}

export function buildSuggestions(projection, goals) {
  const items = []

  if (!projection.hasSalary) {
    items.push({
      id: 'no-salary',
      tone: 'warning',
      icon: 'calendar',
      title: 'Salários ainda não informados',
      text: 'Cadastrem os salários do mês para o sistema calcular metas, custos fixos, parcelas e limites reais.'
    })

    return items
  }

  if (projection.investments >= projection.investmentSuggested && projection.investmentSuggested > 0) {
    items.push({
      id: 'investment-hit',
      tone: 'success',
      icon: 'shield',
      title: 'Meta mínima de investimento batida',
      text: `Vocês já aportaram ${projection.investments.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      })} no mês. O mínimo saudável era ${projection.investmentSuggested.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      })}.`
    })

    if (projection.investedAboveMinimum > 0) {
      items.push({
        id: 'investment-above-minimum',
        tone: 'success',
        icon: 'target',
        title: 'Investimento acima do mínimo',
        text: `Além do piso, ainda foi colocado ${projection.investedAboveMinimum.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        })} acima da meta mínima.`
      })
    }
  } else {
    items.push({
      id: 'investment-missing',
      tone: 'warning',
      icon: 'target',
      title: 'Meta mínima de investimento ainda não foi batida',
      text: `Ainda faltam ${projection.remainingInvestmentGoal.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      })} para alcançar os 10% mínimos de aporte do mês.`
    })
  }

  if (projection.monthlyGoalsNeed > 0) {
    items.push({
      id: 'goals-month-need',
      tone: projection.availableAfterGoals >= 0 ? 'success' : 'danger',
      icon: 'goal',
      title: 'Reserva mensal para bater metas',
      text:
        projection.availableAfterGoals >= 0
          ? `Para cumprir os prazos das metas, o ideal é separar ${projection.monthlyGoalsNeed.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            })} neste mês.`
          : `Para cumprir os prazos das metas, seria preciso separar ${projection.monthlyGoalsNeed.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            })}, mas o orçamento atual ainda não sustenta isso.`
    })
  }

  if (goals?.length) {
    items.push({
      id: 'routine-advice',
      tone: 'default',
      icon: 'target',
      title: 'Ordem ideal do dinheiro',
      text: 'Paga o fixo, garante aporte, separa metas, respeita tetos variáveis e só depois libera o resto.'
    })
  }

  return items
}

export function getCategoryTotalsForMonth(entries, monthKey) {
  const entriesForMonth = getEntriesForMonthView(entries, monthKey)
  const totalsMap = {}

  for (const entry of entriesForMonth) {
    if (entry.type !== 'expense') {
      continue
    }

    const categoryName = entry.category || 'Outros'
    const amount = Number(entry.visibleAmount || entry.amount || 0)

    if (!totalsMap[categoryName]) {
      totalsMap[categoryName] = 0
    }

    totalsMap[categoryName] += amount
  }

  const result = []

  for (const categoryName in totalsMap) {
    result.push({
      name: categoryName,
      value: Number(totalsMap[categoryName].toFixed(2))
    })
  }

  result.sort((a, b) => b.value - a.value)

  return result
}

export function getInstallmentsForMonth(entries, monthKey) {
  const result = []

  for (const entry of entries || []) {
    if (!entry.isInstallment) {
      continue
    }

    const visibleAmount = getInstallmentAmountInMonth(entry, monthKey)

    if (!visibleAmount) {
      continue
    }

    result.push({
      ...entry,
      visibleAmount
    })
  }

  return result
}

export function simulateGoal(goal, projection) {
  const targetAmount = Number(goal?.targetAmount || 0)
  const targetMonths = Number(goal?.targetMonths || 0)

  const monthlyNeed =
    targetAmount > 0 && targetMonths > 0
      ? Number((targetAmount / targetMonths).toFixed(2))
      : 0

  const suggestedReserve = Math.max(
    0,
    Number(
      Math.min(
        projection.availableAfterGoals > 0 ? projection.availableAfterGoals : 0,
        monthlyNeed > 0 ? monthlyNeed : 0
      ).toFixed(2)
    )
  )

  const isViable = projection.availableAfterGoals >= monthlyNeed && monthlyNeed > 0
  const gap = Math.max(0, Number((monthlyNeed - projection.availableAfterGoals).toFixed(2)))
  const estimatedMonths =
    projection.availableAfterGoals > 0
      ? Math.ceil(targetAmount / projection.availableAfterGoals)
      : 0

  return {
    monthlyNeed,
    suggestedReserve,
    isViable,
    gap,
    estimatedMonths
  }
}

export function getProjectionDonutData(projection) {
  const planned = [
    {
      name: 'Custos fixos',
      value: Number(projection.fixedCosts.toFixed(2))
    },
    {
      name: 'Investimento ideal',
      value: Number((projection.aggressiveInvestment || projection.investmentSuggested || 0).toFixed(2))
    },
    {
      name: 'Metas mensais',
      value: Number(projection.monthlyGoalsNeed.toFixed(2))
    },
    {
      name: 'Mercado',
      value: Number(projection.marketBudget.toFixed(2))
    },
    {
      name: 'Alimentação',
      value: Number(projection.foodBudget.toFixed(2))
    },
    {
      name: 'Lazer',
      value: Number(projection.leisureBudget.toFixed(2))
    },
    {
      name: 'Transporte',
      value: Number(projection.transportBudget.toFixed(2))
    },
    {
      name: 'Outros',
      value: Number(projection.otherBudget.toFixed(2))
    }
  ]

  const actual = [
    {
      name: 'Custos fixos',
      value: Number(projection.fixedCosts.toFixed(2))
    },
    {
      name: 'Investimentos',
      value: Number(projection.investments.toFixed(2))
    },
    {
      name: 'Metas',
      value: Number(projection.goalPayments.toFixed(2))
    },
    {
      name: 'Mercado',
      value: Number(projection.marketSpent.toFixed(2))
    },
    {
      name: 'Alimentação',
      value: Number(projection.foodSpent.toFixed(2))
    },
    {
      name: 'Lazer',
      value: Number(projection.leisureSpent.toFixed(2))
    },
    {
      name: 'Transporte',
      value: Number(projection.transportSpent.toFixed(2))
    },
    {
      name: 'Outros',
      value: Number(projection.otherSpent.toFixed(2))
    }
  ]

  const filteredPlanned = []
  const filteredActual = []

  for (const item of planned) {
    if (item.value > 0) {
      filteredPlanned.push(item)
    }
  }

  for (const item of actual) {
    if (item.value > 0) {
      filteredActual.push(item)
    }
  }

  return {
    planned: filteredPlanned,
    actual: filteredActual
  }
}

export function getMonthlyEntriesList(financeData, monthKey) {
  const result = []
  const entryItems = getEntriesForMonthView(financeData.entries || [], monthKey)

  for (const entry of entryItems) {
    const isGoalPayment = entry.category === 'Meta'

    result.push({
      ...entry,
      sourceType: 'entry',
      originalId: entry.id,
      title: isGoalPayment ? 'Pagamento de meta' : entry.category || 'Geral',
      displayNote: entry.note || 'Sem observação',
      displayAmount: Number(entry.visibleAmount || entry.amount || 0),
      displayDate: entry.date,
      entryKindLabel:
        entry.type === 'investment'
          ? 'Investimento'
          : isGoalPayment
            ? 'Pagamento de meta'
            : 'Despesa variável',
      recurrenceLabel: entry.isRecurring ? 'Recorrente' : 'Avulso'
    })
  }

  for (const fixedCost of financeData.fixedCosts || []) {
    if (!fixedCost.active) {
      continue
    }

    if (hasSkippedMonth(fixedCost, monthKey)) {
      continue
    }

    result.push({
      id: `fixed-view-${fixedCost.id}-${monthKey}`,
      originalId: fixedCost.id,
      sourceType: 'fixed_cost',
      title: fixedCost.title || fixedCost.category || 'Custo fixo',
      category: fixedCost.category || 'Casa',
      displayNote: 'Custo fixo recorrente',
      displayAmount: Number(fixedCost.amount || 0),
      displayDate: buildVirtualFixedCostDate(monthKey, fixedCost.dueDay),
      dueDay: Number(fixedCost.dueDay || 1),
      entryKindLabel: 'Custo fixo',
      recurrenceLabel: 'Mensal'
    })
  }

  for (const salary of financeData.salaries || []) {
    if (salary.month !== monthKey) {
      continue
    }

    result.push({
      id: `salary-view-${salary.id || salary.month}`,
      originalId: salary.id || salary.month,
      sourceType: 'salary',
      title: 'Salário do mês',
      category: 'Receita',
      displayNote: `Gustavo: ${Number(salary.gustavo || 0).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      })} • Marccella: ${Number(salary.marccella || 0).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      })}`,
      displayAmount: Number(salary.amount || 0),
      displayDate: `${salary.month}-01`,
      entryKindLabel: 'Receita',
      recurrenceLabel: 'Mensal',
      type: 'income'
    })
  }

  result.sort((a, b) => {
    if (a.displayDate < b.displayDate) return 1
    if (a.displayDate > b.displayDate) return -1
    return 0
  })

  return result
}