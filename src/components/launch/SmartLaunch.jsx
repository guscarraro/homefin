import { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { FiMic, FiSend, FiX } from 'react-icons/fi'
import Button from '../common/Button'
import Input from '../common/Input'
import { useFinance } from '../../context/FinanceContext'
import { formatCurrency } from '../../utils/currency'
import { getSmartLaunchExamples, parseSmartLaunch } from '../../utils/smartLaunch'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const Row = styled.form`
  display: grid;
  grid-template-columns: 1fr 52px 52px;
  gap: 8px;
`

const IconButton = styled.button`
  width: 52px;
  height: 52px;
  border: 0;
  border-radius: 8px;
  background: ${({ active, theme }) => (active ? theme.colors.primary : theme.colors.surfaceAlt)};
  color: ${({ active, theme }) => (active ? '#fff' : theme.colors.text)};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.55;
  }
`

const Hint = styled.div`
  color: ${({ theme }) => theme.colors.textSoft};
  font-size: 13px;
  line-height: 1.45;
`

const Chips = styled.div`
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 2px;
`

const Chip = styled.button`
  flex: 0 0 auto;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.surfaceAlt};
  color: ${({ theme }) => theme.colors.text};
  padding: 8px 10px;
  font-size: 12px;
`

const Preview = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  padding: 12px;
  background: ${({ theme }) => theme.colors.surfaceAlt};
`

const PreviewTop = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
`

const Amount = styled.strong`
  color: ${({ tone }) => {
    if (tone === 'income') return '#16a34a'
    if (tone === 'investment') return '#7c3aed'
    return '#dc2626'
  }};
  white-space: nowrap;
`

const Meta = styled.div`
  color: ${({ theme }) => theme.colors.textSoft};
  font-size: 13px;
  line-height: 1.45;
`

const Feedback = styled.div`
  padding: 12px;
  border-radius: 8px;
  background: rgba(239, 68, 68, 0.10);
  color: ${({ theme }) => theme.colors.danger};
  font-size: 14px;
`

const Actions = styled.div`
  display: grid;
  grid-template-columns: 1fr 52px;
  gap: 8px;
`

function getSpeechRecognition() {
  return window.SpeechRecognition || window.webkitSpeechRecognition
}

function getTypeLabel(type) {
  if (type === 'income') return 'Receita'
  if (type === 'investment') return 'Investimento'
  return 'Despesa'
}

function getOwnerLabel(owner) {
  if (owner === 'gustavo') return 'Gustavo'
  if (owner === 'marccella') return 'Marccella'
  return ''
}

function getInitialLaunchText() {
  const params = new URLSearchParams(window.location.search)
  return params.get('text') || params.get('launch') || ''
}

function getSpeechSynthesis() {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    return null
  }

  return window.speechSynthesis
}

function speakFeedback(message) {
  const synthesis = getSpeechSynthesis()

  if (!synthesis || !window.SpeechSynthesisUtterance) {
    return
  }

  const utterance = new window.SpeechSynthesisUtterance(message)
  const voices = synthesis.getVoices()
  const portugueseVoice = voices.find(voice => voice.lang?.toLowerCase().startsWith('pt-br'))
    || voices.find(voice => voice.lang?.toLowerCase().startsWith('pt'))

  utterance.lang = 'pt-BR'
  utterance.rate = 0.96
  utterance.pitch = 1

  if (portugueseVoice) {
    utterance.voice = portugueseVoice
  }

  synthesis.cancel()
  synthesis.speak(utterance)
}

function buildFailureMessage(reason, heardText = '') {
  const cleanText = heardText.trim()

  if (!cleanText) {
    return reason
  }

  return `Não consegui lançar. Eu entendi: "${cleanText}". ${reason}`
}

