import { Bell, Cake } from 'lucide-react';

export default function BirthdayReminders({ todaysBirthdays, thisWeekBirthdays }) {
  const formatBirthdayDisplay = (birthday) => {
    if (!birthday) return 'Not set';
    const [month, day] = birthday.split('-');
    const date = new Date(2000, parseInt(month) - 1, parseInt(day));
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
  };

  if (todaysBirthdays.length === 0 && thisWeekBirthdays.length === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl shadow-xl p-6 mb-6 text-white">
      <div className="flex items-center gap-2 mb-4">
        <Bell className="w-6 h-6" />
        <h2 className="text-xl font-bold">Birthday Reminders</h2>
      </div>
      
      {todaysBirthdays.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Cake className="w-5 h-5" />
            <h3 className="font-semibold">Today's Birthdays! 🎉</h3>
          </div>
          {todaysBirthdays.map(person => (
            <div key={person.id} className="bg-white bg-opacity-20 rounded-lg p-3 mb-2">
              <p className="font-semibold text-lg">{person.name}</p>
              <p className="text-sm opacity-90">Happy Birthday! 🎂</p>
            </div>
          ))}
        </div>
      )}
      
      {thisWeekBirthdays.length > 0 && (
        <div>
          <h3 className="font-semibold mb-2">Coming Up This Week:</h3>
          {thisWeekBirthdays.map(person => (
            <div key={person.id} className="bg-white bg-opacity-20 rounded-lg p-3 mb-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{person.name}</p>
                  <p className="text-sm opacity-90">{formatBirthdayDisplay(person.birthday)}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">{person.daysUntil}</p>
                  <p className="text-xs opacity-90">days</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}