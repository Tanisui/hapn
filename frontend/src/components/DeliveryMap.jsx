import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './DeliveryMap.css';

// Davao City center
const DAVAO_CENTER = [7.0731, 125.6127];

// Custom icon factory
function createIcon(emoji, size = 32) {
  return L.divIcon({
    className: 'custom-marker',
    html: `<span style="font-size:${size}px">${emoji}</span>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
}

const riderDeliveringIcon = createIcon('🏍️', 30);
const riderAvailableIcon = createIcon('🟢', 24);
const destinationIcon = createIcon('📍', 28);

// Re-center map when view changes
function MapUpdater({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 0.8 });
  }, [map, center, zoom]);
  return null;
}

export default function DeliveryMap({ riders, zones, mapView, selectedRider }) {
  const center = selectedRider
    ? [selectedRider.location.lat, selectedRider.location.lng]
    : DAVAO_CENTER;

  const zoom = selectedRider ? 15 : 13;

  return (
    <MapContainer center={center} zoom={zoom} className="delivery-map" scrollWheelZoom={true}>
      <MapUpdater center={center} zoom={zoom} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Delivery Zones */}
      {(mapView === 'zones' || mapView === 'riders') && zones.map(zone => (
        <Circle
          key={zone.name}
          center={[zone.center.lat, zone.center.lng]}
          radius={zone.radius}
          pathOptions={{
            color: zone.color,
            fillColor: zone.color,
            fillOpacity: mapView === 'zones' ? 0.2 : 0.07,
            weight: mapView === 'zones' ? 2 : 1,
          }}
        >
          {mapView === 'zones' && (
            <Popup>
              <div className="zone-popup">
                <strong>{zone.name}</strong>
                <span>Coverage: {zone.radius}m radius</span>
                <span>Delivery: ₱39 – ₱59</span>
              </div>
            </Popup>
          )}
        </Circle>
      ))}

      {/* Rider markers */}
      {riders.map(rider => (
        <Marker
          key={rider.id}
          position={[rider.location.lat, rider.location.lng]}
          icon={rider.status === 'delivering' ? riderDeliveringIcon : riderAvailableIcon}
        >
          <Popup>
            <div className="rider-popup">
              <div className="rider-popup-header">
                <span className="rider-popup-avatar">{rider.avatar}</span>
                <div>
                  <strong>{rider.name}</strong>
                  <span className={`rider-popup-status ${rider.status}`}>
                    {rider.status === 'delivering' ? 'Delivering' : 'Available'}
                  </span>
                </div>
              </div>
              {rider.currentOrder && (
                <div className="rider-popup-order">
                  <span>📦 {rider.currentOrder.items} items</span>
                  <span>From: {rider.currentOrder.merchant}</span>
                  {rider.eta && <span>⏱️ ETA: {rider.eta}</span>}
                </div>
              )}
              <span className="rider-popup-vehicle">{rider.vehicle} {rider.plate !== 'N/A' ? `• ${rider.plate}` : ''}</span>
            </div>
          </Popup>
        </Marker>
      ))}

      {/* Destination markers & route lines for delivering riders */}
      {riders.filter(r => r.status === 'delivering' && r.destination).map(rider => (
        <Marker
          key={`dest-${rider.id}`}
          position={[rider.destination.lat, rider.destination.lng]}
          icon={destinationIcon}
        >
          <Popup>
            <div className="dest-popup">
              <strong>📦 Delivery Destination</strong>
              <span>Order: {rider.currentOrder?.id}</span>
              <span>Customer: {rider.currentOrder?.customer}</span>
            </div>
          </Popup>
        </Marker>
      ))}

      {/* Route polylines */}
      {(mapView === 'riders' || mapView === 'tracking') &&
        riders.filter(r => r.status === 'delivering' && r.destination).map(rider => (
          <Polyline
            key={`route-${rider.id}`}
            positions={[
              [rider.location.lat, rider.location.lng],
              [rider.destination.lat, rider.destination.lng],
            ]}
            pathOptions={{
              color: '#E57373',
              weight: 3,
              dashArray: '8, 8',
              opacity: 0.8,
            }}
          />
        ))
      }
    </MapContainer>
  );
}
