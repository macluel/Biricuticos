import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Star,
  MapPin,
  Search,
  TrendingUp,
  Heart,
  ExternalLink,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { appConfig, categories } from "@/data/config";
import { usePlaces } from "@/contexts/PlacesContext";
import { usePlaceStats } from "@/contexts/PlaceStatsContext";
import { FavoriteButton } from "@/components/FavoriteButton";
import { VisitedButton } from "@/components/VisitedButton";
import { PlaceDetailsModal } from "@/components/PlaceDetailsModal";
import { UserRatingDisplay } from "@/components/UserRating";

// This will be replaced with dynamic places from context

// Places now come from the context, no need for sample data

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlace, setSelectedPlace] = useState<(typeof places)[0] | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { stats, getUserRating } = usePlaceStats();
  const { places } = usePlaces();
  const navigate = useNavigate();

  // Featured places - show first 3 places
  const featuredPlaces = [...places]
    .sort((a, b) => {
      // Get user ratings, default to 0 if not rated
      const ratingA = getUserRating(a.id) || 0;
      const ratingB = getUserRating(b.id) || 0;
      // Sort descending (highest first)
      return ratingB - ratingA;
    })
    .slice(0, 6); // Show top 3, change to 6 if you want more

  // Calculate dynamic category counts from actual places
  const dynamicCategories = useMemo(() => {
    return categories.map((category) => {
      const count = places.filter((place) => {
        // Check if place type matches category name (with some flexibility)
        const placeType = place.type.toLowerCase();
        const categoryName = category.name.toLowerCase();

        // Create more intelligent matching rules
        const matchingRules = {
          "fine dining": ["fine dining", "fine", "dining"],
          pizzaria: ["pizzaria", "pizza"],
          confeitaria: ["confeitaria", "confeitarias", "doces", "patisserie"],
          churrascaria: ["churrascaria", "churrasco"],
          cafeterias: ["cafeteria", "cafe", "café", "coffee"],
          padarias: ["padaria", "bakery"],
          botecos: ["boteco", "bar", "pub"],
          açaí: ["açaí", "acai"],
        };

        // Check direct match first
        if (placeType === categoryName) return true;

        // Check specific rules
        const rules = matchingRules[categoryName] || [categoryName];
        return rules.some(
          (rule) => placeType.includes(rule) || rule.includes(placeType),
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
    } else {
      // If no search query, just go to catalog
      navigate("/catalog");
    }
  };

  // Handle place click
  const handlePlaceClick = (place: (typeof places)[0]) => {
    setSelectedPlace(place);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPlace(null);
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
            <p className="text-xl lg:text-2xl text-white mb-8 max-w-2xl">
              De jantares românticos a brunches de fim de semana, esta é nossa
              coleção pessoal de lugares incríveis que queremos conhecer juntos.
              ❤️
            </p>

            {/* Search Bar */}
            <form
              onSubmit={handleSearch}
              className="flex flex-col sm:flex-row gap-4 mb-8"
            >
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Buscar restaurantes, cafeterias ou culinárias..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 py-4 text-lg text-gray-900 placeholder:text-gray-500 bg-white/90 backdrop-blur-sm border-0 focus:bg-white"
                />
              </div>
              <Button
                type="submit"
                size="lg"
                variant="secondary"
                className="px-8 py-4 text-lg font-semibold"
              >
                {searchQuery.trim() ? (
                  <>
                    <Search className="mr-2 h-5 w-5" />
                    Buscar
                  </>
                ) : (
                  <>
                    <ExternalLink className="mr-2 h-5 w-5" />
                    Explorar Restaurantes
                  </>
                )}
              </Button>
            </form>

            {/* Quick Stats */}
            <div className="flex flex-wrap gap-8 text-white">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                <span className="text-lg">
                  {stats.totalPlaces} Na Nossa Lista
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl">✅</span>
                <span className="text-lg">
                  {stats.triedTogether} Provamos Juntos
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl">📌</span>
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
        {/* Horizontal scrollable container */}
        <div className="relative">
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800">
            {dynamicCategories.map((category) => (
              <Link
                key={category.name}
                to={`/catalog?category=${category.name.toLowerCase().replace(" ", "-")}`}
                className="group flex-shrink-0 w-36 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary-300 hover:shadow-lg transition-all duration-200 snap-start"
              >
                <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-200 text-center">
                  {category.icon}
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1 text-center text-sm">
                  {category.name}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  {category.count} locais
                </p>
              </Link>
            ))}
          </div>

          {/* Scroll indicator */}
          <div className="flex justify-center mt-2">
            <p className="text-xs text-gray-400 dark:text-gray-500">
              ← Deslize para ver mais categorias →
            </p>
          </div>
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
              className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 cursor-pointer"
              onClick={() => handlePlaceClick(place)}
            >
              <div className="relative overflow-hidden">
                <img
                  src={place.image}
                  alt={place.name}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4">
                  <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg px-3 py-2">
                    <UserRatingDisplay
                      userRating={getUserRating(place.id)}
                      size="sm"
                      showLabel
                    />
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
                  <span className="px-2 py-1 bg-primary-100 dark:bg-primary-800 text-primary-700 dark:text-gray-300 text-xs font-medium rounded-full">
                    {place.type}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    <VisitedButton placeId={place.id} size="sm" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Place Details Modal */}
      <PlaceDetailsModal
        place={selectedPlace}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}
