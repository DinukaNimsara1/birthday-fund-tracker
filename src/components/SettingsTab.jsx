import { useState } from 'react';
import { Plus, Trash2, Cake, Lock } from 'lucide-react';

export default function SettingsTab({
  members,
  monthlyAmount,
  onUpdateMonthlyAmount,
  onAddMember,
  onRemoveMember,
  onAddMember,
  onRemoveMember,
  onUpdateMemberBirthday,
  managerPassword,
  onUpdateManagerPassword
}) {
  const [showAddMember, setShowAddMember] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberBirthday, setNewMemberBirthday] = useState('');
  const [tempMonthlyAmount, setTempMonthlyAmount] = useState(monthlyAmount);
  const [newPassword, setNewPassword] = useState('');

  const handleChangePassword = () => {
    if (newPassword.trim()) {
      onUpdateManagerPassword(newPassword.trim());
      setNewPassword('');
      alert('Password updated successfully');
    }
  };

  const handleAddMember = () => {
    if (!newMemberName.trim()) return;

    onAddMember({
      name: newMemberName.trim(),
      birthday: newMemberBirthday || null
    });

    setNewMemberName('');
    setNewMemberBirthday('');
    setShowAddMember(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Settings</h2>

      <div className="mb-8 p-4 bg-gray-50 rounded-xl">
        <h3 className="font-semibold mb-3">Monthly Contribution Amount</h3>
        <div className="flex gap-2">
          <input
            type="number"
            value={tempMonthlyAmount}
            onChange={(e) => setTempMonthlyAmount(parseFloat(e.target.value) || 0)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
          />
          <button
            onClick={() => onUpdateMonthlyAmount(tempMonthlyAmount)}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            Save
          </button>
        </div>
      </div>

      <div className="mb-8 p-4 bg-gray-50 rounded-xl">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Lock className="w-4 h-4" /> Manager Password
        </h3>
        <div className="flex gap-2">
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New Password"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
          />
          <button
            onClick={handleChangePassword}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            Update
          </button>
        </div>
      </div>

      <div className="p-4 bg-gray-50 rounded-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Members & Birthdays</h3>
          <button
            onClick={() => setShowAddMember(true)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" /> Add Member
          </button>
        </div>

        {showAddMember && (
          <div className="mb-4 p-3 bg-white rounded-lg">
            <h4 className="text-sm font-semibold mb-2">Add New Member</h4>
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Member name"
                value={newMemberName}
                onChange={(e) => setNewMemberName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              />
              <input
                type="text"
                placeholder="Birthday (MM-DD, e.g., 03-15)"
                value={newMemberBirthday}
                onChange={(e) => setNewMemberBirthday(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleAddMember}
                  className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                  Add
                </button>
                <button
                  onClick={() => {
                    setShowAddMember(false);
                    setNewMemberName('');
                    setNewMemberBirthday('');
                  }}
                  className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-2">
          {members.map(member => (
            <div key={member.id} className="p-3 bg-white rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-800">{member.name}</span>
                <button
                  onClick={() => onRemoveMember(member.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <Cake className="w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Birthday (MM-DD)"
                  value={member.birthday || ''}
                  onChange={(e) => onUpdateMemberBirthday(member.id, e.target.value)}
                  className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}