import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, ChevronDown, ChevronRight, Search, Crown, Calendar } from 'lucide-react';
import { users } from '../data/mockData';
import { useState } from 'react';

export default function Team() {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
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

  const TreeNode = ({ node, level = 0 }: { node: any; level?: number }) => {
    const hasChildren = node.children.length > 0;
    const isExpanded = expanded.has(node.user.id);

    return (
      <div className={`${level > 0 ? 'ml-6 border-l-2 border-amber-500/20 pl-4' : ''}`}>
        <div className="flex items-center gap-3 py-3 px-4 rounded-xl hover:bg-white/5 transition-colors cursor-pointer" onClick={() => hasChildren && toggleExpand(node.user.id)}>
          {hasChildren ? (
            <motion.div animate={{ rotate: isExpanded ? 90 : 0 }}>
              <ChevronRight className="w-4 h-4 text-amber-400" />
            </motion.div>
          ) : (
            <div className="w-4" />
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
          <span className="text-xs px-2 py-1 bg-amber-500/10 text-amber-400 rounded-full">L{level + 1}</span>
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
        <p className="text-white/50 mt-1">View your referral network</p>
      </div>

      <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search members..."
              className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30"
            />
          </div>
        </div>

        {tree.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-white/20 mx-auto mb-3" />
            <p className="text-white/50">No team members yet. Start referring!</p>
          </div>
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
