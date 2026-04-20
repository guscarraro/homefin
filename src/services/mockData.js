export const USERS = [
  { id: 'gustavo', name: 'Gustavo' },
  { id: 'marccella', name: 'Marccella' }
]

export const ACCOUNTS = ['Nubank', 'Itaú', 'Bradesco', 'Inter', 'Caixa']

export const CATEGORIES = [
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
  'Outros'
]

export const PAYMENT_METHODS = ['Pix', 'Débito', 'Crédito', 'Dinheiro']

export const DEFAULT_DATA = {
  salaries: [],
  fixedCosts: [
    { id: 'fc-1', title: 'Aluguel', amount: 1800, dueDay: 5, active: true },
    { id: 'fc-2', title: 'Internet', amount: 120, dueDay: 10, active: true },
    { id: 'fc-3', title: 'Energia', amount: 220, dueDay: 15, active: true }
  ],
  entries: [
    {
      id: 'en-1',
      type: 'expense',
      category: 'Mercado',
      amount: 420,
      account: 'Nubank',
      paymentMethod: 'Crédito',
      isInstallment: true,
      installmentCount: 3,
      installmentAmount: 140,
      installmentStartMonth: '2026-05',
      userId: 'gustavo',
      date: '2026-04-20',
      note: 'Compra maior do mês'
    },
    {
      id: 'en-2',
      type: 'expense',
      category: 'Combustível',
      amount: 80,
      account: 'Inter',
      paymentMethod: 'Pix',
      isInstallment: false,
      installmentCount: 1,
      installmentAmount: 80,
      installmentStartMonth: null,
      userId: 'marccella',
      date: '2026-04-21',
      note: ''
    }
  ],
  goals: [
    {
      id: 'goal-1',
      title: 'Viagem',
      targetAmount: 8000,
      targetMonths: 10,
      priority: 'media'
    }
  ]
}