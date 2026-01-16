import { useState, useEffect } from 'react';
import LoginScreen from './components/LoginScreen';
import Header from './components/Header';
import BirthdayReminders from './components/BirthdayReminders';
import TabNav from './components/TabNav';
import BirthdayCalendar from './components/BirthdayCalendar';
import ContributionsTab from './components/ContributionsTab';
import ExpensesTab from './components/ExpensesTab';
import SettingsTab from './components/SettingsTab';

function App() {
  const [members, setMembers] = useState([]);
  const [contributions, setContributions] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [monthlyAmount, setMonthlyAmount] = useState(20);
  const [isManager, setIsManager] = useState(false);
  const [currentUser, setCurrentUser] = useState('');
  const [managerPassword, setManagerPassword] = useState('admin123');
  const [activeTab, setActiveTab] = useState('contributions');
  const [upcomingBirthdays, setUpcomingBirthdays] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    calculateUpcomingBirthdays();
  }, [members]);

  const loadData = async () => {
    try {
      const membersData = await window.storage.get('birthday-fund-members');
      const contribData = await window.storage.get('birthday-fund-contributions');
      const expensesData = await window.storage.get('birthday-fund-expenses');
      const amountData = await window.storage.get('birthday-fund-monthly-amount');
      const userData = await window.storage.get('birthday-fund-current-user');

      if (membersData) setMembers(JSON.parse(membersData.value));
      if (contribData) setContributions(JSON.parse(contribData.value));
      if (expensesData) setExpenses(JSON.parse(expensesData.value));
      if (amountData) setMonthlyAmount(parseFloat(amountData.value));
      if (userData) {
        const user = JSON.parse(userData.value);
        
        if (!user.isManager) {
          // Regular users always stay logged in
          setCurrentUser(user.name);
          setIsManager(user.isManager);
        } else {
          // Managers stay logged in for 24 hours
          const LOGIN_DURATION = 24 * 60 * 60 * 1000; // 24 hours
          const now = Date.now();
          if (user.loginTimestamp && (now - user.loginTimestamp < LOGIN_DURATION)) {
            setCurrentUser(user.name);
            setIsManager(user.isManager);
          }
        }
      }
      
      const passwordData = await window.storage.get('birthday-fund-manager-password');
      if (passwordData) {
        setManagerPassword(JSON.parse(passwordData.value).value);
      }
    } catch (error) {
      console.log('No existing data, starting fresh');
    }
  };

  const saveData = async (key, data) => {
    try {
      await window.storage.set(key, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save data:', error);
    }
  };

  const selectUser = (name, manager = false) => {
    setCurrentUser(name);
    setIsManager(manager);
    saveData('birthday-fund-current-user', { 
      name, 
      isManager: manager,
      loginTimestamp: Date.now() 
    });
  };

  const calculateUpcomingBirthdays = () => {
    const today = new Date();
    const currentYear = today.getFullYear();

    const birthdays = members
      .filter(m => m.birthday)
      .map(member => {
        const [month, day] = member.birthday.split('-').map(Number);
        let birthdayThisYear = new Date(currentYear, month - 1, day);

        if (birthdayThisYear < today) {
          birthdayThisYear = new Date(currentYear + 1, month - 1, day);
        }

        const daysUntil = Math.ceil((birthdayThisYear - today) / (1000 * 60 * 60 * 24));

        return {
          ...member,
          nextBirthday: birthdayThisYear,
          daysUntil,
          isToday: daysUntil === 0,
          isThisWeek: daysUntil <= 7 && daysUntil >= 0,
          isThisMonth: daysUntil <= 30 && daysUntil >= 0
        };
      })
      .sort((a, b) => a.daysUntil - b.daysUntil);

    setUpcomingBirthdays(birthdays);
  };

  const calculateBalance = () => {
    const totalContributions = contributions
      .filter(c => c.confirmed)
      .reduce((sum, c) => sum + c.amount, 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    return totalContributions - totalExpenses;
  };

  const getCurrentMonth = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  };

  const markAsPaid = (memberId) => {
    const month = getCurrentMonth();
    const existing = contributions.find(c => c.memberId === memberId && c.month === month);

    if (existing) return;

    const updated = [...contributions, {
      id: Date.now(),
      memberId,
      month,
      amount: monthlyAmount,
      markedPaid: true,
      confirmed: false,
      markedDate: new Date().toISOString()
    }];
    setContributions(updated);
    saveData('birthday-fund-contributions', updated);
  };

  const confirmPayment = (contributionId) => {
    const updated = contributions.map(c =>
      c.id === contributionId ? { ...c, confirmed: true } : c
    );
    setContributions(updated);
    saveData('birthday-fund-contributions', updated);
  };

  const unconfirmPayment = (contributionId) => {
    const updated = contributions.map(c =>
      c.id === contributionId ? { ...c, confirmed: false } : c
    );
    setContributions(updated);
    saveData('birthday-fund-contributions', updated);
  };

  const addExpense = (expenseData) => {
    const updated = [...expenses, {
      id: Date.now(),
      ...expenseData
    }];
    setExpenses(updated);
    saveData('birthday-fund-expenses', updated);
  };

  const removeExpense = (id) => {
    const updated = expenses.filter(e => e.id !== id);
    setExpenses(updated);
    saveData('birthday-fund-expenses', updated);
  };

  const addMember = (memberData) => {
    const updated = [...members, {
      id: Date.now(),
      ...memberData
    }];
    setMembers(updated);
    saveData('birthday-fund-members', updated);
  };

  const removeMember = (id) => {
    const updated = members.filter(m => m.id !== id);
    setMembers(updated);
    saveData('birthday-fund-members', updated);
  };

  const updateMemberBirthday = (memberId, birthday) => {
    const updated = members.map(m =>
      m.id === memberId ? { ...m, birthday } : m
    );
    setMembers(updated);
    saveData('birthday-fund-members', updated);
  };

  const updateMonthlyAmount = (amount) => {
    setMonthlyAmount(amount);
    saveData('birthday-fund-monthly-amount', amount);
  };

  const updateManagerPassword = (newPassword) => {
    setManagerPassword(newPassword);
    saveData('birthday-fund-manager-password', { value: newPassword });
  };

  if (!currentUser) {
    return (
      <LoginScreen
        members={members}
        onSelectUser={selectUser}
        managerPassword={managerPassword}
      />
    );
  }

  const todaysBirthdays = upcomingBirthdays.filter(b => b.isToday);
  const thisWeekBirthdays = upcomingBirthdays.filter(b => b.isThisWeek && !b.isToday);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        <Header
          currentUser={currentUser}
          balance={calculateBalance()}
          onSwitchUser={() => {
            setCurrentUser('');
            setIsManager(false);
          }}
        />

        <BirthdayReminders
          todaysBirthdays={todaysBirthdays}
          thisWeekBirthdays={thisWeekBirthdays}
        />

        <TabNav
          activeTab={activeTab}
          onTabChange={setActiveTab}
          isManager={isManager}
        />

        {activeTab === 'contributions' && (
          <ContributionsTab
            members={members}
            monthlyAmount={monthlyAmount}
            contributions={contributions}
            isManager={isManager}
            currentUser={currentUser}
            onMarkAsPaid={markAsPaid}
            onConfirmPayment={confirmPayment}
            onUnconfirmPayment={unconfirmPayment}
          />
        )}

        {activeTab === 'birthdays' && (
          <BirthdayCalendar upcomingBirthdays={upcomingBirthdays} />
        )}

        {activeTab === 'expenses' && (
          <ExpensesTab
            expenses={expenses}
            isManager={isManager}
            onAddExpense={addExpense}
            onRemoveExpense={removeExpense}
          />
        )}

        {activeTab === 'settings' && isManager && (
          <SettingsTab
            members={members}
            monthlyAmount={monthlyAmount}
            onUpdateMonthlyAmount={updateMonthlyAmount}
            onAddMember={addMember}
            onRemoveMember={removeMember}
            onUpdateMemberBirthday={updateMemberBirthday}
            managerPassword={managerPassword}
            onUpdateManagerPassword={updateManagerPassword}
          />
        )}
      </div>
    </div>
  );
}

export default App;