import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import { Star, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FavoriteButton } from "./FavoriteButton";
import { VisitedButton } from "./VisitedButton";

// Fix for default markers in React-Leaflet
delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

interface Place {
  id: number;
  name: string;
  location: string;
  type: string;
  rating: number;
  lat: number;
  lng: number;
  price?: string;
  description?: string;
}

interface InteractiveMapProps {
  places: Place[];
  center: [number, number];
  zoom?: number;
  className?: string;
}

export function InteractiveMap({
  places,
  center,
  zoom = 12,
  className = "",
}: InteractiveMapProps) {
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  // Custom marker icon for restaurants
  const restaurantIcon = new Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  return (
    <div className={`relative ${className}`}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: "100%", width: "100%" }}
        className="rounded-2xl overflow-hidden z-10"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {places.map((place) => (
          <Marker
            key={place.id}
            position={[place.lat, place.lng]}
            icon={restaurantIcon}
            eventHandlers={{
              click: () => setSelectedPlace(place),
            }}
          >
            <Popup>
              <div className="min-w-[200px] p-2">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 text-sm">
                    {place.name}
                  </h3>
                  <FavoriteButton placeId={place.id} size="sm" />
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="text-xs">
                    {place.type}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 text-yellow-400 fill-current" />
                    <span className="text-xs font-medium">{place.rating}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 mb-3">
                  <MapPin className="h-3 w-3 text-gray-400" />
                  <span className="text-xs text-gray-600">
                    {place.location}
                  </span>
                </div>

                {place.description && (
                  <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                    {place.description}
                  </p>
                )}

                <div className="flex gap-2">
                  <VisitedButton placeId={place.id} size="sm" />
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 z-20">
        <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100 mb-2">
          Legenda
        </h4>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <span className="text-xs text-gray-600 dark:text-gray-300">
            Restaurantes
          </span>
        </div>
      </div>
    </div>
  );
}

export default InteractiveMap;
