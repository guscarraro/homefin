import { ACCOUNTS, CATEGORIES, PAYMENT_METHODS } from '../services/mockData'

const CATEGORY_KEYWORDS = [
  { category: 'Mercado', terms: ['mercado', 'supermercado', 'compras do mes', 'compras do mês', 'hortifruti', 'atacadao', 'atacadão'] },
  { category: 'Alimentação', terms: ['restaurante', 'almoco', 'almoço', 'jantar', 'lanche', 'ifood', 'comida', 'padaria', 'cafe', 'café'] },
  { category: 'Combustível', terms: ['combustivel', 'combustível', 'gasolina', 'etanol', 'posto', 'abasteci', 'abastecimento'] },
  { category: 'Transporte', terms: ['uber', '99', 'taxi', 'táxi', 'metro', 'metrô', 'onibus', 'ônibus', 'estacionamento', 'pedagio', 'pedágio'] },
  { category: 'Casa', terms: ['aluguel', 'condominio', 'condomínio', 'luz', 'agua', 'água', 'internet', 'casa', 'limpeza'] },
  { category: 'Farmácia', terms: ['farmacia', 'farmácia', 'remedio', 'remédio', 'drogaria'] },
  { category: 'Saúde', terms: ['medico', 'médico', 'consulta', 'exame', 'dentista', 'terapia', 'saude', 'saúde'] },
  { category: 'Lazer', terms: ['cinema', 'show', 'bar', 'viagem', 'lazer', 'passeio'] },
  { category: 'Assinaturas', terms: ['netflix', 'spotify', 'assinatura', 'icloud', 'youtube', 'amazon prime'] },
  { category: 'Compras', terms: ['roupa', 'sapato', 'presente', 'shopping', 'amazon', 'mercado livre', 'magalu'] },
  { category: 'Investimento', terms: ['investi', 'investimento', 'aporte', 'tesouro', 'cdb', 'fundo'] },
  { category: 'Meta', terms: ['meta', 'objetivo', 'reserva'] }
]

