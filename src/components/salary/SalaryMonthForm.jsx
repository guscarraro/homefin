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

function SalaryMonthForm() {
  const { saveMonthSalary } = useFinance();

  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [gustavo, setGustavo] = useState("");
  const [marccella, setMarccella] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    const gustavoValue = Number(String(gustavo || 0).replace(",", "."));
    const marccellaValue = Number(String(marccella || 0).replace(",", "."));

    if (!gustavoValue && !marccellaValue) {
      alert("Informe pelo menos um salário");
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

        <Button type="submit" disabled={loading}>
          {loading ? "Salvando..." : "Salvar salários"}
        </Button>
      </Form>
    </Card>
  );
}

export default SalaryMonthForm;
