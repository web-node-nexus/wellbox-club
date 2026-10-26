import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { ToastProvider } from './context/ToastContext';
import Layout from './components/Layout';
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
import Team from './pages/Team';
import Income from './pages/Income';
import Wallet from './pages/Wallet';
import Contributions from './pages/Contributions';
import Referral from './pages/Referral';
import Orders from './pages/Orders';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';
import Support from './pages/Support';
import Admin from './pages/Admin';

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
        <Route path="/dashboard" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
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
        <Route path="/admin" element={<AdminRoute><Layout><Admin /></Layout></AdminRoute>} />
      </Routes>
      <JoinModal isOpen={joinOpen} onClose={() => setJoinOpen(false)} initialTab={joinTab} />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <ToastProvider>
            <AppRoutes />
          </ToastProvider>
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
