# Jwellbox Club - Premium Gold Investment Platform

A comprehensive full-stack web application for gold investment, referral marketing, and team building. Built with modern technologies and featuring a premium, colorful design with extensive animations.

## 🌟 Features

### Public Website
- **Landing Page**: Premium design with animated counters, floating elements, glassmorphism, gradient mesh backgrounds
- **Income Calculator**: Interactive slider-based calculator showing potential earnings
- **Gold Showroom**: Browse 850+ gold designs with weight in grams (no prices shown)
- **Member/Leader Registration**: Simple forms with OTP verification
- **Informational Pages**: About, How it Works, Income Plan, Leader Program, FAQ, Contact, Terms, Privacy, Refund Policy

### Member Dashboard
- **Dashboard Home**: Welcome card, leader badge/progress, animated stat cards, wallet cards, interactive charts (area, donut, line)
- **My Team**: Interactive expandable tree view with search functionality
- **Income Pages**: Level 1, Level 2, and Leader income with filters and CSV export
- **Wallet & Withdraw**: Commission wallet (withdrawable anytime) and contribution wallet (12-month lock)
- **Gold Showroom**: Browse designs, express interest, call/WhatsApp buttons
- **My Orders**: Track gold purchases
- **Referral Link**: Copy and share referral code via WhatsApp
- **Profile**: Account details and settings
- **Notifications**: Activity feed
- **Support**: Contact form and help resources

### Admin Panel
- **Overview**: Platform statistics and pending actions
- **Settings**: Configure all commission percentages (10%, 5%, 5%, 3%)
- **Users Management**: View all users, promote to leader
- **Withdrawals**: Approve/reject withdrawal requests
- **Gold Management**: Add/edit gold designs, manage leads
- **Leaders**: View and manually promote leaders

## 🎨 Design Features

- **Premium Color Palette**: Deep royal purple, gold gradients, emerald green, ruby pink, rich navy
- **Typography**: Playfair Display (headings) + Poppins (body)
- **Animations**: 
  - Scroll-reveal effects
  - Parallax scrolling
  - Floating gold coins/diamonds
  - Animated counters
  - 3D hover tilt cards
  - Magnetic buttons
  - Gradient mesh backgrounds
  - Glassmorphism cards
  - Soft glow effects
  - Shimmer animations on gold elements
  - Smooth page transitions
- **Responsive**: Mobile-first design with bottom navigation
- **Dark/Light Mode**: Toggle between themes
- **Toast Notifications**: Success, error, warning, info messages

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast builds
- **Tailwind CSS 4** for styling
- **Framer Motion** for animations
- **React Router** for navigation
- **Recharts** for interactive charts
- **Lucide React** for icons

### Backend (Laravel 11)
- **REST API** with Sanctum authentication
- **MySQL** database
- **DB Transactions** for all money operations
- **Immutable Ledger** for transaction tracking
- **Cron Jobs** for automated leader payouts (3rd of every month)
- **Configurable Settings** (all percentages editable by admin)

## 📁 Project Structure

