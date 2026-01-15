export default function TabNav({ activeTab, onTabChange, isManager }) {
    return (
      <div className="bg-white rounded-2xl shadow-xl mb-6">
        <div className="flex border-b overflow-x-auto">
          <button
            onClick={() => onTabChange('contributions')}
            className={`flex-1 py-4 px-6 font-semibold transition-colors whitespace-nowrap ${
              activeTab === 'contributions'
                ? 'border-b-2 border-purple-600 text-purple-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Contributions
          </button>
          <button
            onClick={() => onTabChange('birthdays')}
            className={`flex-1 py-4 px-6 font-semibold transition-colors whitespace-nowrap ${
              activeTab === 'birthdays'
                ? 'border-b-2 border-purple-600 text-purple-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Birthday Calendar
          </button>
          <button
            onClick={() => onTabChange('expenses')}
            className={`flex-1 py-4 px-6 font-semibold transition-colors whitespace-nowrap ${
              activeTab === 'expenses'
                ? 'border-b-2 border-purple-600 text-purple-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Expenses
          </button>
          {isManager && (
            <button
              onClick={() => onTabChange('settings')}
              className={`flex-1 py-4 px-6 font-semibold transition-colors whitespace-nowrap ${
                activeTab === 'settings'
                  ? 'border-b-2 border-purple-600 text-purple-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Settings
            </button>
          )}
        </div>
      </div>
    );
  }