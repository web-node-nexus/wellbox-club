import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Save, CheckCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useState } from 'react';
import { useToast } from '../../context/ToastContext';

export default function AdminSettings() {
  const { settings, updateSettings } = useApp();
  const { showToast } = useToast();
  const [formData, setFormData] = useState(settings);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateSettings(formData);
    setSaved(true);
    showToast('success', 'Settings updated successfully', 'Success');
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">System Settings</h1>
        <p className="text-white/50 mt-1">Configure platform parameters</p>
      </div>

      {saved && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-green-500/20 border border-green-500/30 rounded-xl flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-400" />
          <p className="text-sm text-green-300">Settings saved successfully!</p>
        </motion.div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Commission Settings */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
              <SettingsIcon className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold">Commission Rates</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-white/60 mb-2">Level 1 Commission (%)</label>
              <input
                type="number"
                value={formData.level1Commission}
                onChange={e => setFormData(prev => ({ ...prev, level1Commission: Number(e.target.value) }))}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-amber-500/50"
              />
              <p className="text-xs text-white/40 mt-1">Commission on direct referral's contribution</p>
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-2">Level 2 Commission (%)</label>
              <input
                type="number"
                value={formData.level2Commission}
                onChange={e => setFormData(prev => ({ ...prev, level2Commission: Number(e.target.value) }))}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-amber-500/50"
              />
              <p className="text-xs text-white/40 mt-1">Commission on referral-of-referral's contribution</p>
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-2">Leader Commission (%)</label>
              <input
                type="number"
                value={formData.leaderCommission}
                onChange={e => setFormData(prev => ({ ...prev, leaderCommission: Number(e.target.value) }))}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-amber-500/50"
              />
              <p className="text-xs text-white/40 mt-1">Monthly payout on team's total income</p>
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-2">Gold Order Commission (%)</label>
              <input
                type="number"
                value={formData.goldOrderCommission}
                onChange={e => setFormData(prev => ({ ...prev, goldOrderCommission: Number(e.target.value) }))}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-amber-500/50"
              />
              <p className="text-xs text-white/40 mt-1">Commission on referred gold orders</p>
            </div>
          </div>
        </motion.div>

        {/* System Settings */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <SettingsIcon className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold">System Configuration</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-white/60 mb-2">Contribution Lock Period (Months)</label>
              <input
                type="number"
                value={formData.lockPeriodMonths}
                onChange={e => setFormData(prev => ({ ...prev, lockPeriodMonths: Number(e.target.value) }))}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-amber-500/50"
              />
              <p className="text-xs text-white/40 mt-1">How long contributions are locked before withdrawal</p>
            </div>
            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
              <p className="text-sm text-amber-300">
                <strong>Note:</strong> Leader milestone (100 members) and payout day (3rd of month) are configured in the backend cron jobs.
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Save Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleSave}
        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-purple-900 font-bold rounded-xl shadow-lg shadow-amber-500/30"
      >
        <Save className="w-5 h-5" />
        Save Settings
      </motion.button>
    </div>
  );
}
