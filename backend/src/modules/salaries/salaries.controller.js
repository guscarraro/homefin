import { supabase } from '../../config/db.js'

export async function getSalaries(req, res) {
  const { data } = await supabase
    .from('salaries')
    .select('*')
    .eq('user_id', req.user.id)

  res.json(data)
}

export async function saveSalary(req, res) {
  const { month, amount } = req.body

  const { data } = await supabase
    .from('salaries')
    .upsert({
      user_id: req.user.id,
      month,
      amount
    })
    .select()

  res.json(data[0])
}