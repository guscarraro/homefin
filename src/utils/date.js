export function padMonth(value) {
  return String(value).padStart(2, '0')
}

export function getMonthKeyFromDate(dateValue) {
  const date = new Date(dateValue)
  const year = date.getFullYear()
  const month = padMonth(date.getMonth() + 1)
  return `${year}-${month}`
}

export function addMonthsToMonthKey(monthKey, amount) {
  const [yearString, monthString] = monthKey.split('-')
  const date = new Date(Number(yearString), Number(monthString) - 1 + amount, 1)
  return getMonthKeyFromDate(date)
}

export function getNextMonthKey(monthKey) {
  return addMonthsToMonthKey(monthKey, 1)
}

export function getDaysInMonthFromKey(monthKey) {
  const [yearString, monthString] = monthKey.split('-')
  return new Date(Number(yearString), Number(monthString), 0).getDate()
}

export function getTodayDayOfMonth(monthKey) {
  const currentMonth = getMonthKeyFromDate(new Date())

  if (currentMonth !== monthKey) {
    return 1
  }

  return new Date().getDate()
}