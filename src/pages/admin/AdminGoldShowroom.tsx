import { motion, AnimatePresence } from 'framer-motion';
import { 
  Gem, Plus, Edit, Trash2, Eye, EyeOff, X, Save, Upload, Scale, Award, 
  Search, Filter, Download, Image as ImageIcon, Package, TrendingUp,
  CheckCircle, AlertCircle, Copy, RefreshCw, Archive, Star
} from 'lucide-react';
import { goldDesigns as initialDesigns } from '../../data/mockData';
import { useState, useEffect, useRef } from 'react';
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
  stock: number;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AdminGoldShowroom() {
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [designs, setDesigns] = useState<GoldDesign[]>(() => {
    const stored = localStorage.getItem('admin_gold_designs');
    if (stored) {
      return JSON.parse(stored);
    }
    return initialDesigns.map(d => ({ 
      ...d, 
      isActive: true,
      stock: Math.floor(Math.random() * 50) + 10,
      featured: Math.random() > 0.7,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
  });

  const [showModal, setShowModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [editingDesign, setEditingDesign] = useState<GoldDesign | null>(null);
  const [previewDesign, setPreviewDesign] = useState<GoldDesign | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterPurity, setFilterPurity] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedDesigns, setSelectedDesigns] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [formData, setFormData] = useState({
    name: '',
    category: 'Necklace',
    weightGrams: 0,
    purity: '22K' as '22K' | '24K',
    makingCharges: '',
    description: '',
    images: [] as string[],
    stock: 0,
    featured: false,
  });

  useEffect(() => {
    localStorage.setItem('admin_gold_designs', JSON.stringify(designs));
  }, [designs]);

  // Filter and search logic
  const filteredDesigns = designs.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         d.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || d.category === filterCategory;
    const matchesPurity = filterPurity === 'all' || d.purity === filterPurity;
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && d.isActive) ||
                         (filterStatus === 'inactive' && !d.isActive);
    return matchesSearch && matchesCategory && matchesPurity && matchesStatus;
  });

  // Statistics
  const stats = {
    total: designs.length,
    active: designs.filter(d => d.isActive).length,
    inactive: designs.filter(d => !d.isActive).length,
    featured: designs.filter(d => d.featured).length,
    categories: new Set(designs.map(d => d.category)).size,
    totalWeight: designs.reduce((sum, d) => sum + d.weightGrams, 0),
    totalStock: designs.reduce((sum, d) => sum + d.stock, 0),
    lowStock: designs.filter(d => d.stock < 10).length,
  };

  const categories = Array.from(new Set(designs.map(d => d.category)));

  // Image upload handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      if (file.size > 5 * 1024 * 1024) {
        showToast('error', 'Image size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ 
          ...prev, 
          images: [...prev.images, reader.result as string] 
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  // CRUD Operations
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
      stock: 0,
      featured: false,
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
      stock: design.stock,
      featured: design.featured,
    });
    setShowModal(true);
  };

  const handleSaveDesign = () => {
    if (!formData.name.trim()) {
      showToast('error', 'Design name is required');
      return;
    }
    if (formData.weightGrams <= 0) {
      showToast('error', 'Weight must be greater than 0');
      return;
    }
    if (!formData.makingCharges.trim()) {
      showToast('error', 'Making charges are required');
      return;
    }
    if (formData.images.length === 0) {
      showToast('error', 'Please upload at least one image');
      return;
    }

    if (editingDesign) {
      setDesigns(designs.map(d => 
        d.id === editingDesign.id 
          ? { ...d, ...formData, updatedAt: new Date().toISOString() } 
          : d
      ));
      showToast('success', 'Design updated successfully');
    } else {
      const newDesign: GoldDesign = {
        id: String(Date.now()),
        ...formData,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setDesigns([...designs, newDesign]);
      showToast('success', 'Design added successfully');
    }
    setShowModal(false);
  };

  const handleDeleteDesign = (id: string) => {
    if (confirm('Are you sure you want to delete this design? This action cannot be undone.')) {
      setDesigns(designs.filter(d => d.id !== id));
      showToast('success', 'Design deleted successfully');
    }
  };

  const handleToggleActive = (id: string) => {
    setDesigns(designs.map(d => 
      d.id === id ? { ...d, isActive: !d.isActive, updatedAt: new Date().toISOString() } : d
    ));
    showToast('success', 'Design status updated');
  };

  const handleToggleFeatured = (id: string) => {
    setDesigns(designs.map(d => 
      d.id === id ? { ...d, featured: !d.featured, updatedAt: new Date().toISOString() } : d
    ));
    showToast('success', 'Featured status updated');
  };

  // Bulk operations
  const handleBulkDelete = () => {
    if (selectedDesigns.length === 0) {
      showToast('error', 'Please select designs first');
      return;
    }
    if (confirm(`Delete ${selectedDesigns.length} selected designs?`)) {
      setDesigns(designs.filter(d => !selectedDesigns.includes(d.id)));
      setSelectedDesigns([]);
      showToast('success', `${selectedDesigns.length} designs deleted`);
    }
  };

  const handleBulkActivate = () => {
    if (selectedDesigns.length === 0) {
      showToast('error', 'Please select designs first');
      return;
    }
    setDesigns(designs.map(d => 
      selectedDesigns.includes(d.id) ? { ...d, isActive: true, updatedAt: new Date().toISOString() } : d
    ));
    setSelectedDesigns([]);
    showToast('success', 'Selected designs activated');
  };

  const handleBulkDeactivate = () => {
    if (selectedDesigns.length === 0) {
      showToast('error', 'Please select designs first');
      return;
    }
    setDesigns(designs.map(d => 
      selectedDesigns.includes(d.id) ? { ...d, isActive: false, updatedAt: new Date().toISOString() } : d
    ));
    setSelectedDesigns([]);
    showToast('success', 'Selected designs deactivated');
  };

  const toggleSelectAll = () => {
    if (selectedDesigns.length === filteredDesigns.length) {
      setSelectedDesigns([]);
    } else {
      setSelectedDesigns(filteredDesigns.map(d => d.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedDesigns(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  // Export functionality
  const exportCSV = () => {
    const headers = ['ID', 'Name', 'Category', 'Weight (g)', 'Purity', 'Making Charges', 'Stock', 'Status', 'Featured', 'Created'];
    const rows = filteredDesigns.map(d => [
      d.id,
      d.name,
      d.category,
      d.weightGrams,
      d.purity,
      d.makingCharges,
      d.stock,
      d.isActive ? 'Active' : 'Inactive',
      d.featured ? 'Yes' : 'No',
      new Date(d.createdAt).toLocaleDateString()
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gold-designs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    showToast('success', 'Designs exported successfully');
  };

  const duplicateDesign = (design: GoldDesign) => {
    const newDesign: GoldDesign = {
      ...design,
      id: String(Date.now()),
      name: `${design.name} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setDesigns([...designs, newDesign]);
    showToast('success', 'Design duplicated successfully');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Gold Showroom Management</h1>
          <p className="text-white/50 mt-1">Manage your gold designs inventory</p>
        </div>
        <div className="flex gap-3">
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
            onClick={handleAddDesign}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-purple-900 font-bold rounded-xl shadow-lg"
          >
            <Plus className="w-4 h-4" />
            Add Design
          </motion.button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
          </div>
          <p className="text-2xl font-bold">{stats.total}</p>
          <p className="text-xs text-white/50 mt-1">Total Designs</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
          </div>
          <p className="text-2xl font-bold">{stats.active}</p>
          <p className="text-xs text-white/50 mt-1">Active Designs</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
              <Star className="w-5 h-5 text-white" />
            </div>
          </div>
          <p className="text-2xl font-bold">{stats.featured}</p>
          <p className="text-xs text-white/50 mt-1">Featured</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <Scale className="w-5 h-5 text-white" />
            </div>
          </div>
          <p className="text-2xl font-bold">{stats.totalWeight.toFixed(0)}g</p>
          <p className="text-xs text-white/50 mt-1">Total Weight</p>
        </motion.div>
      </div>

      {/* Low Stock Alert */}
      {stats.lowStock > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center gap-3"
        >
          <AlertCircle className="w-5 h-5 text-red-400" />
          <p className="text-sm text-red-300">
            <strong>{stats.lowStock}</strong> design(s) have low stock (less than 10 units)
          </p>
        </motion.div>
      )}

      {/* Filters */}
      <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="Search designs..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm focus:border-amber-500/50"
            />
          </div>
          <select
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm focus:border-amber-500/50"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <select
            value={filterPurity}
            onChange={e => setFilterPurity(e.target.value)}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm focus:border-amber-500/50"
          >
            <option value="all">All Purity</option>
            <option value="22K">22K</option>
            <option value="24K">24K</option>
          </select>
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm focus:border-amber-500/50"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedDesigns.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-center justify-between"
        >
          <span className="text-sm font-medium text-amber-300">
            {selectedDesigns.length} design(s) selected
          </span>
          <div className="flex gap-2">
            <button
              onClick={handleBulkActivate}
              className="px-3 py-1.5 bg-green-600 hover:bg-green-700 rounded-lg text-xs font-medium transition-colors"
            >
              Activate
            </button>
            <button
              onClick={handleBulkDeactivate}
              className="px-3 py-1.5 bg-yellow-600 hover:bg-yellow-700 rounded-lg text-xs font-medium transition-colors"
            >
              Deactivate
            </button>
            <button
              onClick={handleBulkDelete}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 rounded-lg text-xs font-medium transition-colors"
            >
              Delete
            </button>
          </div>
        </motion.div>
      )}

      {/* Designs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDesigns.map((design, i) => (
          <motion.div
            key={design.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`bg-white/5 backdrop-blur border rounded-2xl overflow-hidden transition-all ${
              selectedDesigns.includes(design.id) 
                ? 'border-amber-500 shadow-lg shadow-amber-500/20' 
                : 'border-white/10 hover:border-amber-500/30'
            }`}
          >
            {/* Image */}
            <div className="h-48 bg-gradient-to-br from-amber-900/20 to-purple-900/20 relative overflow-hidden">
              {design.images.length > 0 ? (
                <img 
                  src={design.images[0]} 
                  alt={design.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="w-16 h-16 text-white/20" />
                </div>
              )}
              
              {/* Badges */}
              <div className="absolute top-2 right-2 flex gap-1">
                {design.featured && (
                  <span className="px-2 py-0.5 bg-amber-500 rounded text-[10px] text-purple-900 font-bold">
                    ★ Featured
                  </span>
                )}
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  design.isActive ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                }`}>
                  {design.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              {/* Stock Warning */}
              {design.stock < 10 && (
                <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-red-500/90 rounded text-[10px] text-white font-bold">
                  Low Stock: {design.stock}
                </div>
              )}

              {/* Select Checkbox */}
              <div className="absolute top-2 left-2">
                <input
                  type="checkbox"
                  checked={selectedDesigns.includes(design.id)}
                  onChange={() => toggleSelect(design.id)}
                  className="w-5 h-5 rounded cursor-pointer"
                />
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="font-semibold text-sm mb-1 truncate">{design.name}</h3>
              <p className="text-xs text-white/50 mb-2">{design.category}</p>
              
              <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                <div className="flex items-center gap-1">
                  <Scale className="w-3 h-3 text-amber-400" />
                  <span>{design.weightGrams}g</span>
                </div>
                <div className="flex items-center gap-1">
                  <Award className="w-3 h-3 text-amber-400" />
                  <span>{design.purity}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Package className="w-3 h-3 text-amber-400" />
                  <span>Stock: {design.stock}</span>
                </div>
                <div className="text-white/40">
                  {design.makingCharges}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button 
                  onClick={() => { setPreviewDesign(design); setShowPreview(true); }}
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
                  onClick={() => handleToggleFeatured(design.id)}
                  className="py-2 px-3 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-medium transition-colors"
                  title={design.featured ? 'Remove Featured' : 'Mark Featured'}
                >
                  <Star className={`w-3 h-3 ${design.featured ? 'text-amber-400 fill-amber-400' : ''}`} />
                </button>
                <button 
                  onClick={() => duplicateDesign(design)}
                  className="py-2 px-3 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-medium transition-colors"
                  title="Duplicate"
                >
                  <Copy className="w-3 h-3" />
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

      {filteredDesigns.length === 0 && (
        <div className="text-center py-12">
          <Gem className="w-16 h-16 text-white/20 mx-auto mb-4" />
          <p className="text-white/50">No designs found</p>
        </div>
      )}

      {/* Add/Edit Modal */}
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

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm text-white/60 mb-1">Weight (grams) *</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.weightGrams}
                      onChange={e => setFormData({ ...formData, weightGrams: Number(e.target.value) })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-amber-500/50"
                      placeholder="45.5"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-white/60 mb-1">Making Charges *</label>
                    <input
                      type="text"
                      value={formData.makingCharges}
                      onChange={e => setFormData({ ...formData, makingCharges: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-amber-500/50"
                      placeholder="₹800/g"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-white/60 mb-1">Stock</label>
                    <input
                      type="number"
                      value={formData.stock}
                      onChange={e => setFormData({ ...formData, stock: Number(e.target.value) })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-amber-500/50"
                      placeholder="0"
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
                  <label className="block text-sm text-white/60 mb-1">Images *</label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-8 border-2 border-dashed border-white/20 rounded-xl hover:border-amber-500/50 transition-colors flex flex-col items-center gap-2"
                  >
                    <Upload className="w-8 h-8 text-white/40" />
                    <span className="text-sm text-white/60">Click to upload images</span>
                    <span className="text-xs text-white/40">Max 5MB per image</span>
                  </button>
                  
                  {formData.images.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mt-3">
                      {formData.images.map((img, i) => (
                        <div key={i} className="relative group">
                          <img src={img} alt={`Upload ${i + 1}`} className="w-full h-24 object-cover rounded-lg" />
                          <button
                            type="button"
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

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={e => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <label htmlFor="featured" className="text-sm text-white/80">Mark as Featured</label>
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

      {/* Preview Modal */}
      <AnimatePresence>
        {showPreview && previewDesign && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowPreview(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-gradient-to-b from-slate-900 to-purple-950 rounded-2xl max-w-3xl w-full p-6 border border-amber-500/20 max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">{previewDesign.name}</h3>
                <button onClick={() => setShowPreview(false)} className="p-2 hover:bg-white/10 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Image Gallery */}
              {previewDesign.images.length > 0 && (
                <div className="mb-6">
                  <div className="h-96 bg-gradient-to-br from-amber-900/20 to-purple-900/20 rounded-xl overflow-hidden mb-3">
                    <img 
                      src={previewDesign.images[currentImageIndex]} 
                      alt={previewDesign.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  {previewDesign.images.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {previewDesign.images.map((img, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentImageIndex(i)}
                          className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                            currentImageIndex === i ? 'border-amber-500' : 'border-transparent'
                          }`}
                        >
                          <img src={img} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-white/5 rounded-xl">
                  <p className="text-xs text-white/50 mb-1">Category</p>
                  <p className="font-medium">{previewDesign.category}</p>
                </div>
                <div className="p-4 bg-white/5 rounded-xl">
                  <p className="text-xs text-white/50 mb-1">Purity</p>
                  <p className="font-medium">{previewDesign.purity}</p>
                </div>
                <div className="p-4 bg-white/5 rounded-xl">
                  <p className="text-xs text-white/50 mb-1">Weight</p>
                  <p className="font-medium">{previewDesign.weightGrams}g</p>
                </div>
                <div className="p-4 bg-white/5 rounded-xl">
                  <p className="text-xs text-white/50 mb-1">Making Charges</p>
                  <p className="font-medium">{previewDesign.makingCharges}</p>
                </div>
                <div className="p-4 bg-white/5 rounded-xl">
                  <p className="text-xs text-white/50 mb-1">Stock</p>
                  <p className="font-medium">{previewDesign.stock} units</p>
                </div>
                <div className="p-4 bg-white/5 rounded-xl">
                  <p className="text-xs text-white/50 mb-1">Status</p>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    previewDesign.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {previewDesign.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              {previewDesign.description && (
                <div className="p-4 bg-white/5 rounded-xl mb-6">
                  <p className="text-xs text-white/50 mb-1">Description</p>
                  <p className="text-sm">{previewDesign.description}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 text-xs text-white/50">
                <div>Created: {new Date(previewDesign.createdAt).toLocaleDateString()}</div>
                <div>Updated: {new Date(previewDesign.updatedAt).toLocaleDateString()}</div>
              </div>

              <button
                onClick={() => setShowPreview(false)}
                className="w-full py-3 bg-white/5 border border-white/10 rounded-xl font-medium hover:bg-white/10 mt-6"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
