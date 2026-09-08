import { useState, useMemo } from 'react';
import { FiPhone, FiStar, FiMapPin, FiPackage, FiClock, FiTruck, FiCheckCircle, FiNavigation } from 'react-icons/fi';
import DeliveryMap from '../components/DeliveryMap';
import './RidersPage.css';

const riders = [
  {
    id: 1, name: 'Marco Dela Cruz', avatar: '🧑‍💼', rating: 4.9, trips: 1243,
    vehicle: 'Motorcycle', plate: 'MC-1234', phone: '+63 912 345 6789',
    status: 'delivering', eta: '12 mins',
    location: { lat: 7.0860, lng: 125.6100 },
    destination: { lat: 7.0731, lng: 125.6127 },
    currentOrder: { id: 'ORD-20260308-001', items: 3, merchant: 'Lola\'s Lechon Manok', customer: 'Maria Santos' },
  },
  {
    id: 2, name: 'Ana Reyes', avatar: '👩‍💼', rating: 4.8, trips: 987,
    vehicle: 'Motorcycle', plate: 'AR-5678', phone: '+63 917 654 3210',
    status: 'delivering', eta: '25 mins',
    location: { lat: 7.0650, lng: 125.5950 },
    destination: { lat: 7.0500, lng: 125.5700 },
    currentOrder: { id: 'ORD-20260308-002', items: 1, merchant: 'Mindanao Crafts Co.', customer: 'Juan Ramos' },
  },
  {
    id: 3, name: 'Rico Bautista', avatar: '🧔', rating: 4.7, trips: 564,
    vehicle: 'Bicycle', plate: 'N/A', phone: '+63 918 111 2233',
    status: 'available', eta: null,
    location: { lat: 7.0780, lng: 125.6230 },
    destination: null,
    currentOrder: null,
  },
  {
    id: 4, name: 'Jenny Lim', avatar: '👩', rating: 5.0, trips: 2100,
    vehicle: 'Motorcycle', plate: 'JL-9012', phone: '+63 919 222 3344',
    status: 'delivering', eta: '8 mins',
    location: { lat: 7.0920, lng: 125.6300 },
    destination: { lat: 7.0807, lng: 125.6135 },
    currentOrder: { id: 'ORD-20260308-003', items: 5, merchant: 'Davao Fresh Produce', customer: 'Teresa Cruz' },
  },
  {
    id: 5, name: 'Carlos Mendoza', avatar: '🧑', rating: 4.6, trips: 312,
    vehicle: 'Motorcycle', plate: 'CM-3456', phone: '+63 920 333 4455',
    status: 'available', eta: null,
    location: { lat: 7.0550, lng: 125.6050 },
    destination: null,
    currentOrder: null,
  },
  {
    id: 6, name: 'Bea Torres', avatar: '👩‍🦱', rating: 4.9, trips: 1567,
    vehicle: 'Motorcycle', plate: 'BT-7890', phone: '+63 921 444 5566',
    status: 'delivering', eta: '18 mins',
    location: { lat: 7.0700, lng: 125.5800 },
    destination: { lat: 7.0850, lng: 125.6000 },
    currentOrder: { id: 'ORD-20260308-004', items: 2, merchant: 'Durian Delights', customer: 'Paolo Tan' },
  },
];

const deliveryZones = [
  { name: 'Downtown Davao', center: { lat: 7.0731, lng: 125.6127 }, radius: 1200, color: '#E57373' },
  { name: 'Lanang', center: { lat: 7.0950, lng: 125.6350 }, radius: 900, color: '#EF9A9A' },
  { name: 'Toril', center: { lat: 7.0300, lng: 125.5100 }, radius: 1000, color: '#FFCDD2' },
  { name: 'Buhangin', center: { lat: 7.0900, lng: 125.6100 }, radius: 800, color: '#E57373' },
];

const filters = ['All Riders', 'Delivering', 'Available', 'Top Rated'];

const stats = [
  { icon: <FiTruck />, label: 'Active Riders', value: '6' },
  { icon: <FiPackage />, label: 'Deliveries Today', value: '148' },
  { icon: <FiClock />, label: 'Avg Delivery Time', value: '22 min' },
  { icon: <FiCheckCircle />, label: 'Completion Rate', value: '99.2%' },
];

