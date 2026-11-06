import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Bell,
  CheckCircle,
  Trash2,
  DollarSign,
  Users,
  Coins,
  Wallet,
  Gift,
  Info,
  Loader2,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import {
  AppNotification,
  countUnreadAdmin,
  deleteNotification,
  fetchAdminNotifications,
  formatNotificationTime,
  markAllAdminNotificationsRead,
  markNotificationRead,
  requestBrowserNotificationPermission,
} from '../../services/notificationService';

const iconFor = (type: string) => {
  switch (type) {
    case 'commission':
      return { Icon: DollarSign, color: 'text-green-400' };
    case 'member_joined':
      return { Icon: Users, color: 'text-blue-400' };
    case 'investment':
      return { Icon: Coins, color: 'text-amber-400' };
    case 'withdrawal':
      return { Icon: Wallet, color: 'text-purple-400' };
    case 'gold_order':
      return { Icon: Gift, color: 'text-pink-400' };
    default:
      return { Icon: Info, color: 'text-indigo-400' };
  }
};

export default function AdminNotifications() {
  const { showToast } = useToast();
  const [items, setItems] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [unread, setUnread] = useState(0);

  const load = useCallback(async () => {
    try {
      const [list, count] = await Promise.all([
        fetchAdminNotifications(),
        countUnreadAdmin(),
      ]);
      setItems(list);
      setUnread(count);
    } catch (e: any) {
      showToast('error', e?.message || 'Could not load notifications', 'Error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    void load();
    const t = window.setInterval(() => void load(), 20000);
    return () => window.clearInterval(t);
  }, [load]);

  const onMarkRead = async (id: string) => {
    try {
      await markNotificationRead(id);
      setItems(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
      setUnread(c => Math.max(0, c - 1));
    } catch (e: any) {
      showToast('error', e?.message || 'Failed', 'Error');
    }
  };

  const onMarkAll = async () => {
    try {
      await markAllAdminNotificationsRead();
      setItems(prev => prev.map(n => ({ ...n, read: true })));
      setUnread(0);
      showToast('success', 'All notifications marked as read', 'Success');
    } catch (e: any) {
      showToast('error', e?.message || 'Failed', 'Error');
    }
  };

  const onDelete = async (id: string) => {
    try {
      const wasUnread = items.find(n => n.id === id && !n.read);
      await deleteNotification(id);
      setItems(prev => prev.filter(n => n.id !== id));
      if (wasUnread) setUnread(c => Math.max(0, c - 1));
      showToast('success', 'Notification deleted', 'Deleted');
    } catch (e: any) {
      showToast('error', e?.message || 'Failed', 'Error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Notifications</h1>
          <p className="text-white/50 mt-1">
            Members, investments, commissions, withdrawals — stored in database
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() =>
              void requestBrowserNotificationPermission().then(p => {
                if (p === 'granted') {
                  showToast('success', 'Browser notifications enabled', 'Enabled');
                } else {
                  showToast('info', 'Permission not granted', 'Browser');
                }
              })
            }
            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white/80 hover:bg-white/10"
          >
            Enable browser alerts
          </button>
          {unread > 0 && (
            <button
              type="button"
              onClick={() => void onMarkAll()}
              className="flex items-center gap-2 px-4 py-2 bg-amber-500/20 border border-amber-500/30 rounded-xl text-sm text-amber-300 hover:bg-amber-500/30"
            >
              <CheckCircle className="w-4 h-4" />
              Mark all read
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
          <p className="text-2xl font-bold text-white">{unread}</p>
          <p className="text-sm text-white/50">Unread</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
          <p className="text-2xl font-bold text-white">{items.length}</p>
          <p className="text-sm text-white/50">Total</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16 text-gray-400">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No notifications yet</p>
            <p className="text-xs text-gray-400 mt-2 px-6">
              Run <code className="bg-gray-100 px-1 rounded">supabase/notifications_migration.sql</code> if
              the table is missing.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {items.map(notif => {
              const { Icon, color } = iconFor(notif.type);
              return (
                <motion.div
                  key={notif.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex items-start gap-4 p-4 hover:bg-gray-50 ${
                    !notif.read ? 'bg-blue-50/60' : ''
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      !notif.read ? 'bg-blue-100' : 'bg-gray-100'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium text-sm text-gray-900">{notif.title}</p>
                        <p className="text-sm text-gray-600 mt-0.5">{notif.message}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatNotificationTime(notif.createdAt)}
                          {!notif.read && (
                            <span className="ml-2 text-blue-600 font-medium">Unread</span>
                          )}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        {!notif.read && (
                          <button
                            type="button"
                            onClick={() => void onMarkRead(notif.id)}
                            className="p-1.5 hover:bg-gray-100 rounded-lg"
                            title="Mark as read"
                          >
                            <CheckCircle className="w-4 h-4 text-blue-600" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => void onDelete(notif.id)}
                          className="p-1.5 hover:bg-red-50 rounded-lg"
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
