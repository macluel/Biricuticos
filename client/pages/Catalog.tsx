import { useState, useMemo } from "react";
import {
  Search,
  Filter,
  MapPin,
  Star,
  Heart,
  Grid,
  List,
  SlidersHorizontal,
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
import { Checkbox } from "@/components/ui/checkbox";

// Sample data - in a real app this would come from an API
const allPlaces = [
  {
    id: 1,
    name: "Blue Ridge Parkway",
    location: "Virginia & North Carolina",
    state: "Virginia",
    type: "Scenic Drive",
    rating: 4.8,
    reviews: 2847,
    price: "Free",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
    description:
      "A breathtaking 469-mile scenic highway through the Appalachian Mountains.",
    tags: ["nature", "scenic", "driving"],
  },
  {
    id: 2,
    name: "Central Park",
    location: "New York City, NY",
    state: "New York",
    type: "Park",
    rating: 4.7,
    reviews: 5632,
    price: "Free",
    image:
      "https://images.unsplash.com/photo-1511593358241-7eea1f3c84e5?w=400&h=300&fit=crop",
    description:
      "An iconic urban oasis in the heart of Manhattan with endless activities.",
    tags: ["urban", "park", "family"],
  },
  {
    id: 3,
    name: "Golden Gate Bridge",
    location: "San Francisco, CA",
    state: "California",
    type: "Landmark",
    rating: 4.9,
    reviews: 8294,
    price: "Free",
    image:
      "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=300&fit=crop",
    description:
      "World-famous suspension bridge with stunning views of San Francisco Bay.",
    tags: ["landmark", "scenic", "photography"],
  },
  {
    id: 4,
    name: "Yellowstone National Park",
    location: "Wyoming, Montana, Idaho",
    state: "Wyoming",
    type: "National Park",
    rating: 4.8,
    reviews: 12567,
    price: "$35",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
    description:
      "America's first national park, featuring geothermal wonders and wildlife.",
    tags: ["nature", "wildlife", "geothermal"],
  },
  {
    id: 5,
    name: "Metropolitan Museum",
    location: "New York City, NY",
    state: "New York",
    type: "Museum",
    rating: 4.6,
    reviews: 9847,
    price: "$30",
    image:
      "https://images.unsplash.com/photo-1511593358241-7eea1f3c84e5?w=400&h=300&fit=crop",
    description: "One of the world's largest and most prestigious art museums.",
    tags: ["art", "culture", "indoor"],
  },
  {
    id: 6,
    name: "Miami Beach",
    location: "Miami, FL",
    state: "Florida",
    type: "Beach",
    rating: 4.5,
    reviews: 6543,
    price: "Free",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
    description:
      "Famous beach destination with white sand and vibrant nightlife.",
    tags: ["beach", "nightlife", "water"],
  },
];

const placeTypes = [
  "All",
  "Park",
  "Museum",
  "Beach",
  "Landmark",
  "National Park",
  "Scenic Drive",
];
const states = [
  "All",
  "California",
  "Florida",
  "New York",
  "Virginia",
  "Wyoming",
  "Montana",
  "Idaho",
];
const priceRanges = ["All", "Free", "$1-25", "$26-50", "$50+"];

export default function Catalog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedState, setSelectedState] = useState("All");
  const [selectedPrice, setSelectedPrice] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("rating");
  const [showFilters, setShowFilters] = useState(false);

  const filteredPlaces = useMemo(() => {
    let filtered = allPlaces.filter((place) => {
      const matchesSearch =
        place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType = selectedType === "All" || place.type === selectedType;
      const matchesState =
        selectedState === "All" || place.state === selectedState;

      let matchesPrice = true;
      if (selectedPrice !== "All") {
        if (selectedPrice === "Free") {
          matchesPrice = place.price === "Free";
        } else if (selectedPrice === "$1-25") {
          const price = place.price.replace("$", "");
          matchesPrice = price !== "Free" && parseInt(price) <= 25;
        } else if (selectedPrice === "$26-50") {
          const price = place.price.replace("$", "");
          matchesPrice =
            price !== "Free" && parseInt(price) >= 26 && parseInt(price) <= 50;
        } else if (selectedPrice === "$50+") {
          const price = place.price.replace("$", "");
          matchesPrice = price !== "Free" && parseInt(price) > 50;
        }
      }

      return matchesSearch && matchesType && matchesState && matchesPrice;
    });

    // Sort results
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating;
        case "reviews":
          return b.reviews - a.reviews;
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchQuery, selectedType, selectedState, selectedPrice, sortBy]);

  const PlaceCard = ({ place }: { place: (typeof allPlaces)[0] }) => (
    <div
      className={`group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 ${viewMode === "list" ? "flex" : ""}`}
    >
      <div
        className={`relative overflow-hidden ${viewMode === "list" ? "w-48 flex-shrink-0" : ""}`}
      >
        <img
          src={place.image}
          alt={place.name}
          className={`object-cover group-hover:scale-105 transition-transform duration-300 ${viewMode === "list" ? "w-full h-full" : "w-full h-64"}`}
        />
        <div className="absolute top-4 right-4">
          <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-sm font-semibold">{place.rating}</span>
          </div>
        </div>
      </div>
      <div className="p-6 flex-1">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
            {place.name}
          </h3>
          <button className="p-1 hover:text-red-500 transition-colors">
            <Heart className="h-5 w-5" />
          </button>
        </div>
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="h-4 w-4 text-gray-400" />
          <span className="text-gray-600">{place.location}</span>
        </div>
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="secondary">{place.type}</Badge>
          <Badge variant="outline">{place.price}</Badge>
        </div>
        <p className="text-gray-600 mb-4 line-clamp-2">{place.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">
            {place.reviews.toLocaleString()} reviews
          </span>
          <Button size="sm" variant="outline">
            Learn More
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Place Catalog</h1>
          <p className="text-gray-600">
            Discover {allPlaces.length} amazing places to visit
          </p>
        </div>

        {/* View controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center border border-gray-200 rounded-lg">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="rounded-r-none"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>

          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden"
          >
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div
        className={`grid lg:grid-cols-4 gap-4 ${showFilters || window.innerWidth >= 1024 ? "block" : "hidden lg:grid"}`}
      >
        <div className="lg:col-span-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search places..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12"
            />
          </div>
        </div>

        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger>
            <SelectValue placeholder="Place Type" />
          </SelectTrigger>
          <SelectContent>
            {placeTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedState} onValueChange={setSelectedState}>
          <SelectTrigger>
            <SelectValue placeholder="State" />
          </SelectTrigger>
          <SelectContent>
            {states.map((state) => (
              <SelectItem key={state} value={state}>
                {state}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedPrice} onValueChange={setSelectedPrice}>
          <SelectTrigger>
            <SelectValue placeholder="Price Range" />
          </SelectTrigger>
          <SelectContent>
            {priceRanges.map((price) => (
              <SelectItem key={price} value={price}>
                {price}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger>
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rating">Rating</SelectItem>
            <SelectItem value="reviews">Most Reviews</SelectItem>
            <SelectItem value="name">Name A-Z</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600">
          Showing {filteredPlaces.length} of {allPlaces.length} places
        </p>
      </div>

      {/* Places Grid/List */}
      <div
        className={
          viewMode === "grid"
            ? "grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            : "space-y-6"
        }
      >
        {filteredPlaces.map((place) => (
          <PlaceCard key={place.id} place={place} />
        ))}
      </div>

      {filteredPlaces.length === 0 && (
        <div className="text-center py-12">
          <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No places found
          </h3>
          <p className="text-gray-600">
            Try adjusting your search criteria or filters
          </p>
        </div>
      )}
    </div>
  );
}
