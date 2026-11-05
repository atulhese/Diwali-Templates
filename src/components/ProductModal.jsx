import React, { useState, useEffect } from 'react';
import { X, Sparkles, Image as ImageIcon, Tag, DollarSign, Package } from 'lucide-react';

const CATEGORIES = [
  'Diyas & Candles',
  'Sweets & Dry Fruits',
  'Puja Essentials',
  'Decor & Rangoli',
  'Lights & Lanterns',
  'Green Crackers'
];

export default function ProductModal({
  isOpen,
  onClose,
  onSave,
  editingProduct
}) {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Diyas & Candles',
    price: '',
    originalPrice: '',
    stockCount: '50',
    image: '',
    description: '',
    tags: 'Handmade, Diwali Special',
    isDiwaliSpecial: true
  });

  useEffect(() => {
    if (editingProduct) {
      setFormData({
        name: editingProduct.name || '',
        category: editingProduct.category || 'Diyas & Candles',
        price: editingProduct.price || '',
        originalPrice: editingProduct.originalPrice || '',
        stockCount: editingProduct.stockCount || '50',
        image: editingProduct.image || '',
        description: editingProduct.description || '',
        tags: Array.isArray(editingProduct.tags) ? editingProduct.tags.join(', ') : '',
        isDiwaliSpecial: Boolean(editingProduct.isDiwaliSpecial)
      });
    } else {
      setFormData({
        name: '',
        category: 'Diyas & Candles',
        price: '',
        originalPrice: '',
        stockCount: '50',
        image: 'https://images.unsplash.com/photo-1574267432553-4b4628081c31?auto=format&fit=crop&w=800&q=80',
        description: '',
        tags: 'Handmade, Festive Gift, Eco-Friendly',
        isDiwaliSpecial: true
      });
    }
  }, [editingProduct, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.category) {
      alert('Please fill in product name, price, and category.');
      return;
    }

    onSave({
      ...formData,
      price: Number(formData.price),
      originalPrice: formData.originalPrice ? Number(formData.originalPrice) : Number(formData.price),
      stockCount: Number(formData.stockCount) || 20,
      tags: formData.tags.split(',').map(s => s.trim()).filter(Boolean)
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-xl bg-gradient-to-b from-[#240811] to-[#140308] border border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-amber-500/20">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🪔</span>
            <div>
              <h2 className="text-xl font-bold font-serif-festive text-amber-200">
                {editingProduct ? 'Edit Diwali Product' : 'Add New Diwali Product'}
              </h2>
              <p className="text-xs text-amber-200/60">
                {editingProduct ? 'Update catalogue details and pricing' : 'Showcase items in the festival shopping catalogue'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-amber-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-4 text-xs sm:text-sm">
          {/* Product Name */}
          <div>
            <label className="block text-amber-200 font-semibold mb-1">Product Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Royal Brass Peacock Diya with Bells"
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-amber-500/30 text-amber-100 focus:border-amber-400 focus:outline-none"
            />
          </div>

          {/* Category & Special Tag */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-amber-200 font-semibold mb-1">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#1c060d] border border-amber-500/30 text-amber-100 focus:border-amber-400 focus:outline-none cursor-pointer"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-2 pt-6">
              <input
                type="checkbox"
                id="isDiwaliSpecial"
                checked={formData.isDiwaliSpecial}
                onChange={(e) => setFormData({ ...formData, isDiwaliSpecial: e.target.checked })}
                className="w-4 h-4 rounded text-amber-500 bg-black/60 border-amber-400/50"
              />
              <label htmlFor="isDiwaliSpecial" className="text-amber-200 font-medium cursor-pointer">
                Mark as Diwali Special Exclusive ✨
              </label>
            </div>
          </div>

          {/* Pricing & Stock */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-amber-200 font-semibold mb-1">Offer Price (₹) *</label>
              <input
                type="number"
                required
                min="1"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="499"
                className="w-full px-3 py-2.5 rounded-xl bg-black/40 border border-amber-500/30 text-amber-100 focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-amber-200 font-semibold mb-1">Original Price (₹)</label>
              <input
                type="number"
                min="1"
                value={formData.originalPrice}
                onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                placeholder="999"
                className="w-full px-3 py-2.5 rounded-xl bg-black/40 border border-amber-500/30 text-amber-100 focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-amber-200 font-semibold mb-1">Stock Units</label>
              <input
                type="number"
                min="0"
                value={formData.stockCount}
                onChange={(e) => setFormData({ ...formData, stockCount: e.target.value })}
                placeholder="50"
                className="w-full px-3 py-2.5 rounded-xl bg-black/40 border border-amber-500/30 text-amber-100 focus:border-amber-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-amber-200 font-semibold mb-1">Image URL</label>
            <input
              type="url"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-amber-500/30 text-amber-100 focus:border-amber-400 focus:outline-none"
            />
            <p className="text-[11px] text-amber-200/50 mt-1">
              Paste any valid image link (Unsplash or direct image URL).
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-amber-200 font-semibold mb-1">Description</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the craftsmanship, materials, aroma, and Diwali significance..."
              className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-amber-500/30 text-amber-100 focus:border-amber-400 focus:outline-none"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-amber-200 font-semibold mb-1">Tags (Comma separated)</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="Handmade, Pure Brass, Desi Ghee"
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-amber-500/30 text-amber-100 focus:border-amber-400 focus:outline-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-amber-500/20">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-amber-200 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 hover:from-amber-400 hover:to-orange-400 text-white font-bold shadow-lg shadow-orange-500/20"
            >
              {editingProduct ? 'Save Changes' : 'Add to Catalogue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
