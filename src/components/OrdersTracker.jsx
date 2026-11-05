import React, { useState, useEffect } from 'react';
import { Package, Truck, CheckCircle, Clock, MapPin, Printer, ArrowRight } from 'lucide-react';
import { soundFX } from '../utils/audio';

export default function OrdersTracker({ onBackToShopping }) {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      setOrders(data);
      if (data.length > 0) {
        setSelectedOrder(data[0]);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs font-semibold mb-2">
            <Package className="w-3.5 h-3.5 text-amber-400" />
            <span>FESTIVE ORDERS & EXPRESS DISPATCH</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black font-serif-festive text-gold-gradient">
            My Diwali Orders & Live Tracking
          </h1>
          <p className="text-amber-100/70 text-xs sm:text-sm">
            Track real-time shipment status, auspicious blessings packing, and delivery timeline.
          </p>
        </div>

        <button
          onClick={onBackToShopping}
          className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-300 font-bold text-xs flex items-center space-x-1.5"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {loading ? (
        <div className="text-center py-16 text-amber-300">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 festive-glass rounded-3xl border border-amber-500/20 p-8 space-y-3">
          <span className="text-5xl block animate-flame-flicker">📦</span>
          <h3 className="font-serif-festive text-lg font-bold text-amber-200">
            No Orders Placed Yet
          </h3>
          <p className="text-xs text-amber-200/60 max-w-sm mx-auto">
            Bring home handmade clay diyas, pure desi ghee sweets, and festive lights with special discounts!
          </p>
          <button
            onClick={onBackToShopping}
            className="mt-3 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-xs shadow-md"
          >
            Start Diwali Shopping
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Order Selector List */}
          <div className="lg:col-span-5 space-y-3">
            <h3 className="text-xs uppercase tracking-wider font-bold text-amber-300/80">
              Your Orders ({orders.length})
            </h3>

            <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
              {orders.map((ord) => {
                const isSelected = selectedOrder?.orderId === ord.orderId;
                return (
                  <div
                    key={ord.orderId}
                    onClick={() => {
                      setSelectedOrder(ord);
                      soundFX.playDiyaLight();
                    }}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-400 shadow-md scale-101'
                        : 'bg-black/40 border-amber-500/20 hover:bg-white/5'
                    }`}
                  >
                    <div className="flex justify-between items-start text-xs">
                      <div>
                        <span className="font-mono font-bold text-amber-300">{ord.orderId}</span>
                        <div className="text-[11px] text-amber-200/50 mt-0.5">
                          {new Date(ord.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold">
                        {ord.status}
                      </span>
                    </div>

                    <div className="mt-3 pt-2 border-t border-amber-500/10 flex justify-between items-center text-xs">
                      <span className="text-amber-200/70">{ord.items?.length || 0} Item(s)</span>
                      <span className="font-mono font-bold text-amber-200">₹{ord.pricing?.finalTotal || 0}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Details & Timeline */}
          {selectedOrder && (
            <div className="lg:col-span-7 p-6 rounded-3xl festive-glass border border-amber-500/30 space-y-6">
              
              <div className="flex flex-wrap justify-between items-center pb-4 border-b border-amber-500/20 gap-2">
                <div>
                  <span className="text-[10px] text-amber-400 font-mono block">ORDER SUMMARY</span>
                  <h3 className="font-mono text-lg font-bold text-amber-200">{selectedOrder.orderId}</h3>
                  <span className="text-xs text-amber-200/60">Placed on {new Date(selectedOrder.createdAt).toLocaleString()}</span>
                </div>

                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-amber-200 border border-amber-400/20 text-xs font-semibold flex items-center space-x-1"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Invoice</span>
                </button>
              </div>

              {/* Express Timeline */}
              <div className="space-y-3">
                <h4 className="text-xs uppercase font-bold text-amber-300 tracking-wider">
                  Shubh Dispatch & Delivery Timeline
                </h4>

                <div className="space-y-3">
                  {[
                    { step: 'Order Placed & Confirmed', time: 'Completed', active: true },
                    { step: 'Packed with Shubh Puja Blessings', time: 'In Progress', active: true },
                    { step: 'Express Courier Dispatch', time: 'Estimated Nov 06', active: false },
                    { step: 'Delivered to Doorstep Before Diwali', time: 'Estimated Nov 07', active: false }
                  ].map((t, idx) => (
                    <div key={idx} className="flex items-center space-x-3 text-xs">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                        t.active ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-neutral-800 text-neutral-500'
                      }`}>
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <span className={`font-semibold ${t.active ? 'text-amber-200' : 'text-neutral-500'}`}>
                          {t.step}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-amber-200/50">{t.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-2 pt-2 border-t border-amber-500/15">
                <h4 className="text-xs uppercase font-bold text-amber-300 tracking-wider">
                  Purchased Items
                </h4>

                <div className="space-y-2">
                  {selectedOrder.items?.map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-xs p-2 rounded-xl bg-black/40">
                      <div className="flex items-center space-x-2">
                        <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover" />
                        <div>
                          <div className="font-semibold text-amber-100">{item.name}</div>
                          <span className="text-[11px] text-amber-200/50">Qty: {item.quantity}</span>
                        </div>
                      </div>
                      <span className="font-mono font-bold text-amber-200">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Address */}
              <div className="p-3 rounded-2xl bg-black/40 border border-amber-500/15 text-xs space-y-1">
                <span className="text-[10px] uppercase font-bold text-amber-400">Delivery Address:</span>
                <p className="text-amber-100">{selectedOrder.customer?.name} ({selectedOrder.customer?.phone})</p>
                <p className="text-amber-200/70">{selectedOrder.deliveryAddress?.address}, {selectedOrder.deliveryAddress?.city} - {selectedOrder.deliveryAddress?.pincode}</p>
              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
}