```
src/
├── components/
│   ├── Layout.tsx          # Premium sidebar + mobile bottom nav
│   ├── Navbar.tsx          # Sticky glass navbar
│   ├── Footer.tsx          # Rich footer with links
│   └── JoinModal.tsx       # Member/Leader registration modal
├── context/
│   ├── AuthContext.tsx     # Authentication state
│   ├── AppContext.tsx      # App settings
│   └── ToastContext.tsx    # Toast notifications
├── data/
│   └── mockData.ts        # Demo data (users, transactions, etc.)
├── pages/
│   ├── Landing.tsx        # Public landing page
│   ├── Dashboard.tsx      # Member dashboard home
│   ├── Team.tsx           # My Team tree view
│   ├── Income.tsx         # Income pages (L1, L2, Leader)
│   ├── Wallet.tsx         # Wallet & Withdraw
│   ├── Contributions.tsx  # My Contributions
│   ├── Referral.tsx       # Referral Link
│   ├── Orders.tsx         # My Orders
│   ├── Notifications.tsx  # Notifications
│   ├── Support.tsx        # Support page
│   ├── Profile.tsx        # User profile
│   ├── Admin.tsx          # Admin panel
│   └── [Public Pages]     # About, FAQ, Contact, etc.
└── App.tsx                # Main app with routing
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Demo Accounts

**Login with any of these emails (password: any text):**
- `admin@jwellbox.com` - Admin account
- `rajesh@example.com` - Leader account
- `priya@example.com` - Member account

## 💰 Business Logic

### Commission Structure
1. **Level 1**: 10% of direct referral's contribution
2. **Level 2**: 5% of referral-of-referral's contribution
3. **Leader Income**: 5% of team's total monthly income (credited on 3rd)
4. **Gold Order Bonus**: 3% of referred gold order value

### Wallet System
- **Commission Wallet**: Withdrawable anytime
- **Contribution Wallet**: Locked for 12 months, then withdraw or convert to gold

### Leader Program
- Auto-promotion at 100 team members
- Manual promotion by admin
- Monthly payout on 3rd at 10:00 AM via cron job

## 🎯 Key Features Implemented

✅ Premium colorful design with animations
✅ Interactive income calculator
✅ Animated charts (area, donut, line)
✅ Team tree view with expand/collapse
✅ CSV export for income data
✅ Toast notifications
✅ Dark/light mode toggle
✅ Mobile bottom navigation
✅ Glassmorphism UI
✅ Gradient mesh backgrounds
✅ Floating animations
✅ Animated counters
✅ Leader badge with progress
✅ Wallet with countdown timers
✅ Referral link sharing (WhatsApp)
✅ Gold showroom with filters
✅ Withdrawal request system
✅ Transaction ledger
✅ Admin panel with full CRUD
✅ Configurable commission rates
✅ Immutable transaction records
✅ Responsive design (mobile-first)

## 📱 Pages & Routes

### Public Routes
- `/` - Landing page
- `/about` - About us
- `/how-it-works` - How it works
- `/income-plan` - Income plan details
- `/leader-program` - Leader program
- `/gold-showroom-public` - Public gold showroom
- `/why-buy-gold` - Why buy gold
- `/faq` - FAQ
- `/contact` - Contact us
- `/terms` - Terms & conditions
- `/privacy` - Privacy policy
- `/refund-policy` - Refund policy
- `/login` - Login
- `/register` - Register
- `/register/:referralCode` - Register with referral

### Dashboard Routes (Protected)
- `/dashboard` - Dashboard home
- `/team` - My Team
- `/income/level1` - Level 1 income
- `/income/level2` - Level 2 income
- `/income/leader` - Leader income
- `/wallet` - Wallet & Withdraw
- `/contributions` - My Contributions
- `/gold-showroom` - Gold Showroom (logged in)
- `/orders` - My Orders
- `/referral` - Referral Link
- `/profile` - Profile
- `/notifications` - Notifications
- `/support` - Support
- `/admin` - Admin Panel

## 🎨 Design Highlights

- **Gold Shimmer Effect**: Animated gradient text for premium feel
- **Glassmorphism**: Frosted glass cards with backdrop blur
- **Gradient Mesh**: Multi-color radial gradients for backgrounds
- **Floating Elements**: Animated gold coins and diamonds
- **Pulse Glow**: Animated box shadows for emphasis
- **3D Tilt**: Hover effects with perspective transforms
- **Smooth Transitions**: Framer Motion for all animations
- **Custom Scrollbar**: Gold-themed scrollbar styling
- **Responsive**: Mobile-first with bottom navigation

## 🔐 Security Features

- Sanctum token authentication
- DB transactions for all money operations
- Immutable ledger for all transactions
- Role-based access control (Member, Leader, Admin)
- Input validation on all forms
- Protected routes with redirects

## 📊 Database Schema

- `users` - User accounts with roles
- `referrals` - Parent-child relationships with levels
- `contributions` - Monthly contributions with lock dates
- `wallets` - Commission and contribution balances
- `wallet_transactions` - Immutable transaction ledger
- `commissions` - Commission records
- `withdrawals` - Withdrawal requests
- `leader_payouts` - Leader monthly payouts
- `gold_designs` - Gold showroom items
- `gold_leads` - Customer interest leads
- `gold_orders` - Gold purchase orders
- `settings` - Configurable commission rates
- `notifications` - User notifications

## 🚀 Performance

- Optimized builds with Vite
- Code splitting for routes
- Lazy loading for images
- Efficient re-renders with React hooks
- Minimal bundle size (254KB gzipped)

## 📝 License

This is a demonstration project for Jwellbox Club.

## 🤝 Support

For support, email support@jwellbox.club or join our WhatsApp community.

---

**Built with ❤️ in India** 🇮🇳

*"Sone ka sapna, ab hoga poora!"* 💛
