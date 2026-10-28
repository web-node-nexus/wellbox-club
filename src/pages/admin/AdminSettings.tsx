import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Save, CheckCircle, DollarSign, Users, Calendar, Crown, AlertTriangle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';

export default function AdminSettings() {
  const { settings, updateSettings } = useApp();
  const { showToast } = useToast();
  const [formData, setFormData] = useState(settings);
  const [saved, setSaved] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('admin_settings');
    if (stored) {
      setFormData(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    setHasChanges(JSON.stringify(formData) !== JSON.stringify(settings));
  }, [formData, settings]);

  const handleSave = () => {
    updateSettings(formData);
    localStorage.setItem('admin_settings', JSON.stringify(formData));
    setSaved(true);
    setHasChanges(false);
    showToast('success', 'Settings saved successfully');
    setTimeout(() => setSaved(false), 3000);
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all settings to default?')) {
      const defaultSettings = {
        level1Commission: 10,
        level2Commission: 5,
        leaderCommission: 5,
        goldOrderCommission: 3,
        lockPeriodMonths: 12,
      };
      setFormData(defaultSettings);
      showToast('info', 'Settings reset to default');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">System Settings</h1>
          <p className="text-white/50 mt-1">Configure platform parameters and commission rates</p>
        </div>
        {hasChanges && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 px-4 py-2 bg-yellow-500/20 border border-yellow-500/30 rounded-xl"
          >
            <AlertTriangle className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-yellow-300">Unsaved changes</span>
          </motion.div>
        )}
      </div>

      {/* Success Message */}
      {saved && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="p-4 bg-green-500/20 border border-green-500/30 rounded-xl flex items-center gap-3"
        >
          <CheckCircle className="w-5 h-5 text-green-400" />
          <p className="text-sm text-green-300">Settings saved successfully!</p>
        </motion.div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Commission Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Commission Rates</h3>
              <p className="text-sm text-white/50">Configure commission percentages</p>
            </div>
          </div>
          <div className="space-y-5">
            <div>
              <label className="flex items-center justify-between text-sm text-white/70 mb-2">
                <span className="font-medium">Level 1 Commission (%)</span>
                <span className="text-amber-400 font-bold text-lg">{formData.level1Commission}%</span>
              </label>
              <input
                type="range"
                min="0"
                max="20"
                step="0.5"
                value={formData.level1Commission}
                onChange={e => setFormData({ ...formData, level1Commission: Number(e.target.value) })}
                className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-gradient-to-br [&::-webkit-slider-thumb]:from-amber-400 [&::-webkit-slider-thumb]:to-yellow-600 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-lg"
              />
              <p className="text-xs text-white/40 mt-2">Commission on direct referral's contribution</p>
            </div>
            <div>
              <label className="flex items-center justify-between text-sm text-white/70 mb-2">
                <span className="font-medium">Level 2 Commission (%)</span>
                <span className="text-blue-400 font-bold text-lg">{formData.level2Commission}%</span>
              </label>
              <input
                type="range"
                min="0"
                max="15"
                step="0.5"
                value={formData.level2Commission}
                onChange={e => setFormData({ ...formData, level2Commission: Number(e.target.value) })}
                className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-gradient-to-br [&::-webkit-slider-thumb]:from-blue-400 [&::-webkit-slider-thumb]:to-indigo-600 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-lg"
              />
              <p className="text-xs text-white/40 mt-2">Commission on referral-of-referral's contribution</p>
            </div>
            <div>
              <label className="flex items-center justify-between text-sm text-white/70 mb-2">
                <span className="font-medium">Leader Commission (%)</span>
                <span className="text-purple-400 font-bold text-lg">{formData.leaderCommission}%</span>
              </label>
              <input
                type="range"
                min="0"
                max="15"
                step="0.5"
                value={formData.leaderCommission}
                onChange={e => setFormData({ ...formData, leaderCommission: Number(e.target.value) })}
                className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-gradient-to-br [&::-webkit-slider-thumb]:from-purple-400 [&::-webkit-slider-thumb]:to-pink-600 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-lg"
              />
              <p className="text-xs text-white/40 mt-2">Monthly payout on team's total income</p>
            </div>
            <div>
              <label className="flex items-center justify-between text-sm text-white/70 mb-2">
                <span className="font-medium">Gold Order Commission (%)</span>
                <span className="text-green-400 font-bold text-lg">{formData.goldOrderCommission}%</span>
              </label>
              <input
                type="range"
                min="0"
                max="10"
                step="0.5"
                value={formData.goldOrderCommission}
                onChange={e => setFormData({ ...formData, goldOrderCommission: Number(e.target.value) })}
                className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-gradient-to-br [&::-webkit-slider-thumb]:from-green-400 [&::-webkit-slider-thumb]:to-emerald-600 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-lg"
              />
              <p className="text-xs text-white/40 mt-2">Commission on referred gold orders</p>
            </div>
          </div>
        </motion.div>

        {/* System Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <SettingsIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold">System Configuration</h3>
              <p className="text-sm text-white/50">Platform settings and rules</p>
            </div>
          </div>
          <div className="space-y-5">
            <div>
              <label className="flex items-center justify-between text-sm text-white/70 mb-2">
                <span className="font-medium">Contribution Lock Period (Months)</span>
                <span className="text-blue-400 font-bold text-lg">{formData.lockPeriodMonths} months</span>
              </label>
              <input
                type="range"
                min="6"
                max="24"
                step="1"
                value={formData.lockPeriodMonths}
                onChange={e => setFormData({ ...formData, lockPeriodMonths: Number(e.target.value) })}
                className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-gradient-to-br [&::-webkit-slider-thumb]:from-blue-400 [&::-webkit-slider-thumb]:to-indigo-600 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-lg"
              />
              <p className="text-xs text-white/40 mt-2">How long contributions are locked before withdrawal</p>
            </div>

            {/* Info Cards */}
            <div className="space-y-3 pt-4">
              <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                <div className="flex items-start gap-3">
                  <Crown className="w-5 h-5 text-amber-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-amber-300 mb-1">Leader Promotion Rule</p>
                    <p className="text-xs text-amber-200/70">
                      Members automatically become Leaders when they reach 100 team members (direct + indirect). Admin can also manually promote members.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-purple-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-purple-300 mb-1">Leader Payout Schedule</p>
                    <p className="text-xs text-purple-200/70">
                      Leader payouts are calculated and credited on the 3rd of every month at 10:00 AM via automated cron job.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-green-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-green-300 mb-1">Leader Income Rule</p>
                    <p className="text-xs text-green-200/70">
                      Leaders start earning income only when they have 10+ direct members under them. This ensures active team building.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleReset}
          className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl font-medium hover:bg-white/10 transition-colors"
        >
          Reset to Default
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          disabled={!hasChanges}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-purple-900 font-bold rounded-xl shadow-lg shadow-amber-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-5 h-5" />
          Save Settings
        </motion.button>
      </div>
    </div>
  );
}
