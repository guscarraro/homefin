import { supabase } from '../../config/db.js'

function normalizeEntry(item) {
  return {
    id: item.id,
    userId: item.user_id,
    type: item.type,
    category: item.category,
    amount: Number(item.amount || 0),
    account: item.account,
    paymentMethod: item.payment_method,
    isInstallment: Boolean(item.is_installment),
    installmentCount: Number(item.installment_count || 1),
    installmentAmount: Number(item.installment_amount || 0),
    installmentStartMonth: item.installment_start_month,
    isRecurring: Boolean(item.is_recurring),
    date: item.date,
    note: item.note || '',
    goalId: item.goal_id || null,
    createdAt: item.created_at
  }
}

export async function getEntries(req, res) {
  const { month } = req.query
  const userId = req.user.id

  let query = supabase
    .from('entries')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false })

  if (month) {
    query = query
      .gte('date', `${month}-01`)
      .lte('date', `${month}-31`)
  }

  const { data, error } = await query

  if (error) {
    console.error('Erro ao buscar lançamentos:', error)
    return res.status(500).json({ error: 'Erro ao buscar lançamentos' })
  }

  const normalized = []

  for (const item of data || []) {
    normalized.push(normalizeEntry(item))
  }

  return res.json(normalized)
}

export async function createEntry(req, res) {
  const userId = req.user.id

  const payload = {
    user_id: userId,
    type: req.body.type || 'expense',
    category: req.body.category,
    amount: Number(req.body.amount || 0),
    account: req.body.account,
    payment_method: req.body.paymentMethod,
    is_installment: Boolean(req.body.isInstallment),
    installment_count: Number(req.body.installmentCount || 1),
    installment_amount: Number(req.body.installmentAmount || req.body.amount || 0),
    installment_start_month: req.body.installmentStartMonth || null,
    is_recurring: Boolean(req.body.isRecurring),
    date: req.body.date,
    note: req.body.note || '',
    goal_id: req.body.goalId || null
  }

  const { data, error } = await supabase
    .from('entries')
    .insert([payload])
    .select()

  if (error) {
    console.error('Erro ao criar lançamento:', error)
    return res.status(500).json({ error: 'Erro ao criar lançamento', details: error.message })
  }

  return res.json(normalizeEntry(data[0]))
}

export async function updateEntry(req, res) {
  const { id } = req.params

  const payload = {
    type: req.body.type,
    category: req.body.category,
    amount: req.body.amount !== undefined ? Number(req.body.amount) : undefined,
    account: req.body.account,
    payment_method: req.body.paymentMethod,
    is_installment: req.body.isInstallment,
    installment_count: req.body.installmentCount !== undefined ? Number(req.body.installmentCount) : undefined,
    installment_amount: req.body.installmentAmount !== undefined ? Number(req.body.installmentAmount) : undefined,
    installment_start_month: req.body.installmentStartMonth,
    is_recurring: req.body.isRecurring,
    date: req.body.date,
    note: req.body.note,
    goal_id: req.body.goalId === undefined ? undefined : req.body.goalId
  }

  const cleanPayload = {}

  for (const key in payload) {
    if (payload[key] !== undefined) {
      cleanPayload[key] = payload[key]
    }
  }

  const { data, error } = await supabase
    .from('entries')
    .update(cleanPayload)
    .eq('id', id)
    .eq('user_id', req.user.id)
    .select()

  if (error) {
    console.error('Erro ao atualizar lançamento:', error)
    return res.status(500).json({ error: 'Erro ao atualizar lançamento' })
  }

  return res.json(normalizeEntry(data[0]))
}

export async function deleteEntry(req, res) {
  const { id } = req.params

  const { error } = await supabase
    .from('entries')
    .delete()
    .eq('id', id)
    .eq('user_id', req.user.id)

  if (error) {
    console.error('Erro ao excluir lançamento:', error)
    return res.status(500).json({ error: 'Erro ao excluir lançamento' })
  }

  return res.sendStatus(204)
}