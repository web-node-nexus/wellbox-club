import { motion } from 'framer-motion';
import { Bell, DollarSign, Crown, Gift, Info } from 'lucide-react';

export default function Notifications() {
  const notifications = [
    { id: 1, type: 'commission', title: 'Commission Credited', message: '₹500 Level 1 commission from Priya Sharma', time: '2 hours ago', icon: DollarSign, color: 'text-green-400' },
    { id: 2, type: 'leader', title: 'Leader Payout', message: 'Monthly leader payout of ₹1,800 credited', time: '3 days ago', icon: Crown, color: 'text-amber-400' },
    { id: 3, type: 'gold', title: 'Gold Order Bonus', message: '₹450 commission from gold order', time: '1 week ago', icon: Gift, color: 'text-purple-400' },
    { id: 4, type: 'info', title: 'Welcome to Jewellbox', message: 'Your account has been created successfully', time: '2 weeks ago', icon: Info, color: 'text-blue-400' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold">Notifications</h1>
        <p className="text-white/50 mt-1">Stay updated with your activity</p>
      </div>

      <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6">
        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="w-12 h-12 text-white/20 mx-auto mb-3" />
            <p className="text-white/50">No notifications yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map(notif => (
              <motion.div key={notif.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-start gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                <div className={`w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <notif.icon className={`w-5 h-5 ${notif.color}`} />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{notif.title}</p>
                  <p className="text-sm text-white/60 mt-0.5">{notif.message}</p>
                  <p className="text-xs text-white/40 mt-1">{notif.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
