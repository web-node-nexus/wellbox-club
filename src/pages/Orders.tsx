import { motion } from 'framer-motion';
import { ShoppingBag, Package, Clock, CheckCircle, Eye, X, Download, Loader2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import {
  fetchGoldOrders,
  getUserGoldOrders,
  type GoldOrderRecord,
} from '../services/investmentService';

type OrderRow = {
  id: string;
  design: string;
  weight: string;
  status: string;
  date: string;
  amount: number;
  trackingId: string;
};

function toRow(o: GoldOrderRecord): OrderRow {
  return {
    id: o.id,
    design: o.designName,
    weight: `${o.weightGrams}g`,
    status: o.status === 'confirmed' ? 'confirmed' : o.status === 'delivered' ? 'delivered' : 'processing',
    date: (o.createdAt || '').slice(0, 10),
    amount: Number(o.amount) || 0,
    trackingId: o.id,
  };
}

export default function Orders() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [viewingOrder, setViewingOrder] = useState<OrderRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        await fetchGoldOrders();
      } catch {
        /* cache may still have data */
      } finally {
        if (!cancelled) {
          setTick(t => t + 1);
          setLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  const orders = useMemo(() => {
    void tick;
    if (!user?.id) return [];
    return getUserGoldOrders(user.id).map(toRow);
  }, [user?.id, tick]);

  const stats = {
    total: orders.length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    processing: orders.filter(o => o.status === 'processing' || o.status === 'confirmed').length,
    totalValue: orders.reduce((sum, o) => sum + o.amount, 0),
  };

  const exportCSV = () => {
    if (orders.length === 0) {
      showToast('error', 'No orders to export', 'Export');
      return;
    }
    const csv =
      'ID,Design,Weight,Amount,Status,Date,Tracking ID\n' +
      orders
        .map(o => `${o.id},"${o.design}","${o.weight}",${o.amount},${o.status},${o.date},${o.trackingId}`)
        .join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'orders.csv';
    a.click();
    showToast('success', 'Orders exported successfully', 'Export');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-700';
      case 'confirmed':
        return 'bg-blue-100 text-blue-700';
      case 'processing':
        return 'bg-yellow-100 text-yellow-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="w-3 h-3" />;
      case 'confirmed':
        return <Package className="w-3 h-3" />;
      case 'processing':
        return <Clock className="w-3 h-3" />;
      case 'cancelled':
        return <X className="w-3 h-3" />;
      default:
        return <Clock className="w-3 h-3" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-500 mt-1">Track your gold purchases</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={exportCSV}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm hover:bg-gray-50 transition-colors"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </motion.button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-sm text-gray-500">Total Orders</p>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.delivered}</p>
              <p className="text-sm text-gray-500">Delivered</p>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.processing}</p>
              <p className="text-sm text-gray-500">Processing</p>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <Package className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                ₹{(stats.totalValue / 1000).toFixed(0)}K
              </p>
              <p className="text-sm text-gray-500">Total Value</p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Order History</h3>
        </div>
        {loading ? (
          <div className="flex justify-center py-16 text-gray-400">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 mb-3">No gold orders yet</p>
            <Link
              to="/gold-showroom"
              className="inline-flex px-4 py-2 rounded-xl bg-amber-500 text-white text-sm font-semibold"
            >
              Browse Gold Showroom
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {orders.map(order => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500/20 to-purple-500/20 rounded-xl flex items-center justify-center">
                  <Package className="w-6 h-6 text-amber-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{order.design}</p>
                  <p className="text-sm text-gray-500">
                    {order.weight} • {order.date}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Order ID: {order.trackingId}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">₹{order.amount.toLocaleString()}</p>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium mt-1 ${getStatusColor(order.status)}`}
                  >
                    {getStatusIcon(order.status)}
                    {order.status}
                  </span>
                </div>
                <button
                  onClick={() => setViewingOrder(order)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="View Details"
                >
                  <Eye className="w-5 h-5 text-gray-400" />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {viewingOrder && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={() => setViewingOrder(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Order Details</h3>
              <button
                type="button"
                onClick={() => setViewingOrder(null)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <p>
                <span className="text-gray-500">Design:</span>{' '}
                <span className="font-medium">{viewingOrder.design}</span>
              </p>
              <p>
                <span className="text-gray-500">Weight:</span>{' '}
                <span className="font-medium">{viewingOrder.weight}</span>
              </p>
              <p>
                <span className="text-gray-500">Amount:</span>{' '}
                <span className="font-medium">₹{viewingOrder.amount.toLocaleString()}</span>
              </p>
              <p>
                <span className="text-gray-500">Status:</span>{' '}
                <span className="font-medium">{viewingOrder.status}</span>
              </p>
              <p>
                <span className="text-gray-500">Date:</span>{' '}
                <span className="font-medium">{viewingOrder.date}</span>
              </p>
              <p>
                <span className="text-gray-500">Order ID:</span>{' '}
                <span className="font-medium">{viewingOrder.trackingId}</span>
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
