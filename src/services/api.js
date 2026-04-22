const API = import.meta.env.VITE_API_URL

function getHeaders() {
  const token = localStorage.getItem('token')

  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  }
}

/* AUTH */
export async function login(email, password) {
  const res = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })

  return res.json()
}

/* ENTRIES */
export async function getEntries(month) {
  const url = month ? `${API}/entries?month=${month}` : `${API}/entries`

  const res = await fetch(url, {
    headers: getHeaders()
  })

  return res.json()
}

export async function createEntry(data) {
  const res = await fetch(`${API}/entries`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data)
  })

  return res.json()
}

export async function updateEntry(id, data) {
  const res = await fetch(`${API}/entries/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data)
  })

  return res.json()
}

export async function deleteEntry(id) {
  await fetch(`${API}/entries/${id}`, {
    method: 'DELETE',
    headers: getHeaders()
  })
}

/* FIXED COSTS */
export async function getFixedCosts() {
  const res = await fetch(`${API}/fixed-costs`, {
    headers: getHeaders()
  })

  return res.json()
}

export async function createFixedCost(data) {
  const res = await fetch(`${API}/fixed-costs`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data)
  })

  return res.json()
}

export async function updateFixedCost(id, data) {
  const res = await fetch(`${API}/fixed-costs/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data)
  })

  return res.json()
}

export async function deleteFixedCost(id) {
  await fetch(`${API}/fixed-costs/${id}`, {
    method: 'DELETE',
    headers: getHeaders()
  })
}

/* GOALS */
export async function getGoals() {
  const res = await fetch(`${API}/goals`, {
    headers: getHeaders()
  })

  return res.json()
}

export async function createGoal(data) {
  const res = await fetch(`${API}/goals`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data)
  })

  return res.json()
}

export async function deleteGoal(id) {
  await fetch(`${API}/goals/${id}`, {
    method: 'DELETE',
    headers: getHeaders()
  })
}

/* SALARIES */
export async function getSalaries() {
  const res = await fetch(`${API}/salaries`, {
    headers: getHeaders()
  })

  return res.json()
}

export async function saveSalary(data) {
  const res = await fetch(`${API}/salaries`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data)
  })

  return res.json()
}