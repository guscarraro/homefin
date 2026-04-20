import { useState } from 'react'
import styled from 'styled-components'
import Card from '../common/Card'
import Input from '../common/Input'
import Button from '../common/Button'
import { useFinance } from '../../context/FinanceContext'

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

function SalaryMonthForm() {
  const { saveMonthSalary } = useFinance()
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7))
  const [gustavo, setGustavo] = useState('')
  const [marccella, setMarccella] = useState('')

  function handleSubmit(event) {
    event.preventDefault()

    saveMonthSalary({
      month,
      gustavo: Number(gustavo),
      marccella: Number(marccella)
    })
  }

  return (
    <Card>
      <h3>Salários do mês</h3>
      <Form onSubmit={handleSubmit}>
        <Input type="month" value={month} onChange={event => setMonth(event.target.value)} />
        <Input placeholder="Salário Gustavo" value={gustavo} onChange={event => setGustavo(event.target.value)} />
        <Input placeholder="Salário Marccella" value={marccella} onChange={event => setMarccella(event.target.value)} />
        <Button type="submit">Salvar salários</Button>
      </Form>
    </Card>
  )
}

export default SalaryMonthForm