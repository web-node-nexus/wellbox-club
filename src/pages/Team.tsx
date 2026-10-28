import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, ChevronDown, ChevronRight, Search, Crown, Calendar, DollarSign, Eye, X } from 'lucide-react';
import { users } from '../data/mockData';
import { useState } from 'react';

export default function Team() {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [viewingMember, setViewingMember] = useState<any>(null);
  if (!user) return null;

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expanded);
    if (newExpanded.has(id)) newExpanded.delete(id);
    else newExpanded.add(id);
    setExpanded(newExpanded);
  };

  const buildTree = (parentId: string): any[] => {
    return users
      .filter(u => u.referredBy === parentId && (search === '' || u.name.toLowerCase().includes(search.toLowerCase())))
      .map(u => ({ user: u, children: buildTree(u.id) }));
  };

  const tree = buildTree(user.id);

  const stats = {
    totalMembers: users.filter(u => {
      let current = u;
      while (current.referredBy) {
        if (current.referredBy === user.id) return true;
        current = users.find(x => x.id === current.referredBy)!;
        if (!current) break;
      }
      return false;
    }).length,
    directMembers: users.filter(u => u.referredBy === user.id).length,
    leaders: users.filter(u => {
      let current = u;
      while (current.referredBy) {
        if (current.referredBy === user.id) return u.isLeader;
        current = users.find(x => x.id === current.referredBy)!;
        if (!current) break;
      }
      return false;
    }).length,
  };

  const TreeNode = ({ node, level = 0 }: { node: any; level?: number }) => {
    const hasChildren = node.children.length > 0;
    const isExpanded = expanded.has(node.user.id);

    return (
      <div className={`${level > 0 ? 'ml-6 border-l-2 border-amber-500/20 pl-4' : ''}`}>
        <div className="flex items-center gap-3 py-3 px-4 rounded-xl hover:bg-white/5 transition-colors">
          {hasChildren ? (
            <motion.button
              onClick={() => toggleExpand(node.user.id)}
              animate={{ rotate: isExpanded ? 90 : 0 }}
              className="p-1 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-amber-400" />
            </motion.button>
          ) : (
            <div className="w-6" />
          )}
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
            node.user.isLeader ? 'bg-gradient-to-br from-yellow-400 to-amber-500 text-purple-900' : 'bg-white/10 text-white/60'
          }`}>
            {node.user.name.charAt(0)}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="font-medium text-sm">{node.user.name}</p>
              {node.user.isLeader && <Crown className="w-3.5 h-3.5 text-amber-400" />}
            </div>
            <div className="flex items-center gap-3 text-xs text-white/50">
              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{node.user.joinDate}</span>
              <span>{node.children.length} direct</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2 py-1 bg-amber-500/10 text-amber-400 rounded-full">L{level + 1}</span>
            <button
              onClick={() => setViewingMember(node.user)}
              className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
              title="View Details"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>
        </div>
        <AnimatePresence>
          {isExpanded && hasChildren && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
              {node.children.map((child: any, i: number) => (
                <TreeNode key={i} node={child} level={level + 1} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold">My Team</h1>
        <p className="text-white/50 mt-1">View your referral network and team structure</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalMembers}</p>
              <p className="text-sm text-gray-500">Total Team</p>
            </div>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.directMembers}</p>
              <p className="text-sm text-gray-500">Direct Referrals</p>
            </div>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
              <Crown className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.leaders}</p>
              <p className="text-sm text-gray-500">Team Leaders</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search team members..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            />
          </div>
        </div>

        {tree.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No team members yet. Start referring!</p>
          </div>
        ) : (
          <div className="space-y-1">
            {tree.map((node, i) => (
              <TreeNode key={i} node={node} />
            ))}
          </div>
        )}
      </div>

      {/* View Member Modal */}
      <AnimatePresence>
        {viewingMember && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => setViewingMember(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Member Details</h3>
                <button onClick={() => setViewingMember(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-2xl ${
                    viewingMember.isLeader ? 'bg-gradient-to-br from-yellow-400 to-amber-500 text-purple-900' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {viewingMember.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xl font-bold text-gray-900">{viewingMember.name}</p>
                    <p className="text-sm text-gray-500">{viewingMember.email}</p>
                    {viewingMember.isLeader && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full mt-1">
                        <Crown className="w-3 h-3" /> Leader
                      </span>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500 mb-1">Phone</p>
                    <p className="font-medium text-gray-900">{viewingMember.phone}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500 mb-1">Referral Code</p>
                    <p className="font-mono font-medium text-gray-900">{viewingMember.referralCode}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500 mb-1">Team Size</p>
                    <p className="font-medium text-gray-900">{viewingMember.teamSize} members</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500 mb-1">Join Date</p>
                    <p className="font-medium text-gray-900">{viewingMember.joinDate}</p>
                  </div>
                </div>
                <button
                  onClick={() => setViewingMember(null)}
                  className="w-full py-3 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
