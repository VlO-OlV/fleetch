'use client';

import { FC, useState } from 'react';
import { GoogleMap, LoadScript, Marker, DirectionsRenderer } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '500px',
};

const defaultCenter = {
  lat: 37.7749,
  lng: -122.4194,
};

const GoogleMapComponent: FC = () => {
  const [locations, setLocations] = useState<google.maps.LatLngLiteral[]>([]);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [distance, setDistance] = useState<string | null>(null);
  const [duration, setDuration] = useState<string | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const onLoad = (mapInstance: google.maps.Map) => {
    setMap(mapInstance);
  };

  const onMapClick = (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const newLocation = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      };
      setLocations((prev) => [...prev, newLocation]);
    }
  };

  const calculateRoute = () => {
    if (locations.length < 2 || !map) return;

    const directionsService = new google.maps.DirectionsService();

    // Origin: first point, Destination: last point, Waypoints: middle points
    const origin = locations[0];
    const destination = locations[locations.length - 1];
    const waypoints = locations.slice(1, -1).map((loc) => ({
      location: loc,
      stopover: true, // Allows stopping at the waypoint
    }));

    directionsService.route(
      {
        origin,
        destination,
        waypoints,
        optimizeWaypoints: true,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result) {
          setDirections(result);
          // Sum up total distance and duration from all legs
          const totalDistance = result.routes[0].legs.reduce((acc, leg) => acc + (leg.distance?.value || 0), 0) / 1000; // in km
          const totalDuration = result.routes[0].legs.reduce((acc, leg) => acc + (leg.duration?.value || 0), 0) / 60; // in minutes
          setDistance(`${totalDistance.toFixed(1)} km`);
          setDuration(`${Math.round(totalDuration)} minutes`);
        } else {
          console.error('Error fetching directions:', status);
        }
      }
    );
  };

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={defaultCenter}
        zoom={10}
        onLoad={onLoad}
        onClick={onMapClick}
        options={{
          disableDefaultUI: true,
        }}
      >
        {locations.map((loc, index) => (
          <Marker key={index} position={loc} label={`Pin ${index + 1}`} />
        ))}
        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>
      <button onClick={calculateRoute}>Calculate and Render Route</button>
      {distance && <p>Total Distance: {distance} (Estimated Duration: {duration})</p>}
    </LoadScript>
  );
};

export default GoogleMapComponent;