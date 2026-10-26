import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Users, UserPlus, Crown, Copy, CheckCircle, Share2 } from 'lucide-react';
import { users, getDirectReferrals } from '../data/mockData';
import { useState } from 'react';

export default function Referrals() {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  if (!user) return null;

  const directReferrals = getDirectReferrals(user.id);
  const allTeamMembers = users.filter(u => {
    let current = u;
    while (current.referredBy) {
      if (current.referredBy === user.id) return true;
      current = users.find(x => x.id === current.referredBy)!;
      if (!current) break;
    }
    return false;
  });

  const copyCode = () => {
    navigator.clipboard.writeText(user.referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Build referral tree
  const buildTree = (parentId: string, level: number = 0): any[] => {
    if (level > 3) return [];
    const children = users.filter(u => u.referredBy === parentId);
    return children.map(child => ({
      user: child,
      level,
      children: buildTree(child.id, level + 1),
    }));
  };

  const tree = buildTree(user.id);

  const TreeNode = ({ node, depth = 0 }: { node: any; depth?: number }) => (
    <div className={`${depth > 0 ? 'ml-6 border-l-2 border-amber-200 pl-4' : ''}`}>
      <div className="flex items-center gap-3 py-2">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
          node.user.isLeader ? 'bg-gradient-to-br from-yellow-400 to-amber-500 text-white' : 'bg-gray-200 text-gray-600'
        }`}>
          {node.user.name.charAt(0)}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-gray-900">{node.user.name}</p>
            {node.user.isLeader && <Crown className="w-3.5 h-3.5 text-amber-500" />}
          </div>
          <p className="text-xs text-gray-500">Joined {node.user.joinDate} • Code: {node.user.referralCode}</p>
        </div>
        <span className="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded-full font-medium">L{depth + 1}</span>
      </div>
      {node.children.map((child: any, i: number) => (
        <TreeNode key={i} node={child} depth={depth + 1} />
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">My Referrals</h1>
        <p className="text-gray-500 mt-1">Track your referral network and team growth</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{directReferrals.length}</p>
              <p className="text-sm text-gray-500">Direct Referrals (L1)</p>
            </div>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{allTeamMembers.length}</p>
              <p className="text-sm text-gray-500">Total Team Size</p>
            </div>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
              <Crown className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{user.isLeader ? 'Active' : `${100 - allTeamMembers.length} more`}</p>
              <p className="text-sm text-gray-500">Leader Status</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Referral Code */}
      <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl p-6 border border-amber-100">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm text-amber-700 font-medium">Your Referral Code</p>
            <p className="text-3xl font-bold text-amber-900 mt-1 font-mono">{user.referralCode}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={copyCode} className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-xl border border-amber-200 hover:bg-amber-50 transition-colors">
              {copied ? <CheckCircle className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-amber-600" />}
              <span className="text-sm font-medium text-amber-700">{copied ? 'Copied!' : 'Copy Code'}</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-colors">
              <Share2 className="w-4 h-4" />
              <span className="text-sm font-medium">Share</span>
            </button>
          </div>
        </div>
      </div>

      {/* Direct Referrals List */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-4">Direct Referrals (Level 1)</h3>
        {directReferrals.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No direct referrals yet. Share your code to start building your team!</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {directReferrals.map(ref => (
              <div key={ref.id} className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-amber-200 transition-colors">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  ref.isLeader ? 'bg-gradient-to-br from-yellow-400 to-amber-500 text-white' : 'bg-gray-100 text-gray-600'
                }`}>
                  {ref.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-900">{ref.name}</p>
                    {ref.isLeader && <Crown className="w-4 h-4 text-amber-500" />}
                  </div>
                  <p className="text-sm text-gray-500">{ref.email} • Joined {ref.joinDate}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{ref.teamSize} members</p>
                  <p className="text-xs text-gray-500">in their team</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Referral Tree */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-4">Referral Tree</h3>
        {tree.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-8">Your referral tree will appear here once you start inviting members.</p>
        ) : (
          <div className="space-y-1">
            {tree.map((node, i) => (
              <TreeNode key={i} node={node} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
