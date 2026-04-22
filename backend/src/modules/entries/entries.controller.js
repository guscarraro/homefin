import { supabase } from '../../config/db.js'

export async function getEntries(req, res) {
  const { month } = req.query
  const userId = req.user.id

  let query = supabase
    .from('entries')
    .select('*')
    .eq('user_id', userId)

  if (month) {
    query = query.gte('date', `${month}-01`).lte('date', `${month}-31`)
  }

  const { data } = await query

  res.json(data)
}

export async function createEntry(req, res) {
  const userId = req.user.id

  const { data } = await supabase
    .from('entries')
    .insert([{ ...req.body, user_id: userId }])
    .select()

  res.json(data[0])
}

export async function updateEntry(req, res) {
  const { id } = req.params

  const { data } = await supabase
    .from('entries')
    .update(req.body)
    .eq('id', id)
    .select()

  res.json(data[0])
}

export async function deleteEntry(req, res) {
  const { id } = req.params

  await supabase.from('entries').delete().eq('id', id)

  res.sendStatus(204)
}