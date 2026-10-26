import { motion } from 'framer-motion';
import { Activity, Download, Filter } from 'lucide-react';
import { auditLogs, users } from '../../data/mockData';
import { useState } from 'react';

export default function AdminAuditLogs() {
  const [filter, setFilter] = useState('all');

  const filteredLogs = auditLogs.filter(log => {
    if (filter === 'all') return true;
    return log.action.toLowerCase().includes(filter.toLowerCase());
  });

  const exportCSV = () => {
    const csv = 'ID,User ID,Action,Details,IP Address,Timestamp\n' +
      filteredLogs.map(log => `${log.id},${log.userId},"${log.action}","${log.details}","${log.ipAddress}","${log.timestamp}"`).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'audit-logs.csv';
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Audit Logs</h1>
          <p className="text-white/50 mt-1">Track all admin activities</p>
        </div>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={exportCSV} className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm hover:bg-white/10">
          <Download className="w-4 h-4" />
          Export CSV
        </motion.button>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-3">
        <Filter className="w-4 h-4 text-white/40" />
        <select value={filter} onChange={e => setFilter(e.target.value)} className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm">
          <option value="all">All Actions</option>
          <option value="login">Login</option>
          <option value="withdrawal">Withdrawals</option>
          <option value="settings">Settings</option>
          <option value="gold">Gold</option>
          <option value="leader">Leader</option>
        </select>
      </div>

      {/* Logs Table */}
      <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr className="text-left text-xs text-white/50">
                <th className="px-6 py-4 font-medium">Timestamp</th>
                <th className="px-6 py-4 font-medium">User</th>
                <th className="px-6 py-4 font-medium">Action</th>
                <th className="px-6 py-4 font-medium">Details</th>
                <th className="px-6 py-4 font-medium">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredLogs.map(log => {
                const user = users.find(u => u.id === log.userId);
                return (
                  <tr key={log.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-sm font-mono">{log.timestamp}</td>
                    <td className="px-6 py-4 text-sm">{user?.name || 'Unknown'}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 bg-amber-500/20 text-amber-400 text-xs font-medium rounded-full">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-white/70">{log.details}</td>
                    <td className="px-6 py-4 text-sm font-mono text-white/50">{log.ipAddress}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
