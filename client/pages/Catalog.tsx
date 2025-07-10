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
    name: "The French Laundry",
    location: "Yountville, CA",
    state: "California",
    type: "Fine Dining",
    rating: 4.9,
    reviews: 1847,
    price: "$$$",
    image:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop",
    description:
      "Michelin-starred restaurant offering exquisite French cuisine in Napa Valley.",
    tags: ["french", "fine-dining", "wine"],
  },
  {
    id: 2,
    name: "Joe's Pizza",
    location: "New York City, NY",
    state: "New York",
    type: "Pizza",
    rating: 4.6,
    reviews: 3421,
    price: "$",
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop",
    description:
      "Authentic NYC pizza slice that's been a local favorite since 1975.",
    tags: ["pizza", "casual", "classic"],
  },
  {
    id: 3,
    name: "Tartine Bakery",
    location: "San Francisco, CA",
    state: "California",
    type: "Bakery",
    rating: 4.7,
    reviews: 2156,
    price: "$$",
    image:
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop",
    description:
      "Artisanal bakery famous for fresh bread, pastries, and morning coffee.",
    tags: ["bakery", "coffee", "pastries"],
  },
  {
    id: 4,
    name: "Franklin Barbecue",
    location: "Austin, TX",
    state: "Texas",
    type: "BBQ",
    rating: 4.8,
    reviews: 5243,
    price: "$$",
    image:
      "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop",
    description:
      "World-renowned BBQ joint famous for their incredible brisket and long lines.",
    tags: ["bbq", "brisket", "texas"],
  },
  {
    id: 5,
    name: "The Spotted Pig",
    location: "New York City, NY",
    state: "New York",
    type: "Pub",
    rating: 4.5,
    reviews: 2847,
    price: "$$",
    image:
      "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop",
    description:
      "Cozy gastropub serving elevated comfort food and craft beers.",
    tags: ["pub", "gastropub", "comfort-food"],
  },
  {
    id: 6,
    name: "Katz's Delicatessen",
    location: "New York City, NY",
    state: "New York",
    type: "Deli",
    rating: 4.4,
    reviews: 8765,
    price: "$$",
    image:
      "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=400&h=300&fit=crop",
    description:
      "Historic deli famous for their pastrami sandwiches since 1888.",
    tags: ["deli", "pastrami", "historic"],
  },
];

const placeTypes = [
  "All",
  "Fine Dining",
  "Pizza",
  "Bakery",
  "BBQ",
  "Pub",
  "Deli",
  "Cafe",
];
const states = [
  "All",
  "California",
  "New York",
  "Texas",
  "Illinois",
  "Florida",
  "Washington",
];
const priceRanges = ["All", "$", "$$", "$$$", "$$$$"];

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
        matchesPrice = place.price === selectedPrice;
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
