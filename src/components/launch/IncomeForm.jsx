import { useState } from 'react'
import styled from 'styled-components'
import Input from '../common/Input'
import StyledSelect from '../common/StyledSelect'
import Button from '../common/Button'
import { ACCOUNTS } from '../../services/mockData'
import { useFinance } from '../../context/FinanceContext'
import { useUser } from '../../context/UserContext'

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

function IncomeForm() {
  const { addEntry } = useFinance()
  const { selectedUser } = useUser()
  const [amount, setAmount] = useState('')
  const [account, setAccount] = useState('')
  const [note, setNote] = useState('')

  function handleSubmit(event) {
    event.preventDefault()

    addEntry({
      type: 'income',
      category: 'Receita avulsa',
      amount: Number(amount),
      account,
      note,
      userId: selectedUser,
      date: new Date().toISOString().slice(0, 10)
    })

    setAmount('')
    setAccount('')
    setNote('')
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Input
        placeholder="Valor"
        inputMode="decimal"
        value={amount}
        onChange={event => setAmount(event.target.value)}
      />

      <StyledSelect
        options={ACCOUNTS}
        value={account}
        onChange={event => setAccount(event.target.value)}
        placeholder="Conta"
      />

      <Input
        placeholder="Observação opcional"
        value={note}
        onChange={event => setNote(event.target.value)}
      />

      <Button type="submit">Salvar receita</Button>
    </Form>
  )
}

export default IncomeForm