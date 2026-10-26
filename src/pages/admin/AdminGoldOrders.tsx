import { motion } from 'framer-motion';
import { ShoppingBag, Download } from 'lucide-react';
import { goldOrders, goldLeads, goldDesigns, users } from '../../data/mockData';
import { useState } from 'react';

export default function AdminGoldOrders() {
  const [tab, setTab] = useState<'orders' | 'leads'>('orders');

  const exportCSV = () => {
    const data = tab === 'orders' ? goldOrders : goldLeads;
    const csv = tab === 'orders'
      ? 'ID,User ID,Design,Amount,Commission,Status,Date\n' + data.map((o: any) => `${o.id},${o.userId},${goldDesigns.find(d => d.id === o.designId)?.name},${o.amount},${o.commission},${o.status},${o.createdAt}`).join('\n')
      : 'ID,User ID,Design,Status,Date\n' + data.map((l: any) => `${l.id},${l.userId},${goldDesigns.find(d => d.id === l.designId)?.name},${l.status},${l.createdAt}`).join('\n');
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
          <p className="text-white/50 mt-1">Manage gold orders and customer leads</p>
        </div>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={exportCSV} className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm hover:bg-white/10">
          <Download className="w-4 h-4" />
          Export CSV
        </motion.button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button onClick={() => setTab('orders')} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${tab === 'orders' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-white/5 text-white/60 border border-white/10'}`}>
          Orders ({goldOrders.length})
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
                  <th className="px-6 py-4 font-medium">Amount</th>
                  <th className="px-6 py-4 font-medium">Commission (3%)</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {goldOrders.map(o => {
                  const user = users.find(u => u.id === o.userId);
                  const design = goldDesigns.find(d => d.id === o.designId);
                  return (
                    <tr key={o.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 text-sm font-mono">{o.id}</td>
                      <td className="px-6 py-4 text-sm">{user?.name || 'Unknown'}</td>
                      <td className="px-6 py-4 text-sm">{design?.name || 'Unknown'}</td>
                      <td className="px-6 py-4 text-sm font-bold">₹{o.amount.toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm text-green-400">₹{o.commission.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          o.status === 'delivered' ? 'bg-green-500/20 text-green-400' :
                          o.status === 'confirmed' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-yellow-500/20 text-yellow-400'
                        }`}>{o.status}</span>
                      </td>
                      <td className="px-6 py-4 text-sm">{o.createdAt}</td>
                    </tr>
                  );
                })}
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
