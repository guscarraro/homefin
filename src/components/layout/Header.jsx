import styled from 'styled-components'
import { FiCalendar, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import ThemeToggle from '../common/ThemeToggle'
import { useFinance } from '../../context/FinanceContext'
import { addMonthsToMonthKey, getMonthKeyFromDate } from '../../utils/date'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
`

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 10px;

  @media (max-width: 420px) {
    flex-direction: column;
    align-items: stretch;
  }
`

const TitleBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
  flex: 1;
`

const Title = styled.h1`
  font-size: 22px;
  line-height: 1.1;
  word-break: break-word;
`

const Subtitle = styled.span`
  color: ${({ theme }) => theme.colors.textSoft};
  font-size: 13px;
  line-height: 1.3;
`

const RightBox = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;

  @media (max-width: 420px) {
    width: 100%;
    align-items: stretch;
  }
`

const MonthControl = styled.div`
  display: grid;
  grid-template-columns: 34px minmax(122px, 1fr) 34px;
  align-items: center;
  gap: 4px;
  padding: 4px;
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.surfaceAlt};
  border: 1px solid ${({ theme }) => theme.colors.border};

  @media (max-width: 420px) {
    flex: 1;
  }
`

const MonthButton = styled.button`
  width: 34px;
  height: 34px;
  border: 0;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.surfaceAlt};
  color: ${({ theme }) => theme.colors.text};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:active {
    background: ${({ theme }) => theme.colors.primarySoft};
  }
`

const MonthPicker = styled.label`
  position: relative;
  min-height: 34px;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 0 10px;
  font-size: 13px;
  font-weight: 800;
  white-space: nowrap;
  cursor: pointer;
`

const MonthInput = styled.input`
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;

  &::-webkit-calendar-picker-indicator {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    cursor: pointer;
    opacity: 0;
  }
`

const ThemeIconOnly = styled.div`
  display: flex;
  align-items: center;

  button {
    min-width: 36px;
    min-height: 36px;
    padding: 0;
    border-radius: 10px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
`

const TodayButton = styled.button`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 10px;
  min-height: 36px;
  padding: 0 10px;
  background: ${({ theme }) => theme.colors.surfaceAlt};
  color: ${({ theme }) => theme.colors.text};
  font-size: 12px;
  font-weight: 800;
`

function formatMonthLabel(monthKey) {
  const [year, month] = monthKey.split('-')
  const date = new Date(Number(year), Number(month) - 1, 1)
  const monthName = date.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '')

  return `${monthName.charAt(0).toUpperCase()}${monthName.slice(1)} ${year}`
}

function Header({ title, subtitle, showMonthSelector = false }) {
  const { selectedMonth, setSelectedMonth } = useFinance()
  const currentMonth = getMonthKeyFromDate(new Date())
  const isCurrentMonth = selectedMonth === currentMonth

  function goToPreviousMonth() {
    setSelectedMonth(addMonthsToMonthKey(selectedMonth, -1))
  }

  function goToNextMonth() {
    setSelectedMonth(addMonthsToMonthKey(selectedMonth, 1))
  }

  return (
    <Wrapper>
      <TopRow>
        <TitleBox>
          <Title>{title}</Title>
          {subtitle ? <Subtitle>{subtitle}</Subtitle> : null}
        </TitleBox>

        <RightBox>
          {showMonthSelector ? (
            <>
              <MonthControl>
                <MonthButton type="button" onClick={goToPreviousMonth} aria-label="Mês anterior">
                  <FiChevronLeft size={18} />
                </MonthButton>

                <MonthPicker>
                  <FiCalendar size={15} />
                  {formatMonthLabel(selectedMonth)}
                  <MonthInput
                    type="month"
                    value={selectedMonth}
                    onChange={event => setSelectedMonth(event.target.value)}
                    aria-label="Selecionar mês"
                  />
                </MonthPicker>

                <MonthButton type="button" onClick={goToNextMonth} aria-label="Próximo mês">
                  <FiChevronRight size={18} />
                </MonthButton>
              </MonthControl>

              {!isCurrentMonth ? (
                <TodayButton type="button" onClick={() => setSelectedMonth(currentMonth)}>
                  Hoje
                </TodayButton>
              ) : null}
            </>
          ) : null}

          <ThemeIconOnly>
            <ThemeToggle />
          </ThemeIconOnly>
        </RightBox>
      </TopRow>
    </Wrapper>
  )
}

export default Header
