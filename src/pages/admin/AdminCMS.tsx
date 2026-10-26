import { motion } from 'framer-motion';
import { FileText, Save } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '../../context/ToastContext';

export default function AdminCMS() {
  const { showToast } = useToast();
  const [activeSection, setActiveSection] = useState('hero');

  const handleSave = () => {
    showToast('success', 'Content updated successfully', 'Saved');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Content Management</h1>
        <p className="text-white/50 mt-1">Edit landing page and informational content</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-4 space-y-1">
            {[
              { id: 'hero', label: 'Hero Section' },
              { id: 'features', label: 'Features' },
              { id: 'testimonials', label: 'Testimonials' },
              { id: 'faq', label: 'FAQ' },
              { id: 'banners', label: 'Banners' },
              { id: 'pages', label: 'Static Pages' },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeSection === item.id ? 'bg-amber-500/20 text-amber-400' : 'text-white/60 hover:bg-white/5'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Editor */}
        <div className="lg:col-span-3">
          <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6">
            <h3 className="font-semibold mb-4 capitalize">{activeSection} Content</h3>
            
            {activeSection === 'hero' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-white/60 mb-1">Headline</label>
                  <input type="text" defaultValue="Earn Together. Grow Together. Own Gold." className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl" />
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-1">Subheadline</label>
                  <textarea rows={3} defaultValue="Join thousands of members building wealth through gold savings, team commissions, and direct manufacturer gold access." className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl resize-none" />
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-1">CTA Button Text</label>
                  <input type="text" defaultValue="Join Now ✨" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl" />
                </div>
              </div>
            )}

            {activeSection === 'testimonials' && (
              <div className="space-y-4">
                <p className="text-sm text-white/50">Manage customer testimonials</p>
                <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="p-4 bg-white/5 rounded-xl border border-white/10">
                      <input type="text" defaultValue={`Customer Name ${i}`} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm mb-2" />
                      <textarea rows={2} defaultValue="Customer testimonial text goes here..." className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm resize-none" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'faq' && (
              <div className="space-y-4">
                <p className="text-sm text-white/50">Manage FAQ questions and answers</p>
                <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="p-4 bg-white/5 rounded-xl border border-white/10">
                      <input type="text" defaultValue={`Question ${i}?`} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm mb-2 font-medium" />
                      <textarea rows={2} defaultValue="Answer text goes here..." className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm resize-none" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(activeSection === 'features' || activeSection === 'banners' || activeSection === 'pages') && (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-white/20 mx-auto mb-3" />
                <p className="text-white/50">Content editor for {activeSection}</p>
                <p className="text-xs text-white/40 mt-1">Configure content for this section</p>
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSave}
              className="mt-6 flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-purple-900 font-bold rounded-xl shadow-lg shadow-amber-500/30"
            >
              <Save className="w-5 h-5" />
              Save Changes
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
