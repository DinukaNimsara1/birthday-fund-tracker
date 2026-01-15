import { Gift } from 'lucide-react';

export default function LoginScreen({ members, onSelectUser }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="max-w-md mx-auto mt-20">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-center mb-6">
            <Gift className="w-12 h-12 text-purple-600" />
          </div>
          <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">Birthday Fund</h1>
          <p className="text-center text-gray-600 mb-8">Select your profile to continue</p>
          
          <div className="space-y-3">
            {members.map(member => (
              <button
                key={member.id}
                onClick={() => onSelectUser(member.name, false)}
                className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all transform hover:scale-105"
              >
                {member.name}
              </button>
            ))}
            <button
              onClick={() => onSelectUser('Manager', true)}
              className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all transform hover:scale-105 font-semibold"
            >
              🔑 Manager Access
            </button>
          </div>

          {members.length === 0 && (
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800 text-center">
                No members yet. Login as Manager to add members.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}