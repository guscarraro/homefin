import { useMemo, useState } from 'react'
import styled from 'styled-components'
import { FiTrash2, FiX } from 'react-icons/fi'
import Card from '../common/Card'
import { formatCurrency } from '../../utils/currency'
import { useFinance } from '../../context/FinanceContext'

const SwipeWrapper = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: 22px;
`

const DeleteBackground = styled.div`
  position: absolute;
  inset: 0;
  background: #dc2626;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 22px;
  color: #fff;
`

const Foreground = styled.div`
  position: relative;
  transform: translateX(${({ offset }) => `${offset}px`});
  transition: ${({ dragging }) => (dragging ? 'none' : 'transform 0.18s ease')};
`

const Top = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
`

const Left = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`

const TitleRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
`

const Title = styled.strong`
  font-size: 16px;
`

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  min-height: 24px;
  padding: 0 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  background: ${({ tone, theme }) => {
    if (tone === 'fixed') return 'rgba(37, 99, 235, 0.12)'
    if (tone === 'installment') return 'rgba(124, 58, 237, 0.12)'
    if (tone === 'investment') return 'rgba(34, 197, 94, 0.12)'
    return theme.colors.primarySoft
  }};
  color: ${({ tone, theme }) => {
    if (tone === 'fixed') return '#2563eb'
    if (tone === 'installment') return '#7c3aed'
    if (tone === 'investment') return '#16a34a'
    return theme.colors.text
  }};
`

const Note = styled.div`
  color: ${({ theme }) => theme.colors.textSoft};
  line-height: 1.4;
`

const Amount = styled.strong`
  white-space: nowrap;
  font-size: 18px;
`

const Meta = styled.div`
  margin-top: 12px;
  color: ${({ theme }) => theme.colors.textSoft};
  font-size: 14px;
  line-height: 1.45;
`

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 14px;
`

const DangerButton = styled.button`
  border: 0;
  background: transparent;
  color: #dc2626;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
`

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.55);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 999;
`

const Modal = styled.div`
  width: 100%;
  max-width: 520px;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 24px 24px 0 0;
  padding: 22px 18px 28px;
  box-shadow: 0 -10px 30px ${({ theme }) => theme.colors.shadow};
`

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: flex-start;
  margin-bottom: 12px;
`

const CloseButton = styled.button`
  border: 0;
  background: transparent;
  color: ${({ theme }) => theme.colors.textSoft};
  cursor: pointer;
`

const ModalText = styled.p`
  color: ${({ theme }) => theme.colors.textSoft};
  line-height: 1.5;
  margin-bottom: 16px;
`

const ModalActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`

const ModalButton = styled.button`
  min-height: 46px;
  border-radius: 14px;
  border: 0;
  cursor: pointer;
  font-weight: 700;
  background: ${({ variant, theme }) => {
    if (variant === 'danger') return '#dc2626'
    if (variant === 'secondary') return theme.colors.surfaceAlt
    return theme.colors.primary
  }};
  color: ${({ variant, theme }) => {
    if (variant === 'secondary') return theme.colors.text
    return '#fff'
  }};
