import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import { goldOrders, goldLeads, goldDesigns, users } from '../../data/mockData';
import { useMemo, useState } from 'react';
import { getGoldOrders } from '../../services/investmentService';

export default function AdminGoldOrders() {
  const [tab, setTab] = useState<'orders' | 'leads'>('orders');
  const liveOrders = useMemo(() => getGoldOrders(), [tab]);

  const allOrders = useMemo(() => {
    const mappedLive = liveOrders.map(o => ({
      id: o.id,
      userId: o.userId,
      userName: o.userName,
      designName: o.designName,
      weightGrams: o.weightGrams,
      amount: o.amount,
      commission: Math.round(o.amount * 0.03),
      status: o.status,
      createdAt: o.createdAt,
      source: 'live' as const,
    }));
    const mappedMock = goldOrders.map(o => {
      const user = users.find(u => u.id === o.userId);
      const design = goldDesigns.find(d => d.id === o.designId);
      return {
        id: o.id,
        userId: o.userId,
        userName: user?.name || 'Unknown',
        designName: design?.name || 'Unknown',
        weightGrams: design?.weightGrams || 0,
        amount: o.amount,
        commission: o.commission,
        status: o.status,
        createdAt: o.createdAt,
        source: 'demo' as const,
      };
    });
    return [...mappedLive, ...mappedMock];
  }, [liveOrders]);

  const exportCSV = () => {
    const data = tab === 'orders' ? allOrders : goldLeads;
    const csv = tab === 'orders'
      ? 'ID,User,Design,Weight(g),Amount,Commission,Status,Date,Source\n' +
        allOrders.map(o => `${o.id},${o.userName},${o.designName},${o.weightGrams},${o.amount},${o.commission},${o.status},${o.createdAt},${o.source}`).join('\n')
      : 'ID,User ID,Design,Status,Date\n' +
        goldLeads.map((l: any) => `${l.id},${l.userId},${goldDesigns.find(d => d.id === l.designId)?.name},${l.status},${l.createdAt}`).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${tab}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gold Orders & Leads</h1>
          <p className="text-white/50 mt-1">Member gold orders from unlocked investments appear here</p>
        </div>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={exportCSV} className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm hover:bg-white/10">
          <Download className="w-4 h-4" />
          Export CSV
        </motion.button>
      </div>

      <div className="flex gap-2">
        <button onClick={() => setTab('orders')} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${tab === 'orders' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-white/5 text-white/60 border border-white/10'}`}>
          Orders ({allOrders.length})
        </button>
        <button onClick={() => setTab('leads')} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${tab === 'leads' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-white/5 text-white/60 border border-white/10'}`}>
          Leads ({goldLeads.length})
        </button>
      </div>

      {tab === 'orders' ? (
        <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr className="text-left text-xs text-white/50">
                  <th className="px-6 py-4 font-medium">ID</th>
                  <th className="px-6 py-4 font-medium">User</th>
                  <th className="px-6 py-4 font-medium">Design</th>
                  <th className="px-6 py-4 font-medium">Weight</th>
                  <th className="px-6 py-4 font-medium">Amount</th>
                  <th className="px-6 py-4 font-medium">Commission (3%)</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {allOrders.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center text-white/40 text-sm">No gold orders yet</td>
                  </tr>
                )}
                {allOrders.map(o => (
                  <tr key={o.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-sm font-mono">{o.id}</td>
                    <td className="px-6 py-4 text-sm">{o.userName}</td>
                    <td className="px-6 py-4 text-sm">{o.designName}</td>
                    <td className="px-6 py-4 text-sm">{o.weightGrams}g</td>
                    <td className="px-6 py-4 text-sm font-bold">₹{o.amount.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-green-400">₹{o.commission.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        o.status === 'delivered' ? 'bg-green-500/20 text-green-400' :
                        o.status === 'confirmed' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-yellow-500/20 text-yellow-400'
                      }`}>{o.status}</span>
                      {o.source === 'live' && (
                        <span className="ml-2 text-[10px] text-amber-400">LIVE</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm">{o.createdAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr className="text-left text-xs text-white/50">
                  <th className="px-6 py-4 font-medium">ID</th>
                  <th className="px-6 py-4 font-medium">User</th>
                  <th className="px-6 py-4 font-medium">Design</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {goldLeads.map(l => {
                  const user = users.find(u => u.id === l.userId);
                  const design = goldDesigns.find(d => d.id === l.designId);
                  return (
                    <tr key={l.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 text-sm font-mono">{l.id}</td>
                      <td className="px-6 py-4 text-sm">{user?.name || 'Unknown'}</td>
                      <td className="px-6 py-4 text-sm">{design?.name || 'Unknown'}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          l.status === 'new' ? 'bg-blue-500/20 text-blue-400' :
                          l.status === 'contacted' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-green-500/20 text-green-400'
                        }`}>{l.status}</span>
                      </td>
                      <td className="px-6 py-4 text-sm">{l.createdAt}</td>
                      <td className="px-6 py-4">
                        <button className="px-3 py-1.5 bg-amber-500/20 text-amber-400 rounded-lg text-xs font-medium hover:bg-amber-500/30 transition-colors">
                          Update Status
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
