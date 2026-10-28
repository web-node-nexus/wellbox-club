import { motion } from 'framer-motion';
import { ShoppingBag, Package, Clock, CheckCircle, Eye, X, Download, Truck } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '../context/ToastContext';

export default function Orders() {
  const { showToast } = useToast();
  const [viewingOrder, setViewingOrder] = useState<any>(null);
  
  const orders = [
    { id: 'o1', design: 'Royal Necklace Set', weight: '45.5g', status: 'confirmed', date: '2024-06-15', amount: 285000, trackingId: 'JWL20240615001' },
    { id: 'o2', design: 'Gold Coin 10g', weight: '10g', status: 'delivered', date: '2024-05-20', amount: 62500, trackingId: 'JWL20240520002' },
    { id: 'o3', design: 'Diamond Ring', weight: '4.8g', status: 'processing', date: '2024-06-20', amount: 30000, trackingId: 'JWL20240620003' },
  ];

  const stats = {
    total: orders.length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    processing: orders.filter(o => o.status === 'processing' || o.status === 'confirmed').length,
    totalValue: orders.reduce((sum, o) => sum + o.amount, 0),
  };

  const exportCSV = () => {
    const csv = 'ID,Design,Weight,Amount,Status,Date,Tracking ID\n' +
      orders.map(o => `${o.id},"${o.design}","${o.weight}",${o.amount},${o.status},${o.date},${o.trackingId}`).join('\n');
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
      case 'delivered': return 'bg-green-100 text-green-700';
      case 'confirmed': return 'bg-blue-100 text-blue-700';
      case 'processing': return 'bg-yellow-100 text-yellow-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <CheckCircle className="w-3 h-3" />;
      case 'confirmed': return <Package className="w-3 h-3" />;
      case 'processing': return <Clock className="w-3 h-3" />;
      case 'cancelled': return <X className="w-3 h-3" />;
      default: return <Clock className="w-3 h-3" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">My Orders</h1>
          <p className="text-white/50 mt-1">Track your gold purchases</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={exportCSV}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm hover:bg-white/10 transition-colors"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </motion.button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
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
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
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
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
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
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <Package className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">₹{(stats.totalValue / 1000).toFixed(0)}K</p>
              <p className="text-sm text-gray-500">Total Value</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Orders List */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Order History</h3>
        </div>
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No orders yet</p>
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
                  <p className="text-sm text-gray-500">{order.weight} • {order.date}</p>
                  <p className="text-xs text-gray-400 mt-1">Tracking: {order.trackingId}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">₹{order.amount.toLocaleString()}</p>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium mt-1 ${getStatusColor(order.status)}`}>
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

      {/* View Order Modal */}
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
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Order Details</h3>
              <button onClick={() => setViewingOrder(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500 mb-1">Order ID</p>
                  <p className="font-mono font-medium text-gray-900">{viewingOrder.id}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500 mb-1">Amount</p>
                  <p className="text-xl font-bold text-green-600">₹{viewingOrder.amount.toLocaleString()}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500 mb-1">Design</p>
                  <p className="font-medium text-gray-900">{viewingOrder.design}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500 mb-1">Weight</p>
                  <p className="font-medium text-gray-900">{viewingOrder.weight}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500 mb-1">Order Date</p>
                  <p className="font-medium text-gray-900">{viewingOrder.date}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500 mb-1">Status</p>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(viewingOrder.status)}`}>
                    {getStatusIcon(viewingOrder.status)}
                    {viewingOrder.status}
                  </span>
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-500 mb-1">Tracking ID</p>
                <p className="font-mono font-medium text-gray-900">{viewingOrder.trackingId}</p>
              </div>
              {viewingOrder.status === 'delivered' && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <p className="text-sm text-green-800 font-medium">Order delivered successfully!</p>
                  </div>
                </div>
              )}
              {(viewingOrder.status === 'confirmed' || viewingOrder.status === 'processing') && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <div className="flex items-center gap-2">
                    <Truck className="w-5 h-5 text-blue-600" />
                    <p className="text-sm text-blue-800 font-medium">Your order is being processed and will be delivered soon.</p>
                  </div>
                </div>
              )}
              <button
                onClick={() => setViewingOrder(null)}
                className="w-full py-3 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
