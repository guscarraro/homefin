import { useState } from 'react'
import styled from 'styled-components'
import Input from '../common/Input'
import StyledSelect from '../common/StyledSelect'
import Button from '../common/Button'
import { EXPENSE_CATEGORIES } from '../../services/mockData'
import { useFinance } from '../../context/FinanceContext'

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const Title = styled.h3`
  font-size: 18px;
`

const Feedback = styled.div`
  padding: 12px 14px;
  border-radius: 14px;
  background: rgba(239, 68, 68, 0.10);
  color: ${({ theme }) => theme.colors.danger};
  font-size: 14px;
  line-height: 1.45;
`

function getSelectValue(value) {
  if (value?.target) return value.target.value
  if (value?.value) return value.value
  return value || ''
}

function FixedCostForm() {
  const { addFixedCost } = useFinance()

  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [dueDay, setDueDay] = useState('')
  const [category, setCategory] = useState('Casa')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()

    const parsedAmount = Number(String(amount).replace(',', '.'))
    const parsedDueDay = Number(dueDay)
    setError('')

    if (!title.trim()) {
      setError('Informe o nome do custo fixo.')
      return
    }

    if (!parsedAmount) {
      setError('Informe um valor válido.')
      return
    }

    if (!parsedDueDay || parsedDueDay < 1 || parsedDueDay > 31) {
      setError('Informe um dia de vencimento entre 1 e 31.')
      return
    }

    try {
      setLoading(true)

      await addFixedCost({
        title: title.trim(),
        amount: parsedAmount,
        dueDay: parsedDueDay,
        category
      })

      setTitle('')
      setAmount('')
      setDueDay('')
      setCategory('Casa')
    } catch (err) {
      setError(err.message || 'Não foi possível salvar o custo fixo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Title>Cadastrar custo fixo</Title>

      <Form onSubmit={handleSubmit}>
        <Input
          placeholder="Ex: Aluguel"
          value={title}
          onChange={event => setTitle(event.target.value)}
        />

        <Input
          placeholder="Valor"
          inputMode="decimal"
          value={amount}
          onChange={event => setAmount(event.target.value)}
        />

        <Input
          placeholder="Dia do vencimento"
          inputMode="numeric"
          value={dueDay}
          onChange={event => setDueDay(event.target.value)}
        />

        <StyledSelect
          options={EXPENSE_CATEGORIES}
          value={category}
          onChange={value => setCategory(getSelectValue(value))}
          placeholder="Categoria"
        />

        {error ? <Feedback>{error}</Feedback> : null}

        <Button type="submit" disabled={loading}>
          {loading ? 'Salvando...' : 'Salvar custo fixo'}
        </Button>
      </Form>
    </>
  )
}

export default FixedCostForm
