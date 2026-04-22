import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { supabase } from '../../config/db.js'

export async function login(req, res) {
  const { email, password } = req.body

  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single()

  if (error || !user) {
    return res.status(401).json({ error: 'Usuário inválido' })
  }

  const valid = await bcrypt.compare(password, user.password)

  if (!valid) {
    return res.status(401).json({ error: 'Senha inválida' })
  }

  if (!user.household_id) {
    return res.status(400).json({ error: 'Usuário sem household_id vinculado' })
  }

  const token = jwt.sign(
    {
      id: user.id,
      householdId: user.household_id,
      name: user.name,
      email: user.email
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES }
  )

  return res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      householdId: user.household_id
    }
  })
}