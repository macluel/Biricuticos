import { useState, useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Search, Filter, Star, Heart, MapPin } from "lucide-react";
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

// Mapbox access token - using a demo token (you'll need to replace this with your own)
mapboxgl.accessToken =
  "pk.eyJ1IjoibWFjbHVlbCIsImEiOiJjbWN4dmplYTYwZ2pqMmxva2M4eHprOXk2In0.gauez6de-WZWDhQiJzLIqg";

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

export default function MapView() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("Todos");
  const [selectedPlace, setSelectedPlace] = useState<
    (typeof mapPlaces)[0] | null
  >(null);

  // Filter places based on search and type
  const filteredPlaces = mapPlaces.filter((place) => {
    const matchesSearch =
      place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === "Todos" || place.type === selectedType;
    return matchesSearch && matchesType;
  });

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

  const addMarkersToMap = () => {
    if (!map.current) return;

    // Clear existing markers
    markers.current.forEach((marker) => marker.remove());
    markers.current = [];

    // Add markers for filtered places
    filteredPlaces.forEach((place) => {
      // Create a custom marker element
      const markerElement = document.createElement("div");
      markerElement.className = "custom-marker";
      markerElement.innerHTML = `
        <div style="
          width: 32px;
          height: 32px;
          background-color: #ef4444;
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
            border: 2px solid #ef4444;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
            font-weight: bold;
            color: #ef4444;
          ">${place.rating}</div>
        </div>
      `;

      // Create popup
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
            <span style="font-size: 12px; color: #6b7280;">${place.location}</span>
          </div>
          ${place.description ? `<p style="margin: 0; font-size: 12px; color: #6b7280; line-height: 1.4;">${place.description}</p>` : ""}
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
            Mapa dos Restaurantes
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Explore restaurantes em um mapa interativo real
          </p>
        </div>
      </div>

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
            </div>

            {selectedPlace.description && (
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                {selectedPlace.description}
              </p>
            )}

            <div className="flex gap-2">
              <FavoriteButton placeId={selectedPlace.id} size="sm" />
              <VisitedButton placeId={selectedPlace.id} size="sm" />
            </div>
          </div>
        )}
      </div>

      {/* Places List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Lugares no Mapa ({filteredPlaces.length})
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPlaces.map((place) => (
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
