import { supabase } from '../../config/db.js'

export async function getFixedCosts(req, res) {
  const { data } = await supabase
    .from('fixed_costs')
    .select('*')
    .eq('user_id', req.user.id)

  res.json(data)
}

export async function createFixedCost(req, res) {
  const { data } = await supabase
    .from('fixed_costs')
    .insert([{ ...req.body, user_id: req.user.id }])
    .select()

  res.json(data[0])
}

export async function updateFixedCost(req, res) {
  const { id } = req.params

  const { data } = await supabase
    .from('fixed_costs')
    .update(req.body)
    .eq('id', id)
    .select()

  res.json(data[0])
}

export async function deleteFixedCost(req, res) {
  const { id } = req.params

  await supabase.from('fixed_costs').delete().eq('id', id)

  res.sendStatus(204)
}