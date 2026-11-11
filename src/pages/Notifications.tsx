import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Bell,
  DollarSign,
  Crown,
  Gift,
  Info,
  Users,
  CheckCircle,
  Trash2,
  Coins,
  Loader2,
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import {
  AppNotification,
  deleteNotification,
  fetchUserNotifications,
  formatNotificationTime,
  markAllUserNotificationsRead,
  markNotificationRead,
} from '../services/notificationService';
import { enablePaymentPushReminders, pushSupported } from '../services/pushService';

const iconFor = (type: string) => {
  switch (type) {
    case 'commission':
      return { Icon: DollarSign, color: 'text-green-400' };
    case 'member_joined':
    case 'info':
      return type === 'member_joined'
        ? { Icon: Users, color: 'text-blue-400' }
        : { Icon: Info, color: 'text-indigo-400' };
    case 'investment':
      return { Icon: Coins, color: 'text-amber-400' };
    case 'payment_reminder':
      return { Icon: Bell, color: 'text-rose-400' };
    case 'gold_order':
      return { Icon: Gift, color: 'text-purple-400' };
    default:
      return { Icon: Crown, color: 'text-amber-400' };
  }
};

export default function Notifications() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [pushBusy, setPushBusy] = useState(false);
  const [pushStatus, setPushStatus] = useState('');

  const load = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    try {
      const list = await fetchUserNotifications(user.id);
      setNotifications(list);
    } catch (e: any) {
      showToast('error', e?.message || 'Could not load notifications', 'Error');
    } finally {
      setLoading(false);
    }
  }, [user?.id, showToast]);

  useEffect(() => {
    void load();
  }, [load]);

  const markAsRead = async (id: string) => {
    try {
      await markNotificationRead(id);
      setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
    } catch (e: any) {
      showToast('error', e?.message || 'Failed', 'Error');
    }
  };

  const markAllAsRead = async () => {
    if (!user?.id) return;
    try {
      await markAllUserNotificationsRead(user.id);
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      showToast('success', 'All notifications marked as read', 'Success');
    } catch (e: any) {
      showToast('error', e?.message || 'Failed', 'Error');
    }
  };

  const removeNotification = async (id: string) => {
    try {
      await deleteNotification(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
      showToast('success', 'Notification deleted', 'Deleted');
    } catch (e: any) {
      showToast('error', e?.message || 'Failed', 'Error');
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-500 mt-1">
            Stay updated · payment reminders start 5 days before due (every 6 hours)
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {pushSupported() && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={pushBusy || !user?.id}
              onClick={async () => {
                if (!user?.id) return;
                setPushBusy(true);
                const r = await enablePaymentPushReminders(user.id);
                setPushBusy(false);
                setPushStatus(r.message);
                showToast(r.ok ? 'success' : 'error', r.message, r.ok ? 'Push' : 'Error');
              }}
              className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-xl text-sm font-semibold disabled:opacity-50"
            >
              {pushBusy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Bell className="w-4 h-4" />}
              Enable Push Reminders
            </motion.button>
          )}
          {unreadCount > 0 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => void markAllAsRead()}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm hover:bg-gray-50 transition-colors"
            >
              <CheckCircle className="w-4 h-4" />
              Mark All as Read
            </motion.button>
          )}
        </div>
      </div>
      {pushStatus && <p className="text-xs text-gray-500">{pushStatus}</p>}

      <div className="grid grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm"
        >
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm"
        >
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

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16 text-gray-400">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No notifications yet</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {notifications.map(notif => {
              const { Icon, color } = iconFor(notif.type);
              return (
                <motion.div
                  key={notif.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex items-start gap-4 p-4 hover:bg-gray-50 transition-colors ${
                    !notif.read ? 'bg-blue-50/50' : ''
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      !notif.read ? 'bg-blue-100' : 'bg-gray-100'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${color}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium text-sm text-gray-900">{notif.title}</p>
                        <p className="text-sm text-gray-600 mt-0.5">{notif.message}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatNotificationTime(notif.createdAt)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {!notif.read && (
                          <button
                            onClick={() => void markAsRead(notif.id)}
                            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Mark as read"
                          >
                            <CheckCircle className="w-4 h-4 text-blue-600" />
                          </button>
                        )}
                        <button
                          onClick={() => void removeNotification(notif.id)}
                          className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
