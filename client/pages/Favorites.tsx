import { useState, useMemo } from "react";
import {
  Search,
  Heart,
  MapPin,
  Star,
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
import { filterOptions } from "@/data/config";
import { FavoriteButton } from "@/components/FavoriteButton";
import { VisitedButton } from "@/components/VisitedButton";
import { PlaceDetailsModal } from "@/components/PlaceDetailsModal";
import { UserRatingDisplay } from "@/components/UserRating";

import { usePlaceStats } from "@/contexts/PlaceStatsContext";
import { usePlaces } from "@/contexts/PlacesContext";

export default function Favorites() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("Todos");
  const [selectedState, setSelectedState] = useState("Todos");
  const [selectedPrice, setSelectedPrice] = useState("Todos");
  const [selectedStarRating, setSelectedStarRating] = useState("Todos");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("name-asc");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<
    (typeof allPlaces)[0] | null
  >(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { places } = usePlaces();
  const { getPlaceInteraction, getUserRating } = usePlaceStats();

  // Only show favorited places
  const allPlaces = places.filter((place) => {
    const interaction = getPlaceInteraction(place.id);
    return interaction.isFavorited;
  });

  // Helper function to convert price to numeric order
  const getPriceOrder = (price: string): number => {
    switch (price) {
      case "$":
        return 1;
      case "$$":
        return 2;
      case "$$$":
        return 3;
      case "$$$$":
        return 4;
      default:
        return 0;
    }
  };

  // Filter options
  const placeTypes = filterOptions.placeTypes;
  const states = filterOptions.states;
  const priceRanges = filterOptions.priceRanges;

  const filteredPlaces = useMemo(() => {
    let filtered = allPlaces.filter((place) => {
      const matchesSearch =
        place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (place.description &&
          place.description.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesType =
        selectedType === "Todos" || place.type === selectedType;
      const matchesState =
        selectedState === "Todos" || place.state === selectedState;

      let matchesPrice = true;
      if (selectedPrice !== "Todos") {
        matchesPrice = place.price === selectedPrice;
      }

      // Filter by star rating
      let matchesStarRating = true;
      if (selectedStarRating !== "Todos") {
        const userRating = getUserRating(place.id);
        switch (selectedStarRating) {
          case "5-stars":
            matchesStarRating = userRating === 5;
            break;
          case "4-stars":
            matchesStarRating = userRating === 4;
            break;
          case "3-stars":
            matchesStarRating = userRating === 3;
            break;
          case "2-stars":
            matchesStarRating = userRating === 2;
            break;
          case "1-star":
            matchesStarRating = userRating === 1;
            break;
          case "rated":
            matchesStarRating = userRating !== null;
            break;
          case "unrated":
            matchesStarRating = userRating === null;
            break;
        }
      }

      return (
        matchesSearch &&
        matchesType &&
        matchesState &&
        matchesPrice &&
        matchesStarRating
      );
    });

    // Sort results
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "stars-asc":
          const ratingA = getUserRating(a.id) || 0;
          const ratingB = getUserRating(b.id) || 0;
          return ratingA - ratingB;
        case "stars-desc":
          const ratingDescA = getUserRating(a.id) || 0;
          const ratingDescB = getUserRating(b.id) || 0;
          return ratingDescB - ratingDescA;
        case "price-asc":
          const priceOrderA = getPriceOrder(a.price);
          const priceOrderB = getPriceOrder(b.price);
          return priceOrderA - priceOrderB;
        case "price-desc":
          const priceOrderDescA = getPriceOrder(a.price);
          const priceOrderDescB = getPriceOrder(b.price);
          return priceOrderDescB - priceOrderDescA;
        default:
          return 0;
      }
    });

    return filtered;
  }, [
    allPlaces,
    searchQuery,
    selectedType,
    selectedState,
    selectedPrice,
    selectedStarRating,
    sortBy,
    getUserRating,
  ]);

  // Handle place click
  const handlePlaceClick = (place: (typeof allPlaces)[0]) => {
    setSelectedPlace(place);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPlace(null);
  };

  const PlaceCard = ({ place }: { place: (typeof allPlaces)[0] }) => (
    <div
      className={`group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 cursor-pointer ${
        viewMode === "list" ? "flex" : ""
      }`}
      onClick={() => handlePlaceClick(place)}
    >
      <div
        className={`relative overflow-hidden ${
          viewMode === "list" ? "w-48 flex-shrink-0" : ""
        }`}
      >
        <img
          src={place.image}
          alt={place.name}
          className={`object-cover group-hover:scale-105 transition-transform duration-300 ${
            viewMode === "list" ? "w-full h-full" : "w-full h-64"
          }`}
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
        <div className="absolute top-4 left-4">
          <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
            <Heart className="h-3 w-3 fill-current" />
            Favorito
          </div>
        </div>
      </div>
      <div className="p-6 flex-1">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-primary-600 transition-colors">
            {place.name}
          </h3>
          <div className="flex items-center gap-2">
            <FavoriteButton placeId={place.id} />
          </div>
        </div>
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="h-4 w-4 text-gray-400" />
          <span className="text-gray-600 dark:text-gray-300">
            {place.location}
          </span>
        </div>
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="secondary">{place.type}</Badge>
          <Badge variant="outline">{place.price}</Badge>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            <VisitedButton placeId={place.id} size="sm" />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Meus Favoritos
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {allPlaces.length > 0
              ? `Seus ${allPlaces.length} lugares favoritos que você amou`
              : "Ainda não há lugares favoritos"}
          </p>
        </div>

        {/* View controls */}
        {allPlaces.length > 0 && (
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
              Filtros
            </Button>
          </div>
        )}
      </div>

      {allPlaces.length === 0 ? (
        /* Empty State */
        <div className="text-center py-16">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
              <Heart className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Nenhum favorito ainda
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Marque os lugares que você amou como favoritos usando o botão ❤️
              nas páginas de restaurantes.
            </p>
            <Button asChild>
              <a href="/catalog">Explorar Restaurantes</a>
            </Button>
          </div>
        </div>
      ) : (
        <>
          {/* Search and Filters */}
          <div
            className={`grid lg:grid-cols-4 xl:grid-cols-6 gap-4 ${
              showFilters || window.innerWidth >= 1024
                ? "block"
                : "hidden lg:grid"
            }`}
          >
            <div className="lg:col-span-4 xl:col-span-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Buscar nos seus favoritos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12"
                />
              </div>
            </div>

            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo" />
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
                <SelectValue placeholder="Estado" />
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
                <SelectValue placeholder="Preço" />
              </SelectTrigger>
              <SelectContent>
                {priceRanges.map((price) => (
                  <SelectItem key={price} value={price}>
                    {price}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={selectedStarRating}
              onValueChange={setSelectedStarRating}
            >
              <SelectTrigger>
                <SelectValue placeholder="⭐ Estrelas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Todos">Todas Estrelas</SelectItem>
                <SelectItem value="5-stars">⭐⭐⭐⭐⭐ 5 Estrelas</SelectItem>
                <SelectItem value="4-stars">⭐⭐⭐⭐⭐ 4 Estrelas</SelectItem>
                <SelectItem value="3-stars">⭐⭐⭐⭐⭐ 3 Estrelas</SelectItem>
                <SelectItem value="2-stars">⭐⭐⭐⭐⭐ 2 Estrelas</SelectItem>
                <SelectItem value="1-star">⭐⭐⭐⭐⭐ 1 Estrela</SelectItem>
                <SelectItem value="rated">Avaliados</SelectItem>
                <SelectItem value="unrated">Não Avaliados</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Ordenar Por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name-asc">Nome A-Z</SelectItem>
                <SelectItem value="name-desc">Nome Z-A</SelectItem>
                <SelectItem value="stars-desc">Estrelas (Maior)</SelectItem>
                <SelectItem value="stars-asc">Estrelas (Menor)</SelectItem>
                <SelectItem value="price-asc">Preço (Menor)</SelectItem>
                <SelectItem value="price-desc">Preço (Maior)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Results */}
          <div className="flex items-center justify-between">
            <p className="text-gray-600 dark:text-gray-300">
              Mostrando {filteredPlaces.length} de {allPlaces.length} favoritos
            </p>
          </div>

          {/* Places Grid */}
          {filteredPlaces.length === 0 ? (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Nenhum favorito encontrado
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Tente ajustar seus critérios de busca ou filtros
              </p>
            </div>
          ) : (
            <div
              className={`grid gap-6 ${
                viewMode === "grid"
                  ? "md:grid-cols-2 lg:grid-cols-3"
                  : "grid-cols-1"
              }`}
            >
              {filteredPlaces.map((place) => (
                <PlaceCard key={place.id} place={place} />
              ))}
            </div>
          )}
        </>
      )}

      {/* Place Details Modal */}
      <PlaceDetailsModal
        place={selectedPlace}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}
