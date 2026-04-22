import { supabase } from '../../config/db.js'

export async function getGoals(req, res) {
  const { data } = await supabase
    .from('goals')
    .select('*')
    .eq('user_id', req.user.id)

  res.json(data)
}

export async function createGoal(req, res) {
  const { data } = await supabase
    .from('goals')
    .insert([{ ...req.body, user_id: req.user.id }])
    .select()

  res.json(data[0])
}

export async function deleteGoal(req, res) {
  const { id } = req.params

  await supabase.from('goals').delete().eq('id', id)

  res.sendStatus(204)
}