export default function RidersPage({ notify }) {
  const [activeFilter, setActiveFilter] = useState('All Riders');
  const [selectedRider, setSelectedRider] = useState(null);
  const [mapView, setMapView] = useState('riders'); // riders | zones | tracking

  const filtered = useMemo(() => {
    return riders.filter(r => {
      if (activeFilter === 'Delivering') return r.status === 'delivering';
      if (activeFilter === 'Available') return r.status === 'available';
      if (activeFilter === 'Top Rated') return r.rating >= 4.8;
      return true;
    });
  }, [activeFilter]);

  const handleTrackRider = (rider) => {
    setSelectedRider(rider);
    setMapView('tracking');
    notify(`Tracking ${rider.name}`);
  };

  const handleContactRider = (rider) => {
    notify(`Calling ${rider.name}...`);
  };

  return (
    <div className="riders-page">
      {/* Hero */}
      <div className="riders-hero">
        <div className="riders-hero-content">
          <h1><FiNavigation className="hero-icon" /> hap'n! Riders</h1>
          <p>Real-time delivery tracking across Davao City. Fast, reliable, community-powered.</p>
        </div>
        <div className="riders-stats">
          {stats.map(s => (
            <div key={s.label} className="stat-card">
              <span className="stat-icon">{s.icon}</span>
              <span className="stat-value">{s.value}</span>
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Map Section */}
      <section className="riders-map-section">
        <div className="map-header">
          <h2><FiMapPin /> Live Delivery Map</h2>
          <div className="map-view-toggle">
            <button className={`map-toggle-btn${mapView === 'riders' ? ' active' : ''}`} onClick={() => { setMapView('riders'); setSelectedRider(null); }}>
              All Riders
            </button>
            <button className={`map-toggle-btn${mapView === 'zones' ? ' active' : ''}`} onClick={() => { setMapView('zones'); setSelectedRider(null); }}>
              Delivery Zones
            </button>
            {selectedRider && (
              <button className={`map-toggle-btn${mapView === 'tracking' ? ' active' : ''}`} onClick={() => setMapView('tracking')}>
                Tracking: {selectedRider.name.split(' ')[0]}
              </button>
            )}
          </div>
        </div>
        <div className="map-container">
          <DeliveryMap
            riders={mapView === 'tracking' && selectedRider ? [selectedRider] : riders}
            zones={deliveryZones}
            mapView={mapView}
            selectedRider={selectedRider}
          />
        </div>
        <div className="map-legend">
          <span className="legend-item"><span className="legend-dot delivering" /> Delivering</span>
          <span className="legend-item"><span className="legend-dot available" /> Available</span>
          <span className="legend-item"><span className="legend-dot destination" /> Destination</span>
          <span className="legend-item"><span className="legend-dot zone" /> Delivery Zone</span>
        </div>
      </section>

      {/* Riders List */}
      <section className="riders-list-section">
        <div className="riders-toolbar">
          <div className="riders-toolbar-left">
            {filters.map(f => (
              <button key={f} className={`filter-btn${activeFilter === f ? ' active' : ''}`}
                onClick={() => { setActiveFilter(f); notify(`Showing: ${f}`); }}>
                {f}
              </button>
            ))}
            <span className="riders-count">{filtered.length} riders</span>
          </div>
        </div>

        <div className="riders-grid">
          {filtered.map(rider => (
            <div key={rider.id} className={`rider-card ${rider.status}`}>
              <div className="rider-card-header">
                <span className="rider-avatar">{rider.avatar}</span>
                <div className="rider-info">
                  <h3>{rider.name}</h3>
                  <div className="rider-meta">
                    <span className="rider-rating"><FiStar /> {rider.rating}</span>
                    <span className="rider-trips">{rider.trips} trips</span>
                  </div>
                </div>
                <span className={`rider-status-badge ${rider.status}`}>
                  {rider.status === 'delivering' ? '🔴 Delivering' : '🟢 Available'}
                </span>
              </div>

              <div className="rider-details">
                <div className="rider-detail-row">
                  <FiTruck /> <span>{rider.vehicle} {rider.plate !== 'N/A' ? `• ${rider.plate}` : ''}</span>
                </div>
                <div className="rider-detail-row">
                  <FiPhone /> <span>{rider.phone}</span>
                </div>
              </div>

              {rider.currentOrder && (
                <div className="rider-order-info">
                  <div className="order-label"><FiPackage /> Active Order</div>
                  <div className="order-details">
                    <span className="order-id">{rider.currentOrder.id}</span>
                    <span>{rider.currentOrder.items} items from <strong>{rider.currentOrder.merchant}</strong></span>
                    <span>To: {rider.currentOrder.customer}</span>
                    {rider.eta && <span className="order-eta"><FiClock /> ETA: {rider.eta}</span>}
                  </div>
                </div>
              )}

              <div className="rider-card-actions">
                <button className="rider-action-btn track" onClick={() => handleTrackRider(rider)}>
                  <FiMapPin /> Track on Map
                </button>
                <button className="rider-action-btn contact" onClick={() => handleContactRider(rider)}>
                  <FiPhone /> Contact
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Delivery Zones Info */}
      <section className="zones-info-section">
        <h2>Delivery Coverage Zones</h2>
        <p className="zones-subtitle">hap'n! riders cover all major areas in Davao City with fast and affordable delivery.</p>
        <div className="zones-grid">
          {deliveryZones.map(zone => (
            <div key={zone.name} className="zone-card" style={{ borderLeftColor: zone.color }}>
              <h3>{zone.name}</h3>
              <div className="zone-detail"><FiMapPin /> Radius: {zone.radius}m</div>
              <div className="zone-detail"><FiClock /> Avg: 15-30 mins</div>
              <div className="zone-detail"><FiTruck /> ₱39 – ₱59 delivery fee</div>
            </div>
          ))}
        </div>
      </section>

      {/* Become a Rider CTA */}
      <section className="become-rider-section">
        <div className="become-rider-content">
          <h2>🏍️ Become a hap'n! Rider</h2>
          <p>Earn money on your own schedule. Deliver for local MSMEs in Davao City and be part of our growing community.</p>
          <div className="become-rider-perks">
            <div className="perk">✅ Flexible hours</div>
            <div className="perk">✅ Weekly payouts</div>
            <div className="perk">✅ Insurance coverage</div>
            <div className="perk">✅ Fuel allowance</div>
          </div>
          <button className="become-rider-btn" onClick={() => notify('Rider application form coming soon!')}>
            Apply Now
          </button>
        </div>
      </section>
    </div>
  );
}
