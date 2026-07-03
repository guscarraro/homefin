import { useState } from "react";
import styled from "styled-components";
import Card from "../common/Card";
import Input from "../common/Input";
import Button from "../common/Button";
import { useFinance } from "../../context/FinanceContext";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Feedback = styled.div`
  padding: 12px 14px;
  border-radius: 14px;
  background: rgba(239, 68, 68, 0.10);
  color: ${({ theme }) => theme.colors.danger};
  font-size: 14px;
  line-height: 1.45;
`;

function SalaryMonthForm() {
  const { saveMonthSalary } = useFinance();

  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [gustavo, setGustavo] = useState("");
  const [marccella, setMarccella] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    const gustavoValue = Number(String(gustavo || 0).replace(",", "."));
    const marccellaValue = Number(String(marccella || 0).replace(",", "."));
    setError("");

    if (!gustavoValue && !marccellaValue) {
      setError("Informe pelo menos um salário.");
      return;
    }

    try {
      setLoading(true);

      await saveMonthSalary({
        month,
        gustavo: gustavoValue,
        marccella: marccellaValue,
      });

      setGustavo("");
      setMarccella("");
    } catch (err) {
      setError(err.message || "Não foi possível salvar os salários.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <h3>Salários do mês</h3>

      <Form onSubmit={handleSubmit}>
        <Input
          type="month"
          value={month}
          onChange={(event) => setMonth(event.target.value)}
        />

        <Input
          placeholder="Salário Gustavo"
          inputMode="decimal"
          value={gustavo}
          onChange={(event) => setGustavo(event.target.value)}
        />

        <Input
          placeholder="Salário Marccella"
          inputMode="decimal"
          value={marccella}
          onChange={(event) => setMarccella(event.target.value)}
        />

        {error ? <Feedback>{error}</Feedback> : null}

        <Button type="submit" disabled={loading}>
          {loading ? "Salvando..." : "Salvar salários"}
        </Button>
      </Form>
    </Card>
  );
}

export default SalaryMonthForm;
