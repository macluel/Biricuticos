import { useState, useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  Search,
  Filter,
  Star,
  Heart,
  MapPin,
  Navigation,
  Crosshair,
  Route,
  LocateFixed,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { places } from "@/data/config";
import { FavoriteButton } from "@/components/FavoriteButton";
import { VisitedButton } from "@/components/VisitedButton";

// Mapbox access token
mapboxgl.accessToken =
  "pk.eyJ1IjoibWFjbHVlbCIsImEiOiJjbWN4dmplYTYwZ2pqMmxva2M4eHprOXk2In0.gauez6de-WZWDhQiJzLIqg";

// Disable Mapbox telemetry to prevent fetch errors
if (typeof window !== "undefined") {
  // @ts-ignore
  window.mapboxgl = mapboxgl;
  // Disable telemetry collection
  mapboxgl.prewarm();
}

// Use places from config for map markers
const mapPlaces = places.map((place) => ({
  id: place.id,
  name: place.name,
  location: place.location,
  type: place.type,
  rating: place.rating,
  lat: place.lat || -22.9068,
  lng: place.lng || -43.1729,
  price: place.price,
  description: place.description,
}));

// Calculate distance between two coordinates (Haversine formula)
const calculateDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export default function MapView() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const userLocationMarker = useRef<mapboxgl.Marker | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("Todos");
  const [selectedPlace, setSelectedPlace] = useState<
    (typeof mapPlaces)[0] | null
  >(null);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isTrackingLocation, setIsTrackingLocation] = useState(false);
  const [nearestPlaces, setNearestPlaces] = useState<
    (typeof mapPlaces & { distance: number })[]
  >([]);

  // Filter places based on search and type
  const filteredPlaces = mapPlaces.filter((place) => {
    const matchesSearch =
      place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === "Todos" || place.type === selectedType;
    return matchesSearch && matchesType;
  });

  // Get user's current location
  const getCurrentLocation = () => {
    setLocationError(null);
    setIsTrackingLocation(true);

    if (!navigator.geolocation) {
      setLocationError("Geolocalização não é suportada neste navegador");
      setIsTrackingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        setIsTrackingLocation(false);

        // Update map center to user location
        if (map.current) {
          map.current.flyTo({
            center: [longitude, latitude],
            zoom: 15,
            duration: 1500,
          });
        }

        // Calculate nearest places
        const placesWithDistance = mapPlaces.map((place) => ({
          ...place,
          distance: calculateDistance(
            latitude,
            longitude,
            place.lat,
            place.lng,
          ),
        }));

        // Sort by distance and take top 5
        const nearest = placesWithDistance
          .sort((a, b) => a.distance - b.distance)
          .slice(0, 5);

        setNearestPlaces(nearest);
      },
      (error) => {
        let errorMessage = "Erro ao obter localização";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage =
              "Permissão de localização negada. Permita o acesso à localização para usar esta funcionalidade.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Localização indisponível";
            break;
          case error.TIMEOUT:
            errorMessage = "Timeout ao obter localização";
            break;
        }
        setLocationError(errorMessage);
        setIsTrackingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      },
    );
  };

  // Open navigation to a place
  const navigateToPlace = (place: (typeof mapPlaces)[0]) => {
    if (!userLocation) {
      alert(
        "Sua localização é necessária para navegação. Clique em 'Minha Localização' primeiro.",
      );
      return;
    }

    // Create Google Maps navigation URL
    const googleMapsUrl = `https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${place.lat},${place.lng}`;
    window.open(googleMapsUrl, "_blank");
  };

  useEffect(() => {
    if (map.current) return; // Initialize map only once

    if (!mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [-43.1729, -22.9068], // Rio de Janeiro coordinates
      zoom: 11,
    });

    // Add navigation control
    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    // Add markers for all places
    addMarkersToMap();

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);

  // Update markers when filtered places change
  useEffect(() => {
    if (map.current) {
      addMarkersToMap();
    }
  }, [filteredPlaces]);

  // Update user location marker when location changes
  useEffect(() => {
    if (userLocation && map.current) {
      addUserLocationMarker();
    }
  }, [userLocation]);

  const addUserLocationMarker = () => {
    if (!map.current || !userLocation) return;

    // Remove existing user location marker
    if (userLocationMarker.current) {
      userLocationMarker.current.remove();
    }

    // Create user location marker element
    const userMarkerElement = document.createElement("div");
    userMarkerElement.innerHTML = `
      <div style="
        width: 20px;
        height: 20px;
        background-color: #3b82f6;
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
        animation: pulse 2s infinite;
      "></div>
      <style>
        @keyframes pulse {
          0% { box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3); }
          50% { box-shadow: 0 0 0 10px rgba(59, 130, 246, 0.1); }
          100% { box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3); }
        }
      </style>
    `;

    // Create user location marker
    userLocationMarker.current = new mapboxgl.Marker(userMarkerElement)
      .setLngLat([userLocation.lng, userLocation.lat])
      .addTo(map.current);
  };

  const addMarkersToMap = () => {
    if (!map.current) return;

    // Clear existing markers (but keep user location marker)
    markers.current.forEach((marker) => marker.remove());
    markers.current = [];

    // Add markers for filtered places
    filteredPlaces.forEach((place) => {
      // Create a custom marker element
      const markerElement = document.createElement("div");
      markerElement.className = "custom-marker";

      // Color based on distance if user location is available
      const distanceFromUser = userLocation
        ? calculateDistance(
            userLocation.lat,
            userLocation.lng,
            place.lat,
            place.lng,
          )
        : null;
      const isNearby = distanceFromUser && distanceFromUser <= 2; // Within 2km
      const markerColor = isNearby ? "#10b981" : "#ef4444"; // Green if nearby, red otherwise

      markerElement.innerHTML = `
        <div style="
          width: 32px;
          height: 32px;
          background-color: ${markerColor};
          border: 2px solid white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          cursor: pointer;
          position: relative;
        ">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          <div style="
            position: absolute;
            top: -8px;
            right: -8px;
            width: 20px;
            height: 20px;
            background: white;
            border: 2px solid ${markerColor};
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
            font-weight: bold;
            color: ${markerColor};
          ">${place.rating}</div>
        </div>
      `;

      // Create popup with navigation option
      const distanceText = distanceFromUser
        ? `<br><span style="color: #059669; font-weight: bold;">📍 ${distanceFromUser.toFixed(1)}km de você</span>`
        : "";
      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <div style="padding: 8px; min-width: 200px;">
          <h3 style="margin: 0 0 8px 0; font-weight: bold; color: #1f2937;">${place.name}</h3>
          <div style="display: flex; gap: 8px; margin-bottom: 8px; flex-wrap: wrap;">
            <span style="background: #f3f4f6; padding: 2px 8px; border-radius: 12px; font-size: 12px; color: #374151;">${place.type}</span>
            <span style="display: flex; align-items: center; gap: 4px; font-size: 12px; color: #374151;">
              ⭐ ${place.rating}
            </span>
            ${place.price ? `<span style="background: #f3f4f6; padding: 2px 8px; border-radius: 12px; font-size: 12px; color: #374151;">${place.price}</span>` : ""}
          </div>
          <div style="display: flex; align-items: center; gap: 4px; margin-bottom: 8px;">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="#9ca3af">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span style="font-size: 12px; color: #6b7280;">${place.location}${distanceText}</span>
          </div>
          ${place.description ? `<p style="margin: 0 0 8px 0; font-size: 12px; color: #6b7280; line-height: 1.4;">${place.description}</p>` : ""}
          ${userLocation ? `<button onclick="window.open('https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${place.lat},${place.lng}', '_blank')" style="background: #3b82f6; color: white; border: none; padding: 4px 8px; border-radius: 4px; font-size: 12px; cursor: pointer; margin-top: 4px;">🧭 Navegar</button>` : ""}
        </div>
      `);

      // Create marker
      const marker = new mapboxgl.Marker(markerElement)
        .setLngLat([place.lng, place.lat])
        .setPopup(popup)
        .addTo(map.current!);

      // Add click event to marker
      markerElement.addEventListener("click", () => {
        setSelectedPlace(place);
      });

      markers.current.push(marker);
    });
  };

  const flyToPlace = (place: (typeof mapPlaces)[0]) => {
    if (map.current) {
      map.current.flyTo({
        center: [place.lng, place.lat],
        zoom: 15,
        duration: 1000,
      });
      setSelectedPlace(place);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            GPS dos Restaurantes
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Encontre restaurantes próximos à sua localização
          </p>
        </div>

        {/* Location Controls */}
        <div className="flex gap-2">
          <Button
            onClick={getCurrentLocation}
            disabled={isTrackingLocation}
            variant="outline"
            className="flex items-center gap-2"
          >
            {isTrackingLocation ? (
              <div className="animate-spin h-4 w-4 border-2 border-primary-600 border-t-transparent rounded-full" />
            ) : (
              <LocateFixed className="h-4 w-4" />
            )}
            {isTrackingLocation ? "Localizando..." : "Minha Localização"}
          </Button>
        </div>
      </div>

      {/* Location Error */}
      {locationError && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-700 dark:text-red-300 text-sm">
            {locationError}
          </p>
        </div>
      )}

      {/* Nearest Places Alert */}
      {nearestPlaces.length > 0 && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">
            🎯 Restaurantes Próximos a Você
          </h3>
          <div className="space-y-2">
            {nearestPlaces.slice(0, 3).map((place) => (
              <div key={place.id} className="flex items-center justify-between">
                <div>
                  <span className="font-medium text-green-700 dark:text-green-300">
                    {place.name}
                  </span>
                  <span className="text-green-600 dark:text-green-400 text-sm ml-2">
                    {place.distance.toFixed(1)}km
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => flyToPlace(place)}
                    className="text-xs"
                  >
                    Ver no Mapa
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => navigateToPlace(place)}
                    className="text-xs"
                  >
                    <Route className="h-3 w-3 mr-1" />
                    Navegar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar restaurantes no mapa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12"
            />
          </div>
        </div>

        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger>
            <SelectValue placeholder="Tipo de Comida" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Todos">Todos os Tipos</SelectItem>
            <SelectItem value="Fine Dining">Fine Dining</SelectItem>
            <SelectItem value="Pizzaria">Pizzaria</SelectItem>
            <SelectItem value="Confeitaria">Confeitaria</SelectItem>
            <SelectItem value="Churrascaria">Churrascaria</SelectItem>
            <SelectItem value="Boteco">Boteco</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Map Container */}
      <div className="relative h-[600px] rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
        <div ref={mapContainer} className="w-full h-full" />

        {/* Map Legend */}
        <div className="absolute top-4 left-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-gray-700 dark:text-gray-300">
                Sua Localização
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-700 dark:text-gray-300">
                Próximo (≤2km)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-gray-700 dark:text-gray-300">
                Outros Lugares
              </span>
            </div>
          </div>
        </div>

        {/* Place Info Popup */}
        {selectedPlace && (
          <div className="absolute bottom-4 left-4 right-4 lg:left-4 lg:right-auto lg:w-80 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-4 z-20">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                {selectedPlace.name}
              </h3>
              <button
                onClick={() => setSelectedPlace(null)}
                className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 text-xl leading-none"
              >
                ×
              </button>
            </div>

            <div className="flex items-center gap-2 mb-2">
              <Badge
                variant="secondary"
                className="dark:bg-primary-800 dark:text-primary-100"
              >
                {selectedPlace.type}
              </Badge>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="text-sm font-medium">
                  {selectedPlace.rating}
                </span>
              </div>
              {selectedPlace.price && (
                <Badge variant="outline">{selectedPlace.price}</Badge>
              )}
            </div>

            <div className="flex items-center gap-1 mb-3">
              <MapPin className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {selectedPlace.location}
              </span>
              {userLocation && (
                <span className="text-sm text-green-600 dark:text-green-400 font-medium ml-2">
                  {calculateDistance(
                    userLocation.lat,
                    userLocation.lng,
                    selectedPlace.lat,
                    selectedPlace.lng,
                  ).toFixed(1)}
                  km
                </span>
              )}
            </div>

            {selectedPlace.description && (
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                {selectedPlace.description}
              </p>
            )}

            <div className="flex gap-2">
              <FavoriteButton placeId={selectedPlace.id} size="sm" />
              <VisitedButton placeId={selectedPlace.id} size="sm" />
              {userLocation && (
                <Button
                  size="sm"
                  onClick={() => navigateToPlace(selectedPlace)}
                  className="flex items-center gap-1"
                >
                  <Route className="h-3 w-3" />
                  Navegar
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Places List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Lugares no Mapa ({filteredPlaces.length})
          {userLocation && " - Ordenados por Distância"}
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(userLocation
            ? filteredPlaces
                .map((place) => ({
                  ...place,
                  distance: calculateDistance(
                    userLocation.lat,
                    userLocation.lng,
                    place.lat,
                    place.lng,
                  ),
                }))
                .sort((a, b) => a.distance - b.distance)
            : filteredPlaces
          ).map((place) => (
            <div
              key={place.id}
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary-300 transition-colors cursor-pointer"
              onClick={() => flyToPlace(place)}
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-gray-900 dark:text-gray-100">
                  {place.name}
                </h4>
                <FavoriteButton placeId={place.id} size="sm" />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                {place.location}
                {userLocation && "distance" in place && (
                  <span className="block text-green-600 dark:text-green-400 font-medium">
                    📍 {(place as any).distance.toFixed(1)}km de você
                  </span>
                )}
              </p>
              <div className="flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className="text-xs dark:bg-primary-800 dark:text-primary-100"
                >
                  {place.type}
                </Badge>
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 text-yellow-400 fill-current" />
                  <span className="text-xs">{place.rating}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
