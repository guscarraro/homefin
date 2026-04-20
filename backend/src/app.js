import express from 'express'
import cors from 'cors'

const app = express()

app.use(cors())
app.use(express.json())

app.get('/health', (request, response) => {
  response.json({ ok: true, service: 'homefin-backend' })
})

export default app