import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Star,
  MapPin,
  Search,
  TrendingUp,
  Heart,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Sample data - in a real app this would come from an API
const featuredPlaces = [
  {
    id: 1,
    name: "Blue Ridge Parkway",
    location: "Virginia & North Carolina",
    type: "Scenic Drive",
    rating: 4.8,
    reviews: 2847,
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
    description:
      "A breathtaking 469-mile scenic highway through the Appalachian Mountains.",
  },
  {
    id: 2,
    name: "Central Park",
    location: "New York City, NY",
    type: "Park",
    rating: 4.7,
    reviews: 5632,
    image:
      "https://images.unsplash.com/photo-1511593358241-7eea1f3c84e5?w=400&h=300&fit=crop",
    description:
      "An iconic urban oasis in the heart of Manhattan with endless activities.",
  },
  {
    id: 3,
    name: "Golden Gate Bridge",
    location: "San Francisco, CA",
    type: "Landmark",
    rating: 4.9,
    reviews: 8294,
    image:
      "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=300&fit=crop",
    description:
      "World-famous suspension bridge with stunning views of San Francisco Bay.",
  },
];

const trendingCategories = [
  { name: "National Parks", count: 127, icon: "🏔️" },
  { name: "Museums", count: 89, icon: "🏛️" },
  { name: "Beaches", count: 156, icon: "🏖️" },
  { name: "Historic Sites", count: 73, icon: "🏰" },
  { name: "Gardens", count: 45, icon: "🌸" },
  { name: "Adventure", count: 92, icon: "🧗" },
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative px-8 py-16 lg:px-12 lg:py-24">
          <div className="max-w-4xl">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Discover Amazing
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
                Places to Explore
              </span>
            </h1>
            <p className="text-xl lg:text-2xl text-primary-100 mb-8 max-w-2xl">
              From hidden gems to world-famous landmarks, find your next
              adventure with our curated collection of extraordinary places.
            </p>

            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search places, cities, or experiences..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 py-4 text-lg bg-white/90 backdrop-blur-sm border-0 focus:bg-white"
                />
              </div>
              <Button
                size="lg"
                variant="secondary"
                className="px-8 py-4 text-lg font-semibold"
                asChild
              >
                <Link to="/catalog">
                  Explore All Places
                  <ExternalLink className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="flex flex-wrap gap-8 text-primary-100">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                <span className="text-lg">1,200+ Places</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                <span className="text-lg">50,000+ Reviews</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                <span className="text-lg">Community Curated</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Categories */}
      <section>
        <div className="flex items-center gap-3 mb-8">
          <TrendingUp className="h-6 w-6 text-primary-600" />
          <h2 className="text-3xl font-bold text-gray-900">
            Trending Categories
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {trendingCategories.map((category) => (
            <Link
              key={category.name}
              to={`/catalog?category=${category.name.toLowerCase().replace(" ", "-")}`}
              className="group p-6 bg-white rounded-2xl border border-gray-200 hover:border-primary-300 hover:shadow-lg transition-all duration-200"
            >
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-200">
                {category.icon}
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">
                {category.name}
              </h3>
              <p className="text-sm text-gray-500">{category.count} places</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Places */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Featured Places</h2>
          <Button variant="outline" asChild>
            <Link to="/catalog">View All Places</Link>
          </Button>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredPlaces.map((place) => (
            <div
              key={place.id}
              className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              <div className="relative overflow-hidden">
                <img
                  src={place.image}
                  alt={place.name}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4">
                  <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-semibold">
                      {place.rating}
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-6">
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
                  <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded-full">
                    {place.type}
                  </span>
                </div>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {place.description}
                </p>
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
          ))}
        </div>
      </section>
    </div>
  );
}
