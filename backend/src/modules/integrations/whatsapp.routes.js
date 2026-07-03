import { Router } from 'express'
import {
  verifyWhatsAppWebhook,
  receiveWhatsAppWebhook
} from './whatsapp.controller.js'

const router = Router()

router.get('/webhook', verifyWhatsAppWebhook)
router.post('/webhook', receiveWhatsAppWebhook)

export default router
