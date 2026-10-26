import { motion } from 'framer-motion';
import { Gem, Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { goldDesigns } from '../../data/mockData';
import { useState } from 'react';
import { useToast } from '../../context/ToastContext';

export default function AdminGoldShowroom() {
  const { showToast } = useToast();
  const [showAddModal, setShowAddModal] = useState(false);

  const handleToggleActive = (id: string) => {
    showToast('success', 'Design status updated', 'Success');
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this design?')) {
      showToast('success', 'Design deleted', 'Deleted');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gold Showroom</h1>
          <p className="text-white/50 mt-1">Manage gold designs and inventory</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-purple-900 font-bold rounded-xl shadow-lg shadow-amber-500/30"
        >
          <Plus className="w-4 h-4" />
          Add Design
        </motion.button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-5">
          <Gem className="w-8 h-8 text-amber-400 mb-2" />
          <p className="text-2xl font-bold">{goldDesigns.length}</p>
          <p className="text-xs text-white/50 mt-1">Total Designs</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-5">
          <Eye className="w-8 h-8 text-green-400 mb-2" />
          <p className="text-2xl font-bold">{goldDesigns.filter(d => d.images.length > 0).length}</p>
          <p className="text-xs text-white/50 mt-1">Active</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-5">
          <p className="text-2xl font-bold">{new Set(goldDesigns.map(d => d.category)).size}</p>
          <p className="text-xs text-white/50 mt-1">Categories</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-5">
          <p className="text-2xl font-bold">{goldDesigns.reduce((sum, d) => sum + d.weightGrams, 0).toFixed(0)}g</p>
          <p className="text-xs text-white/50 mt-1">Total Weight</p>
        </motion.div>
      </div>

      {/* Designs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {goldDesigns.map((design, i) => (
          <motion.div
            key={design.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl overflow-hidden hover:border-amber-500/20 transition-all"
          >
            <div className="h-40 bg-gradient-to-br from-amber-900/20 to-purple-900/20 flex items-center justify-center relative">
              <span className="text-6xl">💎</span>
              <div className="absolute top-2 right-2 flex gap-1">
                <span className="px-2 py-0.5 bg-white/10 rounded text-[10px] text-amber-300">{design.purity}</span>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-sm mb-1">{design.name}</h3>
              <p className="text-xs text-white/50 mb-3">{design.category}</p>
              <div className="flex items-center justify-between text-xs">
                <span className="text-amber-400 font-bold">{design.weightGrams}g</span>
                <span className="text-white/40">{design.makingCharges}</span>
              </div>
              <div className="flex gap-2 mt-4">
                <button className="flex-1 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1">
                  <Edit className="w-3 h-3" /> Edit
                </button>
                <button onClick={() => handleToggleActive(design.id)} className="flex-1 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1">
                  <EyeOff className="w-3 h-3" /> Toggle
                </button>
                <button onClick={() => handleDelete(design.id)} className="py-2 px-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-xs font-medium transition-colors">
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add Design Modal */}
      {showAddModal && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setShowAddModal(false)}>
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-gradient-to-b from-slate-900 to-purple-950 rounded-2xl max-w-lg w-full p-6 border border-amber-500/20" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold mb-4">Add New Gold Design</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm text-white/60 mb-1">Design Name</label>
                <input type="text" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl" placeholder="e.g., Royal Necklace Set" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-white/60 mb-1">Category</label>
                  <select className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl">
                    <option>Necklace</option>
                    <option>Bangles</option>
                    <option>Chain</option>
                    <option>Ring</option>
                    <option>Earrings</option>
                    <option>Coins</option>
                    <option>Set</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-1">Purity</label>
                  <select className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl">
                    <option>22K</option>
                    <option>24K</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm text-white/60 mb-1">Weight (grams)</label>
                <input type="number" step="0.1" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl" placeholder="e.g., 45.5" />
              </div>
              <div>
                <label className="block text-sm text-white/60 mb-1">Making Charges</label>
                <input type="text" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl" placeholder="e.g., ₹800/gram" />
              </div>
              <div>
                <label className="block text-sm text-white/60 mb-1">Description</label>
                <textarea rows={3} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl resize-none" placeholder="Describe the design..." />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl font-medium">Cancel</button>
                <button type="button" onClick={() => { showToast('success', 'Design added successfully', 'Success'); setShowAddModal(false); }} className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-purple-900 font-bold rounded-xl">Add Design</button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
