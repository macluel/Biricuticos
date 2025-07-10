import { useState } from "react";
import {
  Map,
  MapPin,
  Search,
  Filter,
  Navigation,
  Star,
  Heart,
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Mapa dos Restaurantes
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Explore restaurantes em um mapa interativo
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
      <div className="relative h-[600px] bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
        {/* Map Background with Rio de Janeiro styling */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-green-50 to-yellow-50 dark:from-gray-700 dark:via-gray-600 dark:to-gray-800">
          {/* Decorative map elements */}
          <div className="absolute top-20 left-20 w-32 h-20 bg-blue-200/30 dark:bg-blue-600/20 rounded-full blur-xl"></div>
          <div className="absolute bottom-32 right-24 w-40 h-24 bg-green-200/30 dark:bg-green-600/20 rounded-full blur-xl"></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-yellow-200/30 dark:bg-yellow-600/20 rounded-full blur-xl"></div>
        </div>

        {/* Map Header */}
        <div className="absolute top-4 left-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg">
          <div className="flex items-center gap-2">
            <Map className="h-5 w-5 text-primary-600" />
            <span className="font-medium text-gray-900 dark:text-gray-100">
              Rio de Janeiro
            </span>
          </div>
        </div>

        {/* Place Markers */}
        {filteredPlaces.map((place, index) => {
          // Distribute places across the map area
          const positions = [
            { top: "25%", left: "20%" },
            { top: "40%", left: "60%" },
            { top: "65%", left: "30%" },
            { top: "30%", left: "75%" },
            { top: "70%", left: "65%" },
            { top: "50%", left: "45%" },
          ];
          const position = positions[index % positions.length];

          return (
            <div
              key={place.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
              style={{ top: position.top, left: position.left }}
              onClick={() => setSelectedPlace(place)}
            >
              <div className="relative group">
                <div className="w-8 h-8 bg-red-500 rounded-full border-2 border-white shadow-lg hover:scale-110 transition-transform duration-200 flex items-center justify-center">
                  <MapPin className="h-4 w-4 text-white fill-current" />
                </div>
                <div className="absolute -top-2 -right-2 w-5 h-5 bg-white rounded-full border-2 border-red-500 flex items-center justify-center shadow-sm">
                  <span className="text-xs font-bold text-red-500">
                    {place.rating}
                  </span>
                </div>

                {/* Hover tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  {place.name}
                </div>
              </div>
            </div>
          );
        })}

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
              <Badge variant="secondary">{selectedPlace.type}</Badge>
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

        {/* Map Controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
          <Button
            size="sm"
            variant="secondary"
            className="w-10 h-10 p-0"
            disabled
          >
            <Navigation className="h-4 w-4" />
          </Button>
        </div>
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
              onClick={() => setSelectedPlace(place)}
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
                <Badge variant="secondary" className="text-xs">
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
