import React, { useState } from 'react';
import { 
  Search, 
  Sparkles, 
  ShoppingBag, 
  Star, 
  Trash2, 
  Edit3, 
  Plus, 
  Check, 
  Flame, 
  SlidersHorizontal,
  Gift,
  ArrowRight
} from 'lucide-react';
import { soundFX } from '../utils/audio';

const CATEGORIES = [
  { id: 'All', label: 'All Items', emoji: '✨' },
  { id: 'Diyas & Candles', label: 'Diyas & Candles', emoji: '🪔' },
  { id: 'Sweets & Dry Fruits', label: 'Mithai & Dry Fruits', emoji: '🍬' },
  { id: 'Puja Essentials', label: 'Puja Essentials', emoji: '🕉️' },
  { id: 'Decor & Rangoli', label: 'Decor & Rangoli', emoji: '🎨' },
  { id: 'Lights & Lanterns', label: 'Lights & Lanterns', emoji: '🏮' },
  { id: 'Green Crackers', label: 'Eco Green Crackers', emoji: '🎇' }
];

export default function ShoppingStore({
  products,
  onAddToCart,
  cartItems,
  onEditProduct,
  onDeleteProduct,
  onOpenAddModal,
  setActiveTab
}) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [onlyDiwaliSpecial, setOnlyDiwaliSpecial] = useState(false);
  const [addedAnimationId, setAddedAnimationId] = useState(null);

  // Filter and sort products
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.tags && product.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));
    const matchesSpecial = onlyDiwaliSpecial ? product.isDiwaliSpecial : true;
    return matchesCategory && matchesSearch && matchesSpecial;
  }).sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'discount') return b.discountPercent - a.discountPercent;
    return 0; // featured / default order
  });

  const handleAddToCartClick = (product) => {
    soundFX.playDiyaLight();
    onAddToCart(product);
    setAddedAnimationId(product.id);
    setTimeout(() => {
      setAddedAnimationId(null);
    }, 1200);
  };

  const getCartQuantity = (productId) => {
    const item = cartItems.find(i => i.id === productId);
    return item ? item.quantity : 0;
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Hero Festive Banner */}
      <div className="relative overflow-hidden rounded-3xl festive-glass-gold p-6 sm:p-10 border border-amber-500/30">
        <div className="absolute -right-10 -top-10 w-72 h-72 bg-gradient-to-br from-amber-500/20 to-red-600/30 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -left-10 -bottom-10 w-64 h-64 bg-gradient-to-tr from-amber-400/20 to-orange-600/20 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
              <span>GRAND DIWALI UTSAV SPECIAL 2026</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black font-serif-festive text-gold-gradient tracking-tight leading-tight">
              Bring Divine Light, Joy & Sweetness Home
            </h1>

            <p className="text-amber-100/80 text-sm sm:text-base max-w-2xl leading-relaxed">
              Explore authentic handcrafted clay diyas, pure desi ghee sweets, blessed Lakshmi-Ganesh idols, vibrant floral decor, and certified eco-friendly fireworks.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <div className="flex items-center space-x-2 bg-black/40 border border-amber-500/30 rounded-xl px-3 py-1.5 text-xs text-amber-200">
                <Gift className="w-4 h-4 text-amber-400" />
                <span>Free 4-Pack Diyas above ₹999</span>
              </div>
              <div className="flex items-center space-x-2 bg-black/40 border border-amber-500/30 rounded-xl px-3 py-1.5 text-xs text-amber-200">
                <Flame className="w-4 h-4 text-orange-400" />
                <span>Guaranteed Delivery Before Diwali</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col items-center justify-center gap-4">
            <div className="w-full bg-gradient-to-br from-red-950/80 to-amber-950/80 border border-amber-500/40 rounded-2xl p-5 text-center shadow-xl">
              <span className="text-4xl animate-bounce inline-block">🪔</span>
              <h3 className="font-serif-festive text-lg font-bold text-amber-200 mt-2">
                Flat 25% Festive Code
              </h3>
              <div className="mt-2 py-1.5 px-4 bg-black/60 border border-dashed border-amber-400 rounded-lg text-amber-300 font-mono font-bold text-sm tracking-wider select-all">
                DIWALI2026
              </div>
              <p className="text-[11px] text-amber-200/60 mt-1">
                Auto-applies at checkout for all festive orders!
              </p>
            </div>

            <button
              onClick={() => setActiveTab('diyas')}
              className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-neutral-950 font-bold text-sm shadow-lg shadow-orange-500/20 transition-all hover:scale-[1.02]"
            >
              <Flame className="w-4 h-4" />
              <span>Join Live Diya Lighting Ceremony</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar Controls */}
      <div className="space-y-4">
        {/* Category Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map(cat => {
            const isSelected = selectedCategory.toLowerCase() === cat.id.toLowerCase();
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  soundFX.playDiyaLight();
                }}
                className={`whitespace-nowrap flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all ${
                  isSelected
                    ? 'bg-gradient-to-r from-amber-500 to-red-600 text-neutral-950 font-bold shadow-lg shadow-amber-500/30 scale-105'
                    : 'bg-[#1c070e] text-amber-200/80 hover:text-amber-100 hover:bg-[#2c0b16] border border-amber-500/20'
                }`}
              >
                <span>{cat.emoji}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search, Sort & Quick Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          {/* Search box */}
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400/60" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search sweets, diyas, pooja idols, lights..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#1c060d] border border-amber-500/30 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400 text-amber-100 placeholder:text-amber-300/40 text-sm"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-amber-400/60 hover:text-amber-200"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-end">
            {/* Diwali Special Toggle */}
            <label className="flex items-center space-x-2 cursor-pointer select-none text-xs text-amber-200 font-medium">
              <input
                type="checkbox"
                checked={onlyDiwaliSpecial}
                onChange={(e) => setOnlyDiwaliSpecial(e.target.checked)}
                className="w-4 h-4 rounded text-amber-500 bg-black/60 border-amber-400/50 focus:ring-amber-400"
              />
              <span className="flex items-center space-x-1">
                <span>Diwali Specials</span>
                <Flame className="w-3.5 h-3.5 text-orange-400 inline" />
              </span>
            </label>

            {/* Sort Dropdown */}
            <div className="flex items-center space-x-1.5 bg-[#1c060d] border border-amber-500/30 rounded-xl px-2.5 py-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-amber-200 text-xs focus:outline-none cursor-pointer"
              >
                <option value="featured" className="bg-[#1c060d] text-amber-100">Featured</option>
                <option value="price-low" className="bg-[#1c060d] text-amber-100">Price: Low to High</option>
                <option value="price-high" className="bg-[#1c060d] text-amber-100">Price: High to Low</option>
                <option value="rating" className="bg-[#1c060d] text-amber-100">Highest Rated</option>
                <option value="discount" className="bg-[#1c060d] text-amber-100">Biggest Discount %</option>
              </select>
            </div>

            {/* Add New Product Quick Button */}
            <button
              onClick={onOpenAddModal}
              className="flex items-center space-x-1 px-3 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/40 text-xs font-semibold transition-all hover:scale-105"
            >
              <Plus className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Add Item</span>
            </button>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 festive-glass rounded-3xl border border-amber-500/20 p-8">
          <span className="text-5xl block mb-3">🔍</span>
          <h3 className="font-serif-festive text-xl text-amber-200 font-bold mb-2">No Diwali Items Found</h3>
          <p className="text-amber-200/60 text-sm max-w-md mx-auto mb-6">
            We couldn't find anything matching "{searchQuery}". Try selecting another category or add your own custom item!
          </p>
          <button
            onClick={onOpenAddModal}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-sm shadow-lg hover:scale-105 transition-transform"
          >
            + Add New Festive Product
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const inCartQty = getCartQuantity(product.id);
            const isJustAdded = addedAnimationId === product.id;

            return (
              <div
                key={product.id}
                className="group relative flex flex-col justify-between bg-gradient-to-b from-[#240811] to-[#16040a] rounded-3xl border border-amber-500/25 overflow-hidden festive-card-hover shadow-xl"
              >
                {/* Badges */}
                <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
                  {product.discountPercent > 0 && (
                    <span className="px-2.5 py-0.5 rounded-full bg-red-600/90 text-white font-black text-[11px] shadow-md backdrop-blur-sm">
                      {product.discountPercent}% OFF
                    </span>
                  )}
                  {product.isBestseller && (
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 font-extrabold text-[10px] shadow-md">
                      BESTSELLER
                    </span>
                  )}
                  {product.isDiwaliSpecial && (
                    <span className="px-2 py-0.5 rounded-full bg-orange-600/90 text-white font-bold text-[10px] flex items-center space-x-1 shadow-md">
                      <Flame className="w-2.5 h-2.5" />
                      <span>Shubh Special</span>
                    </span>
                  )}
                </div>

                {/* Top Action Buttons (Edit / Remove) */}
                <div className="absolute top-3 right-3 z-10 flex items-center space-x-1 opacity-90 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditProduct(product);
                    }}
                    title="Edit Product Details"
                    className="p-1.5 rounded-lg bg-black/60 hover:bg-black/90 text-amber-300 border border-amber-400/40 hover:text-amber-100 transition-all shadow-md backdrop-blur-sm"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm(`Are you sure you want to remove "${product.name}" from the store?`)) {
                        onDeleteProduct(product.id);
                      }
                    }}
                    title="Remove Product"
                    className="p-1.5 rounded-lg bg-red-950/70 hover:bg-red-700 text-red-200 border border-red-500/40 transition-all shadow-md backdrop-blur-sm"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Product Image */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-black/40">
                  <img
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                    onError={(e) => {
                      // Fallback image if unsplash link fails
                      e.target.src = "https://images.unsplash.com/photo-1574267432553-4b4628081c31?auto=format&fit=crop&w=800&q=80";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#16040a] via-transparent to-black/20" />
                </div>

                {/* Product Content Details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    {/* Category & Rating */}
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-amber-400/80 font-medium tracking-wide">
                        {product.category}
                      </span>
                      <div className="flex items-center space-x-1 text-amber-400 font-semibold">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{product.rating}</span>
                        <span className="text-amber-200/50 text-[11px]">({product.reviewsCount})</span>
                      </div>
                    </div>

                    {/* Product Name */}
                    <h3 className="font-semibold text-amber-100 text-base leading-snug group-hover:text-amber-300 transition-colors line-clamp-2">
                      {product.name}
                    </h3>

                    {/* Description preview */}
                    <p className="text-amber-200/60 text-xs line-clamp-2 mt-1.5 leading-relaxed">
                      {product.description}
                    </p>

                    {/* Tags preview */}
                    {product.tags && product.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2.5">
                        {product.tags.slice(0, 3).map((tag, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300/80 border border-amber-500/20"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Pricing and Add to Cart Section */}
                  <div className="pt-3 border-t border-amber-500/15 space-y-3">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-xl font-bold font-serif-festive text-amber-200">
                          ₹{product.price}
                        </span>
                        {product.originalPrice > product.price && (
                          <span className="ml-2 text-xs text-amber-300/50 line-through">
                            ₹{product.originalPrice}
                          </span>
                        )}
                      </div>

                      {product.stockCount > 0 ? (
                        <span className="text-[11px] text-emerald-400/90 font-medium">
                          In Stock ({product.stockCount})
                        </span>
                      ) : (
                        <span className="text-[11px] text-red-400 font-semibold">
                          Out of Stock
                        </span>
                      )}
                    </div>

                    {/* Add to Cart Button */}
                    <button
                      onClick={() => handleAddToCartClick(product)}
                      disabled={product.stockCount <= 0}
                      className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-md ${
                        product.stockCount <= 0
                          ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                          : isJustAdded
                          ? 'bg-emerald-600 text-white scale-95'
                          : inCartQty > 0
                          ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-slate-950 hover:from-amber-500 hover:to-amber-400'
                          : 'bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 hover:from-amber-400 hover:to-orange-400 text-white'
                      }`}
                    >
                      {isJustAdded ? (
                        <>
                          <Check className="w-4 h-4 animate-bounce" />
                          <span>Added to Festive Cart!</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-4 h-4" />
                          <span>
                            {inCartQty > 0 ? `In Cart (${inCartQty}) - Add More` : 'Add to Cart'}
                          </span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
