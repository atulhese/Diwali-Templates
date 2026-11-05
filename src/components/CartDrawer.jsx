import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  Gift, 
  Sparkles, 
  Tag, 
  CheckCircle2, 
  ShieldCheck 
} from 'lucide-react';
import { soundFX } from '../utils/audio';

const AVAILABLE_COUPONS = [
  { code: 'DIWALI2026', label: '25% OFF', desc: 'Flat 25% off festive code' },
  { code: 'SHUBH500', label: '₹500 OFF', desc: 'Orders > ₹1500' },
  { code: 'FESTIVE100', label: '₹100 OFF', desc: 'Orders > ₹499' }
];

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onProceedToCheckout
}) {
  const [couponCode, setCouponCode] = useState('DIWALI2026');
  const [appliedCoupon, setAppliedCoupon] = useState({
    code: 'DIWALI2026',
    discountAmount: 0,
    valid: true
  });
  const [couponMsg, setCouponMsg] = useState('Festive 25% discount unlocked!');

  if (!isOpen) return null;

  // Calculate financials
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  
  // Calculate discount based on subtotal
  let discount = 0;
  if (appliedCoupon && appliedCoupon.valid) {
    if (appliedCoupon.code === 'DIWALI2026') {
      discount = Math.round(subtotal * 0.25);
    } else if (appliedCoupon.code === 'SHUBH500') {
      discount = subtotal >= 1500 ? 500 : 0;
    } else if (appliedCoupon.code === 'FESTIVE100') {
      discount = subtotal >= 499 ? 100 : 0;
    }
  }

  const FREE_GIFT_THRESHOLD = 999;
  const isFreeGiftUnlocked = subtotal >= FREE_GIFT_THRESHOLD;
  const amountToGift = Math.max(0, FREE_GIFT_THRESHOLD - subtotal);
  const deliveryFee = 0; // Free for Diwali!
  const finalTotal = Math.max(0, subtotal - discount + deliveryFee);

  const handleApplyCoupon = (codeToApply) => {
    const code = (codeToApply || couponCode).trim().toUpperCase();
    if (!code) return;

    if (code === 'DIWALI2026') {
      const disc = Math.round(subtotal * 0.25);
      setAppliedCoupon({ code, discountAmount: disc, valid: true });
      setCouponMsg('Applied 25% Festive Discount! 🎉');
      soundFX.playDiyaLight();
    } else if (code === 'SHUBH500') {
      if (subtotal < 1500) {
        setCouponMsg('Add ₹' + (1500 - subtotal) + ' more to use SHUBH500.');
        setAppliedCoupon(null);
      } else {
        setAppliedCoupon({ code, discountAmount: 500, valid: true });
        setCouponMsg('Applied flat ₹500 Shubh Discount! 🪔');
        soundFX.playDiyaLight();
      }
    } else if (code === 'FESTIVE100') {
      if (subtotal < 499) {
        setCouponMsg('Add ₹' + (499 - subtotal) + ' more to use FESTIVE100.');
        setAppliedCoupon(null);
      } else {
        setAppliedCoupon({ code, discountAmount: 100, valid: true });
        setCouponMsg('Applied ₹100 Festive Off! ✨');
        soundFX.playDiyaLight();
      }
    } else {
      setCouponMsg('Invalid coupon code. Try DIWALI2026!');
      setAppliedCoupon(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-gradient-to-b from-[#220710] to-[#120308] border-l border-amber-500/30 flex flex-col shadow-2xl">
          
          {/* Cart Header */}
          <div className="p-5 border-b border-amber-500/20 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-amber-400" />
              <h2 className="font-serif-festive text-lg font-bold text-amber-200">
                Your Festive Cart ({cartItems.reduce((a, b) => a + b.quantity, 0)})
              </h2>
            </div>
            <div className="flex items-center space-x-2">
              {cartItems.length > 0 && (
                <button
                  onClick={onClearCart}
                  className="text-xs text-red-400 hover:text-red-300 font-medium px-2 py-1 rounded-lg bg-red-950/40 border border-red-500/20"
                >
                  Clear
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-amber-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Free Gift Notification Bar */}
          <div className="bg-gradient-to-r from-amber-600/20 via-orange-600/30 to-amber-600/20 border-b border-amber-500/20 p-3 text-xs">
            {isFreeGiftUnlocked ? (
              <div className="flex items-center space-x-2 text-amber-200 font-semibold">
                <Gift className="w-4 h-4 text-amber-400 shrink-0 animate-bounce" />
                <span>🎉 Shubh Offer: Free 4-Pack Handcrafted Diyas unlocked!</span>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between text-amber-200 font-medium mb-1">
                  <span className="flex items-center space-x-1">
                    <Gift className="w-3.5 h-3.5 text-amber-400" />
                    <span>Free Festive Gift</span>
                  </span>
                  <span>Add ₹{amountToGift} more</span>
                </div>
                <div className="w-full bg-black/40 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-amber-500 to-orange-500 h-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (subtotal / FREE_GIFT_THRESHOLD) * 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cartItems.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <span className="text-5xl block animate-flame-flicker">🪔</span>
                <h3 className="font-serif-festive text-base font-bold text-amber-200">
                  Your Cart is Empty
                </h3>
                <p className="text-xs text-amber-200/60 max-w-xs mx-auto">
                  Brighten your home with handmade clay diyas, premium dry fruits, and festive lights!
                </p>
                <button
                  onClick={onClose}
                  className="mt-3 px-5 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs shadow-md"
                >
                  Browse Diwali Store
                </button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex space-x-3 p-3 rounded-2xl bg-black/40 border border-amber-500/20 items-center justify-between"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-xl object-cover shrink-0 border border-amber-500/20"
                  />
                  <div className="flex-1 min-w-0 pr-2">
                    <h4 className="text-xs font-semibold text-amber-100 truncate">
                      {item.name}
                    </h4>
                    <p className="text-[11px] text-amber-300/70 font-mono mt-0.5">
                      ₹{item.price} each
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-2 mt-2">
                      <div className="flex items-center bg-black/60 rounded-lg border border-amber-500/30">
                        <button
                          onClick={() => {
                            soundFX.playDiyaLight();
                            onUpdateQuantity(item.id, item.quantity - 1);
                          }}
                          className="p-1 hover:text-amber-400 text-amber-200/80"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold font-mono text-amber-100">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => {
                            soundFX.playDiyaLight();
                            onUpdateQuantity(item.id, item.quantity + 1);
                          }}
                          className="p-1 hover:text-amber-400 text-amber-200/80"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs font-bold text-amber-300 ml-auto font-mono">
                        ₹{item.price * item.quantity}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onRemoveItem(item.id)}
                    title="Remove item"
                    className="p-1.5 rounded-lg text-red-400/70 hover:text-red-300 hover:bg-red-950/50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}

            {/* Unlocked Free Gift Display */}
            {isFreeGiftUnlocked && cartItems.length > 0 && (
              <div className="flex items-center space-x-3 p-3 rounded-2xl bg-amber-500/10 border border-dashed border-amber-400/50">
                <span className="text-2xl">🪔</span>
                <div className="flex-1 text-xs">
                  <p className="font-bold text-amber-300">Free Gift: 4-Pack Terracotta Diyas</p>
                  <p className="text-[10px] text-amber-200/60">Festive blessing on orders over ₹999</p>
                </div>
                <span className="text-xs font-bold text-emerald-400 font-mono">FREE</span>
              </div>
            )}
          </div>

          {/* Coupon and Checkout Footer */}
          {cartItems.length > 0 && (
            <div className="p-5 border-t border-amber-500/20 bg-black/60 space-y-4">
              
              {/* Coupon input */}
              <div className="space-y-2">
                <div className="flex space-x-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-amber-400" />
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="Coupon Code"
                      className="w-full pl-8 pr-3 py-2 text-xs rounded-xl bg-black/60 border border-amber-500/30 text-amber-200 uppercase font-mono tracking-wider focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <button
                    onClick={() => handleApplyCoupon()}
                    className="px-3 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-300 font-bold text-xs"
                  >
                    Apply
                  </button>
                </div>

                {/* Quick Coupon Chips */}
                <div className="flex flex-wrap gap-1.5">
                  {AVAILABLE_COUPONS.map(c => (
                    <button
                      key={c.code}
                      onClick={() => {
                        setCouponCode(c.code);
                        handleApplyCoupon(c.code);
                      }}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/30 text-amber-300 font-mono"
                    >
                      {c.code} ({c.label})
                    </button>
                  ))}
                </div>

                {couponMsg && (
                  <p className="text-[11px] text-amber-300/80 italic">{couponMsg}</p>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs border-t border-amber-500/15 pt-3">
                <div className="flex justify-between text-amber-200/70">
                  <span>Subtotal</span>
                  <span className="font-mono">₹{subtotal}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-medium">
                    <span>Festive Discount ({appliedCoupon?.code})</span>
                    <span className="font-mono">-₹{discount}</span>
                  </div>
                )}
                <div className="flex justify-between text-amber-200/70">
                  <span>Diwali Express Delivery</span>
                  <span className="text-emerald-400 font-bold">FREE</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-amber-200 border-t border-amber-500/20 pt-2 font-serif-festive">
                  <span>Grand Total</span>
                  <span className="text-base text-gold-gradient font-mono">₹{finalTotal}</span>
                </div>
              </div>

              {/* Secure Checkout Button */}
              <button
                onClick={() => {
                  soundFX.playDiyaLight();
                  onProceedToCheckout({
                    subtotal,
                    discount,
                    finalTotal,
                    appliedCoupon: appliedCoupon?.code || 'DIWALI2026',
                    hasFreeGift: isFreeGiftUnlocked
                  });
                }}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 hover:from-amber-400 hover:to-orange-400 text-white font-bold text-sm flex items-center justify-center space-x-2 shadow-xl shadow-orange-500/20 hover:scale-[1.02] transition-transform"
              >
                <span>Proceed to Pay (₹{finalTotal})</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center space-x-2 text-[10px] text-amber-200/60">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>100% Auspicious & Secure SSL Shubh Checkout</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
