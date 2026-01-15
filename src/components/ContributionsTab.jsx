import { Calendar, CheckCircle, XCircle, Users } from 'lucide-react';

export default function ContributionsTab({ 
  members, 
  monthlyAmount, 
  contributions, 
  isManager, 
  currentUser,
  onMarkAsPaid,
  onConfirmPayment,
  onUnconfirmPayment
}) {
  const getCurrentMonth = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  };

  const monthContribs = contributions.filter(c => c.month === getCurrentMonth());
  
  const currentMemberContrib = monthContribs.find(c => {
    const member = members.find(m => m.id === c.memberId);
    return member && member.name === currentUser;
  });

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">
          {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h2>
        <div className="text-right">
          <p className="text-sm text-gray-600">Monthly Amount</p>
          <p className="text-lg font-bold text-purple-600">${monthlyAmount}</p>
        </div>
      </div>

      {!isManager && (
        <div className="mb-6 p-4 bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-800">Your Contribution</p>
              <p className="text-sm text-gray-600">${monthlyAmount} for this month</p>
            </div>
            {currentMemberContrib ? (
              <div className="flex items-center gap-2">
                {currentMemberContrib.confirmed ? (
                  <span className="flex items-center gap-1 text-green-600 font-semibold">
                    <CheckCircle className="w-5 h-5" /> Confirmed
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-yellow-600 font-semibold">
                    <Calendar className="w-5 h-5" /> Pending
                  </span>
                )}
              </div>
            ) : (
              <button
                onClick={() => {
                  const member = members.find(m => m.name === currentUser);
                  if (member) onMarkAsPaid(member.id);
                }}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                Mark as Paid
              </button>
            )}
          </div>
        </div>
      )}

      {isManager && (
        <div className="space-y-3">
          {members.map(member => {
            const contrib = monthContribs.find(c => c.memberId === member.id);
            return (
              <div key={member.id} className="p-4 border border-gray-200 rounded-xl hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-800">{member.name}</p>
                    <p className="text-sm text-gray-600">${monthlyAmount}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {contrib ? (
                      <>
                        {contrib.confirmed ? (
                          <>
                            <span className="flex items-center gap-1 text-green-600 font-semibold">
                              <CheckCircle className="w-5 h-5" /> Confirmed
                            </span>
                            <button
                              onClick={() => onUnconfirmPayment(contrib.id)}
                              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-sm transition-colors"
                            >
                              Unconfirm
                            </button>
                          </>
                        ) : (
                          <>
                            <span className="flex items-center gap-1 text-yellow-600 font-semibold">
                              <Calendar className="w-5 h-5" /> Pending
                            </span>
                            <button
                              onClick={() => onConfirmPayment(contrib.id)}
                              className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
                            >
                              Confirm
                            </button>
                          </>
                        )}
                      </>
                    ) : (
                      <span className="flex items-center gap-1 text-red-600 font-semibold">
                        <XCircle className="w-5 h-5" /> Not Paid
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {members.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p>No members added yet</p>
        </div>
      )}
    </div>
  );
}