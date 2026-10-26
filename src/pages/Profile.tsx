import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { User, Phone, Tag, Calendar, Crown, Users, Copy, CheckCircle, Shield } from 'lucide-react';
import { useState } from 'react';
import { getCommissionWalletBalance, getContributionWalletBalance } from '../data/mockData';

export default function Profile() {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  if (!user) return null;

  const commissionBalance = getCommissionWalletBalance(user.id);
  const contributionBalance = getContributionWalletBalance(user.id);

  const copyCode = () => {
    navigator.clipboard.writeText(user.referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-500 mt-1">Manage your account details</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
        >
          <div className="text-center">
            <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center text-3xl font-bold ${
              user.isLeader ? 'bg-gradient-to-br from-yellow-400 to-amber-500 text-white' : 'bg-gradient-to-br from-gray-200 to-gray-300 text-gray-600'
            }`}>
              {user.name.charAt(0)}
            </div>
            <h2 className="text-xl font-bold text-gray-900 mt-4">{user.name}</h2>
            <div className="flex items-center justify-center gap-2 mt-2">
              {user.isLeader && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
                  <Crown className="w-3 h-3" /> Leader
                </span>
              )}
              {user.role === 'admin' && (
                <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">Admin</span>
              )}
              <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">Member</span>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <Phone className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Mobile</p>
                <p className="text-sm font-medium text-gray-900">+91 {user.mobile}</p>
              </div>
            </div>
            {user.city && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <User className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">City</p>
                  <p className="text-sm font-medium text-gray-900">{user.city}</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Member Since</p>
                <p className="text-sm font-medium text-gray-900">{user.joinDate}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Referral Info */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl p-6 text-white"
          >
            <div className="flex items-center gap-2 mb-3">
              <Tag className="w-5 h-5" />
              <h3 className="font-semibold">Your Referral Code</h3>
            </div>
            <div className="flex items-center gap-3">
              <p className="text-3xl font-bold font-mono">{user.referralCode}</p>
              <button
                onClick={copyCode}
                className="flex items-center gap-1 px-3 py-1.5 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
              >
                {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span className="text-xs">{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
            <p className="text-sm text-amber-100 mt-2">Share this code to earn commissions on referrals</p>
          </motion.div>

          {/* Account Stats */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <Shield className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-900">₹{commissionBalance.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">Commission Balance</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-900">{user.teamSize}</p>
                  <p className="text-sm text-gray-500">Team Members</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Leader Info */}
          {user.isLeader && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-2xl p-6 border border-yellow-200"
            >
              <div className="flex items-center gap-3 mb-3">
                <Crown className="w-6 h-6 text-amber-600" />
                <h3 className="font-semibold text-gray-900">Leader Benefits</h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Earn 5% of your team's total income monthly (credited on 3rd)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Priority support and dedicated account manager
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Exclusive leader events and recognition
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Team size: {user.teamSize} members
                </li>
              </ul>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
