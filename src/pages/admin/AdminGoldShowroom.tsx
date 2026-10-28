import { motion, AnimatePresence } from 'framer-motion';
import { Gem, Plus, Edit, Trash2, Eye, EyeOff, X, Save, Upload, Scale, Award } from 'lucide-react';
import { goldDesigns as initialDesigns } from '../../data/mockData';
import { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';

interface GoldDesign {
  id: string;
  name: string;
  category: string;
  weightGrams: number;
  purity: '22K' | '24K';
  makingCharges: string;
  description: string;
  images: string[];
  isActive: boolean;
}

export default function AdminGoldShowroom() {
  const { showToast } = useToast();
  const [designs, setDesigns] = useState<GoldDesign[]>(() => {
    const stored = localStorage.getItem('admin_gold_designs');
    return stored ? JSON.parse(stored) : initialDesigns.map(d => ({ ...d, isActive: true }));
  });
  const [showModal, setShowModal] = useState(false);
  const [editingDesign, setEditingDesign] = useState<GoldDesign | null>(null);
  const [viewingDesign, setViewingDesign] = useState<GoldDesign | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Necklace',
    weightGrams: 0,
    purity: '22K' as '22K' | '24K',
    makingCharges: '',
    description: '',
    images: [] as string[],
  });

  useEffect(() => {
    localStorage.setItem('admin_gold_designs', JSON.stringify(designs));
  }, [designs]);

  const stats = {
    total: designs.length,
    active: designs.filter(d => d.isActive).length,
    categories: new Set(designs.map(d => d.category)).size,
    totalWeight: designs.reduce((sum, d) => sum + d.weightGrams, 0),
  };

  const handleAddDesign = () => {
    setEditingDesign(null);
    setFormData({
      name: '',
      category: 'Necklace',
      weightGrams: 0,
      purity: '22K',
      makingCharges: '',
      description: '',
      images: [],
    });
    setShowModal(true);
  };

  const handleEditDesign = (design: GoldDesign) => {
    setEditingDesign(design);
    setFormData({
      name: design.name,
      category: design.category,
      weightGrams: design.weightGrams,
      purity: design.purity,
      makingCharges: design.makingCharges,
      description: design.description,
      images: design.images,
    });
    setShowModal(true);
  };

  const handleSaveDesign = () => {
    if (!formData.name || formData.weightGrams <= 0 || !formData.makingCharges) {
      showToast('error', 'Please fill all required fields');
      return;
    }

    if (editingDesign) {
      setDesigns(designs.map(d => d.id === editingDesign.id ? { ...d, ...formData } : d));
      showToast('success', 'Design updated successfully');
    } else {
      const newDesign: GoldDesign = {
        id: String(Date.now()),
        ...formData,
        isActive: true,
      };
      setDesigns([...designs, newDesign]);
      showToast('success', 'Design added successfully');
    }
    setShowModal(false);
  };

  const handleDeleteDesign = (id: string) => {
    if (confirm('Are you sure you want to delete this design?')) {
      setDesigns(designs.filter(d => d.id !== id));
      showToast('success', 'Design deleted successfully');
    }
  };

  const handleToggleActive = (id: string) => {
    setDesigns(designs.map(d => 
      d.id === id ? { ...d, isActive: !d.isActive } : d
    ));
    showToast('success', 'Design status updated');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData(prev => ({ ...prev, images: [...prev.images, reader.result as string] }));
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gold Showroom Management</h1>
          <p className="text-white/50 mt-1">Manage gold designs and inventory</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAddDesign}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-purple-900 font-bold rounded-xl shadow-lg"
        >
          <Plus className="w-4 h-4" />
          Add Design
        </motion.button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-5">
          <Gem className="w-8 h-8 text-amber-400 mb-2" />
          <p className="text-2xl font-bold">{stats.total}</p>
          <p className="text-xs text-white/50 mt-1">Total Designs</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-5">
          <Eye className="w-8 h-8 text-green-400 mb-2" />
          <p className="text-2xl font-bold">{stats.active}</p>
          <p className="text-xs text-white/50 mt-1">Active Designs</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-5">
          <Award className="w-8 h-8 text-purple-400 mb-2" />
          <p className="text-2xl font-bold">{stats.categories}</p>
          <p className="text-xs text-white/50 mt-1">Categories</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-5">
          <Scale className="w-8 h-8 text-blue-400 mb-2" />
          <p className="text-2xl font-bold">{stats.totalWeight.toFixed(0)}g</p>
          <p className="text-xs text-white/50 mt-1">Total Weight</p>
        </motion.div>
      </div>

      {/* Designs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {designs.map((design, i) => (
          <motion.div
            key={design.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`bg-white/5 backdrop-blur border rounded-2xl overflow-hidden hover:shadow-xl transition-all ${
              design.isActive ? 'border-white/10 hover:border-amber-500/20' : 'border-red-500/20 opacity-60'
            }`}
          >
            <div className="h-48 bg-gradient-to-br from-amber-900/20 to-purple-900/20 flex items-center justify-center relative">
              {design.images.length > 0 ? (
                <img src={design.images[0]} alt={design.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-6xl">💎</span>
              )}
              <div className="absolute top-2 right-2 flex gap-1">
                <span className="px-2 py-0.5 bg-white/10 rounded text-[10px] text-amber-300">{design.purity}</span>
                {!design.isActive && (
                  <span className="px-2 py-0.5 bg-red-500/20 rounded text-[10px] text-red-400">Inactive</span>
                )}
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-sm mb-1">{design.name}</h3>
              <p className="text-xs text-white/50 mb-3">{design.category}</p>
              <div className="flex items-center justify-between text-xs mb-4">
                <span className="text-amber-400 font-bold">{design.weightGrams}g</span>
                <span className="text-white/40">{design.makingCharges}</span>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setViewingDesign(design)}
                  className="flex-1 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1"
                >
                  <Eye className="w-3 h-3" /> View
                </button>
                <button 
                  onClick={() => handleEditDesign(design)}
                  className="flex-1 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1"
                >
                  <Edit className="w-3 h-3" /> Edit
                </button>
                <button 
                  onClick={() => handleToggleActive(design.id)}
                  className="py-2 px-3 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-medium transition-colors"
                  title={design.isActive ? 'Deactivate' : 'Activate'}
                >
                  {design.isActive ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                </button>
                <button 
                  onClick={() => handleDeleteDesign(design.id)}
                  className="py-2 px-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-xs font-medium transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add/Edit Design Modal */}
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
              className="bg-gradient-to-b from-slate-900 to-purple-950 rounded-2xl max-w-2xl w-full p-6 border border-amber-500/20 max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">{editingDesign ? 'Edit Design' : 'Add New Design'}</h3>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white/10 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-white/60 mb-1">Design Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-amber-500/50"
                    placeholder="e.g., Royal Necklace Set"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-white/60 mb-1">Category</label>
                    <select
                      value={formData.category}
                      onChange={e => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-amber-500/50"
                    >
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
                    <select
                      value={formData.purity}
                      onChange={e => setFormData({ ...formData, purity: e.target.value as '22K' | '24K' })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-amber-500/50"
                    >
                      <option value="22K">22K</option>
                      <option value="24K">24K</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-white/60 mb-1">Weight (grams) *</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.weightGrams}
                      onChange={e => setFormData({ ...formData, weightGrams: Number(e.target.value) })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-amber-500/50"
                      placeholder="e.g., 45.5"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-white/60 mb-1">Making Charges *</label>
                    <input
                      type="text"
                      value={formData.makingCharges}
                      onChange={e => setFormData({ ...formData, makingCharges: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-amber-500/50"
                      placeholder="e.g., ₹800/gram"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-amber-500/50 resize-none"
                    placeholder="Describe the design..."
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-1">Images</label>
                  <div className="border-2 border-dashed border-white/20 rounded-xl p-6 text-center hover:border-amber-500/30 transition-colors">
                    <Upload className="w-8 h-8 text-white/40 mx-auto mb-2" />
                    <p className="text-sm text-white/60 mb-2">Click to upload images</p>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm cursor-pointer hover:bg-white/10">
                      Choose Files
                    </label>
                  </div>
                  {formData.images.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mt-3">
                      {formData.images.map((img, i) => (
                        <div key={i} className="relative group">
                          <img src={img} alt={`Design ${i + 1}`} className="w-full h-24 object-cover rounded-lg" />
                          <button
                            onClick={() => removeImage(i)}
                            className="absolute top-1 right-1 p-1 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl font-medium hover:bg-white/10"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveDesign}
                    className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-purple-900 font-bold rounded-xl flex items-center justify-center gap-2"
                  >
                    <Save className="w-5 h-5" />
                    {editingDesign ? 'Update' : 'Add'} Design
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Design Modal */}
      <AnimatePresence>
        {viewingDesign && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => setViewingDesign(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-gradient-to-b from-slate-900 to-purple-950 rounded-2xl max-w-2xl w-full p-6 border border-amber-500/20"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">{viewingDesign.name}</h3>
                <button onClick={() => setViewingDesign(null)} className="p-2 hover:bg-white/10 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                {viewingDesign.images.length > 0 && (
                  <div className="grid grid-cols-2 gap-3">
                    {viewingDesign.images.map((img, i) => (
                      <img key={i} src={img} alt={`${viewingDesign.name} ${i + 1}`} className="w-full h-48 object-cover rounded-xl" />
                    ))}
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white/5 rounded-xl">
                    <p className="text-xs text-white/50 mb-1">Category</p>
                    <p className="font-medium">{viewingDesign.category}</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl">
                    <p className="text-xs text-white/50 mb-1">Purity</p>
                    <p className="font-medium">{viewingDesign.purity}</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl">
                    <p className="text-xs text-white/50 mb-1">Weight</p>
                    <p className="font-medium">{viewingDesign.weightGrams}g</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl">
                    <p className="text-xs text-white/50 mb-1">Making Charges</p>
                    <p className="font-medium">{viewingDesign.makingCharges}</p>
                  </div>
                </div>
                {viewingDesign.description && (
                  <div className="p-4 bg-white/5 rounded-xl">
                    <p className="text-xs text-white/50 mb-1">Description</p>
                    <p className="text-sm">{viewingDesign.description}</p>
                  </div>
                )}
                <button
                  onClick={() => setViewingDesign(null)}
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
