import { motion } from 'framer-motion';
import { Search, Filter, Eye, Crown, UserX, UserCheck, Download } from 'lucide-react';
import { users } from '../../data/mockData';
import { useState } from 'react';

export default function AdminUsers() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || 
                         u.email.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || 
                         (filter === 'leaders' && u.isLeader) ||
                         (filter === 'members' && !u.isLeader);
    return matchesSearch && matchesFilter;
  });

  const exportCSV = () => {
    const csv = 'ID,Name,Email,Phone,Referral Code,Team Size,Leader,Join Date\n' +
      filteredUsers.map(u => `${u.id},"${u.name}","${u.email}","${u.phone}","${u.referralCode}",${u.teamSize},${u.isLeader},${u.joinDate}`).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'users.csv';
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Users Management</h1>
          <p className="text-white/50 mt-1">Manage all platform users</p>
        </div>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={exportCSV} className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm hover:bg-white/10 transition-colors">
          <Download className="w-4 h-4" />
          Export CSV
        </motion.button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search users..."
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm focus:border-amber-500/50"
          />
        </div>
        <select value={filter} onChange={e => setFilter(e.target.value)} className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm focus:border-amber-500/50">
          <option value="all">All Users</option>
          <option value="leaders">Leaders Only</option>
          <option value="members">Members Only</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr className="text-left text-xs text-white/50">
                <th className="px-6 py-4 font-medium">User</th>
                <th className="px-6 py-4 font-medium">Email</th>
                <th className="px-6 py-4 font-medium">Phone</th>
                <th className="px-6 py-4 font-medium">Referral Code</th>
                <th className="px-6 py-4 font-medium">Team Size</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredUsers.map(user => (
                <tr key={user.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                        user.isLeader ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-purple-900' : 'bg-white/10 text-white/60'
                      }`}>
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{user.name}</p>
                        <p className="text-xs text-white/50">Joined {user.joinDate}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">{user.email}</td>
                  <td className="px-6 py-4 text-sm">{user.phone}</td>
                  <td className="px-6 py-4 text-sm font-mono">{user.referralCode}</td>
                  <td className="px-6 py-4 text-sm">{user.teamSize}</td>
                  <td className="px-6 py-4">
                    {user.isLeader ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-500/20 text-amber-400 text-xs font-medium rounded-full">
                        <Crown className="w-3 h-3" /> Leader
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 bg-white/10 text-white/60 text-xs font-medium rounded-full">Member</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-1.5 hover:bg-white/10 rounded-lg transition-colors" title="View">
                        <Eye className="w-4 h-4" />
                      </button>
                      {!user.isLeader && (
                        <button className="p-1.5 hover:bg-amber-500/20 rounded-lg transition-colors text-amber-400" title="Promote to Leader">
                          <Crown className="w-4 h-4" />
                        </button>
                      )}
                      <button className="p-1.5 hover:bg-red-500/20 rounded-lg transition-colors text-red-400" title="Block User">
                        <UserX className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
