import { useState } from 'react'
import styled from 'styled-components'
import Input from '../common/Input'
import StyledSelect from '../common/StyledSelect'
import Button from '../common/Button'
import { ACCOUNTS, CATEGORIES, PAYMENT_METHODS } from '../../services/mockData'
import { useFinance } from '../../context/FinanceContext'
import { useUser } from '../../context/UserContext'

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const ToggleBox = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 52px;
  padding: 0 16px;
  border-radius: 16px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surfaceAlt};
  cursor: pointer;
`

const Hint = styled.div`
  padding: 12px 14px;
  border-radius: 14px;
  background: ${({ theme }) => theme.colors.primarySoft};
  color: ${({ theme }) => theme.colors.text};
  font-size: 14px;
  line-height: 1.4;
`

function ExpenseForm() {
  const { addEntry } = useFinance()
  const { selectedUser } = useUser()

  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('')
  const [account, setAccount] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('')
  const [note, setNote] = useState('')
  const [isInstallment, setIsInstallment] = useState(false)
  const [installmentCount, setInstallmentCount] = useState('')

  function handleSubmit(event) {
    event.preventDefault()

    const parsedAmount = Number(String(amount).replace(',', '.'))
    const parsedInstallments = Number(installmentCount || 1)

    if (!parsedAmount || !category || !account || !paymentMethod) {
      return
    }

    addEntry({
      amount: parsedAmount,
      category,
      account,
      paymentMethod,
      note,
      userId: selectedUser,
      date: new Date().toISOString().slice(0, 10),
      isInstallment,
      installmentCount: isInstallment ? parsedInstallments : 1
    })

    setAmount('')
    setCategory('')
    setAccount('')
    setPaymentMethod('')
    setNote('')
    setIsInstallment(false)
    setInstallmentCount('')
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Input
        placeholder="Valor da compra"
        inputMode="decimal"
        value={amount}
        onChange={event => setAmount(event.target.value)}
      />

      <StyledSelect
        options={CATEGORIES}
        value={category}
        onChange={event => setCategory(event.target.value)}
        placeholder="Categoria"
      />

      <StyledSelect
        options={ACCOUNTS}
        value={account}
        onChange={event => setAccount(event.target.value)}
        placeholder="Conta / banco"
      />

      <StyledSelect
        options={PAYMENT_METHODS}
        value={paymentMethod}
        onChange={event => setPaymentMethod(event.target.value)}
        placeholder="Forma de pagamento"
      />

      <ToggleBox>
        <input
          type="checkbox"
          checked={isInstallment}
          onChange={event => setIsInstallment(event.target.checked)}
        />
        <span>Foi parcelado?</span>
      </ToggleBox>

      {isInstallment && (
        <>
          <Input
            placeholder="Quantas parcelas?"
            inputMode="numeric"
            value={installmentCount}
            onChange={event => setInstallmentCount(event.target.value)}
          />

          {paymentMethod === 'Crédito' ? (
            <Hint>
              Como foi no crédito, a primeira parcela entra no mês que vem.
            </Hint>
          ) : (
            <Hint>
              Como não foi no crédito, a primeira parcela já entra no mês atual.
            </Hint>
          )}
        </>
      )}

      <Input
        placeholder="Observação opcional"
        value={note}
        onChange={event => setNote(event.target.value)}
      />

      <Button type="submit">Salvar despesa</Button>
    </Form>
  )
}

export default ExpenseForm