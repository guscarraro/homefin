import { supabase } from '../../config/db.js'

export async function getSalaries(req, res) {
  const { data, error } = await supabase
    .from('salaries')
    .select('*')
    .eq('user_id', req.user.id)
    .order('month', { ascending: false })

  if (error) {
    return res.status(500).json({ error: 'Erro ao buscar salários' })
  }

  res.json(data || [])
}

export async function saveSalary(req, res) {
  const { month, gustavo, marccella, amount } = req.body

  const payload = {
    user_id: req.user.id,
    month,
    gustavo: Number(gustavo || 0),
    marccella: Number(marccella || 0),
    amount: Number(amount || 0)
  }

  const { data, error } = await supabase
    .from('salaries')
    .upsert(payload, { onConflict: 'user_id,month' })
    .select()

  if (error) {
    return res.status(500).json({ error: 'Erro ao salvar salário' })
  }

  res.json(data[0])
}