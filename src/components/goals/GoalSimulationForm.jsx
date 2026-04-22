import { useState } from 'react'
import styled from 'styled-components'
import Card from '../common/Card'
import Input from '../common/Input'
import StyledSelect from '../common/StyledSelect'
import Button from '../common/Button'
import { useFinance } from '../../context/FinanceContext'

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

function getSelectValue(value) {
  if (value?.target) return value.target.value
  if (value?.value) return value.value
  return value || ''
}

function GoalSimulationForm() {
  const { addGoal } = useFinance()

  const [title, setTitle] = useState('')
  const [targetAmount, setTargetAmount] = useState('')
  const [targetMonths, setTargetMonths] = useState('')
  const [priority, setPriority] = useState('media')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()

    const parsedTargetAmount = Number(String(targetAmount || 0).replace(',', '.'))
    const parsedTargetMonths = Number(targetMonths || 0)

    if (!title.trim()) {
      alert('Informe o nome da meta')
      return
    }

    if (!parsedTargetAmount || parsedTargetAmount <= 0) {
      alert('Informe um valor alvo válido')
      return
    }

    if (!parsedTargetMonths || parsedTargetMonths <= 0) {
      alert('Informe um prazo válido em meses')
      return
    }

    try {
      setLoading(true)

      await addGoal({
        title: title.trim(),
        targetAmount: parsedTargetAmount,
        targetMonths: parsedTargetMonths,
        priority
      })

      setTitle('')
      setTargetAmount('')
      setTargetMonths('')
      setPriority('media')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <h3>Nova meta</h3>

      <Form onSubmit={handleSubmit}>
        <Input
          placeholder="Ex: Viagem, carro, apartamento"
          value={title}
          onChange={event => setTitle(event.target.value)}
        />

        <Input
          placeholder="Valor alvo"
          inputMode="decimal"
          value={targetAmount}
          onChange={event => setTargetAmount(event.target.value)}
        />

        <Input
          placeholder="Prazo em meses"
          inputMode="numeric"
          value={targetMonths}
          onChange={event => setTargetMonths(event.target.value)}
        />

        <StyledSelect
          options={['alta', 'media', 'baixa']}
          value={priority}
          onChange={value => setPriority(getSelectValue(value))}
          placeholder="Prioridade"
        />

        <Button type="submit" disabled={loading}>
          {loading ? 'Salvando...' : 'Adicionar meta'}
        </Button>
      </Form>
    </Card>
  )
}

export default GoalSimulationForm