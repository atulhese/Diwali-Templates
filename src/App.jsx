import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ShoppingStore from './components/ShoppingStore';
import ProductModal from './components/ProductModal';
import CartDrawer from './components/CartDrawer';
import PaymentGateway from './components/PaymentGateway';
import DiyaCeremony from './components/DiyaCeremony';
import CrackersCanvas from './components/CrackersCanvas';
import RangoliStudio from './components/RangoliStudio';
import EventsMela from './components/EventsMela';
import PujaMuhurat from './components/PujaMuhurat';
import GreetingMaker from './components/GreetingMaker';
import OrdersTracker from './components/OrdersTracker';
import { soundFX } from './utils/audio';

export default function App() {
  const [activeTab, setActiveTab] = useState('store');
  const [products, setProducts] = useState([]);
  const [events, setEvents] = useState([]);
  const [cartItems, setCartItems] = useState([
    {
      id: "prod-1",
      name: "Handcrafted Terracotta Clay Diyas (Set of 12)",
      category: "Diyas & Candles",
      price: 249,
      quantity: 2,
      image: "https://images.unsplash.com/photo-1574267432553-4b4628081c31?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "prod-4",
      name: "Royal Kaju Katli & Assorted Dry Fruit Gift Hamper (1kg)",
      category: "Sweets & Dry Fruits",
      price: 1199,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=800&q=80"
    }
  ]);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutData, setCheckoutData] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Fetch initial products and events from backend
  useEffect(() => {
    fetchProducts();
    fetchEvents();
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {
      console.error('Error loading products:', err);
    }
  };

  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/events');
      if (res.ok) {
        const data = await res.json();
        setEvents(data);
      }
    } catch (err) {
      console.error('Error loading events:', err);
    }
  };

  // Cart operations
  const handleAddToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prev, {
          id: product.id,
          name: product.name,
          category: product.category,
          price: product.price,
          image: product.image,
          quantity: 1
        }];
      }
    });
    showToast(`Added "${product.name}" to your cart! 🪔`);
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCartItems(prev =>
      prev.map(item => item.id === productId ? { ...item, quantity: newQuantity } : item)
    );
  };

  const handleRemoveFromCart = (productId) => {
    const item = cartItems.find(i => i.id === productId);
    setCartItems(prev => prev.filter(item => item.id !== productId));
    if (item) {
      showToast(`Removed "${item.name}" from cart.`);
    }
  };

  const handleClearCart = () => {
    setCartItems([]);
    showToast("Festive cart cleared.");
  };

  // Product CRUD
  const handleSaveProduct = async (productData) => {
    try {
      if (editingProduct) {
        // Update product
        const res = await fetch(`/api/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData)
        });
        const updated = await res.json();
        setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
        showToast(`Updated "${updated.name}" successfully! ✨`);
      } else {
        // Create product
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData)
        });
        const created = await res.json();
        setProducts(prev => [created, ...prev]);
        showToast(`Added new item "${created.name}" to store! 🪔`);
      }
    } catch (err) {
      console.error(err);
      showToast("Error saving product");
    } finally {
      setEditingProduct(null);
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const res = await fetch(`/api/products/${productId}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts(prev => prev.filter(p => p.id !== productId));
        // Also remove from cart if present
        setCartItems(prev => prev.filter(item => item.id !== productId));
        showToast("Product removed from catalogue.");
      }
    } catch (err) {
      console.error(err);
      showToast("Failed to delete product");
    }
  };

  const handleEditProductClick = (product) => {
    setEditingProduct(product);
    setIsAddProductOpen(true);
  };

  // Events operations
  const handleBookEvent = async (eventId, bookingData) => {
    const res = await fetch(`/api/events/${eventId}/book`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData)
    });
    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.error || 'Failed to book');
    }
    fetchEvents(); // refresh spots count
    showToast(`Pass booked for ${result.pass?.eventTitle}! 🎟️`);
    return result.pass;
  };

  const handleAddEvent = async (eventData) => {
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData)
      });
      const created = await res.json();
      setEvents(prev => [created, ...prev]);
      showToast(`Event "${created.title}" added to calendar!`);
    } catch (err) {
      console.error(err);
      showToast("Error adding event");
    }
  };

  // Checkout flow
  const handleProceedToCheckout = (data) => {
    setCheckoutData(data);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOrderSuccess = (order) => {
    setCartItems([]);
    showToast(`Order #${order.orderId} placed with Diwali blessings! 🪔`);
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#0d0306] text-amber-50 selection:bg-amber-500 selection:text-black">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl bg-[#2a0712] border border-amber-400 text-amber-200 text-xs font-semibold shadow-2xl animate-in slide-in-from-bottom-5 flex items-center space-x-2">
          <span className="text-base animate-bounce">🪔</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={totalCartCount}
        setIsCartOpen={setIsCartOpen}
        setIsAddProductOpen={() => {
          setEditingProduct(null);
          setIsAddProductOpen(true);
        }}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
      />

      {/* Main Body Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        
        {/* TAB 1: DIWALI SHOPPING STORE */}
        {activeTab === 'store' && (
          <ShoppingStore
            products={products}
            onAddToCart={handleAddToCart}
            cartItems={cartItems}
            onEditProduct={handleEditProductClick}
            onDeleteProduct={handleDeleteProduct}
            onOpenAddModal={() => {
              setEditingProduct(null);
              setIsAddProductOpen(true);
            }}
            setActiveTab={setActiveTab}
          />
        )}

        {/* TAB 2: DIYA LIGHTING CEREMONY */}
        {activeTab === 'diyas' && (
          <DiyaCeremony />
        )}

        {/* TAB 3: VIRTUAL CRACKERS PLAYGROUND */}
        {activeTab === 'crackers' && (
          <CrackersCanvas />
        )}

        {/* TAB 4: RANGOLI STUDIO */}
        {activeTab === 'rangoli' && (
          <RangoliStudio />
        )}

        {/* TAB 5: EVENTS & MELA */}
        {activeTab === 'events' && (
          <EventsMela
            events={events}
            onBookEvent={handleBookEvent}
            onAddEvent={handleAddEvent}
          />
        )}

        {/* TAB 6: PUJA MUHURAT & VIDHI */}
        {activeTab === 'puja' && (
          <PujaMuhurat />
        )}

        {/* TAB 7: WISHES & GREETING CARDS */}
        {activeTab === 'greetings' && (
          <GreetingMaker />
        )}

        {/* TAB 8: ORDERS TRACKER */}
        {activeTab === 'orders' && (
          <OrdersTracker
            onBackToShopping={() => setActiveTab('store')}
          />
        )}

      </main>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        onProceedToCheckout={handleProceedToCheckout}
      />

      {/* Add / Edit Product Modal */}
      <ProductModal
        isOpen={isAddProductOpen}
        onClose={() => {
          setIsAddProductOpen(false);
          setEditingProduct(null);
        }}
        onSave={handleSaveProduct}
        editingProduct={editingProduct}
      />

      {/* Realistic Payment Gateway Modal */}
      <PaymentGateway
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        checkoutData={checkoutData}
        cartItems={cartItems}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* Festive Footer */}
      <footer className="mt-auto border-t border-amber-500/20 bg-[#120307]/90 py-10 px-4 sm:px-6 lg:px-8 text-center text-xs text-amber-200/60">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex items-center justify-center space-x-2 text-amber-300 font-serif-festive text-lg font-bold">
            <span className="animate-flame-flicker">🪔</span>
            <span>Shubh Deepavali Mahotsav 2026</span>
            <span className="animate-flame-flicker">🪔</span>
          </div>

          <p className="max-w-xl mx-auto text-amber-200/50 leading-relaxed">
            "May the supreme light of truth and wisdom banish the darkness of ignorance, filling every household with peace, virtue, health, and endless wealth."
          </p>

          <div className="flex flex-wrap justify-center gap-4 text-amber-300/80 font-medium pt-2">
            <button onClick={() => setActiveTab('store')} className="hover:text-amber-200">Diwali Shopping</button>
            <span>•</span>
            <button onClick={() => setActiveTab('diyas')} className="hover:text-amber-200">Light Diyas</button>
            <span>•</span>
            <button onClick={() => setActiveTab('crackers')} className="hover:text-amber-200">Eco Crackers</button>
            <span>•</span>
            <button onClick={() => setActiveTab('rangoli')} className="hover:text-amber-200">Rangoli Studio</button>
            <span>•</span>
            <button onClick={() => setActiveTab('events')} className="hover:text-amber-200">Events & Mela</button>
            <span>•</span>
            <button onClick={() => setActiveTab('puja')} className="hover:text-amber-200">Puja Muhurat</button>
          </div>

          <div className="pt-4 border-t border-amber-500/10 text-[11px] text-amber-200/40">
            Crafted with devotional care for Diwali Celebrations • 100% Eco-Friendly Digital Deepavali
          </div>
        </div>
      </footer>

    </div>
  );
}
