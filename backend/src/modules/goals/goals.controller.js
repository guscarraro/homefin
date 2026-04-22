import { supabase } from '../../config/db.js'

export async function getGoals(req, res) {
  const { data, error } = await supabase
    .from('goals')
    .select('*')
    .eq('household_id', req.user.householdId)
    .order('created_at', { ascending: false })

  if (error) {
    return res.status(500).json({ error: 'Erro ao buscar metas' })
  }

  const normalizedGoals = []

  for (const item of data || []) {
    normalizedGoals.push({
      id: item.id,
      title: item.title,
      targetAmount: Number(item.target_amount || 0),
      targetMonths: Number(item.target_months || 0),
      priority: item.priority,
      userId: item.user_id,
      householdId: item.household_id,
      createdAt: item.created_at
    })
  }

  return res.json(normalizedGoals)
}

export async function createGoal(req, res) {
  const payload = {
    user_id: req.user.id,
    household_id: req.user.householdId,
    title: req.body.title,
    target_amount: Number(req.body.targetAmount || 0),
    target_months: Number(req.body.targetMonths || 0),
    priority: req.body.priority || 'media'
  }

  const { data, error } = await supabase
    .from('goals')
    .insert([payload])
    .select()

  if (error) {
    return res.status(500).json({ error: 'Erro ao criar meta', details: error.message })
  }

  const item = data[0]

  return res.json({
    id: item.id,
    title: item.title,
    targetAmount: Number(item.target_amount || 0),
    targetMonths: Number(item.target_months || 0),
    priority: item.priority,
    userId: item.user_id,
    householdId: item.household_id,
    createdAt: item.created_at
  })
}

export async function deleteGoal(req, res) {
  const { id } = req.params

  const { error } = await supabase
    .from('goals')
    .delete()
    .eq('id', id)
    .eq('household_id', req.user.householdId)

  if (error) {
    return res.status(500).json({ error: 'Erro ao excluir meta' })
  }

  return res.sendStatus(204)
}