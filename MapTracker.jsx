import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'

export default function MapTracker({ restaurant, destination, courier }) {
  const center = [
    (restaurant.coordinates[1] + destination.coordinates[1]) / 2,
    (restaurant.coordinates[0] + destination.coordinates[0]) / 2
  ]
  const positions = [
    [restaurant.coordinates[1], restaurant.coordinates[0]],
    [courier.coordinates[1], courier.coordinates[0]],
    [destination.coordinates[1], destination.coordinates[0]]
  ]
  return (
    <MapContainer center={center} zoom={13} scrollWheelZoom={false} className="leaflet-container">
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap" />
      <Marker position={[restaurant.coordinates[1], restaurant.coordinates[0]]}><Popup>Restaurant</Popup></Marker>
      <Marker position={[destination.coordinates[1], destination.coordinates[0]]}><Popup>Destination</Popup></Marker>
      <Marker position={[courier.coordinates[1], courier.coordinates[0]]}><Popup>Courier</Popup></Marker>
      <Polyline positions={positions} />
    </MapContainer>
  )
}
