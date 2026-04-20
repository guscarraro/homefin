export function getCurrentMonthKey() {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  return `${year}-${month}`
}

export function getMonthKeyFromDate(dateString) {
  if (!dateString) {
    return getCurrentMonthKey()
  }

  return String(dateString).slice(0, 7)
}

export function addMonthsToMonthKey(monthKey, monthsToAdd) {
  const [yearString, monthString] = monthKey.split('-')
  const year = Number(yearString)
  const month = Number(monthString) - 1

  const date = new Date(year, month + monthsToAdd, 1)

  const nextYear = date.getFullYear()
  const nextMonth = String(date.getMonth() + 1).padStart(2, '0')

  return `${nextYear}-${nextMonth}`
}

export function getRemainingDaysInMonth() {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  const lastDay = new Date(year, month + 1, 0).getDate()

  return Math.max(lastDay - now.getDate(), 1)
}

export function getRemainingWeeksInMonth() {
  const remainingDays = getRemainingDaysInMonth()
  return Math.max(Math.ceil(remainingDays / 7), 1)
}