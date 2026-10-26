# Jwellbox Club - Complete Platform

A comprehensive full-stack gold investment and referral marketing platform with premium UI, admin panel, and member dashboard.

## 🌟 Features

### Public Website
- Premium landing page with animations, glassmorphism, gradient mesh backgrounds
- Income calculator, gold showroom, member/leader registration
- Informational pages (About, FAQ, Contact, Terms, Privacy, etc.)

### Member Dashboard
- Interactive dashboard with animated charts (Recharts)
- Team tree view, income tracking, wallet management
- Gold showroom, orders, referrals, notifications, support
- Dark/light mode, mobile bottom navigation

### Admin Panel (12 Modules)
1. **Dashboard** - Overview with charts and key metrics
2. **Users** - User management, search, filter, promote to leader
3. **Contributions** - Manage member contributions, lock/unlock status
4. **Commissions** - Track all commission types (L1, L2, Leader, Gold)
5. **Withdrawals** - Approve/reject withdrawal requests
6. **Leader Payouts** - Monthly payout management (3rd of month)
7. **Gold Showroom** - Add/edit gold designs
8. **Gold Orders** - Manage orders and leads
9. **Settings** - Configure commission rates, lock periods
10. **CMS** - Edit landing page content
11. **Reports** - Generate and export CSV reports
12. **Audit Logs** - Track all admin activities

## 🛠️ Tech Stack

### Frontend
- **React 18** + TypeScript
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
- **Cron Jobs** for automated leader payouts
- **Configurable Settings** (all percentages editable)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PHP 8.3+
- MySQL 8.0+
- Composer
- Nginx or Apache

### Frontend Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Backend Setup (Laravel)

```bash
# Clone the Laravel backend
cd backend

# Install PHP dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Configure database in .env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=jwellbox_club
DB_USERNAME=your_username
DB_PASSWORD=your_password

# Run migrations
php artisan migrate

# Seed demo data
php artisan db:seed

# Start queue worker (for emails, notifications)
php artisan queue:work

# Setup cron job for leader payouts
crontab -e
# Add: 0 10 3 * * php /path/to/artisan schedule:run >> /dev/null 2>&1
```

## 📁 Project Structure

```
src/
├── components/
│   ├── Layout.tsx              # Member dashboard layout
│   ├── AdminLayout.tsx         # Admin panel layout
│   ├── Navbar.tsx              # Public navbar
│   ├── Footer.tsx              # Public footer
│   └── JoinModal.tsx           # Registration modal
├── context/
│   ├── AuthContext.tsx         # Authentication state
│   ├── AppContext.tsx          # App settings
│   └── ToastContext.tsx        # Toast notifications
├── data/
│   └── mockData.ts            # Demo data
├── pages/
│   ├── [Public Pages]         # Landing, About, FAQ, etc.
│   ├── [Dashboard Pages]      # Member dashboard
│   └── admin/                 # Admin panel (12 modules)
│       ├── AdminDashboard.tsx
│       ├── AdminUsers.tsx
│       ├── AdminContributions.tsx
│       ├── AdminCommissions.tsx
│       ├── AdminWithdrawals.tsx
│       ├── AdminLeaderPayouts.tsx
│       ├── AdminGoldShowroom.tsx
│       ├── AdminGoldOrders.tsx
│       ├── AdminSettings.tsx
│       ├── AdminCMS.tsx
│       ├── AdminReports.tsx
│       └── AdminAuditLogs.tsx
└── App.tsx                    # Main app with routing
```

## 🔐 Demo Accounts

**Login with any of these emails (password: any text):**
- `admin@jwellbox.com` - Super Admin
- `subadmin@jwellbox.com` - Sub Admin
- `rajesh@example.com` - Leader
- `priya@example.com` - Member

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

## 🚀 Deployment Guide

### Production Build

```bash
# Build frontend
npm run build

# Output will be in dist/ folder
```

