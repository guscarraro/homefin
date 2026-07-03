import { supabase } from '../../config/db.js'
import { parseSmartLaunch } from '../../utils/smartLaunch.js'

function addMonthsToMonthKey(monthKey, amount) {
  const [yearString, monthString] = monthKey.split('-')
  const date = new Date(Number(yearString), Number(monthString) - 1 + amount, 1)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  return `${year}-${month}`
}

function getMonthKeyFromDate(dateValue) {
  const date = new Date(dateValue)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  return `${year}-${month}`
}

function getAllowedPhones() {
  return String(process.env.WHATSAPP_ALLOWED_PHONES || '')
    .split(',')
    .map(item => item.replace(/\D/g, ''))
    .filter(Boolean)
}

function getContactMap() {
  if (!process.env.WHATSAPP_CONTACTS_JSON) {
    return {}
  }

  try {
    return JSON.parse(process.env.WHATSAPP_CONTACTS_JSON)
  } catch {
    return {}
  }
}

function getContactConfig(phone) {
  const contactMap = getContactMap()
  const directConfig = contactMap[phone]

  if (directConfig?.userId && directConfig?.householdId) {
    return directConfig
  }

  if (process.env.WHATSAPP_DEFAULT_USER_ID && process.env.WHATSAPP_DEFAULT_HOUSEHOLD_ID) {
    return {
      userId: process.env.WHATSAPP_DEFAULT_USER_ID,
      householdId: process.env.WHATSAPP_DEFAULT_HOUSEHOLD_ID
    }
  }

  return null
}

function normalizeWhatsAppPayload(body) {
  const value = body?.entry?.[0]?.changes?.[0]?.value
  const message = value?.messages?.[0]

  if (!message) {
    return null
  }

  return {
    phone: String(message.from || '').replace(/\D/g, ''),
    type: message.type,
    text: message.text?.body || '',
    audioId: message.audio?.id || null
  }
}

function buildEntryPayload(parsed, contactConfig) {
  const installmentCount = Number(parsed.installmentCount || 1)
  const amount = Number(parsed.amount || 0)
  const originMonth = getMonthKeyFromDate(parsed.date)
  const installmentStartMonth =
    parsed.isInstallment && parsed.paymentMethod === 'Crédito'
      ? addMonthsToMonthKey(originMonth, 1)
      : parsed.isInstallment
        ? originMonth
        : null

  return {
    user_id: contactConfig.userId,
    household_id: contactConfig.householdId,
    type: parsed.type || 'expense',
    category: parsed.category || 'Outros',
    amount,
    account: parsed.account || 'Nubank',
    payment_method: parsed.paymentMethod || 'Pix',
    is_installment: Boolean(parsed.isInstallment),
    installment_count: installmentCount,
    installment_amount: parsed.isInstallment
      ? Number((amount / installmentCount).toFixed(2))
      : amount,
    installment_start_month: installmentStartMonth,
    is_recurring: false,
    date: parsed.date,
    note: `WhatsApp: ${parsed.note || ''}${parsed.incomeOwner ? ` [incomeOwner:${parsed.incomeOwner}]` : ''}`.trim(),
    goal_id: null,
    skipped_months: []
  }
}

async function saveTextLaunch(message) {
  const allowedPhones = getAllowedPhones()

  if (allowedPhones.length && !allowedPhones.includes(message.phone)) {
    return { status: 'ignored', reason: 'phone_not_allowed' }
  }

  const contactConfig = getContactConfig(message.phone)

  if (!contactConfig) {
    return { status: 'ignored', reason: 'missing_contact_config' }
  }

  const parsed = parseSmartLaunch(message.text)

  if (!parsed.amount) {
    return { status: 'ignored', reason: 'missing_amount' }
  }

  const payload = buildEntryPayload(parsed, contactConfig)
  const { data, error } = await supabase
    .from('entries')
    .insert([payload])
    .select()

  if (error) {
    throw error
  }

  return { status: 'saved', entryId: data?.[0]?.id }
}

export function verifyWhatsAppWebhook(req, res) {
  const mode = req.query['hub.mode']
  const token = req.query['hub.verify_token']
  const challenge = req.query['hub.challenge']

  if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return res.status(200).send(challenge)
  }

  return res.sendStatus(403)
}

export async function receiveWhatsAppWebhook(req, res) {
  const message = normalizeWhatsAppPayload(req.body)

  if (!message) {
    return res.sendStatus(200)
  }

  try {
    if (message.type === 'text') {
      const result = await saveTextLaunch(message)
      return res.status(200).json(result)
    }

    if (message.type === 'audio') {
      return res.status(200).json({
        status: 'received',
        reason: 'audio_transcription_not_configured',
        audioId: message.audioId
      })
    }

    return res.status(200).json({ status: 'ignored', reason: 'unsupported_message_type' })
  } catch (error) {
    console.error('Erro no webhook do WhatsApp:', error)
    return res.status(500).json({ error: 'Erro ao processar webhook do WhatsApp' })
  }
}