function normalizeText(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

function parseAmount(text) {
  const match = text.match(/(?:r\$\s*)?(\d{1,3}(?:\.\d{3})*|\d+)(?:[,.](\d{1,2}))?/)

  if (!match) {
    return 0
  }

  const integer = match[1].replace(/\./g, '')
  const cents = match[2] ? match[2].padEnd(2, '0') : '00'
  return Number(`${integer}.${cents}`)
}

function findByKeyword(text, options) {
  const normalizedText = normalizeText(text)

  for (const option of options) {
    if (normalizedText.includes(normalizeText(option))) {
      return option
    }
  }

  return ''
}

function inferCategory(text, type) {
  if (type === 'income') {
    return 'Receita'
  }

  const normalizedText = normalizeText(text)

  for (const item of CATEGORY_KEYWORDS) {
    for (const term of item.terms) {
      if (normalizedText.includes(normalizeText(term))) {
        return item.category
      }
    }
  }

  return 'Outros'
}

function inferPaymentMethod(text) {
  const normalizedText = normalizeText(text)

  if (normalizedText.includes('credito') || normalizedText.includes('cartao')) {
    return 'Crédito'
  }

  if (normalizedText.includes('debito')) {
    return 'Débito'
  }

  if (normalizedText.includes('pix')) {
    return 'Pix'
  }

  if (normalizedText.includes('dinheiro')) {
    return 'Dinheiro'
  }

  return findByKeyword(text, PAYMENT_METHODS) || 'Pix'
}

function inferType(text, category) {
  const normalizedText = normalizeText(text)

  if (
    normalizedText.includes('recebi') ||
    normalizedText.includes('recebemos') ||
    normalizedText.includes('entrou') ||
    normalizedText.includes('cliente pagou') ||
    normalizedText.includes('pagamento recebido') ||
    normalizedText.includes('consulta') ||
    normalizedText.includes('paciente') ||
    normalizedText.includes('atendimento')
  ) {
    return 'income'
  }

  if (category === 'Investimento') {
    return 'investment'
  }

  return 'expense'
}

function inferIncomeOwner(text) {
  const normalizedText = normalizeText(text)

  if (
    normalizedText.includes('marccella') ||
    normalizedText.includes('marcela') ||
    normalizedText.includes('dela') ||
    normalizedText.includes('minha esposa') ||
    normalizedText.includes('consulta') ||
    normalizedText.includes('paciente') ||
    normalizedText.includes('atendimento')
  ) {
    return 'marccella'
  }

  if (
    normalizedText.includes('gustavo') ||
    normalizedText.includes('meu') ||
    normalizedText.includes('eu recebi') ||
    normalizedText.includes('recebi ')
  ) {
    return 'gustavo'
  }

  return ''
}

function parseInstallments(text, paymentMethod, type) {
  if (type !== 'expense') {
    return { isInstallment: false, installmentCount: 1 }
  }

  const normalizedText = normalizeText(text)
  const match = normalizedText.match(/(?:em|parcelado em|parcelei em)\s*(\d{1,2})\s*(?:x|vezes|parcelas)?|\b(\d{1,2})\s*x\b/)
  const count = match ? Number(match[1] || match[2]) : 1

  return {
    isInstallment: paymentMethod === 'Crédito' && count > 1,
    installmentCount: count > 1 ? count : 1
  }
}

function parseDate(text) {
  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = String(now.getMonth() + 1).padStart(2, '0')
  const normalizedText = normalizeText(text)

  if (normalizedText.includes('amanha')) {
    const date = new Date(now)
    date.setDate(date.getDate() + 1)
    return date.toISOString().slice(0, 10)
  }

  if (normalizedText.includes('ontem')) {
    const date = new Date(now)
    date.setDate(date.getDate() - 1)
    return date.toISOString().slice(0, 10)
  }

  const fullDate = normalizedText.match(/\b(\d{1,2})[/-](\d{1,2})(?:[/-](\d{2,4}))?\b/)

  if (fullDate) {
    const day = fullDate[1].padStart(2, '0')
    const month = fullDate[2].padStart(2, '0')
    const year = fullDate[3]
      ? fullDate[3].length === 2
        ? `20${fullDate[3]}`
        : fullDate[3]
      : currentYear

    return `${year}-${month}-${day}`
  }

  const dayOnly = normalizedText.match(/\bdia\s*(\d{1,2})\b/)

  if (dayOnly) {
    return `${currentYear}-${currentMonth}-${dayOnly[1].padStart(2, '0')}`
  }

  return now.toISOString().slice(0, 10)
}

export function parseSmartLaunch(text) {
  const amount = parseAmount(text)
  const preliminaryCategory = inferCategory(text, 'expense')
  const type = inferType(text, preliminaryCategory)
  const category = inferCategory(text, type)
  const paymentMethod = type === 'income' ? 'Pix' : inferPaymentMethod(text)
  const account = findByKeyword(text, ACCOUNTS) || ACCOUNTS[0]
  const installments = parseInstallments(text, paymentMethod, type)
  const incomeOwner = type === 'income' ? inferIncomeOwner(text) : ''

  return {
    amount,
    category,
    type,
    account,
    paymentMethod,
    date: parseDate(text),
    note: text.trim(),
    isInstallment: installments.isInstallment,
    installmentCount: installments.installmentCount,
    incomeOwner,
    confidence: amount > 0 ? 'good' : 'needs_amount'
  }
}

export function getSmartLaunchExamples() {
  return [
    'mercado 83 no crédito nubank',
    'geladeira 2400 em 10x no crédito',
    'comprei sofá 1800 parcelado em 10 vezes',
    'Marcella consulta 250 recebida hoje',
    'Gustavo recebeu 1200 do cliente Carlos dia 20',
    'recebi 1200 do cliente Carlos dia 20',
    'investi 500 no tesouro hoje'
  ]
}
