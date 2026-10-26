import { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { Settings, Users, Wallet, Gem, Crown, CheckCircle, XCircle, Save, TrendingUp, DollarSign, AlertTriangle } from 'lucide-react';
import { users, walletTransactions, withdrawals, goldLeads, goldDesigns, contributions } from '../data/mockData';

type AdminTab = 'overview' | 'settings' | 'users' | 'withdrawals' | 'gold' | 'leaders';

export default function Admin() {
  const { settings, updateSettings } = useApp();
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [settingsForm, setSettingsForm] = useState(settings);
  const [saved, setSaved] = useState(false);

  const pendingWithdrawals = withdrawals.filter(w => w.status === 'pending');
  const totalCommissions = walletTransactions.filter(t => t.type.includes('commission') || t.type === 'leader_payout' || t.type === 'gold_order_commission').reduce((s, t) => s + t.amount, 0);
  const totalContributions = contributions.reduce((s, c) => s + c.amount, 0);
  const leaders = users.filter(u => u.isLeader);

  const handleSaveSettings = () => {
    updateSettings(settingsForm);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const tabs = [
    { id: 'overview' as AdminTab, label: 'Overview', icon: TrendingUp },
    { id: 'settings' as AdminTab, label: 'Settings', icon: Settings },
    { id: 'users' as AdminTab, label: 'Users', icon: Users },
    { id: 'withdrawals' as AdminTab, label: 'Withdrawals', icon: Wallet },
    { id: 'gold' as AdminTab, label: 'Gold', icon: Gem },
    { id: 'leaders' as AdminTab, label: 'Leaders', icon: Crown },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Admin Panel</h1>
        <p className="text-gray-500 mt-1">Manage platform settings, users, and operations</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-amber-100 text-amber-700 border border-amber-200'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-amber-200'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview */}
      {activeTab === 'overview' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                  <p className="text-sm text-gray-500">Total Members</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">₹{totalCommissions.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">Total Commissions</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">₹{totalContributions.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">Total Contributions</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                  <Crown className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{leaders.length}</p>
                  <p className="text-sm text-gray-500">Active Leaders</p>
                </div>
              </div>
            </div>
          </div>

          {/* Pending Actions */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">Pending Actions</h3>
            <div className="space-y-3">
              {pendingWithdrawals.length > 0 ? (
                pendingWithdrawals.map(w => (
                  <div key={w.id} className="flex items-center justify-between p-4 bg-yellow-50 rounded-xl border border-yellow-100">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="w-5 h-5 text-yellow-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Withdrawal Request - ₹{w.amount.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">User ID: {w.userId} • {w.createdAt}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-3 py-1.5 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700">Approve</button>
                      <button className="px-3 py-1.5 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700">Reject</button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">No pending actions</p>
              )}
            </div>
          </div>

          {/* Cron Info */}
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-6 text-white">
            <h3 className="font-semibold mb-2">⚙️ Scheduled Tasks</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Leader Payout: Runs on 3rd of every month at 10:00 AM</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Auto Leader Promotion: Checks team size ≥ 100 members daily</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Contribution Unlock: Checks for expired lock periods hourly</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Settings */}
      {activeTab === 'settings' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-6">Commission Settings</h3>
            {saved && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <p className="text-sm text-green-700">Settings saved successfully!</p>
              </motion.div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Level 1 Commission (%)</label>
                <p className="text-xs text-gray-500 mb-2">Commission on direct referral's contribution</p>
                <input
                  type="number"
                  value={settingsForm.level1Commission}
                  onChange={e => setSettingsForm(prev => ({ ...prev, level1Commission: Number(e.target.value) }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Level 2 Commission (%)</label>
                <p className="text-xs text-gray-500 mb-2">Commission on referral of referral's contribution</p>
                <input
                  type="number"
                  value={settingsForm.level2Commission}
                  onChange={e => setSettingsForm(prev => ({ ...prev, level2Commission: Number(e.target.value) }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Leader Commission (%)</label>
                <p className="text-xs text-gray-500 mb-2">Monthly payout on team's total income</p>
                <input
                  type="number"
                  value={settingsForm.leaderCommission}
                  onChange={e => setSettingsForm(prev => ({ ...prev, leaderCommission: Number(e.target.value) }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gold Order Commission (%)</label>
                <p className="text-xs text-gray-500 mb-2">Commission on referred gold orders</p>
                <input
                  type="number"
                  value={settingsForm.goldOrderCommission}
                  onChange={e => setSettingsForm(prev => ({ ...prev, goldOrderCommission: Number(e.target.value) }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Lock Period (Months)</label>
                <p className="text-xs text-gray-500 mb-2">Contribution lock period before withdrawal</p>
                <input
                  type="number"
                  value={settingsForm.lockPeriodMonths}
                  onChange={e => setSettingsForm(prev => ({ ...prev, lockPeriodMonths: Number(e.target.value) }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
            <button
              onClick={handleSaveSettings}
              className="mt-6 flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-medium rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all shadow-lg shadow-amber-200"
            >
              <Save className="w-4 h-4" />
              Save Settings
            </button>
          </div>
        </motion.div>
      )}

      {/* Users */}
      {activeTab === 'users' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">All Users ({users.length})</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr className="text-left text-xs text-gray-500">
                    <th className="px-6 py-3 font-medium">User</th>
                    <th className="px-6 py-3 font-medium">Email</th>
                    <th className="px-6 py-3 font-medium">Referral Code</th>
                    <th className="px-6 py-3 font-medium">Team Size</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                    <th className="px-6 py-3 font-medium">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {users.map(u => (
                    <tr key={u.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            u.isLeader ? 'bg-gradient-to-br from-yellow-400 to-amber-500 text-white' : 'bg-gray-200 text-gray-600'
                          }`}>{u.name.charAt(0)}</div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{u.name}</p>
                            <p className="text-xs text-gray-500">{u.phone}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{u.email}</td>
                      <td className="px-6 py-4 text-sm font-mono text-gray-600">{u.referralCode}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">{u.teamSize}</td>
                      <td className="px-6 py-4">
                        {u.isLeader ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
                            <Crown className="w-3 h-3" /> Leader
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">Member</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{u.joinDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}

      {/* Withdrawals */}
      {activeTab === 'withdrawals' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">Withdrawal Requests</h3>
            </div>
            <div className="divide-y divide-gray-50">
              {withdrawals.map(w => (
                <div key={w.id} className="flex items-center justify-between p-4 hover:bg-gray-50">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      w.status === 'approved' ? 'bg-green-100' : w.status === 'pending' ? 'bg-yellow-100' : 'bg-red-100'
                    }`}>
                      <Wallet className={`w-5 h-5 ${
                        w.status === 'approved' ? 'text-green-600' : w.status === 'pending' ? 'text-yellow-600' : 'text-red-600'
                      }`} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">₹{w.amount.toLocaleString()}</p>
                      <p className="text-sm text-gray-500">User: {w.userId} • {w.createdAt}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      w.status === 'approved' ? 'bg-green-100 text-green-700' :
                      w.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {w.status}
                    </span>
                    {w.status === 'pending' && (
                      <div className="flex gap-1">
                        <button className="p-1.5 bg-green-100 text-green-600 rounded-lg hover:bg-green-200">
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200">
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Gold */}
      {activeTab === 'gold' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Gold Designs ({goldDesigns.length})</h3>
              <button className="px-4 py-2 bg-amber-600 text-white text-sm font-medium rounded-xl hover:bg-amber-700">+ Add Design</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr className="text-left text-xs text-gray-500">
                    <th className="px-4 py-3 font-medium">Name</th>
                    <th className="px-4 py-3 font-medium">Category</th>
                    <th className="px-4 py-3 font-medium">Weight</th>
                    <th className="px-4 py-3 font-medium">Purity</th>
                    <th className="px-4 py-3 font-medium">Making</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {goldDesigns.map(d => (
                    <tr key={d.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{d.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{d.category}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{d.weightGrams}g</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{d.purity}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{d.makingCharges}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Leads */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">Gold Leads ({goldLeads.length})</h3>
            <div className="space-y-3">
              {goldLeads.map(l => (
                <div key={l.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Lead #{l.id} - User {l.userId}</p>
                    <p className="text-xs text-gray-500">Design: {goldDesigns.find(d => d.id === l.designId)?.name} • {l.createdAt}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    l.status === 'new' ? 'bg-blue-100 text-blue-700' :
                    l.status === 'contacted' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>{l.status}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Leaders */}
      {activeTab === 'leaders' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">Leaders ({leaders.length})</h3>
              <p className="text-sm text-gray-500 mt-1">Members with 100+ team members automatically become leaders. Admin can also manually promote.</p>
            </div>
            <div className="divide-y divide-gray-50">
              {leaders.map(l => (
                <div key={l.id} className="flex items-center justify-between p-4 hover:bg-gray-50">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {l.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900">{l.name}</p>
                        <Crown className="w-4 h-4 text-amber-500" />
                      </div>
                      <p className="text-sm text-gray-500">{l.email} • Team: {l.teamSize} members</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-green-600">
                      ₹{walletTransactions.filter(t => t.userId === l.id && t.type === 'leader_payout').reduce((s, t) => s + t.amount, 0).toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">Total Leader Earnings</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Promote to Leader */}
          <div className="mt-6 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">Manual Promotion</h3>
            <p className="text-sm text-gray-500 mb-4">Promote a member to Leader status manually</p>
            <div className="flex gap-3">
              <select className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500">
                <option value="">Select user to promote...</option>
                {users.filter(u => !u.isLeader).map(u => (
                  <option key={u.id} value={u.id}>{u.name} (Team: {u.teamSize})</option>
                ))}
              </select>
              <button className="px-6 py-3 bg-amber-600 text-white font-medium rounded-xl hover:bg-amber-700 transition-colors">
                Promote
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
