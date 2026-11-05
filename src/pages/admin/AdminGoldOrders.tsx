import { motion } from 'framer-motion';
import { Download, RefreshCw } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { fetchGoldOrders, getGoldOrders, type GoldOrderRecord } from '../../services/investmentService';

export default function AdminGoldOrders() {
  const [orders, setOrders] = useState<GoldOrderRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const list = await fetchGoldOrders();
      setOrders(list);
    } catch {
      setOrders(getGoldOrders());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const rows = useMemo(
    () =>
      orders.map(o => {
        const fromId = (o.designId || '').toUpperCase().match(/(\d+)\s*K/);
        const fromName = (o.designName || '').toUpperCase().match(/(\d+)\s*K/);
        const carat = fromId ? `${fromId[1]}K` : fromName ? `${fromName[1]}K` : '—';
        return {
          ...o,
          carat,
          isDirect: o.userId.startsWith('guest_') || o.designName.includes('Direct Order'),
        };
      }),
    [orders]
  );

  const exportCSV = () => {
    const csv =
      'ID,Name,Mobile,Carat,Weight(g),Product,Amount,Status,Date,Type\n' +
      rows
        .map(
          o =>
            `${o.id},${o.userName},${o.userMobile},${o.carat},${o.weightGrams},${o.designName},${o.amount},${o.status},${o.createdAt},${o.isDirect ? 'direct' : 'member'}`
        )
        .join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'gold-orders.csv';
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold">Gold Orders</h1>
          <p className="text-white/50 mt-1">
            Direct website orders (carat + grams) and member showroom orders
          </p>
        </div>
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => void load()}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm hover:bg-white/10"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm hover:bg-white/10"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </motion.button>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <p className="text-2xl font-bold">{rows.length}</p>
          <p className="text-sm text-white/50">Total Orders</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <p className="text-2xl font-bold">{rows.filter(r => r.isDirect).length}</p>
          <p className="text-sm text-white/50">Direct (Order Gold)</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <p className="text-2xl font-bold">{rows.filter(r => r.status === 'pending').length}</p>
          <p className="text-sm text-white/50">Pending</p>
        </div>
      </div>

      <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr className="text-left text-xs text-white/50">
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Mobile</th>
                <th className="px-6 py-4 font-medium">Carat</th>
                <th className="px-6 py-4 font-medium">Grams</th>
                <th className="px-6 py-4 font-medium">Product</th>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading && (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-white/40 text-sm">
                    Loading orders...
                  </td>
                </tr>
              )}
              {!loading && rows.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-white/40 text-sm">
                    No gold orders yet
                  </td>
                </tr>
              )}
              {!loading &&
                rows.map(o => (
                  <tr key={o.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium">{o.userName}</td>
                    <td className="px-6 py-4 text-sm font-mono">{o.userMobile}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-amber-300">{o.carat}</td>
                    <td className="px-6 py-4 text-sm">{o.weightGrams}g</td>
                    <td className="px-6 py-4 text-sm">{o.designName}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          o.isDirect
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-blue-500/20 text-blue-300'
                        }`}
                      >
                        {o.isDirect ? 'Direct Order' : 'Member'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          o.status === 'delivered'
                            ? 'bg-green-500/20 text-green-400'
                            : o.status === 'confirmed'
                              ? 'bg-blue-500/20 text-blue-400'
                              : 'bg-yellow-500/20 text-yellow-400'
                        }`}
                      >
                        {o.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">{o.createdAt}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
