import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  CreditCard, 
  QrCode, 
  Building2, 
  Truck, 
  Lock, 
  CheckCircle, 
  Sparkles, 
  Printer, 
  ArrowRight,
  Flame,
  Smartphone
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundFX } from '../utils/audio';

export default function PaymentGateway({
  isOpen,
  onClose,
  checkoutData,
  cartItems,
  onOrderSuccess
}) {
  const [step, setStep] = useState('checkout'); // 'checkout' | 'processing' | 'otp' | 'success'
  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi' | 'card' | 'netbanking' | 'cod'
  
  // Customer & Shipping state
  const [customer, setCustomer] = useState({
    name: 'Aarav Sharma',
    email: 'aarav.sharma@example.com',
    phone: '9876543210',
    address: 'Flat 402, Lotus Residency, MG Road',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001'
  });

  // Card details state
  const [cardData, setCardData] = useState({
    number: '4532 8920 1122 8492',
    name: 'AARAV SHARMA',
    expiry: '11/28',
    cvv: '888'
  });

  // UPI state
  const [upiId, setUpiId] = useState('aarav@okhdfcbank');
  const [selectedUpiApp, setSelectedUpiApp] = useState('gpay');

  // Selected Bank for Netbanking
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  // OTP state
  const [otp, setOtp] = useState('123456');
  const [createdOrder, setCreatedOrder] = useState(null);

  if (!isOpen) return null;

  const finalAmount = checkoutData?.finalTotal || 0;

  const handleStartPayment = (e) => {
    e.preventDefault();
    if (!customer.name || !customer.phone || !customer.address || !customer.pincode) {
      alert('Please fill out all delivery address fields.');
      return;
    }

    if (paymentMethod === 'cod') {
      finalizeOrder('COD', 'COD-PENDING');
      return;
    }

    // Move to OTP simulation for card/upi
    setStep('otp');
    soundFX.playDiyaLight();
  };

  const handleVerifyOtp = () => {
    setStep('processing');
    soundFX.playDiyaLight();

    setTimeout(() => {
      finalizeOrder(paymentMethod.toUpperCase(), `TXN-SHUBH-${Math.floor(10000000 + Math.random() * 90000000)}`);
    }, 2000);
  };

  const finalizeOrder = async (methodName, transactionId) => {
    const orderPayload = {
      items: cartItems,
      customer: {
        name: customer.name,
        email: customer.email,
        phone: customer.phone
      },
      deliveryAddress: {
        address: customer.address,
        city: customer.city,
        state: customer.state,
        pincode: customer.pincode
      },
      pricing: {
        subtotal: checkoutData.subtotal,
        discount: checkoutData.discount,
        couponCode: checkoutData.appliedCoupon,
        finalTotal: checkoutData.finalTotal,
        hasFreeGift: checkoutData.hasFreeGift
      },
      paymentDetails: {
        method: methodName,
        transactionId: transactionId,
        status: 'PAID'
      }
    };

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });
      const orderResult = await response.json();
      setCreatedOrder(orderResult);
      setStep('success');

      // Trigger festive celebration effects
      soundFX.playOrderSuccess();
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#dc2626', '#10b981', '#fbbf24', '#ffffff']
      });

      onOrderSuccess(orderResult);
    } catch (err) {
      console.error('Error placing order:', err);
      // Fallback local order creation if backend network delay
      const fallbackOrder = {
        ...orderPayload,
        orderId: `ORD-DIWALI-${Date.now().toString().slice(-6)}`,
        createdAt: new Date().toISOString(),
        estimatedDelivery: 'November 07, 2026'
      };
      setCreatedOrder(fallbackOrder);
      setStep('success');
      soundFX.playOrderSuccess();
      onOrderSuccess(fallbackOrder);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-gradient-to-b from-[#240811] via-[#1a050d] to-[#120308] border border-amber-500/40 rounded-3xl p-5 sm:p-8 shadow-2xl my-6 text-amber-100">
        
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-amber-500/25">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-xl shadow">
              🪔
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg sm:text-xl font-bold font-serif-festive text-gold-gradient">
                  Shubh Pay Gateway
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center space-x-1 font-semibold">
                  <ShieldCheck className="w-3 h-3" />
                  <span>256-bit Encrypted</span>
                </span>
              </div>
              <p className="text-xs text-amber-200/60">
                Official Diwali Festive Checkout & Auspicious Blessing
              </p>
            </div>
          </div>

          {step !== 'processing' && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-amber-200"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* STEP 1: CHECKOUT & PAYMENT SELECTION */}
        {step === 'checkout' && (
          <form onSubmit={handleStartPayment} className="mt-5 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Customer & Shipping Address */}
              <div className="lg:col-span-7 space-y-4">
                <h3 className="text-xs uppercase tracking-wider font-bold text-amber-300/80 flex items-center space-x-1.5">
                  <Truck className="w-4 h-4 text-amber-400" />
                  <span>1. Festive Delivery Address</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-amber-200/80 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={customer.name}
                      onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-black/50 border border-amber-500/30 text-amber-100 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-amber-200/80 mb-1">Mobile Number (For Delivery Updates) *</label>
                    <input
                      type="tel"
                      required
                      value={customer.phone}
                      onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-black/50 border border-amber-500/30 text-amber-100 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-amber-200/80 mb-1">Street Address / House No. *</label>
                    <input
                      type="text"
                      required
                      value={customer.address}
                      onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-black/50 border border-amber-500/30 text-amber-100 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-amber-200/80 mb-1">City *</label>
                    <input
                      type="text"
                      required
                      value={customer.city}
                      onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-black/50 border border-amber-500/30 text-amber-100 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-amber-200/80 mb-1">Pincode *</label>
                    <input
                      type="text"
                      required
                      value={customer.pincode}
                      onChange={(e) => setCustomer({ ...customer, pincode: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-black/50 border border-amber-500/30 text-amber-100 focus:outline-none focus:border-amber-400 font-mono"
                    />
                  </div>
                </div>

                {/* Delivery Guarantee Pill */}
                <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-400/30 text-xs flex items-center space-x-2 text-amber-200">
                  <Flame className="w-4 h-4 text-orange-400 shrink-0" />
                  <span>Express Diwali Dispatch: Guaranteed delivery with Shubh Pooja blessings before Nov 07!</span>
                </div>
              </div>

              {/* Right Column: Order Summary & Total */}
              <div className="lg:col-span-5 space-y-4 bg-black/40 p-4 rounded-2xl border border-amber-500/20">
                <h3 className="text-xs uppercase tracking-wider font-bold text-amber-300/80">
                  Order Summary
                </h3>

                <div className="max-h-40 overflow-y-auto space-y-2 pr-1 text-xs">
                  {cartItems.map(item => (
                    <div key={item.id} className="flex justify-between items-center text-amber-200/80">
                      <span className="truncate max-w-[160px]">{item.name} × {item.quantity}</span>
                      <span className="font-mono text-amber-200">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                  {checkoutData.hasFreeGift && (
                    <div className="flex justify-between items-center text-emerald-400 text-[11px]">
                      <span>🎁 Free Gift: 4-Pack Clay Diyas</span>
                      <span>FREE</span>
                    </div>
                  )}
                </div>

                <div className="border-t border-amber-500/20 pt-3 space-y-1.5 text-xs">
                  <div className="flex justify-between text-amber-200/60">
                    <span>Subtotal:</span>
                    <span className="font-mono">₹{checkoutData.subtotal}</span>
                  </div>
                  {checkoutData.discount > 0 && (
                    <div className="flex justify-between text-emerald-400">
                      <span>Diwali Discount ({checkoutData.appliedCoupon}):</span>
                      <span className="font-mono">-₹{checkoutData.discount}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-amber-200/60">
                    <span>Diwali Express Delivery:</span>
                    <span className="text-emerald-400 font-bold">FREE</span>
                  </div>
                  <div className="flex justify-between items-baseline pt-2 border-t border-amber-500/20">
                    <span className="font-serif-festive font-bold text-sm text-amber-200">Amount Payable:</span>
                    <span className="text-xl font-bold font-mono text-gold-gradient">₹{finalAmount}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* STEP 2: PAYMENT METHOD TABS */}
            <div className="space-y-4 pt-3 border-t border-amber-500/20">
              <h3 className="text-xs uppercase tracking-wider font-bold text-amber-300/80 flex items-center space-x-1.5">
                <Lock className="w-4 h-4 text-amber-400" />
                <span>2. Select Payment Method</span>
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'upi', label: 'UPI / QR', icon: QrCode, desc: 'GPay, PhonePe, Paytm' },
                  { id: 'card', label: 'Cards', icon: CreditCard, desc: 'Visa, RuPay, Master' },
                  { id: 'netbanking', label: 'Net Banking', icon: Building2, desc: 'All Indian Banks' },
                  { id: 'cod', label: 'Cash on Delivery', icon: Truck, desc: 'Pay at Doorstep' }
                ].map(tab => {
                  const Icon = tab.icon;
                  const isSelected = paymentMethod === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => {
                        setPaymentMethod(tab.id);
                        soundFX.playDiyaLight();
                      }}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        isSelected
                          ? 'bg-amber-500/20 border-amber-400 text-amber-200 shadow-md scale-102 font-bold'
                          : 'bg-black/40 border-amber-500/20 text-amber-100/70 hover:bg-white/5'
                      }`}
                    >
                      <Icon className={`w-5 h-5 mb-1 ${isSelected ? 'text-amber-400' : 'text-amber-300/60'}`} />
                      <div className="text-xs font-bold">{tab.label}</div>
                      <div className="text-[10px] text-amber-200/50 truncate">{tab.desc}</div>
                    </button>
                  );
                })}
              </div>

              {/* PAYMENT DETAILS PANEL */}
              <div className="p-5 rounded-2xl bg-black/50 border border-amber-500/25">
                
                {/* 1. UPI TAB */}
                {paymentMethod === 'upi' && (
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                    <div className="sm:col-span-5 flex flex-col items-center justify-center p-4 bg-white rounded-2xl text-slate-900 shadow-lg">
                      <div className="w-36 h-36 bg-neutral-100 p-2 border-2 border-dashed border-amber-600 rounded-xl flex flex-col items-center justify-center relative">
                        {/* Simulated QR Code SVG pattern */}
                        <svg className="w-full h-full text-slate-900" viewBox="0 0 100 100" fill="currentColor">
                          <rect x="10" y="10" width="25" height="25" rx="3" />
                          <rect x="65" y="10" width="25" height="25" rx="3" />
                          <rect x="10" y="65" width="25" height="25" rx="3" />
                          <rect x="16" y="16" width="13" height="13" fill="white" />
                          <rect x="71" y="16" width="13" height="13" fill="white" />
                          <rect x="16" y="71" width="13" height="13" fill="white" />
                          {/* Inner patterns */}
                          <circle cx="22" cy="22" r="3.5" />
                          <circle cx="77" cy="22" r="3.5" />
                          <circle cx="22" cy="77" r="3.5" />
                          <rect x="42" y="15" width="12" height="12" />
                          <rect x="45" y="35" width="15" height="15" />
                          <rect x="65" y="60" width="12" height="20" />
                          <rect x="40" y="70" width="15" height="10" />
                          <circle cx="50" cy="50" r="6" fill="#f59e0b" />
                        </svg>
                      </div>
                      <div className="mt-2 text-center">
                        <span className="text-[11px] font-bold text-slate-900 block">Scan with any UPI App</span>
                        <span className="text-[10px] text-slate-600 font-mono font-bold">Amount: ₹{finalAmount}</span>
                      </div>
                    </div>

                    <div className="sm:col-span-7 space-y-3">
                      <label className="block text-xs font-semibold text-amber-200">Or Pay via UPI ID / VPA</label>
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          placeholder="yourname@okhdfcbank"
                          className="flex-1 px-3 py-2 text-xs rounded-xl bg-black/60 border border-amber-500/30 text-amber-100 font-mono focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div className="flex items-center space-x-2 pt-2">
                        {['Google Pay', 'PhonePe', 'Paytm', 'BHIM UPI'].map(app => (
                          <span
                            key={app}
                            className="text-[10px] px-2 py-1 rounded-lg bg-amber-500/10 border border-amber-400/20 text-amber-300"
                          >
                            ✓ {app}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. CARD TAB */}
                {paymentMethod === 'card' && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="sm:col-span-2">
                        <label className="block text-amber-200/80 mb-1">Card Number</label>
                        <input
                          type="text"
                          value={cardData.number}
                          onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-black/60 border border-amber-500/30 text-amber-100 font-mono tracking-widest focus:outline-none focus:border-amber-400"
                        />
                      </div>
                      <div>
                        <label className="block text-amber-200/80 mb-1">Expiry Date (MM/YY)</label>
                        <input
                          type="text"
                          value={cardData.expiry}
                          onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-black/60 border border-amber-500/30 text-amber-100 font-mono focus:outline-none focus:border-amber-400"
                        />
                      </div>
                      <div>
                        <label className="block text-amber-200/80 mb-1">CVV / CVC</label>
                        <input
                          type="password"
                          maxLength={3}
                          value={cardData.cvv}
                          onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-black/60 border border-amber-500/30 text-amber-100 font-mono focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 text-[11px] text-amber-200/60 pt-1">
                      <span>Supported:</span>
                      <span className="font-semibold text-amber-300">RuPay, Visa, MasterCard, Maestro</span>
                    </div>
                  </div>
                )}

                {/* 3. NET BANKING */}
                {paymentMethod === 'netbanking' && (
                  <div className="space-y-3">
                    <label className="block text-xs font-semibold text-amber-200">Select Bank</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {['HDFC Bank', 'State Bank of India', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra', 'Punjab National Bank'].map(bank => (
                        <button
                          key={bank}
                          type="button"
                          onClick={() => setSelectedBank(bank)}
                          className={`p-2.5 rounded-xl border text-xs text-left transition-all ${
                            selectedBank === bank
                              ? 'bg-amber-500/20 border-amber-400 text-amber-200 font-bold'
                              : 'bg-black/40 border-amber-500/20 text-amber-200/70 hover:bg-white/5'
                          }`}
                        >
                          🏦 {bank}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. CASH ON DELIVERY */}
                {paymentMethod === 'cod' && (
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center space-x-2 text-amber-300 font-semibold">
                      <Truck className="w-4 h-4 text-amber-400" />
                      <span>Cash or UPI on Delivery Doorstep</span>
                    </div>
                    <p className="text-amber-200/70 leading-relaxed">
                      Pay safely when the courier executive delivers your Diwali packages. You may pay with cash or scan the delivery QR code on arrival.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-amber-500/20">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-amber-200 text-xs font-semibold"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 hover:from-amber-400 hover:to-orange-400 text-white font-bold text-sm shadow-xl shadow-orange-500/20 flex items-center space-x-2 transition-all hover:scale-105"
              >
                <Lock className="w-4 h-4" />
                <span>
                  {paymentMethod === 'cod' ? `Confirm Order (₹${finalAmount})` : `Authorize & Pay ₹${finalAmount}`}
                </span>
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: SIMULATED BANK OTP VERIFICATION */}
        {step === 'otp' && (
          <div className="py-8 px-4 text-center max-w-md mx-auto space-y-5 animate-in zoom-in-95">
            <div className="w-14 h-14 mx-auto rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-2xl">
              🔐
            </div>
            
            <div>
              <h3 className="text-lg font-bold font-serif-festive text-amber-200">
                Bank 3D-Secure Verification
              </h3>
              <p className="text-xs text-amber-200/60 mt-1">
                Enter the One-Time-Password (OTP) sent to registered mobile ending with <strong>•••210</strong>
              </p>
            </div>

            <div className="space-y-2">
              <input
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-48 mx-auto px-4 py-3 rounded-xl bg-black/60 border-2 border-amber-400 text-amber-200 font-mono text-center text-xl tracking-[0.3em] focus:outline-none"
              />
              <p className="text-[11px] text-amber-300/60">
                (Simulated Test OTP: <strong>123456</strong>)
              </p>
            </div>

            <div className="flex items-center justify-center space-x-3 pt-2">
              <button
                onClick={() => setStep('checkout')}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-amber-200 text-xs"
              >
                Back
              </button>
              <button
                onClick={handleVerifyOtp}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-xs shadow-lg hover:scale-105"
              >
                Confirm & Pay ₹{finalAmount}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: PROCESSING SPINNER */}
        {step === 'processing' && (
          <div className="py-16 text-center space-y-5 animate-in fade-in">
            <div className="relative w-20 h-20 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-amber-500/20 animate-ping"></div>
              <div className="w-full h-full rounded-full border-4 border-amber-400 border-t-transparent animate-spin flex items-center justify-center text-3xl">
                🪔
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold font-serif-festive text-gold-gradient">
                Processing Auspicious Transaction...
              </h3>
              <p className="text-xs text-amber-200/70 mt-1">
                Connecting with bank gateway & invoking Shubh Deepavali blessing. Please do not close or refresh.
              </p>
            </div>
          </div>
        )}

        {/* STEP 4: ORDER CONFIRMATION & INVOICE */}
        {step === 'success' && createdOrder && (
          <div className="space-y-6 pt-2 animate-in zoom-in-95">
            {/* Success Banner */}
            <div className="text-center space-y-2 p-5 rounded-2xl bg-gradient-to-r from-emerald-950/70 via-amber-950/60 to-emerald-950/70 border border-emerald-500/40">
              <span className="text-5xl block animate-bounce">🪔</span>
              <h3 className="text-2xl font-black font-serif-festive text-gold-gradient">
                Shubh Deepavali! Order Confirmed
              </h3>
              <p className="text-xs text-amber-200/80 max-w-md mx-auto">
                May Goddess Mahalakshmi bless your abode with supreme joy, happiness, and prosperity!
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="p-5 rounded-2xl bg-black/60 border border-amber-500/30 space-y-4 text-xs font-mono">
              <div className="flex flex-wrap justify-between items-center border-b border-amber-500/20 pb-3 gap-2">
                <div>
                  <span className="text-amber-200/60 block text-[10px]">ORDER ID</span>
                  <span className="font-bold text-amber-300 text-sm">{createdOrder.orderId}</span>
                </div>
                <div>
                  <span className="text-amber-200/60 block text-[10px]">PAYMENT METHOD</span>
                  <span className="font-bold text-amber-200">{createdOrder.paymentDetails?.method || 'UPI'}</span>
                </div>
                <div>
                  <span className="text-amber-200/60 block text-[10px]">ESTIMATED DELIVERY</span>
                  <span className="font-bold text-emerald-400">{createdOrder.estimatedDelivery || 'Nov 07, 2026'}</span>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-1.5 py-1">
                <span className="text-amber-200/60 text-[10px] uppercase font-sans font-bold">Items Ordered:</span>
                {createdOrder.items?.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-amber-200">
                    <span className="truncate max-w-[260px]">{item.name} (x{item.quantity})</span>
                    <span>₹{item.price * item.quantity}</span>
                  </div>
                ))}
                {createdOrder.pricing?.hasFreeGift && (
                  <div className="flex justify-between text-emerald-400">
                    <span>🎁 Free 4-Pack Terracotta Diyas</span>
                    <span>FREE</span>
                  </div>
                )}
              </div>

              <div className="border-t border-amber-500/20 pt-2 flex justify-between items-baseline text-sm font-bold text-amber-100 font-sans">
                <span>Total Amount Paid:</span>
                <span className="text-lg text-gold-gradient font-mono">₹{createdOrder.pricing?.finalTotal || finalAmount}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                onClick={handlePrint}
                className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-amber-200 text-xs font-semibold border border-amber-400/20"
              >
                <Printer className="w-4 h-4" />
                <span>Print Invoice</span>
              </button>

              <button
                onClick={onClose}
                className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs shadow-lg transition-transform hover:scale-105"
              >
                Continue Festival Celebrations
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
