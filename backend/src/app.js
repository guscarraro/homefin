import express from 'express'
import cors from 'cors'

import authRoutes from './modules/auth/auth.routes.js'
import entriesRoutes from './modules/entries/entries.routes.js'
import fixedCostsRoutes from './modules/fixedCosts/fixedCosts.routes.js'
import goalsRoutes from './modules/goals/goals.routes.js'
import salariesRoutes from './modules/salaries/salaries.routes.js'

const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.json({ message: 'API rodando 🚀' })
})

app.use('/auth', authRoutes)
app.use('/entries', entriesRoutes)
app.use('/fixed-costs', fixedCostsRoutes)
app.use('/goals', goalsRoutes)
app.use('/salaries', salariesRoutes)

export default app