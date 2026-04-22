import { useState } from 'react'
import styled from 'styled-components'
import Input from '../common/Input'
import StyledSelect from '../common/StyledSelect'
import Button from '../common/Button'
import { ACCOUNTS, CATEGORIES, PAYMENT_METHODS } from '../../services/mockData'
import { useFinance } from '../../context/FinanceContext'

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const NativeSelect = styled.select`
  width: 100%;
  min-height: 52px;
  border-radius: 16px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surfaceAlt};
  color: ${({ theme }) => theme.colors.text};
  padding: 0 14px;
  font-size: 15px;
  outline: none;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
  }
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
  line-height: 1.45;
`

function getSelectValue(value) {
  if (value?.target) return value.target.value
  if (value?.value) return value.value
  return value || ''
}

function ExpenseForm() {
  const { addEntry, financeData } = useFinance()

  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('')
  const [account, setAccount] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('')
  const [note, setNote] = useState('')
  const [goalId, setGoalId] = useState('')
  const [isInstallment, setIsInstallment] = useState(false)
  const [installmentCount, setInstallmentCount] = useState('')
  const [loading, setLoading] = useState(false)

  const isInvestment = category === 'Investimento'
  const isGoalPayment = category === 'Meta'
  const allowInstallment = !isInvestment && !isGoalPayment

  async function handleSubmit(event) {
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

    if (isGoalPayment && !goalId) {
      alert('Selecione qual meta recebeu esse valor')
      return
    }

    if (allowInstallment && isInstallment && parsedInstallments < 2) {
      alert('Se foi parcelado, informe ao menos 2 parcelas')
      return
    }

    try {
      setLoading(true)

      await addEntry({
        amount: parsedAmount,
        category,
        account,
        paymentMethod,
        note: note.trim(),
        date: new Date().toISOString().slice(0, 10),
        isInstallment: allowInstallment ? isInstallment : false,
        installmentCount: allowInstallment && isInstallment ? parsedInstallments : 1,
        goalId: isGoalPayment ? goalId : null
      })

      setAmount('')
      setCategory('')
      setAccount('')
      setPaymentMethod('')
      setNote('')
      setGoalId('')
      setIsInstallment(false)
      setInstallmentCount('')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Input
        placeholder="Valor do lançamento"
        inputMode="decimal"
        value={amount}
        onChange={event => setAmount(event.target.value)}
      />

      <StyledSelect
        options={CATEGORIES}
        value={category}
        onChange={value => setCategory(getSelectValue(value))}
        placeholder="Categoria"
      />

      {isGoalPayment && (
        <NativeSelect
          value={goalId}
          onChange={event => setGoalId(event.target.value)}
        >
          <option value="">Qual meta foi paga?</option>

          {(financeData.goals || []).map(goal => (
            <option key={goal.id} value={goal.id}>
              {goal.title}
            </option>
          ))}
        </NativeSelect>
      )}

      <StyledSelect
        options={ACCOUNTS}
        value={account}
        onChange={value => setAccount(getSelectValue(value))}
        placeholder="Conta / banco"
      />

      <StyledSelect
        options={PAYMENT_METHODS}
        value={paymentMethod}
        onChange={value => setPaymentMethod(getSelectValue(value))}
        placeholder="Forma de pagamento"
      />

      {allowInstallment && (
        <ToggleBox>
          <input
            type="checkbox"
            checked={isInstallment}
            onChange={event => setIsInstallment(event.target.checked)}
          />
          <span>Foi parcelado?</span>
        </ToggleBox>
      )}

      {allowInstallment && isInstallment && (
        <>
          <Input
            placeholder="Quantas parcelas?"
            inputMode="numeric"
            value={installmentCount}
            onChange={event => setInstallmentCount(event.target.value)}
          />

          {paymentMethod === 'Crédito' ? (
            <Hint>Primeira parcela entra no mês que vem.</Hint>
          ) : (
            <Hint>Primeira parcela entra no mês atual.</Hint>
          )}
        </>
      )}

      {isInvestment && (
        <Hint>
          Lançando em “Investimento”, o valor entra como aporte real do mês e ajuda a bater a meta mínima de investimento.
        </Hint>
      )}

      {isGoalPayment && (
        <Hint>
          Lançando em “Meta”, o sistema entende que esse dinheiro saiu da conta e foi destinado a um objetivo específico.
        </Hint>
      )}

      <Input
        placeholder="Observação"
        value={note}
        onChange={event => setNote(event.target.value)}
      />

      <Button type="submit" disabled={loading}>
        {loading ? 'Salvando...' : 'Salvar lançamento'}
      </Button>
    </Form>
  )
}

export default ExpenseForm