import {
  addMonthsToMonthKey,
  getMonthKeyFromDate,
  getNextMonthKey,
  getTodayDayOfMonth,
  getDaysInMonthFromKey,
  padMonth
} from './date'
import { CATEGORIES } from '../services/mockData'

const CATEGORY_PLAN_RULES = {
  Mercado: { percent: 0.1, tone: 'market' },
  Alimentação: { percent: 0.05, tone: 'food' },
  Combustível: { percent: 0.04, tone: 'transport' },
  Casa: { percent: 0.04, tone: 'house' },
  Farmácia: { percent: 0.02, tone: 'health' },
  Lazer: { percent: 0.06, tone: 'leisure' },
  Assinaturas: { percent: 0.015, tone: 'subscription' },
  Transporte: { percent: 0.04, tone: 'transport' },
  Pets: { percent: 0.025, tone: 'pets' },
  Saúde: { percent: 0.03, tone: 'health' },
  Compras: { percent: 0.03, tone: 'shopping' },
  Outros: { percent: 0.03, tone: 'other' }
}

function getWeekInfo(monthKey) {
  const now = new Date()
  const currentMonthKey = getMonthKeyFromDate(now)

  if (monthKey !== currentMonthKey) {
    return {
      daysLeftInWeek: 7,
      daysLeftInMonth: getDaysInMonthFromKey(monthKey)
    }
  }

  const dayOfWeek = now.getDay()
  const normalizedDay = dayOfWeek === 0 ? 7 : dayOfWeek
  const daysLeftInWeek = Math.max(1, 7 - normalizedDay + 1)

  const daysInMonth = getDaysInMonthFromKey(monthKey)
  const todayDay = getTodayDayOfMonth(monthKey)
  const daysLeftInMonth = Math.max(1, daysInMonth - todayDay + 1)

  return {
    daysLeftInWeek,
    daysLeftInMonth
  }
}

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

function getCategorySpent(entriesForMonth) {
  const totals = {}

  for (const category of CATEGORIES) {
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

function buildAllCategoryBudgets(salary) {
  const categoriesToPlan = []

  for (const category of CATEGORIES) {
    if (category === 'Investimento' || category === 'Meta') {
      continue
    }

    categoriesToPlan.push(category)
  }

  const plans = []

  for (const category of categoriesToPlan) {
    const rule = CATEGORY_PLAN_RULES[category]
    const percent = Number(rule?.percent || 0)

    plans.push({
      name: category,
      planned: salary > 0 ? Number((salary * percent).toFixed(2)) : 0,
      spent: 0,
      remaining: 0,
      percent: Number((percent * 100).toFixed(1)),
      tone: rule?.tone || 'other'
    })
  }

  return plans
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

  const weekInfo = getWeekInfo(monthKey)
  const weeklyBudget = availableAfterGoals > 0 ? Number((availableAfterGoals / 4).toFixed(2)) : 0
  const dailyLimit = availableAfterGoals > 0
    ? Number((availableAfterGoals / weekInfo.daysLeftInMonth).toFixed(2))
    : 0

  const categorySpent = getCategorySpent(entriesForMonth)
  const categoryPlans = buildAllCategoryBudgets(salary, availableAfterGoals)

  for (const plan of categoryPlans) {
    const spent = Number(categorySpent[plan.name] || 0)
    plan.spent = Number(spent.toFixed(2))
    plan.remaining = Math.max(0, Number((plan.planned - plan.spent).toFixed(2)))
  }

  let marketSpent = 0
  let foodSpent = 0
  let leisureSpent = 0
  let transportSpent = 0
  let otherSpent = 0

  for (const plan of categoryPlans) {
    if (plan.name === 'Mercado') {
      marketSpent = plan.spent
    } else if (plan.name === 'Alimentação') {
      foodSpent = plan.spent
    } else if (plan.name === 'Lazer') {
      leisureSpent = plan.spent
    } else if (plan.name === 'Transporte' || plan.name === 'Combustível') {
      transportSpent += plan.spent
    } else if (
      plan.name !== 'Mercado' &&
      plan.name !== 'Alimentação' &&
      plan.name !== 'Lazer'
    ) {
      otherSpent += plan.spent
    }
  }

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
    daysLeftInWeek: weekInfo.daysLeftInWeek,
    daysLeftInMonth: weekInfo.daysLeftInMonth,
    categoryPlans,
    marketBudget: Number((categoryPlans.find(item => item.name === 'Mercado')?.planned || 0).toFixed(2)),
    foodBudget: Number((categoryPlans.find(item => item.name === 'Alimentação')?.planned || 0).toFixed(2)),
    leisureBudget: Number((categoryPlans.find(item => item.name === 'Lazer')?.planned || 0).toFixed(2)),
    transportBudget: Number(
      (
        (categoryPlans.find(item => item.name === 'Transporte')?.planned || 0) +
        (categoryPlans.find(item => item.name === 'Combustível')?.planned || 0)
      ).toFixed(2)
    ),
    otherBudget: Number(
      categoryPlans
        .filter(item =>
          item.name !== 'Mercado' &&
          item.name !== 'Alimentação' &&
          item.name !== 'Lazer' &&
          item.name !== 'Transporte' &&
          item.name !== 'Combustível'
        )
        .reduce((total, item) => total + item.planned, 0)
        .toFixed(2)
    ),
    marketSpent: Number(marketSpent.toFixed(2)),
    foodSpent: Number(foodSpent.toFixed(2)),
    leisureSpent: Number(leisureSpent.toFixed(2)),
    transportSpent: Number(transportSpent.toFixed(2)),
    otherSpent: Number(otherSpent.toFixed(2)),
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
  const planned = []
  const actual = []

  for (const item of projection.categoryPlans || []) {
    if (item.planned > 0) {
      planned.push({
        name: item.name,
        value: Number(item.planned.toFixed(2))
      })
    }

    if (item.spent > 0) {
      actual.push({
        name: item.name,
        value: Number(item.spent.toFixed(2))
      })
    }
  }

  if (projection.fixedCosts > 0) {
    planned.push({
      name: 'Custos fixos',
      value: Number(projection.fixedCosts.toFixed(2))
    })

    actual.push({
      name: 'Custos fixos',
      value: Number(projection.fixedCosts.toFixed(2))
    })
  }

  if (projection.aggressiveInvestment > 0 || projection.investmentSuggested > 0) {
    planned.push({
      name: 'Investimento',
      value: Number((projection.aggressiveInvestment || projection.investmentSuggested || 0).toFixed(2))
    })
  }

  if (projection.investments > 0) {
    actual.push({
      name: 'Investimento',
      value: Number(projection.investments.toFixed(2))
    })
  }

  if (projection.monthlyGoalsNeed > 0) {
    planned.push({
      name: 'Metas',
      value: Number(projection.monthlyGoalsNeed.toFixed(2))
    })
  }

  if (projection.goalPayments > 0) {
    actual.push({
      name: 'Metas',
      value: Number(projection.goalPayments.toFixed(2))
    })
  }

  return {
    planned,
    actual
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