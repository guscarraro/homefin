import { useState } from "react";
import styled from "styled-components";
import Card from "../common/Card";
import ExpenseForm from "./ExpenseForm";
import FixedCostForm from "./FixedCostForm";

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 16px;
`;

const Title = styled.h3`
  font-size: 22px;
`;

const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.textSoft};
  line-height: 1.4;
`;

const Switch = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  background: ${({ theme }) => theme.colors.surfaceAlt};
  padding: 6px;
  border-radius: 16px;
  margin-bottom: 18px;
`;

const SwitchButton = styled.button`
  border: 0;
  border-radius: 12px;
  min-height: 42px;
  font-weight: 700;
  cursor: pointer;
  transition: 0.2s ease;
  background: ${({ active, theme }) =>
    active ? theme.colors.primary : "transparent"};
  color: ${({ active, theme }) => (active ? "#fff" : theme.colors.text)};
`;

function QuickLaunch() {
  const [mode, setMode] = useState("expense");

  return (
    <Card>
      <Header>
        <Title>Lançamento rápido</Title>
        <Subtitle>
          Lance despesas, investimentos, pagamentos de metas e custos fixos em
          um único lugar, sem criar aba sobrando.
        </Subtitle>
      </Header>

      <Switch>
        <SwitchButton
          type="button"
          active={mode === "expense" ? 1 : 0}
          onClick={() => setMode("expense")}
        >
          Despesa / investimento
        </SwitchButton>

        <SwitchButton
          type="button"
          active={mode === "fixed" ? 1 : 0}
          onClick={() => setMode("fixed")}
        >
          Custo fixo
        </SwitchButton>
      </Switch>

      {mode === "expense" ? <ExpenseForm /> : <FixedCostForm />}
    </Card>
  );
}

export default QuickLaunch;