`

function formatDate(value) {
  if (!value) {
    return '-'
  }

  const date = new Date(`${value}T12:00:00`)
  return date.toLocaleDateString('pt-BR')
}

function getBadgeTone(item) {
  if (item.sourceType === 'fixed_cost') {
    return 'fixed'
  }

  if (item.type === 'investment') {
    return 'investment'
  }

  if (item.isInstallment) {
    return 'installment'
  }

  return 'default'
}

function EntryItem({ item }) {
  const {
    selectedMonth,
    removeEntry,
    skipRecurringEntryMonth,
    removeFixedCost,
    skipFixedCostMonth
  } = useFinance()

  const [offset, setOffset] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [showModal, setShowModal] = useState(false)

  const deleteMode = useMemo(() => {
    if (item.sourceType === 'fixed_cost') {
      return 'fixed'
    }

    if (item.isInstallment) {
      return 'installment'
    }

    if (item.isRecurring) {
      return 'recurring'
    }

    return 'single'
  }, [item])

  function resetSwipe() {
    setOffset(0)
    setDragging(false)
    setStartX(0)
  }

  function openDeleteModal() {
    setShowModal(true)
    resetSwipe()
  }

  function closeDeleteModal() {
    setShowModal(false)
    resetSwipe()
  }

  function handleTouchStart(event) {
    setDragging(true)
    setStartX(event.touches[0].clientX)
  }

  function handleTouchMove(event) {
    if (!dragging) {
      return
    }

    const currentX = event.touches[0].clientX
    const delta = currentX - startX

    if (delta > 0) {
      setOffset(0)
      return
    }

    if (delta < -120) {
      setOffset(-120)
      return
    }

    setOffset(delta)
  }

  function handleTouchEnd() {
    setDragging(false)

    if (offset <= -88) {
      openDeleteModal()
      return
    }

    setOffset(0)
  }

  function handleDeleteSingle() {
    if (item.sourceType === 'fixed_cost') {
      skipFixedCostMonth(item.originalId, selectedMonth)
    } else {
      if (item.isRecurring || item.isInstallment) {
        skipRecurringEntryMonth(item.originalId, selectedMonth)
      } else {
        removeEntry(item.originalId)
      }
    }

    closeDeleteModal()
  }

  function handleDeleteAll() {
    if (item.sourceType === 'fixed_cost') {
      removeFixedCost(item.originalId)
    } else {
      removeEntry(item.originalId)
    }

    closeDeleteModal()
  }

  function renderMeta() {
    const parts = []

    parts.push(item.entryKindLabel)

    if (item.installmentLabel) {
      parts.push(`Parcela ${item.installmentLabel}`)
    }

    if (item.recurrenceLabel) {
      parts.push(item.recurrenceLabel)
    }

    if (item.account) {
      parts.push(item.account)
    }

    parts.push(formatDate(item.displayDate))

    return parts.join(' • ')
  }

  return (
    <>
      <SwipeWrapper>
        <DeleteBackground>
          <FiTrash2 size={22} />
        </DeleteBackground>

        <Foreground
          offset={offset}
          dragging={dragging}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <Card>
            <Top>
              <Left>
                <TitleRow>
                  <Title>{item.title}</Title>

                  <Badge tone={getBadgeTone(item)}>
                    {item.sourceType === 'fixed_cost'
                      ? 'Fixo'
                      : item.type === 'investment'
                        ? 'Investimento'
                        : item.isInstallment
                          ? item.installmentLabel
                          : 'Normal'}
                  </Badge>
                </TitleRow>

                <Note>{item.displayNote || 'Sem observação'}</Note>
              </Left>

              <Amount>{formatCurrency(item.displayAmount)}</Amount>
            </Top>

            <Meta>{renderMeta()}</Meta>

            <Actions>
              <DangerButton type="button" onClick={openDeleteModal}>
                <FiTrash2 size={16} />
                Remover
              </DangerButton>
            </Actions>
          </Card>
        </Foreground>
      </SwipeWrapper>

      {showModal && (
        <Overlay onClick={closeDeleteModal}>
          <Modal onClick={event => event.stopPropagation()}>
            <ModalHeader>
              <div>
                <strong>Remover lançamento</strong>
              </div>

              <CloseButton type="button" onClick={closeDeleteModal}>
                <FiX size={20} />
              </CloseButton>
            </ModalHeader>

            {deleteMode === 'single' && (
              <>
                <ModalText>
                  Deseja remover este lançamento de forma permanente?
                </ModalText>

                <ModalActions>
                  <ModalButton type="button" variant="danger" onClick={handleDeleteAll}>
                    Sim, remover
                  </ModalButton>

                  <ModalButton type="button" variant="secondary" onClick={closeDeleteModal}>
                    Cancelar
                  </ModalButton>
                </ModalActions>
              </>
            )}

            {deleteMode === 'recurring' && (
              <>
                <ModalText>
                  Esse lançamento é recorrente. Você quer remover apenas a ocorrência deste mês ou apagar a recorrência inteira?
                </ModalText>

                <ModalActions>
                  <ModalButton type="button" variant="danger" onClick={handleDeleteSingle}>
                    Remover só este mês
                  </ModalButton>

                  <ModalButton type="button" onClick={handleDeleteAll}>
                    Remover recorrência inteira
                  </ModalButton>

                  <ModalButton type="button" variant="secondary" onClick={closeDeleteModal}>
                    Cancelar
                  </ModalButton>
                </ModalActions>
              </>
            )}

            {deleteMode === 'installment' && (
              <>
                <ModalText>
                  Esse lançamento faz parte de um parcelamento. Você quer remover apenas a parcela deste mês ou o parcelamento inteiro?
                </ModalText>

                <ModalActions>
                  <ModalButton type="button" variant="danger" onClick={handleDeleteSingle}>
                    Remover só esta parcela
                  </ModalButton>

                  <ModalButton type="button" onClick={handleDeleteAll}>
                    Remover parcelamento inteiro
                  </ModalButton>

                  <ModalButton type="button" variant="secondary" onClick={closeDeleteModal}>
                    Cancelar
                  </ModalButton>
                </ModalActions>
              </>
            )}

            {deleteMode === 'fixed' && (
              <>
                <ModalText>
                  Esse item é um custo fixo. Você quer remover apenas a cobrança deste mês ou apagar o custo fixo recorrente?
                </ModalText>

                <ModalActions>
                  <ModalButton type="button" variant="danger" onClick={handleDeleteSingle}>
                    Remover só este mês
                  </ModalButton>

                  <ModalButton type="button" onClick={handleDeleteAll}>
                    Remover custo fixo inteiro
                  </ModalButton>

                  <ModalButton type="button" variant="secondary" onClick={closeDeleteModal}>
                    Cancelar
                  </ModalButton>
                </ModalActions>
              </>
            )}
          </Modal>
        </Overlay>
      )}
    </>
  )
}

export default EntryItem