const API = import.meta.env.VITE_API_URL

function getHeaders() {
  const token = localStorage.getItem('token')

  const headers = {
    'Content-Type': 'application/json',
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  return headers
}

async function request(path, options = {}) {
  if (!API) {
    throw new Error('URL da API não configurada.')
  }

  const res = await fetch(`${API}${path}`, options)

  if (res.status === 401) {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  if (res.status === 204) {
    return null
  }

  const data = await res.json().catch(() => null)

  if (!res.ok) {
    throw new Error(data?.error || 'Não foi possível concluir a ação.')
  }

  return data
}

/* AUTH */
export async function login(email, password) {
  return request('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
}

/* ENTRIES */
export async function getEntries(month) {
  const url = month ? `/entries?month=${month}` : '/entries'
  return request(url, {
    headers: getHeaders()
  })
}

export async function createEntry(data) {
  return request('/entries', {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data)
  })
}

export async function updateEntry(id, data) {
  return request(`/entries/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data)
  })
}

export async function deleteEntry(id) {
  return request(`/entries/${id}`, {
    method: 'DELETE',
    headers: getHeaders()
  })
}

/* FIXED COSTS */
export async function getFixedCosts() {
  return request('/fixed-costs', {
    headers: getHeaders()
  })
}

export async function createFixedCost(data) {
  return request('/fixed-costs', {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data)
  })
}

export async function updateFixedCost(id, data) {
  return request(`/fixed-costs/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data)
  })
}

export async function deleteFixedCost(id) {
  return request(`/fixed-costs/${id}`, {
    method: 'DELETE',
    headers: getHeaders()
  })
}

/* GOALS */
export async function getGoals() {
  return request('/goals', {
    headers: getHeaders()
  })
}

export async function createGoal(data) {
  return request('/goals', {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data)
  })
}

export async function deleteGoal(id) {
  return request(`/goals/${id}`, {
    method: 'DELETE',
    headers: getHeaders()
  })
}

/* SALARIES */
export async function getSalaries() {
  return request('/salaries', {
    headers: getHeaders()
  })
}

export async function saveSalary(data) {
  return request('/salaries', {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data)
  })
}
