// Simple map view that works without external dependencies
export { default } from "./SimpleMapView";

// Use places from config for map markers
const mapPlaces = places.map((place) => ({
  id: place.id,
  name: place.name,
  location: place.location,
  type: place.type,
  rating: place.rating,
  lat: place.lat || -22.9068, // Default to Rio if no coordinates
  lng: place.lng || -43.1729,
  price: place.price,
  description: place.description,
}));

// Sample places for map markers
const originalMapPlaces = [
  {
    id: 1,
    name: "Pizzaria Guanabara",
    type: "Pizzaria",
    rating: 4.6,
    lat: -22.9068,
    lng: -43.1729,
  },
  {
    id: 2,
    name: "Confeitaria Colombo",
    type: "Confeitaria",
    rating: 4.7,
    lat: -22.9035,
    lng: -43.176,
  },
  {
    id: 3,
    name: "Bar Urca",
    type: "Boteco",
    rating: 4.8,
    lat: -22.9533,
    lng: -43.1651,
  },
];

export default function MapView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All");

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

      {/* Interactive Map */}
      <div className="h-[600px]">
        <InteractiveMap
          places={mapPlaces}
          center={[-22.9068, -43.1729]}
          zoom={12}
          className="h-full w-full"
        />
      </div>

      {/* Backup Map Container (remove this if map works) */}
      <div className="relative h-[600px] bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 hidden">
        {/* Old map placeholder - can be removed if real map works */}
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
