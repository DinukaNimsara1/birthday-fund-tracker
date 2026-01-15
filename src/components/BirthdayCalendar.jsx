import { Cake } from 'lucide-react';

export default function BirthdayCalendar({ upcomingBirthdays }) {
  const formatBirthdayDisplay = (birthday) => {
    if (!birthday) return 'Not set';
    const [month, day] = birthday.split('-');
    const date = new Date(2000, parseInt(month) - 1, parseInt(day));
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">Birthday Calendar</h2>
        <Cake className="w-6 h-6 text-purple-600" />
      </div>

      {upcomingBirthdays.length > 0 ? (
        <div className="space-y-3">
          {upcomingBirthdays.map((person, index) => (
            <div 
              key={person.id} 
              className={`p-4 rounded-xl border-2 transition-all ${
                person.isToday 
                  ? 'bg-gradient-to-r from-pink-50 to-purple-50 border-pink-400' 
                  : person.isThisWeek
                  ? 'bg-yellow-50 border-yellow-300'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${
                    person.isToday ? 'bg-gradient-to-r from-pink-500 to-purple-500' :
                    person.isThisWeek ? 'bg-yellow-500' : 'bg-gray-400'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-bold text-lg text-gray-800">{person.name}</p>
                    <p className="text-sm text-gray-600">{formatBirthdayDisplay(person.birthday)}</p>
                  </div>
                </div>
                <div className="text-right">
                  {person.isToday ? (
                    <div className="text-pink-600 font-bold">
                      <p className="text-2xl">🎉</p>
                      <p className="text-sm">TODAY!</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-3xl font-bold text-purple-600">{person.daysUntil}</p>
                      <p className="text-sm text-gray-600">days away</p>
                    </div>
                  )}
                </div>
              </div>
              {person.isThisWeek && !person.isToday && (
                <div className="mt-2 pt-2 border-t border-yellow-200">
                  <p className="text-sm text-yellow-800 font-semibold">⚠️ Coming up soon!</p>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <Cake className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="mb-2">No birthdays added yet</p>
          <p className="text-sm">Add birthdays in Settings to see them here</p>
        </div>
      )}
    </div>
  );
}