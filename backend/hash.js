// hash.js
import bcrypt from 'bcryptjs'

const password = '123456' // escolha sua senha

const hash = await bcrypt.hash(password, 10)

console.log(hash)