import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { ShoppingBag, Heart, Package, Truck, CheckCircle, Clock, Gem, Star, TrendingUp, Calendar, Eye, Download } from 'lucide-react';
import { useState, useEffect } from 'react';
import { designImages } from '../data/goldImages';
import { Link } from 'react-router-dom';

interface GoldOrder {
  id: string;
  designName: string;
  weight: number;
  purity: string;
  image: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered';
  orderDate: string;
  deliveryDate?: string;
  trackingId?: string;
  amount: number;
}

interface WishlistItem {
  id: string;
  designName: string;
  weight: number;
  purity: string;
  image: string;
  addedDate: string;
  category: string;
}

export default function IndividualDashboard() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<GoldOrder[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'wishlist'>('overview');

  useEffect(() => {
    if (!user) return;
    
    // Load orders from localStorage
    const savedOrders = localStorage.getItem(`individual_orders_${user.id}`);
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    } else {
      // Demo orders
      const demoOrders: GoldOrder[] = [
        {
          id: 'ORD001',
          designName: 'Royal Necklace Set',
          weight: 45.5,
          purity: '22K',
          image: designImages['Royal Necklace Set'],
          status: 'delivered',
          orderDate: '2024-05-15',
          deliveryDate: '2024-05-22',
          trackingId: 'TRK123456789',
          amount: 285000,
        },
        {
          id: 'ORD002',
          designName: 'Gold Coin 10g',
          weight: 10,
          purity: '24K',
          image: designImages['Gold Coin 10g'],
          status: 'shipped',
          orderDate: '2024-06-10',
          trackingId: 'TRK987654321',
          amount: 62500,
        },
        {
          id: 'ORD003',
          designName: 'Diamond Ring',
          weight: 4.8,
          purity: '24K',
          image: designImages['Minimalist Ring'],
          status: 'processing',
          orderDate: '2024-06-18',
          amount: 30000,
        },
      ];
      setOrders(demoOrders);
      localStorage.setItem(`individual_orders_${user.id}`, JSON.stringify(demoOrders));
    }

    // Load wishlist from localStorage
    const savedWishlist = localStorage.getItem(`individual_wishlist_${user.id}`);
    if (savedWishlist) {
      setWishlist(JSON.parse(savedWishlist));
    } else {
      // Demo wishlist
      const demoWishlist: WishlistItem[] = [
        {
          id: 'WISH001',
          designName: 'Temple Jewelry Set',
          weight: 120,
          purity: '22K',
          image: designImages['Temple Jewelry Set'],
          addedDate: '2024-06-01',
          category: 'Set',
        },
        {
          id: 'WISH002',
          designName: 'Bridal Choker',
          weight: 85,
          purity: '22K',
          image: designImages['Bridal Choker'],
          addedDate: '2024-06-05',
          category: 'Necklace',
        },
      ];
      setWishlist(demoWishlist);
      localStorage.setItem(`individual_wishlist_${user.id}`, JSON.stringify(demoWishlist));
    }
  }, [user]);

  if (!user) return null;

  const totalSpent = orders.reduce((sum, order) => sum + order.amount, 0);
  const totalOrders = orders.length;
  const deliveredOrders = orders.filter(o => o.status === 'delivered').length;
  const pendingOrders = orders.filter(o => o.status !== 'delivered').length;
  const totalGoldBought = orders.reduce((sum, order) => sum + order.weight, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-700 border-green-200';
      case 'shipped': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'processing': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'confirmed': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'pending': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      case 'shipped': return <Truck className="w-4 h-4" />;
      case 'processing': return <Package className="w-4 h-4" />;
      case 'confirmed': return <Clock className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const removeFromWishlist = (id: string) => {
    const updated = wishlist.filter(item => item.id !== id);
    setWishlist(updated);
    localStorage.setItem(`individual_wishlist_${user.id}`, JSON.stringify(updated));
  };

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 rounded-3xl p-8 text-purple-900 relative overflow-hidden shadow-2xl"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold font-[var(--font-heading)] mb-2">
                Welcome, {user.name}! 👋
              </h1>
              <p className="text-purple-900/80 text-lg">Your premium gold shopping experience</p>
            </div>
            <div className="hidden lg:block">
              <div className="w-20 h-20 bg-white/30 rounded-full flex items-center justify-center">
                <Gem className="w-10 h-10" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            <div className="bg-white/20 backdrop-blur rounded-xl p-4">
              <p className="text-sm text-purple-900/70">Total Spent</p>
              <p className="text-2xl font-bold">₹{totalSpent.toLocaleString()}</p>
            </div>
            <div className="bg-white/20 backdrop-blur rounded-xl p-4">
              <p className="text-sm text-purple-900/70">Gold Purchased</p>
              <p className="text-2xl font-bold">{totalGoldBought.toFixed(1)}g</p>
            </div>
            <div className="bg-white/20 backdrop-blur rounded-xl p-4">
              <p className="text-sm text-purple-900/70">Total Orders</p>
              <p className="text-2xl font-bold">{totalOrders}</p>
            </div>
            <div className="bg-white/20 backdrop-blur rounded-xl p-4">
              <p className="text-sm text-purple-900/70">Wishlist Items</p>
              <p className="text-2xl font-bold">{wishlist.length}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2 bg-white rounded-2xl p-2 border border-gray-100 shadow-sm">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
            activeTab === 'overview'
              ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-purple-900 shadow-lg'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <TrendingUp className="w-5 h-5 inline mr-2" />
          Overview
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
            activeTab === 'orders'
              ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-purple-900 shadow-lg'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <ShoppingBag className="w-5 h-5 inline mr-2" />
          My Orders ({totalOrders})
        </button>
        <button
          onClick={() => setActiveTab('wishlist')}
          className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
            activeTab === 'wishlist'
              ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-purple-900 shadow-lg'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Heart className="w-5 h-5 inline mr-2" />
          Wishlist ({wishlist.length})
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Order Status Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{deliveredOrders}</p>
                  <p className="text-sm text-gray-500">Delivered</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{pendingOrders}</p>
                  <p className="text-sm text-gray-500">In Progress</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                  <Star className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{wishlist.length}</p>
                  <p className="text-sm text-gray-500">Wishlist Items</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Recent Orders</h3>
              <button
                onClick={() => setActiveTab('orders')}
                className="text-sm text-amber-600 hover:text-amber-700 font-medium"
              >
                View All →
              </button>
            </div>
            <div className="space-y-3">
              {orders.slice(0, 3).map(order => (
                <div key={order.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <img
                    src={order.image}
                    alt={order.designName}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{order.designName}</p>
                    <p className="text-sm text-gray-500">{order.weight}g • {order.purity}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      <Calendar className="w-3 h-3 inline mr-1" />
                      {order.orderDate}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">₹{order.amount.toLocaleString()}</p>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link to="/gold-showroom" className="bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200 rounded-xl p-4 text-center hover:shadow-lg transition-all group">
                <ShoppingBag className="w-8 h-8 text-amber-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <p className="font-semibold text-gray-900 text-sm">Browse Gold</p>
              </Link>
              <button
                onClick={() => setActiveTab('orders')}
                className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 text-center hover:shadow-lg transition-all group"
              >
                <Package className="w-8 h-8 text-blue-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <p className="font-semibold text-gray-900 text-sm">Track Orders</p>
              </button>
              <button
                onClick={() => setActiveTab('wishlist')}
                className="bg-gradient-to-br from-pink-50 to-rose-50 border border-pink-200 rounded-xl p-4 text-center hover:shadow-lg transition-all group"
              >
                <Heart className="w-8 h-8 text-pink-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <p className="font-semibold text-gray-900 text-sm">My Wishlist</p>
              </button>
              <Link to="/profile" className="bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-200 rounded-xl p-4 text-center hover:shadow-lg transition-all group">
                <Eye className="w-8 h-8 text-purple-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <p className="font-semibold text-gray-900 text-sm">View Profile</p>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900">My Orders</h3>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-medium transition-colors">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
          {orders.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No orders yet</p>
              <Link to="/gold-showroom" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-purple-900 font-bold rounded-xl shadow-lg">
                <ShoppingBag className="w-5 h-5" />
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {orders.map(order => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={order.image}
                      alt={order.designName}
                      className="w-24 h-24 object-cover rounded-xl shadow-md"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-bold text-lg text-gray-900">{order.designName}</p>
                          <p className="text-sm text-gray-500">{order.weight}g • {order.purity} Gold</p>
                        </div>
                        <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        <div>
                          <p className="text-xs text-gray-500">Order ID</p>
                          <p className="font-mono text-sm font-medium">{order.id}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Order Date</p>
                          <p className="text-sm font-medium">{order.orderDate}</p>
                        </div>
                        {order.deliveryDate && (
                          <div>
                            <p className="text-xs text-gray-500">Delivery Date</p>
                            <p className="text-sm font-medium">{order.deliveryDate}</p>
                          </div>
                        )}
                        <div>
                          <p className="text-xs text-gray-500">Amount</p>
                          <p className="text-sm font-bold text-green-600">₹{order.amount.toLocaleString()}</p>
                        </div>
                      </div>
                      {order.trackingId && (
                        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <p className="text-xs text-blue-700">
                            <Truck className="w-3 h-3 inline mr-1" />
                            Tracking ID: <span className="font-mono font-semibold">{order.trackingId}</span>
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Wishlist Tab */}
      {activeTab === 'wishlist' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-xl font-bold text-gray-900">My Wishlist</h3>
            <p className="text-sm text-gray-500 mt-1">Items you're interested in</p>
          </div>
          {wishlist.length === 0 ? (
            <div className="text-center py-12">
              <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">Your wishlist is empty</p>
              <Link to="/gold-showroom" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-purple-900 font-bold rounded-xl shadow-lg">
                <ShoppingBag className="w-5 h-5" />
                Browse Gold Designs
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
              {wishlist.map(item => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-gray-50 rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-all group"
                >
                  <div className="h-48 relative overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.designName}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
                    >
                      <Heart className="w-4 h-4 fill-current" />
                    </button>
                  </div>
                  <div className="p-4">
                    <p className="font-bold text-gray-900 mb-1">{item.designName}</p>
                    <p className="text-sm text-gray-500">{item.weight}g • {item.purity}</p>
                    <p className="text-xs text-gray-400 mt-2">
                      <Calendar className="w-3 h-3 inline mr-1" />
                      Added on {item.addedDate}
                    </p>
                    <Link
                      to="/gold-showroom"
                      className="mt-3 w-full py-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-purple-900 text-sm font-bold rounded-lg hover:from-amber-600 hover:to-yellow-600 transition-all flex items-center justify-center gap-2"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      Order Now
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
