import { useState } from "react";
import { MapPin, Star, Navigation } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { FavoriteButton } from "@/components/FavoriteButton";
import { VisitedButton } from "@/components/VisitedButton";
import { Button } from "@/components/ui/button";

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

interface FallbackMapProps {
  places: Place[];
  userLocation?: { lat: number; lng: number } | null;
  onPlaceSelect?: (place: Place) => void;
  onNavigate?: (place: Place) => void;
}

export function FallbackMap({
  places,
  userLocation,
  onPlaceSelect,
  onNavigate,
}: FallbackMapProps) {
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  const handlePlaceClick = (place: Place) => {
    setSelectedPlace(place);
    onPlaceSelect?.(place);
  };

  // Calculate distance for sorting if user location available
  const calculateDistance = (
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number,
  ): number => {
    const R = 6371;
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

  const placesWithDistance = userLocation
    ? places
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
    : places;

  return (
    <div className="space-y-4">
      {/* Visual Map Representation */}
      <div className="relative h-[400px] bg-gradient-to-br from-blue-100 via-green-50 to-yellow-50 dark:from-gray-700 dark:via-gray-600 dark:to-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
        {/* Map Background Elements */}
        <div className="absolute inset-0">
          {/* Roads */}
          <div className="absolute top-0 left-1/4 w-1 h-full bg-gray-300/40 dark:bg-gray-500/40 transform rotate-12"></div>
          <div className="absolute top-1/4 left-0 w-full h-1 bg-gray-300/40 dark:bg-gray-500/40"></div>
          <div className="absolute top-3/4 left-0 w-full h-1 bg-gray-300/40 dark:bg-gray-500/40 transform -rotate-3"></div>
          <div className="absolute top-0 right-1/3 w-1 h-full bg-gray-300/40 dark:bg-gray-500/40 transform -rotate-6"></div>

          {/* Districts/areas */}
          <div className="absolute top-16 left-16 w-28 h-24 bg-green-200/20 dark:bg-green-600/15 rounded-lg border border-green-300/30 dark:border-green-500/20"></div>
          <div className="absolute bottom-20 right-16 w-32 h-20 bg-blue-200/20 dark:bg-blue-600/15 rounded-lg border border-blue-300/30 dark:border-blue-500/20"></div>
          <div className="absolute top-1/2 left-1/2 w-20 h-20 bg-yellow-200/20 dark:bg-yellow-600/15 rounded-lg border border-yellow-300/30 dark:border-yellow-500/20 transform -translate-x-1/2 -translate-y-1/2"></div>

          {/* Water feature (Guanabara Bay) */}
          <div className="absolute bottom-8 left-8 w-24 h-16 bg-blue-300/30 dark:bg-blue-600/25 rounded-full"></div>
        </div>

        {/* Map Header */}
        <div className="absolute top-4 left-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary-600" />
            <span className="font-medium text-gray-900 dark:text-gray-100">
              Rio de Janeiro (Mapa Visual)
            </span>
          </div>
        </div>

        {/* User Location Marker */}
        {userLocation && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
            <div className="w-6 h-6 bg-blue-500 border-3 border-white rounded-full shadow-lg animate-pulse"></div>
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-blue-600 dark:text-blue-400 font-medium whitespace-nowrap">
              Você está aqui
            </div>
          </div>
        )}

        {/* Place Markers */}
        {places.map((place, index) => {
          const positions = [
            { top: "25%", left: "20%" },
            { top: "40%", left: "60%" },
            { top: "65%", left: "30%" },
            { top: "30%", left: "75%" },
            { top: "70%", left: "65%" },
            { top: "50%", left: "45%" },
          ];
          const position = positions[index % positions.length];

          const distance = userLocation
            ? calculateDistance(
                userLocation.lat,
                userLocation.lng,
                place.lat,
                place.lng,
              )
            : null;
          const isNearby = distance && distance <= 5;

          return (
            <div
              key={place.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 group"
              style={{ top: position.top, left: position.left }}
              onClick={() => handlePlaceClick(place)}
            >
              <div className="relative">
                <div
                  className={`w-8 h-8 ${isNearby ? "bg-green-500" : "bg-red-500"} rounded-full border-2 border-white shadow-lg hover:scale-110 transition-transform duration-200 flex items-center justify-center`}
                >
                  <MapPin className="h-4 w-4 text-white fill-current" />
                </div>
                <div
                  className={`absolute -top-2 -right-2 w-5 h-5 bg-white rounded-full border-2 ${isNearby ? "border-green-500" : "border-red-500"} flex items-center justify-center shadow-sm`}
                >
                  <span
                    className={`text-xs font-bold ${isNearby ? "text-green-500" : "text-red-500"}`}
                  >
                    {place.rating}
                  </span>
                </div>

                {/* Hover tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-30">
                  {place.name}
                  {distance && (
                    <div className="text-green-300">
                      {distance.toFixed(1)}km de você
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Legend */}
        <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
          <div className="space-y-2 text-xs">
            {userLocation && (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-gray-700 dark:text-gray-300">
                  Sua Localização
                </span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-700 dark:text-gray-300">
                Próximo (≤5km)
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

        {/* Selected Place Info */}
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
              {userLocation && onNavigate && (
                <Button
                  size="sm"
                  onClick={() => onNavigate(selectedPlace)}
                  className="flex items-center gap-1"
                >
                  <Navigation className="h-3 w-3" />
                  Navegar
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Simplified Places List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Restaurantes {userLocation && "(Ordenados por Distância)"}
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {placesWithDistance.map((place: any) => (
            <div
              key={place.id}
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary-300 transition-colors cursor-pointer"
              onClick={() => handlePlaceClick(place)}
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-gray-900 dark:text-gray-100">
                  {place.name}
                </h4>
                <FavoriteButton placeId={place.id} size="sm" />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                {place.location}
                {place.distance && (
                  <span className="block text-green-600 dark:text-green-400 font-medium">
                    📍 {place.distance.toFixed(1)}km de você
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