function SmartLaunch() {
  const { addEntry } = useFinance()
  const initialLaunchText = useMemo(() => getInitialLaunchText(), [])
  const initialDraft = useMemo(() => {
    if (!initialLaunchText) {
      return null
    }

    const parsed = parseSmartLaunch(initialLaunchText)
    return parsed.amount ? parsed : null
  }, [initialLaunchText])

  const [text, setText] = useState(initialLaunchText)
  const [draft, setDraft] = useState(initialDraft)
  const [listening, setListening] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(
    initialLaunchText && !initialDraft
      ? buildFailureMessage(
        'Não encontrei o valor. Pode repetir dizendo algo como "mercado 83 no crédito".',
        initialLaunchText
      )
      : ''
  )

  const examples = useMemo(() => getSmartLaunchExamples(), [])
  const speechSupported = typeof window !== 'undefined' && Boolean(getSpeechRecognition())

  const fail = useCallback((reason, heardText = '', shouldSpeak = false) => {
    const message = buildFailureMessage(reason, heardText)

    setError(message)

    if (shouldSpeak) {
      speakFeedback(message)
    }
  }, [])

  const buildDraft = useCallback((value, options = {}) => {
    const parsed = parseSmartLaunch(value)

    if (!parsed.amount) {
      fail(
        'Não encontrei o valor. Pode repetir dizendo algo como "mercado 83 no crédito".',
        value,
        options.speak
      )
      setDraft(null)
      return
    }

    setError('')
    setDraft(parsed)
  }, [fail])

  useEffect(() => {
    if (!initialLaunchText) {
      return
    }

    window.history.replaceState({}, '', window.location.pathname)
  }, [initialLaunchText])

  useEffect(() => {
    if (!initialLaunchText || initialDraft) {
      return
    }

    speakFeedback(buildFailureMessage(
      'Não encontrei o valor. Pode repetir dizendo algo como "mercado 83 no crédito".',
      initialLaunchText
    ))
  }, [initialDraft, initialLaunchText])

  function handleSubmit(event) {
    event.preventDefault()

    if (!text.trim()) {
      fail('Digite ou fale o lançamento para eu conseguir salvar.', '', true)
      return
    }

    buildDraft(text, { speak: true })
  }

  function handleListen() {
    if (!speechSupported || listening) {
      return
    }

    const Recognition = getSpeechRecognition()
    const recognition = new Recognition()
    recognition.lang = 'pt-BR'
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    recognition.onstart = () => {
      setListening(true)
      setError('')
    }

    recognition.onerror = () => {
      setListening(false)
      fail('Não consegui ouvir agora. Pode repetir ou digitar a frase no campo.', '', true)
    }

    recognition.onend = () => {
      setListening(false)
    }

    recognition.onresult = event => {
      const transcript = event.results?.[0]?.[0]?.transcript || ''
      setText(transcript)
      buildDraft(transcript, { speak: true })
    }

    recognition.start()
  }

  async function handleConfirm() {
    if (!draft) {
      return
    }

    try {
      setLoading(true)
      setError('')

      await addEntry({
        amount: draft.amount,
        type: draft.type,
        category: draft.category,
        account: draft.account,
        paymentMethod: draft.paymentMethod,
        note: draft.incomeOwner
          ? `${draft.note} [incomeOwner:${draft.incomeOwner}]`
          : draft.note,
        date: draft.date,
        isInstallment: draft.isInstallment,
        installmentCount: draft.installmentCount
      })

      setText('')
      setDraft(null)
    } catch (err) {
      fail(
        err.message || 'Não foi possível salvar esse lançamento.',
        draft.note,
        true
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <Wrapper>
      <Row onSubmit={handleSubmit}>
        <Input
          value={text}
          onChange={event => setText(event.target.value)}
          placeholder="Fale ou digite: mercado 83 no crédito"
        />

        <IconButton type="button" active={listening ? 1 : 0} onClick={handleListen} disabled={!speechSupported}>
          <FiMic size={20} />
        </IconButton>

        <IconButton type="submit">
          <FiSend size={20} />
        </IconButton>
      </Row>

      <Chips>
        {examples.map(example => (
          <Chip key={example} type="button" onClick={() => setText(example)}>
            {example}
          </Chip>
        ))}
      </Chips>

      {!speechSupported ? (
        <Hint>Microfone indisponível neste navegador. Digitar continua funcionando.</Hint>
      ) : (
        <Hint>Toque no microfone, fale o lançamento e confirme antes de salvar.</Hint>
      )}

      {draft ? (
        <Preview>
          <PreviewTop>
            <div>
              <strong>{draft.category}</strong>
              <Meta>
                {getTypeLabel(draft.type)} • {draft.account} • {draft.paymentMethod} • {draft.date}
                {draft.incomeOwner ? ` • ${getOwnerLabel(draft.incomeOwner)}` : ''}
                {draft.isInstallment ? ` • ${draft.installmentCount} parcelas` : ''}
              </Meta>
            </div>

            <Amount tone={draft.type}>
              {draft.type === 'income' ? '+' : '-'} {formatCurrency(draft.amount)}
            </Amount>
          </PreviewTop>

          <Actions>
            <Button type="button" onClick={handleConfirm} disabled={loading}>
              {loading ? 'Salvando...' : 'Confirmar lançamento'}
            </Button>

            <IconButton type="button" onClick={() => setDraft(null)}>
              <FiX size={20} />
            </IconButton>
          </Actions>
        </Preview>
      ) : null}

      {error ? <Feedback role="alert" aria-live="assertive">{error}</Feedback> : null}
    </Wrapper>
  )
}

export default SmartLaunch
