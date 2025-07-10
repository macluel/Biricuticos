import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import { appConfig, categories, places } from "@/data/config";
import { usePlaceStats } from "@/contexts/PlaceStatsContext";
import { FavoriteButton } from "@/components/FavoriteButton";
import { VisitedButton } from "@/components/VisitedButton";

// Featured places from config
const featuredPlaces = places.slice(0, 3); // Show first 3 places

// Sample data - in a real app this would come from an API
const originalFeaturedPlaces = [
  {
    id: 1,
    name: "Oro",
    location: "Leblon, Rio de Janeiro",
    type: "Fine Dining",
    rating: 4.9,
    reviews: 1247,
    image:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop",
    description:
      "Restaurante premiado com estrela Michelin, oferecendo alta gastronomia brasileira.",
  },
  {
    id: 2,
    name: "Pizzaria Guanabara",
    location: "Copacabana, Rio de Janeiro",
    type: "Pizzaria",
    rating: 4.6,
    reviews: 2341,
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop",
    description:
      "Pizza tradicional carioca desde 1969, famosa pela massa fininha e ingredientes frescos.",
  },
  {
    id: 3,
    name: "Confeitaria Colombo",
    location: "Centro, Rio de Janeiro",
    type: "Confeitaria",
    rating: 4.7,
    reviews: 3156,
    image:
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop",
    description:
      "Confeitaria histórica de 1894, famosa pelos doces tradicionais e arquitetura belle époque.",
  },
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const { stats } = usePlaceStats();
  const navigate = useNavigate();

  // Calculate dynamic category counts from actual places
  const dynamicCategories = useMemo(() => {
    return categories.map((category) => {
      const count = places.filter((place) => {
        // Check if place type matches category name (with some flexibility)
        const placeType = place.type.toLowerCase();
        const categoryName = category.name.toLowerCase();

        // Direct match or partial match
        return (
          placeType === categoryName ||
          placeType.includes(categoryName) ||
          categoryName.includes(placeType)
        );
      }).length;

      return {
        ...category,
        count,
      };
    });
  }, []);

  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to catalog with search query
      navigate(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative px-8 py-16 lg:px-12 lg:py-24">
          <div className="max-w-4xl">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Nossa Aventura
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
                Gastronômica
              </span>
            </h1>
            <p className="text-xl lg:text-2xl text-primary-100 mb-8 max-w-2xl">
              De jantares românticos a brunches de fim de semana, esta é nossa
              coleção pessoal de lugares incríveis que queremos conhecer juntos.
              ❤️
            </p>

            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Buscar restaurantes, cafeterias ou culinárias..."
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
                  Explorar Restaurantes
                  <ExternalLink className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="flex flex-wrap gap-8 text-primary-100">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                <span className="text-lg">
                  {stats.totalPlaces} Na Nossa Lista
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                <span className="text-lg">
                  {stats.triedTogether} Provamos Juntos
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                <span className="text-lg">
                  {stats.wantToTry} Prontos pro date
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Categories */}
      <section>
        <div className="flex items-center gap-3 mb-8">
          <TrendingUp className="h-6 w-6 text-primary-600" />
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Categorias
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {trendingCategories.map((category) => (
            <Link
              key={category.name}
              to={`/catalog?category=${category.name.toLowerCase().replace(" ", "-")}`}
              className="group p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-primary-300 hover:shadow-lg transition-all duration-200"
            >
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-200">
                {category.icon}
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                {category.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {category.count} locais
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Places */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Lugares em Destaque
          </h2>
          <Button variant="outline" asChild>
            <Link to="/catalog">Ver Todos os Lugares</Link>
          </Button>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredPlaces.map((place) => (
            <div
              key={place.id}
              className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
            >
              <div className="relative overflow-hidden">
                <img
                  src={place.image}
                  alt={place.name}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4">
                  <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {place.rating}
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-primary-600 transition-colors">
                    {place.name}
                  </h3>
                  <FavoriteButton placeId={place.id} />
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-300">
                    {place.location}
                  </span>
                  <span className="px-2 py-1 bg-primary-100 dark:bg-primary-800 text-primary-700 dark:text-primary-100 text-xs font-medium rounded-full">
                    {place.type}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                  {place.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {place.reviews.toLocaleString()} avaliações
                  </span>
                  <VisitedButton placeId={place.id} size="sm" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
