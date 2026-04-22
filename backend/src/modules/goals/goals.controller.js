import { supabase } from '../../config/db.js'

export async function getGoals(req, res) {
  const { data, error } = await supabase
    .from('goals')
    .select('*')
    .eq('user_id', req.user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Erro ao buscar metas:', error)
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
      createdAt: item.created_at
    })
  }

  return res.json(normalizedGoals)
}

export async function createGoal(req, res) {
  const payload = {
    user_id: req.user.id,
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
    console.error('Erro ao criar meta:', error)
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
    createdAt: item.created_at
  })
}

export async function deleteGoal(req, res) {
  const { id } = req.params

  const { error } = await supabase
    .from('goals')
    .delete()
    .eq('id', id)
    .eq('user_id', req.user.id)

  if (error) {
    console.error('Erro ao excluir meta:', error)
    return res.status(500).json({ error: 'Erro ao excluir meta' })
  }

  return res.sendStatus(204)
}