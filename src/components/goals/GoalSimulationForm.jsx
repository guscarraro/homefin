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

function GoalSimulationForm() {
  const { addGoal } = useFinance()
  const [title, setTitle] = useState('')
  const [targetAmount, setTargetAmount] = useState('')
  const [targetMonths, setTargetMonths] = useState('')
  const [priority, setPriority] = useState('media')

  function handleSubmit(event) {
    event.preventDefault()

    addGoal({
      title,
      targetAmount: Number(targetAmount),
      targetMonths: Number(targetMonths),
      priority
    })

    setTitle('')
    setTargetAmount('')
    setTargetMonths('')
    setPriority('media')
  }

  return (
    <Card>
      <h3>Nova meta</h3>
      <Form onSubmit={handleSubmit}>
        <Input placeholder="Ex: Viagem, carro, apartamento" value={title} onChange={event => setTitle(event.target.value)} />
        <Input placeholder="Valor alvo" value={targetAmount} onChange={event => setTargetAmount(event.target.value)} />
        <Input placeholder="Prazo em meses" value={targetMonths} onChange={event => setTargetMonths(event.target.value)} />
        <StyledSelect
          options={['alta', 'media', 'baixa']}
          value={priority}
          onChange={event => setPriority(event.target.value)}
          placeholder="Prioridade"
        />
        <Button type="submit">Adicionar meta</Button>
      </Form>
    </Card>
  )
}

export default GoalSimulationForm