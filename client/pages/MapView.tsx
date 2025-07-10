import { useState } from "react";
import {
  Map,
  MapPin,
  Search,
  Filter,
  Navigation,
  Layers,
  ZoomIn,
  ZoomOut,
  RotateCcw,
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

// Sample places for map markers
const mapPlaces = [
  {
    id: 1,
    name: "Joe's Pizza",
    type: "Pizza",
    rating: 4.6,
    lat: 40.7589,
    lng: -73.9851,
  },
  {
    id: 2,
    name: "Tartine Bakery",
    type: "Bakery",
    rating: 4.7,
    lat: 37.7749,
    lng: -122.4194,
  },
  {
    id: 3,
    name: "Franklin Barbecue",
    type: "BBQ",
    rating: 4.8,
    lat: 30.2672,
    lng: -97.7431,
  },
];

export default function MapView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedPlace, setSelectedPlace] = useState<
    (typeof mapPlaces)[0] | null
  >(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Food Map
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Explore food places on an interactive map
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="grid lg:grid-cols-4 gap-4">
        <div className="lg:col-span-2">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search food places on map..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12"
            />
          </div>
        </div>

        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger>
            <SelectValue placeholder="Food Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Types</SelectItem>
            <SelectItem value="Pizza">Pizza</SelectItem>
            <SelectItem value="Bakery">Bakery</SelectItem>
            <SelectItem value="BBQ">BBQ</SelectItem>
            <SelectItem value="Fine Dining">Fine Dining</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          More Filters
        </Button>
      </div>

      {/* Map Container */}
      <div className="relative h-[600px] bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
        {/* Map Placeholder */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
          <div className="text-center">
            <Map className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Interactive Food Map
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md">
              This is where an interactive map would be displayed showing all
              our food places with markers. In a real application, this would
              integrate with mapping services like Google Maps, Mapbox, or
              OpenStreetMap.
            </p>
          </div>
        </div>

        {/* Map Controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <Button size="sm" variant="secondary" className="w-10 h-10 p-0">
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="secondary" className="w-10 h-10 p-0">
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="secondary" className="w-10 h-10 p-0">
            <Navigation className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="secondary" className="w-10 h-10 p-0">
            <Layers className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="secondary" className="w-10 h-10 p-0">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>

        {/* Sample Markers Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          {mapPlaces.map((place, index) => (
            <div
              key={place.id}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer ${
                index === 0
                  ? "top-1/3 left-1/4"
                  : index === 1
                    ? "top-2/3 right-1/3"
                    : "top-1/2 left-1/2"
              }`}
              onClick={() => setSelectedPlace(place)}
            >
              <div className="relative">
                <MapPin className="h-8 w-8 text-primary-600 fill-current drop-shadow-lg hover:scale-110 transition-transform" />
                <div className="absolute -top-2 -right-2 w-5 h-5 bg-white rounded-full border-2 border-primary-600 flex items-center justify-center">
                  <span className="text-xs font-bold text-primary-600">
                    {place.rating}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Place Info Popup */}
        {selectedPlace && (
          <div className="absolute bottom-4 left-4 right-4 lg:left-4 lg:right-auto lg:w-80 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                {selectedPlace.name}
              </h3>
              <button
                onClick={() => setSelectedPlace(null)}
                className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
              >
                ×
              </button>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="secondary">{selectedPlace.type}</Badge>
              <div className="flex items-center gap-1">
                <span className="text-sm font-medium">
                  ★ {selectedPlace.rating}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" className="flex-1">
                View Details
              </Button>
              <Button size="sm" variant="outline">
                Directions
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Map Legend */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Map Legend
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-primary-600 rounded-full"></div>
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Featured Food Places
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-600 rounded-full"></div>
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Cafes & Coffee
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Fine Dining
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-600 rounded-full"></div>
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Casual Dining
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
