import { motion } from 'framer-motion';
import { Crown, Play, Calendar } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '../../context/ToastContext';

export default function AdminLeaderPayouts() {
  const { showToast } = useToast();
  const [running, setRunning] = useState(false);

  const handleRunPayout = () => {
    setRunning(true);
    setTimeout(() => {
      setRunning(false);
      showToast('success', 'Leader payouts processed successfully', 'Success');
    }, 2000);
  };

  const payoutHistory = [
    { month: 'June 2024', date: '2024-06-03', leaders: 5, totalAmount: 45000, status: 'completed' },
    { month: 'May 2024', date: '2024-05-03', leaders: 4, totalAmount: 38000, status: 'completed' },
    { month: 'April 2024', date: '2024-04-03', leaders: 4, totalAmount: 35000, status: 'completed' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Leader Payouts</h1>
        <p className="text-white/50 mt-1">Manage monthly leader payouts (3rd of every month)</p>
      </div>

      {/* Next Payout */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-r from-amber-500/20 to-purple-500/20 border border-amber-500/20 rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-white/60">Next Payout Date</p>
            <p className="text-2xl font-bold gradient-text mt-1">July 3, 2024</p>
            <p className="text-sm text-white/50 mt-2">Automatically runs at 10:00 AM via cron job</p>
          </div>
          <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-yellow-600 rounded-full flex items-center justify-center">
            <Crown className="w-8 h-8 text-purple-900" />
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleRunPayout}
          disabled={running}
          className="mt-4 flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-purple-900 font-bold rounded-xl shadow-lg shadow-amber-500/30 disabled:opacity-50"
        >
          <Play className="w-5 h-5" />
          {running ? 'Processing...' : 'Run Manual Payout'}
        </motion.button>
      </motion.div>

      {/* Payout History */}
      <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6">
        <h3 className="font-semibold mb-4">Payout History</h3>
        <div className="space-y-3">
          {payoutHistory.map((payout, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
              <div className="flex items-center gap-4">
                <Calendar className="w-5 h-5 text-amber-400" />
                <div>
                  <p className="font-medium">{payout.month}</p>
                  <p className="text-xs text-white/50">{payout.date} • {payout.leaders} leaders</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-green-400">₹{payout.totalAmount.toLocaleString()}</p>
                <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded-full">{payout.status}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
