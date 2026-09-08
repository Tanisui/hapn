import { useState } from 'react';
import '../components/PageLayout.css';

const events = [
  {
    id: 1, name: 'Davao Weekend Bazaar', emoji: '🎪',
    date: 'March 15, 2026', time: '9:00 AM – 6:00 PM',
    venue: 'SM Lanang Premier, Davao City', status: 'upcoming',
    description: 'The biggest weekend market featuring 50+ MSME vendors, live music, and food stalls.',
    merchants: 54, slots: 12,
  },
  {
    id: 2, name: 'Kadayawan Craft Fair', emoji: '🌺',
    date: 'March 22, 2026', time: '10:00 AM – 8:00 PM',
    venue: 'People\'s Park, Davao City', status: 'upcoming',
    description: 'Celebrate Davao culture with handmade crafts, tribal art showcases, and workshops.',
    merchants: 38, slots: 8,
  },
  {
    id: 3, name: 'Foodie Night Market', emoji: '🍢',
    date: 'Every Friday', time: '5:00 PM – 11:00 PM',
    venue: 'Roxas Avenue Night Market', status: 'live',
    description: 'Street food heaven — local delicacies, fusion dishes, and artisanal beverages.',
    merchants: 72, slots: 0,
  },
  {
    id: 4, name: 'Eco-Living Expo', emoji: '🌱',
    date: 'April 5, 2026', time: '9:00 AM – 5:00 PM',
    venue: 'SMX Convention Center, Davao', status: 'upcoming',
    description: 'Sustainable living showcase — eco products, zero-waste workshops, and green tech demos.',
    merchants: 30, slots: 20,
  },
  {
    id: 5, name: 'Artisan Pop-Up Store', emoji: '🎨',
    date: 'March 29, 2026', time: '11:00 AM – 7:00 PM',
    venue: 'Abreeza Mall, Davao City', status: 'upcoming',
    description: 'Rotating pop-up featuring a different set of local artisans every month.',
    merchants: 15, slots: 5,
  },
  {
    id: 6, name: 'Davao Coffee Festival', emoji: '☕',
    date: 'April 12, 2026', time: '8:00 AM – 6:00 PM',
    venue: 'Davao Convention Center', status: 'upcoming',
    description: 'Specialty coffee from Mindanao farms, barista competitions, and cupping sessions.',
    merchants: 25, slots: 15,
  },
];

const filters = ['All Events', 'Upcoming', 'Live Now', 'Markets', 'Workshops'];

export default function EventsPage({ notify }) {
  const [activeFilter, setActiveFilter] = useState('All Events');

  const filtered = events.filter(e => {
    if (activeFilter === 'Upcoming') return e.status === 'upcoming';
    if (activeFilter === 'Live Now') return e.status === 'live';
    return true;
  });

  return (
    <div className="page-layout">
      <div className="page-hero" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', color: '#fff' }}>
        <h1>Events & Bazaars</h1>
        <p>Discover local markets, pop-ups, workshops, and festivals happening in Davao City.</p>
        <span className="page-hero-emoji">🎪</span>
      </div>

      <div className="page-toolbar">
        <div className="page-toolbar-left">
          {filters.map(f => (
            <button key={f} className={`filter-btn${activeFilter === f ? ' active' : ''}`} onClick={() => { setActiveFilter(f); notify(`Showing: ${f}`); }}>
              {f}
            </button>
          ))}
          <span className="page-result-count">{filtered.length} events</span>
        </div>
      </div>

      <div className="page-promo-strip">
        <div>
          <h3>📣 Become a Vendor — register for upcoming bazaars</h3>
          <p>MSME owners can apply for booth slots at any upcoming event.</p>
        </div>
        <button className="promo-strip-btn" onClick={() => notify('Vendor registration form opening...')}>Apply Now</button>
      </div>

      <div className="events-grid">
        {filtered.map(event => (
          <div key={event.id} className="event-card" onClick={() => notify(`Viewing "${event.name}" details`)}>
            <div className="event-card-banner" style={{
              background: event.status === 'live'
                ? 'linear-gradient(135deg, #e8f5e9, #c8e6c9)'
                : 'linear-gradient(135deg, #fff3e0, #ffe0b2)'
            }}>
              {event.emoji}
            </div>
            <div className="event-card-body">
              <span className={`event-card-badge ${event.status}`}>
                {event.status === 'live' ? '🟢 Live Now' : '🟠 Upcoming'}
              </span>
              <h3>{event.name}</h3>
              <p>{event.description}</p>
              <div className="event-card-meta">
                <span>📅 {event.date}</span>
                <span>🕐 {event.time}</span>
              </div>
              <div className="event-card-meta" style={{ marginTop: 6 }}>
                <span>📍 {event.venue}</span>
                <span>🏪 {event.merchants} vendors</span>
              </div>
              {event.slots > 0 ? (
                <button className="event-join-btn" onClick={(e) => { e.stopPropagation(); notify(`Reserved a spot at "${event.name}"!`); }}>
                  Reserve Spot ({event.slots} left)
                </button>
              ) : (
                <button className="event-join-btn" style={{ background: 'var(--gray-400)' }} onClick={(e) => { e.stopPropagation(); notify('This event is fully booked!'); }}>
                  Fully Booked
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="page-feature-grid">
        <div className="feature-card" onClick={() => notify('Setting up event reminders...')}>
          <div className="feature-card-emoji">🔔</div>
          <h3>Event Reminders</h3>
          <p>Get notified when new events are posted or when your reserved events are near.</p>
        </div>
        <div className="feature-card" onClick={() => notify('Viewing event map...')}>
          <div className="feature-card-emoji">🗺️</div>
          <h3>Event Map</h3>
          <p>Interactive map showing all ongoing and upcoming events around Davao City.</p>
        </div>
        <div className="feature-card" onClick={() => notify('Viewing past events gallery...')}>
          <div className="feature-card-emoji">📸</div>
          <h3>Past Events Gallery</h3>
          <p>Browse photos and highlights from previous bazaars and pop-ups.</p>
        </div>
      </div>
    </div>
  );
}