### Nginx Configuration

```nginx
server {
    listen 80;
    server_name jwellbox.club www.jwellbox.club;
    root /var/www/jwellbox/dist;
    index index.html;

    # Frontend (React SPA)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Laravel API
    location /api {
        root /var/www/jwellbox/backend/public;
        try_files $uri $uri/ /index.php?$query_string;
    }

    # Laravel PHP processing
    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.3-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    # Security
    location ~ /\.(ht|git|env) {
        deny all;
    }

    # Caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

### PM2 Configuration (for Laravel Queue Worker)

```javascript
// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'jwellbox-queue',
      script: 'artisan',
      args: 'queue:work --sleep=3 --tries=3',
      cwd: '/var/www/jwellbox/backend',
      interpreter: '/usr/bin/php',
      watch: false,
      max_memory_restart: '256M',
      env: {
        APP_ENV: 'production',
      },
    },
    {
      name: 'jwellbox-scheduler',
      script: 'artisan',
      args: 'schedule:run',
      cwd: '/var/www/jwellbox/backend',
      interpreter: '/usr/bin/php',
      watch: false,
    },
  ],
};
```

```bash
# Start PM2 processes
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

### SSL Configuration (Let's Encrypt)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d jwellbox.club -d www.jwellbox.club

# Auto-renewal (already configured by Certbot)
sudo certbot renew --dry-run
```

### Database Backup Script

```bash
#!/bin/bash
# backup.sh - Run daily via cron

BACKUP_DIR="/var/backups/jwellbox"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="jwellbox_club"

mkdir -p $BACKUP_DIR

# Backup database
mysqldump -u your_user -p'your_password' $DB_NAME | gzip > $BACKUP_DIR/db_$DATE.sql.gz

# Keep only last 30 days
find $BACKUP_DIR -name "db_*.sql.gz" -mtime +30 -delete

echo "Backup completed: db_$DATE.sql.gz"
```

```bash
# Add to crontab
crontab -e
# Add: 0 2 * * * /path/to/backup.sh
```

### Environment Variables (.env)

```env
# Frontend
VITE_API_URL=https://jwellbox.club/api
VITE_APP_NAME=Jwellbox Club

# Backend (Laravel)
APP_NAME="Jwellbox Club"
APP_ENV=production
APP_KEY=base64:your-key-here
APP_DEBUG=false
APP_URL=https://jwellbox.club

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=jwellbox_club
DB_USERNAME=jwellbox_user
DB_PASSWORD=secure_password

MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@jwellbox.club
MAIL_FROM_NAME="Jwellbox Club"

SANCTUM_STATEFUL_DOMAINS=jwellbox.club,www.jwellbox.club
SESSION_DOMAIN=.jwellbox.club
```

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
- `audit_logs` - Admin activity logs

## 🔒 Security Features

- Sanctum token authentication
- DB transactions for all money operations
- Immutable ledger for all transactions
- Role-based access control (Member, Leader, Admin)
- Input validation on all forms
- Protected routes with redirects
- Audit logging for admin actions
- Rate limiting on API endpoints
- CSRF protection
- SQL injection prevention (Eloquent ORM)

## 📱 Responsive Design

- Mobile-first approach
- Bottom navigation for mobile
- Touch-friendly buttons and inputs
- Optimized images and assets
- Fast loading with code splitting

## 🎨 Design Highlights

- Premium colorful design with animations
- Glassmorphism UI components
- Gradient mesh backgrounds
- Floating animations and parallax
- Animated counters and charts
- Dark/light mode toggle
- Custom scrollbar styling
- Smooth page transitions

## 📝 License

This is a demonstration project for Jwellbox Club.

## 🤝 Support

For support, email support@jwellbox.club or join our WhatsApp community.

---

**Built with ❤️ in India** 🇮🇳

*"Sone ka sapna, ab hoga poora!"* 💛
