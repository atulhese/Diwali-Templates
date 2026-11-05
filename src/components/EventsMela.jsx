import React, { useState } from 'react';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Ticket, 
  PlusCircle, 
  Sparkles, 
  CheckCircle, 
  QrCode, 
  X,
  Share2
} from 'lucide-react';
import { soundFX } from '../utils/audio';

export default function EventsMela({ events, onBookEvent, onAddEvent }) {
  const [selectedEventForBooking, setSelectedEventForBooking] = useState(null);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [bookedPass, setBookedPass] = useState(null);

  // Booking Form State
  const [bookingForm, setBookingForm] = useState({
    name: 'Aarav Sharma',
    email: 'aarav@example.com',
    phone: '9876543210',
    attendeesCount: 2
  });

  // Add Event Form State
  const [newEventForm, setNewEventForm] = useState({
    title: '',
    category: 'Cultural Program',
    date: 'November 08, 2026',
    time: '06:00 PM - 09:00 PM IST',
    location: '',
    organizer: '',
    description: '',
    ticketPrice: '0',
    totalSpots: '200',
    banner: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1000&q=80',
    highlights: 'Food stalls, Live Sangeet, Aarti, Kids Zone'
  });

  const handleOpenBooking = (evt) => {
    setSelectedEventForBooking(evt);
    setBookedPass(null);
    soundFX.playDiyaLight();
  };

  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    if (!selectedEventForBooking) return;

    try {
      const pass = await onBookEvent(selectedEventForBooking.id, bookingForm);
      setBookedPass(pass || {
        passId: `PASS-DW-${Date.now().toString().slice(-6)}`,
        eventTitle: selectedEventForBooking.title,
        attendeeName: bookingForm.name,
        passCount: bookingForm.attendeesCount,
        eventDate: selectedEventForBooking.date,
        location: selectedEventForBooking.location
      });
      soundFX.playBell();
    } catch (err) {
      alert(err.message || 'Error booking passes');
    }
  };

  const handleCreateEvent = (e) => {
    e.preventDefault();
    if (!newEventForm.title || !newEventForm.location) {
      alert('Please fill in title and location.');
      return;
    }

    onAddEvent({
      ...newEventForm,
      ticketPrice: Number(newEventForm.ticketPrice) || 0,
      totalSpots: Number(newEventForm.totalSpots) || 200,
      highlights: newEventForm.highlights.split(',').map(s => s.trim())
    });

    setIsAddEventOpen(false);
    soundFX.playDiyaLight();
    alert('Diwali Event added to community calendar!');
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs font-semibold mb-2">
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <span>FESTIVAL FUNCTIONS & COMMUNITY GATHERINGS</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black font-serif-festive text-gold-gradient">
            Diwali Mela, Maha Aarti & Cultural Events
          </h1>
          <p className="text-amber-100/70 text-xs sm:text-sm">
            Celebrate together! Reserve free passes or participate in grand community competitions.
          </p>
        </div>

        <button
          onClick={() => setIsAddEventOpen(true)}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-300 font-bold text-xs shadow-md transition-all hover:scale-105"
        >
          <PlusCircle className="w-4 h-4 text-amber-400" />
          <span>+ Host a Diwali Event</span>
        </button>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.map((evt) => (
          <div
            key={evt.id}
            className="group relative flex flex-col justify-between bg-gradient-to-b from-[#240811] to-[#140308] rounded-3xl border border-amber-500/25 overflow-hidden festive-card-hover shadow-xl"
          >
            {/* Banner Image */}
            <div className="relative aspect-[16/9] w-full overflow-hidden">
              <img
                src={evt.banner}
                alt={evt.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#140308] via-black/40 to-black/20" />
              
              <div className="absolute top-3 left-3">
                <span className="px-3 py-1 rounded-full bg-amber-500 text-slate-950 font-bold text-xs shadow-md">
                  {evt.category}
                </span>
              </div>

              <div className="absolute top-3 right-3">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold backdrop-blur-md ${
                  evt.status === 'Sold Out'
                    ? 'bg-red-600/80 text-white'
                    : evt.status === 'Almost Full'
                    ? 'bg-amber-600/80 text-white'
                    : 'bg-emerald-600/80 text-white'
                }`}>
                  {evt.status}
                </span>
              </div>
            </div>

            {/* Event Info */}
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <h3 className="font-serif-festive text-xl font-bold text-amber-100 group-hover:text-amber-300 transition-colors">
                  {evt.title}
                </h3>
                <p className="text-amber-200/70 text-xs leading-relaxed line-clamp-2">
                  {evt.description}
                </p>

                <div className="pt-2 space-y-1.5 text-xs text-amber-200/80">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>{evt.date}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>{evt.time}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="truncate">{evt.location}</span>
                  </div>
                </div>

                {/* Highlights */}
                {evt.highlights && (
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {evt.highlights.map((h, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2 py-0.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300"
                      >
                        ✓ {h}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Booking Action Footer */}
              <div className="pt-4 border-t border-amber-500/15 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-amber-200/60 block">ENTRY TICKET</span>
                  <span className="text-lg font-bold font-serif-festive text-amber-200">
                    {evt.ticketPrice === 0 ? 'FREE ENTRY' : `₹${evt.ticketPrice} / Person`}
                  </span>
                </div>

                <button
                  onClick={() => handleOpenBooking(evt)}
                  disabled={evt.status === 'Sold Out'}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 hover:from-amber-400 hover:to-orange-400 text-white font-bold text-xs shadow-lg shadow-orange-500/20 flex items-center space-x-1.5 transition-transform hover:scale-105 disabled:opacity-50"
                >
                  <Ticket className="w-4 h-4" />
                  <span>{evt.status === 'Sold Out' ? 'Full' : 'Book Digital Pass'}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* BOOKING MODAL */}
      {selectedEventForBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md bg-gradient-to-b from-[#240811] to-[#120308] border border-amber-500/40 rounded-3xl p-6 shadow-2xl text-amber-100">
            
            <div className="flex items-center justify-between pb-3 border-b border-amber-500/20">
              <h3 className="font-serif-festive text-lg font-bold text-amber-200">
                {bookedPass ? 'Digital Entry Pass Generated' : 'Reserve Festival Passes'}
              </h3>
              <button
                onClick={() => setSelectedEventForBooking(null)}
                className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-amber-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {!bookedPass ? (
              <form onSubmit={handleConfirmBooking} className="mt-4 space-y-4 text-xs">
                <div>
                  <span className="text-[11px] text-amber-400 block font-bold">{selectedEventForBooking.title}</span>
                  <span className="text-[10px] text-amber-200/60">{selectedEventForBooking.date} • {selectedEventForBooking.location}</span>
                </div>

                <div>
                  <label className="block text-amber-200 mb-1 font-semibold">Attendee Name *</label>
                  <input
                    type="text"
                    required
                    value={bookingForm.name}
                    onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-amber-500/30 text-amber-100 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-amber-200 mb-1 font-semibold">Email *</label>
                    <input
                      type="email"
                      required
                      value={bookingForm.email}
                      onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-black/50 border border-amber-500/30 text-amber-100 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-amber-200 mb-1 font-semibold">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={bookingForm.phone}
                      onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-black/50 border border-amber-500/30 text-amber-100 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-amber-200 mb-1 font-semibold">Number of Attendees</label>
                  <select
                    value={bookingForm.attendeesCount}
                    onChange={(e) => setBookingForm({ ...bookingForm, attendeesCount: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-[#1c060d] border border-amber-500/30 text-amber-100 focus:outline-none focus:border-amber-400 cursor-pointer"
                  >
                    {[1, 2, 3, 4, 5, 6].map(num => (
                      <option key={num} value={num}>{num} Person(s)</option>
                    ))}
                  </select>
                </div>

                <div className="pt-2 border-t border-amber-500/20 flex justify-between items-center text-sm font-bold">
                  <span>Total Amount:</span>
                  <span className="font-mono text-gold-gradient">
                    {selectedEventForBooking.ticketPrice === 0 
                      ? 'FREE' 
                      : `₹${selectedEventForBooking.ticketPrice * bookingForm.attendeesCount}`}
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 text-white font-bold text-xs shadow-lg"
                >
                  Confirm & Generate Digital Pass 🎟️
                </button>
              </form>
            ) : (
              <div className="mt-4 text-center space-y-4">
                <div className="p-5 rounded-2xl bg-black/60 border-2 border-dashed border-amber-400 space-y-3">
                  <div className="flex items-center justify-center space-x-2 text-amber-300 font-bold text-sm">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>DIWALI FESTIVAL PASS</span>
                  </div>
                  <div className="w-28 h-28 mx-auto bg-white p-2 rounded-xl flex items-center justify-center">
                    <QrCode className="w-full h-full text-black" />
                  </div>
                  <div>
                    <span className="text-[11px] text-amber-200/60 block font-mono">PASS ID: {bookedPass.passId}</span>
                    <h4 className="font-bold text-amber-100 text-sm">{bookedPass.eventTitle}</h4>
                    <p className="text-xs text-amber-300 mt-1">Guest: {bookedPass.attendeeName} ({bookedPass.passCount} Passes)</p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedEventForBooking(null)}
                  className="w-full py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
                >
                  Done
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* ADD NEW EVENT MODAL */}
      {isAddEventOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg bg-gradient-to-b from-[#240811] to-[#120308] border border-amber-500/40 rounded-3xl p-6 shadow-2xl text-amber-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-amber-500/20">
              <h3 className="font-serif-festive text-lg font-bold text-amber-200">
                Host a Diwali Community Event
              </h3>
              <button
                onClick={() => setIsAddEventOpen(false)}
                className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-amber-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block text-amber-200 mb-1 font-semibold">Event Title *</label>
                <input
                  type="text"
                  required
                  value={newEventForm.title}
                  onChange={(e) => setNewEventForm({ ...newEventForm, title: e.target.value })}
                  placeholder="e.g. Society Diwali Sangeet & Dandiya Night"
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-amber-500/30 text-amber-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-amber-200 mb-1 font-semibold">Date</label>
                  <input
                    type="text"
                    value={newEventForm.date}
                    onChange={(e) => setNewEventForm({ ...newEventForm, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-amber-500/30 text-amber-100 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-amber-200 mb-1 font-semibold">Time</label>
                  <input
                    type="text"
                    value={newEventForm.time}
                    onChange={(e) => setNewEventForm({ ...newEventForm, time: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-amber-500/30 text-amber-100 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-amber-200 mb-1 font-semibold">Venue / Location *</label>
                <input
                  type="text"
                  required
                  value={newEventForm.location}
                  onChange={(e) => setNewEventForm({ ...newEventForm, location: e.target.value })}
                  placeholder="e.g. Club House Lawn, Lotus County"
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-amber-500/30 text-amber-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-amber-200 mb-1 font-semibold">Description</label>
                <textarea
                  rows={2}
                  value={newEventForm.description}
                  onChange={(e) => setNewEventForm({ ...newEventForm, description: e.target.value })}
                  placeholder="Details about program, food, and music..."
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-amber-500/30 text-amber-100 focus:outline-none"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-amber-500/20">
                <button
                  type="button"
                  onClick={() => setIsAddEventOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-amber-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold"
                >
                  Publish Event 🎪
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
