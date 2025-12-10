'use client';

import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import {
  GoogleMap,
  Marker,
  DirectionsRenderer,
  LoadScriptNext,
} from '@react-google-maps/api';
import { RouteFlagStatus } from '../../orders/create/page';

const defaultCenter = {
  lat: 50.4427,
  lng: 30.5218,
};

interface GoogleMapComponentProps {
  routeFlagStatus?: RouteFlagStatus;
  locations?: { lat: number; lng: number; address: string }[];
  onLocationChange?: (lat: number, lng: number, address: string) => void;
  onRouteChange?: (distance: number) => void;
}

const GoogleMapComponent: FC<GoogleMapComponentProps> = ({
  locations,
  routeFlagStatus,
  onLocationChange,
  onRouteChange,
}) => {
  const [directions, setDirections] =
    useState<google.maps.DirectionsResult | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const onLoad = (mapInstance: google.maps.Map) => {
    setMap(mapInstance);
  };

  const onMapClick = useCallback(
    (event: google.maps.MapMouseEvent) => {
      const geocoder = new google.maps.Geocoder();

      if (event.latLng) {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();

        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
          if (status === 'OK' && results && results[0]) {
            onLocationChange?.(lat, lng, results[0].formatted_address);
          }
        });
      }
    },
    [onLocationChange],
  );

  const calculateRoute = useCallback(() => {
    if (!locations || locations.length < 2 || !map) return;

    const origin = locations[0];
    const destination = locations[locations.length - 1];
    const waypoints = locations.slice(1, -1).map((loc) => ({
      location: loc,
      stopover: true,
    }));

    const directionsService = new google.maps.DirectionsService();

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
          const totalDistance =
            result.routes[0].legs.reduce(
              (acc, leg) => acc + (leg.distance?.value || 0),
              0,
            ) / 1000;
          onRouteChange?.(+totalDistance.toFixed(1));
        }
      },
    );
  }, [locations, onRouteChange, map]);

  useEffect(() => {
    if (routeFlagStatus === RouteFlagStatus.IN_PROGRESS && !!map) {
      calculateRoute();
      return;
    }
    if (routeFlagStatus === RouteFlagStatus.IDLE) {
      (() => setDirections(null))();
    }
  }, [routeFlagStatus, !!map]);

  return (
    <>
      <LoadScriptNext
        googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}
        language="en-US"
      >
        <GoogleMap
          mapContainerStyle={{
            width: '100%',
            height: '100%',
          }}
          center={defaultCenter}
          zoom={10}
          onLoad={onLoad}
          onClick={onMapClick}
          options={{
            disableDefaultUI: true,
          }}
        >
          {locations?.map(
            (loc, index) =>
              loc.lat &&
              loc.lng && (
                <Marker key={index} position={loc} label={`${index + 1}`} />
              ),
          )}
          {directions && <DirectionsRenderer directions={directions} />}
        </GoogleMap>
      </LoadScriptNext>
    </>
  );
};

export default GoogleMapComponent;
