import { motion } from 'framer-motion';
import { ShoppingBag, Package, Clock, CheckCircle } from 'lucide-react';

export default function Orders() {
  const orders = [
    { id: 'o1', design: 'Royal Necklace Set', weight: '45.5g', status: 'confirmed', date: '2024-06-15' },
    { id: 'o2', design: 'Gold Coin 10g', weight: '10g', status: 'delivered', date: '2024-05-20' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold">My Orders</h1>
        <p className="text-white/50 mt-1">Track your gold purchases</p>
      </div>

      <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6">
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingBag className="w-12 h-12 text-white/20 mx-auto mb-3" />
            <p className="text-white/50">No orders yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <motion.div key={order.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4 p-4 bg-white/5 rounded-xl">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500/20 to-purple-500/20 rounded-xl flex items-center justify-center">
                  <Package className="w-6 h-6 text-amber-400" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{order.design}</p>
                  <p className="text-sm text-white/50">{order.weight} • {order.date}</p>
                </div>
                <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                  order.status === 'delivered' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {order.status === 'delivered' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                  {order.status}
                </span>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
