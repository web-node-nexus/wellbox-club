import { motion } from 'framer-motion';
import { Bell, DollarSign, Crown, Gift, Info, Users, CheckCircle, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '../context/ToastContext';

export default function Notifications() {
  const { showToast } = useToast();
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'commission', title: 'Commission Credited', message: '₹500 Level 1 commission from Priya Sharma', time: '2 hours ago', icon: DollarSign, color: 'text-green-400', read: false },
    { id: 2, type: 'leader', title: 'Leader Payout', message: 'Monthly leader payout of ₹1,800 credited', time: '3 days ago', icon: Crown, color: 'text-amber-400', read: false },
    { id: 3, type: 'gold', title: 'Gold Order Bonus', message: '₹450 commission from gold order', time: '1 week ago', icon: Gift, color: 'text-purple-400', read: true },
    { id: 4, type: 'team', title: 'New Team Member', message: 'Amit Patel joined your team', time: '1 week ago', icon: Users, color: 'text-blue-400', read: true },
    { id: 5, type: 'info', title: 'Welcome to Jewellbox', message: 'Your account has been created successfully', time: '2 weeks ago', icon: Info, color: 'text-indigo-400', read: true },
  ]);

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    showToast('success', 'All notifications marked as read', 'Success');
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
    showToast('success', 'Notification deleted', 'Deleted');
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Notifications</h1>
          <p className="text-white/50 mt-1">Stay updated with your activity</p>
        </div>
        {unreadCount > 0 && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={markAllAsRead}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm hover:bg-white/10 transition-colors"
          >
            <CheckCircle className="w-4 h-4" />
            Mark All as Read
          </motion.button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
              <Bell className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{unreadCount}</p>
              <p className="text-sm text-gray-500">Unread</p>
            </div>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{notifications.length}</p>
              <p className="text-sm text-gray-500">Total</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No notifications yet</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {notifications.map(notif => (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex items-start gap-4 p-4 hover:bg-gray-50 transition-colors ${!notif.read ? 'bg-blue-50/50' : ''}`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${!notif.read ? 'bg-blue-100' : 'bg-gray-100'}`}>
                  <notif.icon className={`w-5 h-5 ${notif.color}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium text-sm text-gray-900">{notif.title}</p>
                      <p className="text-sm text-gray-600 mt-0.5">{notif.message}</p>
                      <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {!notif.read && (
                        <button
                          onClick={() => markAsRead(notif.id)}
                          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Mark as read"
                        >
                          <CheckCircle className="w-4 h-4 text-blue-600" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notif.id)}
                        className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
