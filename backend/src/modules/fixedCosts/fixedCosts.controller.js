import { supabase } from '../../config/db.js'

function normalizeFixedCost(item) {
  return {
    id: item.id,
    userId: item.user_id,
    householdId: item.household_id,
    title: item.title,
    amount: Number(item.amount || 0),
    dueDay: Number(item.due_day || 1),
    active: Boolean(item.active),
    category: item.category || 'Casa',
    createdAt: item.created_at
  }
}

export async function getFixedCosts(req, res) {
  const { data, error } = await supabase
    .from('fixed_costs')
    .select('*')
    .eq('household_id', req.user.householdId)
    .order('due_day', { ascending: true })

  if (error) {
    return res.status(500).json({ error: 'Erro ao buscar custos fixos' })
  }

  const normalized = []
  for (const item of data || []) {
    normalized.push(normalizeFixedCost(item))
  }

  return res.json(normalized)
}

export async function createFixedCost(req, res) {
  const payload = {
    user_id: req.user.id,
    household_id: req.user.householdId,
    title: req.body.title,
    amount: Number(req.body.amount || 0),
    due_day: Number(req.body.dueDay || 1),
    active: req.body.active !== undefined ? Boolean(req.body.active) : true,
    category: req.body.category || 'Casa'
  }

  const { data, error } = await supabase
    .from('fixed_costs')
    .insert([payload])
    .select()

  if (error) {
    return res.status(500).json({ error: 'Erro ao criar custo fixo', details: error.message })
  }

  return res.json(normalizeFixedCost(data[0]))
}

export async function updateFixedCost(req, res) {
  const { id } = req.params

  const payload = {
    title: req.body.title,
    amount: req.body.amount !== undefined ? Number(req.body.amount) : undefined,
    due_day: req.body.dueDay !== undefined ? Number(req.body.dueDay) : undefined,
    active: req.body.active !== undefined ? Boolean(req.body.active) : undefined,
    category: req.body.category
  }

  const cleanPayload = {}

  for (const key in payload) {
    if (payload[key] !== undefined) {
      cleanPayload[key] = payload[key]
    }
  }

  const { data, error } = await supabase
    .from('fixed_costs')
    .update(cleanPayload)
    .eq('id', id)
    .eq('household_id', req.user.householdId)
    .select()

  if (error) {
    return res.status(500).json({ error: 'Erro ao atualizar custo fixo', details: error.message })
  }

  return res.json(normalizeFixedCost(data[0]))
}

export async function deleteFixedCost(req, res) {
  const { id } = req.params

  const { error } = await supabase
    .from('fixed_costs')
    .delete()
    .eq('id', id)
    .eq('household_id', req.user.householdId)

  if (error) {
    return res.status(500).json({ error: 'Erro ao excluir custo fixo' })
  }

  return res.sendStatus(204)
}