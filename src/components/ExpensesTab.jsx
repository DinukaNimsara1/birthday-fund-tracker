import { useState } from 'react';
import { DollarSign, Plus, Trash2 } from 'lucide-react';

export default function ExpensesTab({ 
  expenses, 
  isManager,
  onAddExpense,
  onRemoveExpense
}) {
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [newExpense, setNewExpense] = useState({ description: '', amount: '', date: '' });

  const handleAddExpense = () => {
    if (!newExpense.description || !newExpense.amount) return;
    
    onAddExpense({
      description: newExpense.description,
      amount: parseFloat(newExpense.amount),
      date: newExpense.date || new Date().toISOString().split('T')[0]
    });
    
    setNewExpense({ description: '', amount: '', date: '' });
    setShowAddExpense(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">Expenses</h2>
        {isManager && (
          <button
            onClick={() => setShowAddExpense(true)}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" /> Add Expense
          </button>
        )}
      </div>

      {showAddExpense && (
        <div className="mb-6 p-4 bg-gray-50 rounded-xl">
          <h3 className="font-semibold mb-3">New Expense</h3>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Description (e.g., John's birthday cake)"
              value={newExpense.description}
              onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            />
            <input
              type="number"
              placeholder="Amount"
              value={newExpense.amount}
              onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            />
            <input
              type="date"
              value={newExpense.date}
              onChange={(e) => setNewExpense({...newExpense, date: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            />
            <div className="flex gap-2">
              <button
                onClick={handleAddExpense}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Add
              </button>
              <button
                onClick={() => {
                  setShowAddExpense(false);
                  setNewExpense({ description: '', amount: '', date: '' });
                }}
                className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {expenses.sort((a, b) => new Date(b.date) - new Date(a.date)).map(expense => (
          <div key={expense.id} className="p-4 border border-gray-200 rounded-xl hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-800">{expense.description}</p>
                <p className="text-sm text-gray-600">{new Date(expense.date).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-lg font-bold text-red-600">-${expense.amount.toFixed(2)}</p>
                {isManager && (
                  <button
                    onClick={() => onRemoveExpense(expense.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {expenses.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <DollarSign className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p>No expenses recorded yet</p>
        </div>
      )}
    </div>
  );
}