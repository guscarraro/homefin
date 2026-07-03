export const ACCOUNTS = ['Nubank', 'Itaú', 'Bradesco', 'Inter', 'Caixa']

export const CATEGORIES = [
  'Receita',
  'Alimentação',
  'Mercado',
  'Combustível',
  'Casa',
  'Farmácia',
  'Lazer',
  'Assinaturas',
  'Transporte',
  'Pets',
  'Saúde',
  'Compras',
  'Investimento',
  'Meta',
  'Outros'
]

export const PAYMENT_METHODS = ['Pix', 'Débito', 'Crédito', 'Dinheiro']

export const EXPENSE_CATEGORIES = CATEGORIES.filter(
  category => !['Receita', 'Investimento', 'Meta'].includes(category)
)
