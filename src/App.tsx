import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { ToastProvider } from './context/ToastContext';
import { LanguageProvider } from './context/LanguageContext';
import Layout from './components/Layout';
import AdminLayout from './components/AdminLayout';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import JoinModal from './components/JoinModal';

// Public Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import About from './pages/About';
import HowItWorks from './pages/HowItWorks';
import IncomePlan from './pages/IncomePlan';
import LeaderProgram from './pages/LeaderProgram';
import GoldShowroomPublic from './pages/GoldShowroomPublic';
import WhyBuyGold from './pages/WhyBuyGold';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import RefundPolicy from './pages/RefundPolicy';

// Dashboard Pages
import Dashboard from './pages/Dashboard';
import IndividualDashboard from './pages/IndividualDashboard';
import Team from './pages/Team';
import Income from './pages/Income';
import Wallet from './pages/Wallet';
import Contributions from './pages/Contributions';
import Referral from './pages/Referral';
import Orders from './pages/Orders';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';
import Support from './pages/Support';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminContributions from './pages/admin/AdminContributions';
import AdminCommissions from './pages/admin/AdminCommissions';
import AdminWithdrawals from './pages/admin/AdminWithdrawals';
import AdminLeaderPayouts from './pages/admin/AdminLeaderPayouts';
import AdminGoldShowroom from './pages/admin/AdminGoldShowroom';
import AdminGoldOrders from './pages/admin/AdminGoldOrders';
import AdminSettings from './pages/admin/AdminSettings';
import AdminCMS from './pages/admin/AdminCMS';
import AdminReports from './pages/admin/AdminReports';
import AdminAuditLogs from './pages/admin/AdminAuditLogs';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (!user || user.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

function SmartRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  
  // Redirect based on user role
  if (user.role === 'individual') {
    return <Navigate to="/individual-dashboard" replace />;
  }
  
  // Default dashboard for member/leader
  return <Layout><Dashboard /></Layout>;
}

function PublicPageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Footer />
    </>
  );
}

function AppRoutes() {
  const [joinOpen, setJoinOpen] = useState(false);
  const [joinTab, setJoinTab] = useState<'member' | 'leader'>('member');

  const openJoin = (tab: 'member' | 'leader' = 'member') => {
    setJoinTab(tab);
    setJoinOpen(true);
  };

  return (
    <>
      <Navbar onJoinClick={() => openJoin('member')} />
      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<PublicPageWrapper><Landing onJoinClick={() => openJoin('member')} /></PublicPageWrapper>} />
        <Route path="/about" element={<PublicPageWrapper><About onJoinClick={() => openJoin('member')} /></PublicPageWrapper>} />
        <Route path="/how-it-works" element={<PublicPageWrapper><HowItWorks onJoinClick={() => openJoin('member')} /></PublicPageWrapper>} />
        <Route path="/income-plan" element={<PublicPageWrapper><IncomePlan onJoinClick={() => openJoin('member')} /></PublicPageWrapper>} />
        <Route path="/leader-program" element={<PublicPageWrapper><LeaderProgram onJoinClick={() => openJoin('leader')} /></PublicPageWrapper>} />
        <Route path="/gold-showroom-public" element={<PublicPageWrapper><GoldShowroomPublic onJoinClick={() => openJoin('member')} /></PublicPageWrapper>} />
        <Route path="/why-buy-gold" element={<PublicPageWrapper><WhyBuyGold onJoinClick={() => openJoin('member')} /></PublicPageWrapper>} />
        <Route path="/faq" element={<PublicPageWrapper><FAQ /></PublicPageWrapper>} />
        <Route path="/contact" element={<PublicPageWrapper><Contact /></PublicPageWrapper>} />
        <Route path="/terms" element={<PublicPageWrapper><Terms /></PublicPageWrapper>} />
        <Route path="/privacy" element={<PublicPageWrapper><Privacy /></PublicPageWrapper>} />
        <Route path="/refund-policy" element={<PublicPageWrapper><RefundPolicy /></PublicPageWrapper>} />
        
        {/* Auth Pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register/:referralCode" element={<Register />} />

        {/* Dashboard Pages */}
        <Route path="/dashboard" element={<ProtectedRoute><SmartRedirect /></ProtectedRoute>} />
        <Route path="/individual-dashboard" element={<ProtectedRoute><Layout><IndividualDashboard /></Layout></ProtectedRoute>} />
        <Route path="/team" element={<ProtectedRoute><Layout><Team /></Layout></ProtectedRoute>} />
        <Route path="/income/level1" element={<ProtectedRoute><Layout><Income /></Layout></ProtectedRoute>} />
        <Route path="/income/level2" element={<ProtectedRoute><Layout><Income /></Layout></ProtectedRoute>} />
        <Route path="/income/leader" element={<ProtectedRoute><Layout><Income /></Layout></ProtectedRoute>} />
        <Route path="/wallet" element={<ProtectedRoute><Layout><Wallet /></Layout></ProtectedRoute>} />
        <Route path="/contributions" element={<ProtectedRoute><Layout><Contributions /></Layout></ProtectedRoute>} />
        <Route path="/gold-showroom" element={<ProtectedRoute><Layout><GoldShowroomPublic onJoinClick={() => {}} /></Layout></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><Layout><Orders /></Layout></ProtectedRoute>} />
        <Route path="/referral" element={<ProtectedRoute><Layout><Referral /></Layout></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Layout><Profile /></Layout></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><Layout><Notifications /></Layout></ProtectedRoute>} />
        <Route path="/support" element={<ProtectedRoute><Layout><Support /></Layout></ProtectedRoute>} />

        {/* Admin Pages */}
        <Route path="/admin" element={<AdminRoute><AdminLayout><AdminDashboard /></AdminLayout></AdminRoute>} />
        <Route path="/admin/users" element={<AdminRoute><AdminLayout><AdminUsers /></AdminLayout></AdminRoute>} />
        <Route path="/admin/contributions" element={<AdminRoute><AdminLayout><AdminContributions /></AdminLayout></AdminRoute>} />
        <Route path="/admin/commissions" element={<AdminRoute><AdminLayout><AdminCommissions /></AdminLayout></AdminRoute>} />
        <Route path="/admin/withdrawals" element={<AdminRoute><AdminLayout><AdminWithdrawals /></AdminLayout></AdminRoute>} />
        <Route path="/admin/leader-payouts" element={<AdminRoute><AdminLayout><AdminLeaderPayouts /></AdminLayout></AdminRoute>} />
        <Route path="/admin/gold-showroom" element={<AdminRoute><AdminLayout><AdminGoldShowroom /></AdminLayout></AdminRoute>} />
        <Route path="/admin/gold-orders" element={<AdminRoute><AdminLayout><AdminGoldOrders /></AdminLayout></AdminRoute>} />
        <Route path="/admin/settings" element={<AdminRoute><AdminLayout><AdminSettings /></AdminLayout></AdminRoute>} />
        <Route path="/admin/cms" element={<AdminRoute><AdminLayout><AdminCMS /></AdminLayout></AdminRoute>} />
        <Route path="/admin/reports" element={<AdminRoute><AdminLayout><AdminReports /></AdminLayout></AdminRoute>} />
        <Route path="/admin/audit-logs" element={<AdminRoute><AdminLayout><AdminAuditLogs /></AdminLayout></AdminRoute>} />
      </Routes>
      <JoinModal isOpen={joinOpen} onClose={() => setJoinOpen(false)} initialTab={joinTab} />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <AppProvider>
            <ToastProvider>
              <AppRoutes />
            </ToastProvider>
          </AppProvider>
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}
