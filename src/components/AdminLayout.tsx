import { ReactNode, useCallback, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Users, Coins, DollarSign, Wallet, Crown,
  Menu, X, LogOut, Gem, Settings, FileText, BarChart3,
  Shield, Activity, ShoppingBag, Bell
} from 'lucide-react';
import {
  countUnreadAdmin,
  requestBrowserNotificationPermission,
} from '../services/notificationService';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unread, setUnread] = useState(0);

  const refreshUnread = useCallback(() => {
    void countUnreadAdmin().then(setUnread).catch(() => setUnread(0));
  }, []);

  useEffect(() => {
    refreshUnread();
    const t = window.setInterval(refreshUnread, 20000);
    void requestBrowserNotificationPermission();
    return () => window.clearInterval(t);
  }, [refreshUnread, location.pathname]);

  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/notifications', label: 'Notifications', icon: Bell },
    { path: '/admin/users', label: 'Users', icon: Users },
    { path: '/admin/contributions', label: 'Contributions', icon: Coins },
    { path: '/admin/commissions', label: 'Commissions', icon: DollarSign },
    { path: '/admin/withdrawals', label: 'Withdrawals', icon: Wallet },
    { path: '/admin/leader-payouts', label: 'Leader Payouts', icon: Crown },
    { path: '/admin/gold-showroom', label: 'Gold Showroom', icon: Gem },
    { path: '/admin/gold-orders', label: 'Gold Orders', icon: ShoppingBag },
    { path: '/admin/settings', label: 'Settings', icon: Settings },
    { path: '/admin/cms', label: 'CMS', icon: FileText },
    { path: '/admin/reports', label: 'Reports', icon: BarChart3 },
    { path: '/admin/audit-logs', label: 'Audit Logs', icon: Activity },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <aside className={`fixed inset-y-0 left-0 z-50 w-72 h-screen overflow-hidden bg-gradient-to-b from-slate-900 via-purple-950 to-slate-900 border-r border-amber-500/10 transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-amber-500/10">
            <Link to="/admin" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/30">
                <Shield className="w-6 h-6 text-purple-900" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Admin Panel</h1>
                <p className="text-xs text-amber-400/70">Jewellbox Club</p>
              </div>
            </Link>
          </div>

          <div className="p-3 mx-3 mt-3 bg-amber-500/5 border border-amber-500/10 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-purple-900 font-bold">
                {user?.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-500/20 text-red-300 text-[10px] font-medium rounded-full">
                  <Shield className="w-2.5 h-2.5" /> {user?.role === 'admin' ? 'Super Admin' : 'Admin'}
                </span>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-2 mt-2 space-y-0.5 overflow-y-auto">
            {navItems.map(item => {
              const isActive = location.pathname === item.path;
              const showBadge = item.path === '/admin/notifications' && unread > 0;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-500/20 to-purple-500/10 text-amber-400 border border-amber-500/20'
                      : 'text-white/70 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <item.icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : ''}`} />
                  <span className="flex-1 text-xs">{item.label}</span>
                  {showBadge && (
                    <span className="min-w-[1.25rem] h-5 px-1.5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                      {unread > 99 ? '99+' : unread}
                    </span>
                  )}
                  {isActive && !showBadge && <div className="w-1.5 h-1.5 bg-amber-400 rounded-full" />}
                </Link>
              );
            })}
          </nav>

          <div className="p-2 border-t border-amber-500/10">
            <button
              onClick={logout}
              className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-xs font-medium text-white/70 hover:bg-red-500/10 hover:text-red-400 transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      <div className="lg:ml-72 min-h-screen flex flex-col">
        <header className="sticky top-0 z-30 bg-slate-900/80 backdrop-blur-xl border-b border-amber-500/10 px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl hover:bg-white/10 transition-colors"
            >
              {sidebarOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
            </button>
            <div className="flex items-center gap-4 ml-auto">
              <Link
                to="/admin/notifications"
                className="p-2 rounded-xl hover:bg-white/10 transition-colors relative"
                title="Notifications"
              >
                <Bell className="w-5 h-5 text-white/70" />
                {unread > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[1.1rem] h-4 px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                    {unread > 9 ? '9+' : unread}
                  </span>
                )}
              </Link>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-purple-900 text-sm font-bold">
                  {user?.name.charAt(0)}
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-white"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
