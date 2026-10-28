import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Eye, Crown, UserX, Download, Edit, Trash2, Plus, X, Save, Users as UsersIcon, Shield, TrendingUp, ChevronRight, ChevronDown, Mail, Phone, Calendar, MapPin, Copy, CheckCircle, MoreVertical, Ban, Check, AlertCircle } from 'lucide-react';
import { users as initialUsers } from '../../data/mockData';
import { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  referralCode: string;
  referredBy: string | null;
  isLeader: boolean;
  teamSize: number;
  joinDate: string;
  status: 'active' | 'blocked';
  city?: string;
}

export default function AdminUsers() {
  const { showToast } = useToast();
  const [users, setUsers] = useState<User[]>(() => {
    const stored = localStorage.getItem('admin_users');
    return stored ? JSON.parse(stored) : initialUsers.map(u => ({ ...u, status: 'active' as const }));
  });
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  const [showReferralTree, setShowReferralTree] = useState(false);
  const [expandedUsers, setExpandedUsers] = useState<Set<string>>(new Set());
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    referralCode: '',
    isLeader: false,
    city: '',
  });

  useEffect(() => {
    localStorage.setItem('admin_users', JSON.stringify(users));
  }, [users]);

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || 
                         u.email.toLowerCase().includes(search.toLowerCase()) ||
                         u.phone.includes(search) ||
                         u.referralCode.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || 
                         (filter === 'leaders' && u.isLeader) ||
                         (filter === 'members' && !u.isLeader) ||
                         (filter === 'blocked' && u.status === 'blocked') ||
                         (filter === 'active' && u.status === 'active');
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: users.length,
    leaders: users.filter(u => u.isLeader).length,
    members: users.filter(u => !u.isLeader).length,
    active: users.filter(u => u.status === 'active').length,
    blocked: users.filter(u => u.status === 'blocked').length,
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setFormData({ name: '', email: '', phone: '', referralCode: '', isLeader: false, city: '' });
    setShowModal(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      referralCode: user.referralCode,
      isLeader: user.isLeader,
      city: user.city || '',
    });
    setShowModal(true);
  };

  const handleSaveUser = () => {
    if (!formData.name || !formData.email || !formData.phone) {
      showToast('error', 'Please fill all required fields');
      return;
    }

    if (editingUser) {
      setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...formData } : u));
      showToast('success', 'User updated successfully');
    } else {
      const newUser: User = {
        id: String(Date.now()),
        ...formData,
        referredBy: null,
        teamSize: 0,
        joinDate: new Date().toISOString().split('T')[0],
        status: 'active',
      };
      setUsers([...users, newUser]);
      showToast('success', 'User added successfully');
    }
    setShowModal(false);
  };

  const handleDeleteUser = (id: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(u => u.id !== id));
      showToast('success', 'User deleted successfully');
    }
  };

  const handleToggleStatus = (id: string) => {
    setUsers(users.map(u => 
      u.id === id ? { ...u, status: u.status === 'active' ? 'blocked' : 'active' } : u
    ));
    showToast('success', 'User status updated');
  };

  const handlePromoteToLeader = (id: string) => {
    const user = users.find(u => u.id === id);
    if (user && user.teamSize < 100) {
      if (!confirm(`This user has only ${user.teamSize} team members. Leader status requires 100+ members. Continue anyway?`)) {
        return;
      }
    }
    setUsers(users.map(u => 
      u.id === id ? { ...u, isLeader: true } : u
    ));
    showToast('success', 'User promoted to Leader');
  };

  const handleBulkAction = (action: 'block' | 'unblock' | 'delete' | 'promote') => {
    if (selectedUsers.length === 0) {
      showToast('error', 'Please select users first');
      return;
    }

    const count = selectedUsers.length;
    if (!confirm(`Are you sure you want to ${action} ${count} user(s)?`)) {
      return;
    }

    switch (action) {
      case 'block':
        setUsers(users.map(u => selectedUsers.includes(u.id) ? { ...u, status: 'blocked' } : u));
        showToast('success', `${count} users blocked`);
        break;
      case 'unblock':
        setUsers(users.map(u => selectedUsers.includes(u.id) ? { ...u, status: 'active' } : u));
        showToast('success', `${count} users unblocked`);
        break;
      case 'delete':
        setUsers(users.filter(u => !selectedUsers.includes(u.id)));
        showToast('success', `${count} users deleted`);
        break;
      case 'promote':
        setUsers(users.map(u => selectedUsers.includes(u.id) ? { ...u, isLeader: true } : u));
        showToast('success', `${count} users promoted to Leader`);
        break;
    }
    setSelectedUsers([]);
    setShowBulkActions(false);
  };

  const toggleSelectUser = (id: string) => {
    setSelectedUsers(prev => 
      prev.includes(id) ? prev.filter(uid => uid !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(u => u.id));
    }
  };

  const toggleUserExpansion = (id: string) => {
    const newExpanded = new Set(expandedUsers);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedUsers(newExpanded);
  };

  const getReferrals = (userId: string): User[] => {
    return users.filter(u => u.referredBy === userId);
  };

  const exportCSV = () => {
    const csv = 'ID,Name,Email,Phone,Referral Code,Team Size,Leader,Status,City,Join Date\n' +
      filteredUsers.map(u => `${u.id},"${u.name}","${u.email}","${u.phone}","${u.referralCode}",${u.teamSize},${u.isLeader},${u.status},"${u.city || ''}",${u.joinDate}`).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'users.csv';
    a.click();
    showToast('success', 'Users exported successfully');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast('success', 'Copied to clipboard');
  };

  const ReferralTreeNode = ({ user, level = 0 }: { user: User; level?: number }) => {
    const referrals = getReferrals(user.id);
    const isExpanded = expandedUsers.has(user.id);

    return (
      <div className="ml-4">
        <div className="flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-white/5 transition-colors">
          {referrals.length > 0 && (
            <button
              onClick={() => toggleUserExpansion(user.id)}
              className="p-1 hover:bg-white/10 rounded transition-colors"
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
          )}
          {referrals.length === 0 && <div className="w-6" />}
          
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
            user.isLeader ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-purple-900' : 'bg-white/10 text-white/60'
          }`}>
            {user.name.charAt(0)}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-medium text-sm truncate">{user.name}</p>
              {user.isLeader && <Crown className="w-3 h-3 text-amber-400 flex-shrink-0" />}
            </div>
            <p className="text-xs text-white/50 truncate">{user.phone}</p>
          </div>
          
          <span className="text-xs px-2 py-1 bg-white/5 rounded-full text-white/60">
            {referrals.length} refs
          </span>
          
          <button
            onClick={() => setViewingUser(user)}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
        
        <AnimatePresence>
          {isExpanded && referrals.length > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-l-2 border-white/10 ml-6"
            >
              {referrals.map(ref => (
                <ReferralTreeNode key={ref.id} user={ref} level={level + 1} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Users Management</h1>
          <p className="text-white/50 mt-1">Manage all platform users and leaders</p>
        </div>
        <div className="flex gap-3">
          <motion.button 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }} 
            onClick={() => setShowReferralTree(!showReferralTree)}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm hover:bg-white/10 transition-colors"
          >
            <TrendingUp className="w-4 h-4" />
            {showReferralTree ? 'List View' : 'Tree View'}
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }} 
            onClick={exportCSV} 
            className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm hover:bg-white/10 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }} 
            onClick={handleAddUser} 
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-purple-900 font-bold rounded-xl shadow-lg"
          >
            <Plus className="w-4 h-4" />
            Add User
          </motion.button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Total Users', value: stats.total, icon: UsersIcon, color: 'from-blue-500 to-cyan-600' },
          { label: 'Leaders', value: stats.leaders, icon: Crown, color: 'from-amber-500 to-orange-600' },
          { label: 'Members', value: stats.members, icon: UsersIcon, color: 'from-purple-500 to-pink-600' },
          { label: 'Active', value: stats.active, icon: Shield, color: 'from-green-500 to-emerald-600' },
          { label: 'Blocked', value: stats.blocked, icon: UserX, color: 'from-red-500 to-rose-600' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-5 hover:border-amber-500/20 transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-xs text-white/50 mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Bulk Actions Bar */}
      {selectedUsers.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-xl p-4 flex items-center justify-between"
        >
          <span className="text-sm font-medium text-amber-300">
            {selectedUsers.length} user(s) selected
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => handleBulkAction('promote')}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 rounded-lg text-xs font-medium transition-colors flex items-center gap-1"
            >
              <Crown className="w-3 h-3" />
              Promote
            </button>
            <button
              onClick={() => handleBulkAction('block')}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 rounded-lg text-xs font-medium transition-colors flex items-center gap-1"
            >
              <Ban className="w-3 h-3" />
              Block
            </button>
            <button
              onClick={() => handleBulkAction('unblock')}
              className="px-3 py-1.5 bg-green-600 hover:bg-green-700 rounded-lg text-xs font-medium transition-colors flex items-center gap-1"
            >
              <Check className="w-3 h-3" />
              Unblock
            </button>
            <button
              onClick={() => handleBulkAction('delete')}
              className="px-3 py-1.5 bg-red-700 hover:bg-red-800 rounded-lg text-xs font-medium transition-colors flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" />
              Delete
            </button>
            <button
              onClick={() => setSelectedUsers([])}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-medium transition-colors"
            >
              Clear
            </button>
          </div>
        </motion.div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, email, phone, or referral code..."
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm focus:border-amber-500/50"
          />
        </div>
        <select value={filter} onChange={e => setFilter(e.target.value)} className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm focus:border-amber-500/50">
          <option value="all">All Users</option>
          <option value="leaders">Leaders Only</option>
          <option value="members">Members Only</option>
          <option value="active">Active Only</option>
          <option value="blocked">Blocked Only</option>
        </select>
      </div>

      {/* Tree View */}
      {showReferralTree ? (
        <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Referral Tree
          </h3>
          <div className="space-y-1">
            {users.filter(u => !u.referredBy).map(rootUser => (
              <ReferralTreeNode key={rootUser.id} user={rootUser} />
            ))}
          </div>
        </div>
      ) : (
        /* List View */
        <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr className="text-left text-xs text-white/50">
                  <th className="px-6 py-4 font-medium">
                    <input
                      type="checkbox"
                      checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 rounded"
                    />
                  </th>
                  <th className="px-6 py-4 font-medium">User</th>
                  <th className="px-6 py-4 font-medium">Contact</th>
                  <th className="px-6 py-4 font-medium">Referral Code</th>
                  <th className="px-6 py-4 font-medium">Team Size</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Role</th>
                  <th className="px-6 py-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredUsers.map(user => (
                  <tr key={user.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => toggleSelectUser(user.id)}
                        className="w-4 h-4 rounded"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                          user.isLeader ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-purple-900' : 'bg-white/10 text-white/60'
                        }`}>
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{user.name}</p>
                          <p className="text-xs text-white/50">Joined {user.joinDate}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm">{user.email}</p>
                      <p className="text-xs text-white/50">{user.phone}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-mono">{user.referralCode}</span>
                        <button
                          onClick={() => copyToClipboard(user.referralCode)}
                          className="p-1 hover:bg-white/10 rounded transition-colors"
                          title="Copy"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">{user.teamSize}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        user.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {user.isLeader ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-500/20 text-amber-400 text-xs font-medium rounded-full">
                          <Crown className="w-3 h-3" /> Leader
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 bg-white/10 text-white/60 text-xs font-medium rounded-full">Member</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => setViewingUser(user)} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors" title="View">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleEditUser(user)} className="p-1.5 hover:bg-blue-500/20 rounded-lg transition-colors text-blue-400" title="Edit">
                          <Edit className="w-4 h-4" />
                        </button>
                        {!user.isLeader && (
                          <button onClick={() => handlePromoteToLeader(user.id)} className="p-1.5 hover:bg-amber-500/20 rounded-lg transition-colors text-amber-400" title="Promote to Leader">
                            <Crown className="w-4 h-4" />
                          </button>
                        )}
                        <button onClick={() => handleToggleStatus(user.id)} className="p-1.5 hover:bg-yellow-500/20 rounded-lg transition-colors text-yellow-400" title={user.status === 'active' ? 'Block' : 'Unblock'}>
                          {user.status === 'active' ? <UserX className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                        </button>
                        <button onClick={() => handleDeleteUser(user.id)} className="p-1.5 hover:bg-red-500/20 rounded-lg transition-colors text-red-400" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit User Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-b from-slate-900 to-purple-950 rounded-2xl max-w-lg w-full p-6 border border-amber-500/20"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">{editingUser ? 'Edit User' : 'Add New User'}</h3>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white/10 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-white/60 mb-1">Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-amber-500/50"
                    placeholder="Enter user name"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-1">Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-amber-500/50"
                    placeholder="Enter email"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-1">Phone *</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-amber-500/50"
                    placeholder="Enter phone number"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-1">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={e => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-amber-500/50"
                    placeholder="Enter city"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-1">Referral Code</label>
                  <input
                    type="text"
                    value={formData.referralCode}
                    onChange={e => setFormData({ ...formData, referralCode: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-amber-500/50"
                    placeholder="Enter referral code"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isLeader"
                    checked={formData.isLeader}
                    onChange={e => setFormData({ ...formData, isLeader: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <label htmlFor="isLeader" className="text-sm text-white/80">Mark as Leader</label>
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl font-medium hover:bg-white/10"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveUser}
                    className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-purple-900 font-bold rounded-xl flex items-center justify-center gap-2"
                  >
                    <Save className="w-5 h-5" />
                    {editingUser ? 'Update' : 'Add'} User
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View User Modal */}
      <AnimatePresence>
        {viewingUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => setViewingUser(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-b from-slate-900 to-purple-950 rounded-2xl max-w-lg w-full p-6 border border-amber-500/20"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">User Details</h3>
                <button onClick={() => setViewingUser(null)} className="p-2 hover:bg-white/10 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-2xl ${
                    viewingUser.isLeader ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-purple-900' : 'bg-white/10 text-white/60'
                  }`}>
                    {viewingUser.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xl font-bold">{viewingUser.name}</p>
                    <p className="text-sm text-white/60">{viewingUser.email}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white/5 rounded-xl">
                    <div className="flex items-center gap-2 mb-1">
                      <Phone className="w-4 h-4 text-white/40" />
                      <p className="text-xs text-white/50">Phone</p>
                    </div>
                    <p className="font-medium">{viewingUser.phone}</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl">
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin className="w-4 h-4 text-white/40" />
                      <p className="text-xs text-white/50">City</p>
                    </div>
                    <p className="font-medium">{viewingUser.city || 'Not specified'}</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl">
                    <div className="flex items-center gap-2 mb-1">
                      <Copy className="w-4 h-4 text-white/40" />
                      <p className="text-xs text-white/50">Referral Code</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="font-mono font-medium">{viewingUser.referralCode}</p>
                      <button
                        onClick={() => copyToClipboard(viewingUser.referralCode)}
                        className="p-1 hover:bg-white/10 rounded transition-colors"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl">
                    <div className="flex items-center gap-2 mb-1">
                      <UsersIcon className="w-4 h-4 text-white/40" />
                      <p className="text-xs text-white/50">Team Size</p>
                    </div>
                    <p className="font-medium">{viewingUser.teamSize} members</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="w-4 h-4 text-white/40" />
                      <p className="text-xs text-white/50">Join Date</p>
                    </div>
                    <p className="font-medium">{viewingUser.joinDate}</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl">
                    <div className="flex items-center gap-2 mb-1">
                      <Shield className="w-4 h-4 text-white/40" />
                      <p className="text-xs text-white/50">Status</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      viewingUser.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {viewingUser.status}
                    </span>
                  </div>
                </div>
                <div className="p-4 bg-white/5 rounded-xl">
                  <div className="flex items-center gap-2 mb-1">
                    <Crown className="w-4 h-4 text-white/40" />
                    <p className="text-xs text-white/50">Role</p>
                  </div>
                  {viewingUser.isLeader ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-500/20 text-amber-400 text-xs font-medium rounded-full">
                      <Crown className="w-3 h-3" /> Leader
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 bg-white/10 text-white/60 text-xs font-medium rounded-full">Member</span>
                  )}
                </div>
                <button
                  onClick={() => setViewingUser(null)}
                  className="w-full py-3 bg-white/5 border border-white/10 rounded-xl font-medium hover:bg-white/10"
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
