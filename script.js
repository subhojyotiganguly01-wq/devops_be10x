const transactions = [
  { id: 1, type: 'income', category: 'Salary', amount: 4200, date: '2026-11-01', note: 'Monthly salary' },
  { id: 2, type: 'expense', category: 'Housing', amount: 1800, date: '2026-11-03', note: 'Rent payment' },
  { id: 3, type: 'expense', category: 'Food', amount: 320, date: '2026-11-05', note: 'Groceries' },
  { id: 4, type: 'income', category: 'Freelance', amount: 650, date: '2026-11-08', note: 'UX audit' },
  { id: 5, type: 'expense', category: 'Transport', amount: 210, date: '2026-11-10', note: 'Fuel and train' },
  { id: 6, type: 'expense', category: 'Utilities', amount: 170, date: '2026-11-11', note: 'Electricity and internet' },
  { id: 7, type: 'expense', category: 'Savings', amount: 500, date: '2026-11-12', note: 'Emergency fund' },
  { id: 8, type: 'expense', category: 'Leisure', amount: 265, date: '2026-11-14', note: 'Weekend activities' }
];

const moneyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

const transactionTable = document.getElementById('transactionTable');
const transactionForm = document.getElementById('transactionForm');
const netBalanceEl = document.getElementById('netBalance');
const incomeTotalEl = document.getElementById('incomeTotal');
const expenseTotalEl = document.getElementById('expenseTotal');
const savingsRateEl = document.getElementById('savingsRate');

function calculateSummary() {
  const income = transactions
    .filter((item) => item.type === 'income')
    .reduce((sum, item) => sum + item.amount, 0);

  const expenses = transactions
    .filter((item) => item.type === 'expense')
    .reduce((sum, item) => sum + item.amount, 0);

  const balance = income - expenses;
  const savingsRate = income === 0 ? 0 : ((income - expenses) / income) * 100;

  netBalanceEl.textContent = moneyFormatter.format(balance);
  incomeTotalEl.textContent = moneyFormatter.format(income);
  expenseTotalEl.textContent = moneyFormatter.format(expenses);
  savingsRateEl.textContent = `${Math.max(0, savingsRate).toFixed(0)}%`;
}

function renderTransactions() {
  const sorted = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));

  transactionTable.innerHTML = sorted
    .slice(0, 6)
    .map((entry) => {
      const typeLabel = entry.type === 'income' ? 'Income' : 'Expense';
      const isIncome = entry.type === 'income';
      const amount = moneyFormatter.format(entry.amount);
      const sign = isIncome ? '+' : '-';

      return `
        <tr>
          <td><span class="type-pill ${isIncome ? 'type-income' : 'type-expense'}">${typeLabel}</span></td>
          <td>${entry.category}</td>
          <td>${new Date(entry.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
          <td class="amount ${isIncome ? 'positive' : 'negative'}">${sign}${amount}</td>
        </tr>
      `;
    })
    .join('');
}

function handleFormSubmit(event) {
  event.preventDefault();

  const formData = new FormData(transactionForm);
  const type = formData.get('type');
  const category = formData.get('category');
  const amount = Number(formData.get('amount'));
  const date = formData.get('date');
  const note = formData.get('note') || category;

  if (!type || !category || !amount || !date) {
    return;
  }

  transactions.unshift({
    id: Date.now(),
    type,
    category,
    amount,
    date,
    note,
  });

  transactionForm.reset();
  document.getElementById('date').valueAsDate = new Date();
  calculateSummary();
  renderTransactions();
}

transactionForm.addEventListener('submit', handleFormSubmit);
document.getElementById('date').valueAsDate = new Date();

calculateSummary();
renderTransactions();
