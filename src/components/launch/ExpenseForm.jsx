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

function getSelectValue(value) {
  if (value?.target) return value.target.value
  if (value?.value) return value.value
  return value || ''
}

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

    if (!parsedAmount) {
      alert('Informe um valor válido')
      return
    }

    if (!category) {
      alert('Selecione a categoria')
      return
    }

    if (!account) {
      alert('Selecione a conta')
      return
    }

    if (!paymentMethod) {
      alert('Selecione a forma de pagamento')
      return
    }

    if (isInstallment && parsedInstallments < 2) {
      alert('Se foi parcelado, informe ao menos 2 parcelas')
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
        placeholder="Valor da compra ou aporte"
        inputMode="decimal"
        value={amount}
        onChange={e => setAmount(e.target.value)}
      />

      <StyledSelect
        options={CATEGORIES}
        value={category}
        onChange={v => setCategory(getSelectValue(v))}
        placeholder="Categoria"
      />

      <StyledSelect
        options={ACCOUNTS}
        value={account}
        onChange={v => setAccount(getSelectValue(v))}
        placeholder="Conta / banco"
      />

      <StyledSelect
        options={PAYMENT_METHODS}
        value={paymentMethod}
        onChange={v => setPaymentMethod(getSelectValue(v))}
        placeholder="Forma de pagamento"
      />

      {category !== 'Investimento' && (
        <ToggleBox>
          <input
            type="checkbox"
            checked={isInstallment}
            onChange={e => setIsInstallment(e.target.checked)}
          />
          <span>Foi parcelado?</span>
        </ToggleBox>
      )}

      {isInstallment && category !== 'Investimento' && (
        <>
          <Input
            placeholder="Quantas parcelas?"
            inputMode="numeric"
            value={installmentCount}
            onChange={e => setInstallmentCount(e.target.value)}
          />

          {paymentMethod === 'Crédito' ? (
            <Hint>Primeira parcela entra no mês que vem.</Hint>
          ) : (
            <Hint>Primeira parcela entra no mês atual.</Hint>
          )}
        </>
      )}

      {category === 'Investimento' && (
        <Hint>
          Lançando em “Investimento”, o valor entra como aporte real do mês e passa a abater da meta mínima.
        </Hint>
      )}

      <Input
        placeholder="Observação"
        value={note}
        onChange={e => setNote(e.target.value)}
      />

      <Button type="submit">Salvar lançamento</Button>
    </Form>
  )
}

export default ExpenseForm