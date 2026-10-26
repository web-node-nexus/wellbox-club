import { motion } from 'framer-motion';
import { BarChart3, Download, FileText } from 'lucide-react';
import { users, contributions, walletTransactions, withdrawals } from '../../data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export default function AdminReports() {
  const monthlyData = [
    { month: 'Jan', members: 120, contributions: 45000, commissions: 12000 },
    { month: 'Feb', members: 180, contributions: 62000, commissions: 18500 },
    { month: 'Mar', members: 250, contributions: 78000, commissions: 24000 },
    { month: 'Apr', members: 320, contributions: 95000, commissions: 31000 },
    { month: 'May', members: 410, contributions: 115000, commissions: 38500 },
    { month: 'Jun', members: 520, contributions: 142000, commissions: 47000 },
  ];

  const exportReport = (type: string) => {
    let csv = '';
    switch (type) {
      case 'members':
        csv = 'ID,Name,Email,Team Size,Leader,Join Date\n' + users.map(u => `${u.id},"${u.name}","${u.email}",${u.teamSize},${u.isLeader},${u.joinDate}`).join('\n');
        break;
      case 'contributions':
        csv = 'ID,User ID,Amount,Date,Status\n' + contributions.map(c => `${c.id},${c.userId},${c.amount},${c.date},${c.status}`).join('\n');
        break;
      case 'commissions':
        csv = 'ID,User ID,Type,Amount,Date\n' + walletTransactions.filter(t => t.type.includes('commission')).map(t => `${t.id},${t.userId},${t.type},${t.amount},${t.createdAt}`).join('\n');
        break;
      case 'withdrawals':
        csv = 'ID,User ID,Amount,Status,Date\n' + withdrawals.map(w => `${w.id},${w.userId},${w.amount},${w.status},${w.createdAt}`).join('\n');
        break;
    }
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}-report.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Reports & Analytics</h1>
        <p className="text-white/50 mt-1">Generate and export comprehensive reports</p>
      </div>

      {/* Export Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Members Report', icon: '👥', type: 'members' },
          { label: 'Contributions Report', icon: '💰', type: 'contributions' },
          { label: 'Commissions Report', icon: '💵', type: 'commissions' },
          { label: 'Withdrawals Report', icon: '🏦', type: 'withdrawals' },
        ].map((report, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-5 hover:border-amber-500/20 transition-all cursor-pointer"
            onClick={() => exportReport(report.type)}
          >
            <div className="text-3xl mb-2">{report.icon}</div>
            <p className="font-medium text-sm">{report.label}</p>
            <div className="flex items-center gap-1 mt-2 text-xs text-amber-400">
              <Download className="w-3 h-3" />
              <span>Export CSV</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6">
          <h3 className="font-semibold mb-4">Monthly Growth</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" style={{ fontSize: '12px' }} />
              <YAxis stroke="rgba(255,255,255,0.5)" style={{ fontSize: '12px' }} />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,215,0,0.2)', borderRadius: '12px' }} />
              <Bar dataKey="members" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6">
          <h3 className="font-semibold mb-4">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" style={{ fontSize: '12px' }} />
              <YAxis stroke="rgba(255,255,255,0.5)" style={{ fontSize: '12px' }} />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,215,0,0.2)', borderRadius: '12px' }} />
              <Line type="monotone" dataKey="contributions" stroke="#10b981" strokeWidth={3} />
              <Line type="monotone" dataKey="commissions" stroke="#f59e0b" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
}
