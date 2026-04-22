import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { supabase } from '../../config/db.js'

export async function login(req, res) {
  const { email, password } = req.body

  const { data: user } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single()

  if (!user) return res.status(401).json({ error: 'Usuário inválido' })

  const valid = await bcrypt.compare(password, user.password)

  if (!valid) return res.status(401).json({ error: 'Senha inválida' })

  const token = jwt.sign(
    { id: user.id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES }
  )

  res.json({ token, user })
}