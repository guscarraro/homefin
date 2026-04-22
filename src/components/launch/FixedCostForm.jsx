import { useState } from 'react'
import styled from 'styled-components'
import Card from '../common/Card'
import Input from '../common/Input'
import StyledSelect from '../common/StyledSelect'
import Button from '../common/Button'
import { CATEGORIES } from '../../services/mockData'
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

function FixedCostForm() {
  const { addFixedCost } = useFinance()

  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [dueDay, setDueDay] = useState('')
  const [category, setCategory] = useState('Casa')

  function handleSubmit(event) {
    event.preventDefault()

    const parsedAmount = Number(String(amount).replace(',', '.'))
    const parsedDueDay = Number(dueDay)

    if (!title.trim()) {
      alert('Informe o nome do custo fixo')
      return
    }

    if (!parsedAmount) {
      alert('Informe um valor válido')
      return
    }

    if (!parsedDueDay || parsedDueDay < 1 || parsedDueDay > 31) {
      alert('Informe um dia de vencimento entre 1 e 31')
      return
    }

    addFixedCost({
      title: title.trim(),
      amount: parsedAmount,
      dueDay: parsedDueDay,
      category
    })

    setTitle('')
    setAmount('')
    setDueDay('')
    setCategory('Casa')
  }

  return (
    <Card>
      <h3>Cadastrar custo fixo</h3>

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
          options={CATEGORIES}
          value={category}
          onChange={value => setCategory(getSelectValue(value))}
          placeholder="Categoria"
        />

        <Button type="submit">Salvar custo fixo</Button>
      </Form>
    </Card>
  )
}

export default FixedCostForm