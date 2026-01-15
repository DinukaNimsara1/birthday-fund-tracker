import { Gift } from 'lucide-react';

export default function Header({ currentUser, balance, onSwitchUser }) {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <Gift className="w-8 h-8 text-purple-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Birthday Fund Tracker</h1>
            <p className="text-sm text-gray-600">Welcome, {currentUser}!</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-gray-600">Current Balance</p>
            <p className="text-2xl font-bold text-green-600">${balance.toFixed(2)}</p>
          </div>
          <button
            onClick={onSwitchUser}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors"
          >
            Switch User
          </button>
        </div>
      </div>
    </div>
  );
}