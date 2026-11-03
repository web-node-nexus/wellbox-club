import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Users, ChevronRight, Search, Crown, Calendar } from 'lucide-react';
import { useMemo, useState } from 'react';
import { getDirectMembers, getTeamTree } from '../services/incomeService';
import { getTotalInvested } from '../services/investmentService';
import { BUSINESS_RULES, formatInr } from '../data/businessRules';
import type { RegisteredUser } from '../context/AuthContext';

type TreeNodeData = { user: RegisteredUser; children: TreeNodeData[] };

export default function Team() {
  const { user, getAllUsers } = useAuth();
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [viewingMember, setViewingMember] = useState<RegisteredUser | null>(null);

  const all = getAllUsers();

  const buildTree = (parentId: string): TreeNodeData[] => {
    return getDirectMembers(parentId, all)
      .filter(u => !search || u.name.toLowerCase().includes(search.toLowerCase()))
      .map(u => ({ user: u, children: buildTree(u.id) }));
  };

  const tree = useMemo(() => (user ? buildTree(user.id) : []), [user, all, search]);
  const team = user ? getTeamTree(user.id, all) : [];
  const directs = user ? getDirectMembers(user.id, all) : [];

  if (!user) return null;

  const toggleExpand = (id: string) => {
    const next = new Set(expanded);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpanded(next);
  };

  const TreeNode = ({ node, level = 0 }: { node: TreeNodeData; level?: number }) => {
    const hasChildren = node.children.length > 0;
    const isExpanded = expanded.has(node.user.id);

    return (
      <div className={level > 0 ? 'ml-6 border-l-2 border-amber-200 pl-4' : ''}>
        <div className="flex items-center gap-3 py-3 px-4 rounded-xl hover:bg-amber-50/50 transition-colors">
          {hasChildren ? (
            <motion.button
              type="button"
              onClick={() => toggleExpand(node.user.id)}
              animate={{ rotate: isExpanded ? 90 : 0 }}
              className="p-1 hover:bg-amber-100 rounded-lg"
            >
              <ChevronRight className="w-4 h-4 text-amber-500" />
            </motion.button>
          ) : (
            <div className="w-6" />
          )}
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
              node.user.isLeader || node.user.role === 'leader'
                ? 'bg-gradient-to-br from-yellow-400 to-amber-500 text-white'
                : 'bg-amber-100 text-amber-800'
            }`}
          >
            {node.user.name.charAt(0)}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="font-medium text-sm text-gray-900">{node.user.name}</p>
              {(node.user.isLeader || node.user.role === 'leader') && (
                <Crown className="w-3.5 h-3.5 text-amber-500" />
              )}
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {node.user.joinDate}
              </span>
              <span>{node.user.mobile}</span>
              <span>Invested {formatInr(getTotalInvested(node.user.id))}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setViewingMember(node.user)}
            className="text-xs text-amber-700 font-medium px-3 py-1.5 rounded-lg bg-amber-50"
          >
            View
          </button>
        </div>
        {hasChildren && isExpanded && (
          <div>{node.children.map(c => <TreeNode key={c.user.id} node={c} level={level + 1} />)}</div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Users className="w-7 h-7 text-amber-500" /> My Team
        </h1>
        <p className="text-gray-500 mt-1">
          Direct + downline · Leader at {BUSINESS_RULES.leaderTeamRequirement} members
        </p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <p className="text-2xl font-bold text-gray-900">{team.length}</p>
          <p className="text-sm text-gray-500">Total Team</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <p className="text-2xl font-bold text-gray-900">{directs.length}</p>
          <p className="text-sm text-gray-500">Direct (Level 1)</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <p className="text-2xl font-bold text-gray-900">
            {team.filter(u => u.isLeader || u.role === 'leader').length}
          </p>
          <p className="text-sm text-gray-500">Leaders in team</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search team members..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        {tree.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="font-medium">No referrals yet</p>
            <p className="text-sm mt-1">
              Share code <span className="font-mono font-semibold text-amber-700">{user.referralCode}</span> to grow
              your team
            </p>
          </div>
        ) : (
          tree.map(n => <TreeNode key={n.user.id} node={n} />)
        )}
      </div>

      {viewingMember && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={() => setViewingMember(null)}
        >
          <div className="bg-white rounded-2xl p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-gray-900">{viewingMember.name}</h3>
            <p className="text-sm text-gray-500 mt-1">{viewingMember.mobile}</p>
            <p className="text-sm text-gray-600 mt-3">Joined {viewingMember.joinDate}</p>
            <p className="text-sm text-gray-600">Role: {viewingMember.role}</p>
            <p className="text-sm text-gray-600">
              Invested: {formatInr(getTotalInvested(viewingMember.id))}
            </p>
            <p className="text-sm text-gray-600">Code: {viewingMember.referralCode || '—'}</p>
            <button
              onClick={() => setViewingMember(null)}
              className="mt-6 w-full py-2.5 bg-gray-100 rounded-xl font-medium"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
