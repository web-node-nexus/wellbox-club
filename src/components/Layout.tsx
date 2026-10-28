import { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Users, DollarSign, Wallet, Gem, Crown,
  Menu, X, LogOut, User, ChevronRight, Coins, Bell, HelpCircle,
  Link2, ShoppingBag, Sun, Moon, TrendingUp
} from 'lucide-react';
import LogoutModal from './LogoutModal';

export default function Layout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Different navigation for individual users
  const individualNavItems = [
    { path: '/individual-dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/gold-showroom', label: 'Gold Showroom', icon: Gem },
    { path: '/orders', label: 'My Orders', icon: ShoppingBag },
    { path: '/profile', label: 'Profile', icon: User },
    { path: '/notifications', label: 'Notifications', icon: Bell },
    { path: '/support', label: 'Support', icon: HelpCircle },
  ];

  const memberNavItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/contributions', label: 'My Contribution', icon: Coins },
    { path: '/income/level1', label: 'Level 1 Income', icon: DollarSign },
    { path: '/income/level2', label: 'Level 2 Income', icon: TrendingUp },
    ...(user?.isLeader ? [{ path: '/income/leader', label: 'Leader Income', icon: Crown }] : []),
    { path: '/team', label: 'My Team', icon: Users },
    { path: '/wallet', label: 'Wallet & Withdraw', icon: Wallet },
    { path: '/gold-showroom', label: 'Gold Showroom', icon: Gem },
    { path: '/orders', label: 'My Orders', icon: ShoppingBag },
    { path: '/referral', label: 'Referral Link', icon: Link2 },
    { path: '/profile', label: 'Profile', icon: User },
    { path: '/notifications', label: 'Notifications', icon: Bell },
    { path: '/support', label: 'Support', icon: HelpCircle },
  ];

  const navItems = user?.role === 'individual' ? individualNavItems : memberNavItems;

  const mobileNavItems = navItems.slice(0, 5);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-purple-50 via-white to-amber-50'} flex`}>
      {/* Mobile overlay */}
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

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-72 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} shadow-xl`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className={`p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <Link to="/dashboard" className="flex items-center gap-3">
              <motion.div
                whileHover={{ rotate: 10, scale: 1.1 }}
                className="w-12 h-12 bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/30"
              >
                <Crown className="w-7 h-7 text-white" />
              </motion.div>
              <div>
                <h1 className={`text-2xl font-bold font-[var(--font-heading)] ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Jewellbox
                </h1>
                <p className={`text-xs ${darkMode ? 'text-amber-400' : 'text-amber-600'} -mt-1 tracking-wider font-semibold`}>MEMBER DASHBOARD</p>
              </div>
            </Link>
          </div>

          {/* User Info */}
          <div className={`p-4 mx-3 mt-4 ${darkMode ? 'bg-gradient-to-r from-amber-500/10 to-purple-500/10 border-amber-500/20' : 'bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200'} rounded-xl border`}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                {user?.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'} truncate`}>{user?.name}</p>
                <div className="flex items-center gap-1 mt-1">
                  {user?.isLeader && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-500/20 text-amber-600 text-xs font-bold rounded-full">
                      <Crown className="w-3 h-3" /> Leader
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-3 mt-2 space-y-1 overflow-y-auto">
            {navItems.map(item => {
              const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? darkMode
                        ? 'bg-gradient-to-r from-amber-500/20 to-purple-500/10 text-amber-400 border border-amber-500/30 shadow-lg'
                        : 'bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700 border border-amber-300 shadow-md'
                      : darkMode
                        ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? (darkMode ? 'text-amber-400' : 'text-amber-600') : ''}`} />
                  <span className="flex-1">{item.label}</span>
                  {isActive && <ChevronRight className={`w-4 h-4 ${darkMode ? 'text-amber-400' : 'text-amber-600'}`} />}
                </Link>
              );
            })}
          </nav>

          {/* Dark Mode Toggle */}
          <div className={`p-3 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'} transition-all`}
            >
              {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-gray-600" />}
              <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
          </div>

          {/* Logout */}
          <div className={`p-3 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <button
              onClick={() => setShowLogoutModal(true)}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold ${darkMode ? 'text-gray-300 hover:bg-red-500/10 hover:text-red-400' : 'text-gray-700 hover:bg-red-50 hover:text-red-600'} transition-all`}
            >
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className={`sticky top-0 z-30 ${darkMode ? 'bg-gray-800/90 border-gray-700' : 'bg-white/90 border-gray-200'} backdrop-blur-xl border-b px-4 lg:px-8 py-4 shadow-sm`}>
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className={`lg:hidden p-2 rounded-xl ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
            >
              {sidebarOpen ? <X className={`w-6 h-6 ${darkMode ? 'text-white' : 'text-gray-900'}`} /> : <Menu className={`w-6 h-6 ${darkMode ? 'text-white' : 'text-gray-900'}`} />}
            </button>
            <div className="flex items-center gap-4 ml-auto">
              {user?.isLeader && (
                <div className={`hidden sm:flex items-center gap-2 px-4 py-2 ${darkMode ? 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border-amber-500/30' : 'bg-gradient-to-r from-amber-100 to-yellow-100 border-amber-300'} rounded-full border shadow-sm`}>
                  <Crown className={`w-5 h-5 ${darkMode ? 'text-amber-400' : 'text-amber-600'}`} />
                  <span className={`text-sm font-bold ${darkMode ? 'text-amber-300' : 'text-amber-700'}`}>Leader Status Active</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                  {user?.name.charAt(0)}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8 pb-20 lg:pb-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={darkMode ? 'text-white' : 'text-gray-900'}
          >
            {children}
          </motion.div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className={`fixed bottom-0 left-0 right-0 z-40 lg:hidden ${darkMode ? 'bg-gray-800/95 border-gray-700' : 'bg-white/95 border-gray-200'} backdrop-blur-xl border-t shadow-lg`}>
        <div className="flex items-center justify-around py-2">
          {mobileNavItems.map(item => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all ${
                  isActive
                    ? darkMode ? 'text-amber-400' : 'text-amber-600'
                    : darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''} transition-transform`} />
                <span className="text-xs font-semibold">{item.label.split(' ')[0]}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Logout Confirmation Modal */}
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={() => {
          logout();
          setShowLogoutModal(false);
        }}
      />
    </div>
  );
}
