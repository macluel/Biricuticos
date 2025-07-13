import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
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
import { filterOptions } from "@/data/config";
import { FavoriteButton } from "@/components/FavoriteButton";
import { VisitedButton } from "@/components/VisitedButton";
import { PlaceDetailsModal } from "@/components/PlaceDetailsModal";
import { UserRatingDisplay } from "@/components/UserRating";

import { usePlaceStats } from "@/contexts/PlaceStatsContext";
import { usePlaces } from "@/contexts/PlacesContext";

// This will be replaced with dynamic places from context

// Sample data - in a real app this would come from an API
const originalAllPlaces = [
  {
    id: 1,
    name: "Oro",
    location: "Leblon, Rio de Janeiro",
    state: "Rio de Janeiro",
    type: "Fine Dining",
    rating: 4.9,
    reviews: 1247,
    price: "$$$",
    image:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop",
    description:
      "Restaurante premiado com estrela Michelin, oferecendo alta gastronomia brasileira.",
    tags: ["brasileiro", "fine-dining", "leblon"],
  },
  {
    id: 2,
    name: "Pizzaria Guanabara",
    location: "Copacabana, Rio de Janeiro",
    state: "Rio de Janeiro",
    type: "Pizzaria",
    rating: 4.6,
    reviews: 2341,
    price: "$$",
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop",
    description:
      "Pizza tradicional carioca desde 1969, famosa pela massa fininha e ingredientes frescos.",
    tags: ["pizza", "tradicional", "carioca"],
  },
  {
    id: 3,
    name: "Confeitaria Colombo",
    location: "Centro, Rio de Janeiro",
    state: "Rio de Janeiro",
    type: "Confeitaria",
    rating: 4.7,
    reviews: 3156,
    price: "$$",
    image:
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop",
    description:
      "Confeitaria histórica de 1894, famosa pelos doces tradicionais e arquitetura belle époque.",
    tags: ["confeitaria", "histórica", "doces"],
  },
  {
    id: 4,
    name: "Churrascaria Palace",
    location: "Copacabana, Rio de Janeiro",
    state: "Rio de Janeiro",
    type: "Churrascaria",
    rating: 4.8,
    reviews: 4523,
    price: "$$$",
    image:
      "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop",
    description:
      "Tradicional churrascaria carioca com cortes nobres e buffet variado.",
    tags: ["churrasco", "carnes", "copacabana"],
  },
  {
    id: 5,
    name: "Bar Urca",
    location: "Urca, Rio de Janeiro",
    state: "Rio de Janeiro",
    type: "Boteco",
    rating: 4.5,
    reviews: 2847,
    price: "$",
    image:
      "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop",
    description:
      "Tradicional boteco carioca com vista para a Baía de Guanabara e petiscos autênticos.",
    tags: ["boteco", "tradicional", "vista"],
  },
  {
    id: 6,
    name: "Galeto Sat's",
    location: "Copacabana, Rio de Janeiro",
    state: "Rio de Janeiro",
    type: "Galeto",
    rating: 4.4,
    reviews: 3765,
    price: "$$",
    image:
      "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=400&h=300&fit=crop",
    description:
      "Famoso galeto carioca desde 1962, especializado em frango grelhado e acompanhamentos.",
    tags: ["galeto", "frango", "tradicional"],
  },
];

const placeTypes = filterOptions.placeTypes;
const states = filterOptions.states;
const priceRanges = filterOptions.priceRanges;
const interactionTypes = [
  "Todos",
  "Quero Provar", // Favorited but not visited
  "Já Visitamos", // Visited
  "Favoritos", // All favorited
  "Ainda não Tentei", // Not favorited and not visited
];

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { places } = usePlaces();

  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || "",
  );

  // Use places from context
  const allPlaces = places;
  const [selectedType, setSelectedType] = useState("Todos");
  const [selectedState, setSelectedState] = useState("Todos");
  const [selectedPrice, setSelectedPrice] = useState("Todos");
  const [selectedInteraction, setSelectedInteraction] = useState("Todos");
  const [selectedQualityTag, setSelectedQualityTag] = useState("Todos");
  const [selectedWishlistTag, setSelectedWishlistTag] = useState("Todos");
  const [selectedStarRating, setSelectedStarRating] = useState("Todos");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("name-asc");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<
    (typeof allPlaces)[0] | null
  >(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { getPlaceInteraction, getUserRating } = usePlaceStats();

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

  // Collect all available tags from places
  const availableQualityTags = useMemo(() => {
    const tags = new Set<string>();
    allPlaces.forEach((place) => {
      if (place.qualityTags) {
        place.qualityTags.forEach((tag) => tags.add(tag));
      }
    });
    return ["Todos", ...Array.from(tags).sort()];
  }, [allPlaces]);

  const availableWishlistTags = useMemo(() => {
    const tags = new Set<string>();
    allPlaces.forEach((place) => {
      if (place.wishlistTags) {
        place.wishlistTags.forEach((tag) => tags.add(tag));
      }
    });
    return ["Todos", ...Array.from(tags).sort()];
  }, [allPlaces]);

  // Update search query when URL params change
  useEffect(() => {
    const searchParam = searchParams.get("search");
    if (searchParam) {
      setSearchQuery(searchParam);
    }
  }, [searchParams]);

  const filteredPlaces = useMemo(() => {
    let filtered = allPlaces.filter((place) => {
      const matchesSearch =
        place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType =
        selectedType === "Todos" || place.type === selectedType;
      const matchesState =
        selectedState === "Todos" || place.state === selectedState;

      let matchesPrice = true;
      if (selectedPrice !== "Todos") {
        matchesPrice = place.price === selectedPrice;
      }

      // Filter by interaction status
      let matchesInteraction = true;
      if (selectedInteraction !== "Todos") {
        const interaction = getPlaceInteraction(place.id);
        switch (selectedInteraction) {
          case "Quero Provar":
            matchesInteraction =
              interaction.isFavorited && !interaction.isVisited;
            break;
          case "Já Visitamos":
            matchesInteraction = interaction.isVisited;
            break;
          case "Favoritos":
            matchesInteraction = interaction.isFavorited;
            break;
          case "Ainda não Tentei":
            matchesInteraction =
              !interaction.isFavorited && !interaction.isVisited;
            break;
        }
      }

      // Filter by quality tags
      let matchesQualityTag = true;
      if (selectedQualityTag !== "Todos") {
        matchesQualityTag =
          place.qualityTags?.includes(selectedQualityTag) || false;
      }

      // Filter by wishlist tags
      let matchesWishlistTag = true;
      if (selectedWishlistTag !== "Todos") {
        matchesWishlistTag =
          place.wishlistTags?.includes(selectedWishlistTag) || false;
      }

      return (
        matchesSearch &&
        matchesType &&
        matchesState &&
        matchesPrice &&
        matchesInteraction &&
        matchesQualityTag &&
        matchesWishlistTag
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
    searchQuery,
    selectedType,
    selectedState,
    selectedPrice,
    selectedInteraction,
    selectedQualityTag,
    selectedWishlistTag,
    sortBy,
    getPlaceInteraction,
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
      className={`group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 cursor-pointer ${viewMode === "list" ? "flex" : ""}`}
      onClick={() => handlePlaceClick(place)}
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
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg px-3 py-2">
            <UserRatingDisplay
              userRating={getUserRating(place.id)}
              size="sm"
              showLabel
            />
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
            Restaurantes
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Nossa coleção de {allPlaces.length} lugares incríveis para
            experimentar
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
        className={`grid lg:grid-cols-4 xl:grid-cols-8 gap-4 ${showFilters || window.innerWidth >= 1024 ? "block" : "hidden lg:grid"}`}
      >
        <div className="lg:col-span-4 xl:col-span-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar restaurantes, cafeterias, culinárias..."
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
            <SelectValue placeholder="Faixa de Preço" />
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
          value={selectedInteraction}
          onValueChange={setSelectedInteraction}
        >
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {interactionTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={selectedQualityTag}
          onValueChange={setSelectedQualityTag}
        >
          <SelectTrigger>
            <SelectValue placeholder="Qualidades" />
          </SelectTrigger>
          <SelectContent>
            {availableQualityTags.map((tag) => (
              <SelectItem key={tag} value={tag}>
                {tag}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={selectedWishlistTag}
          onValueChange={setSelectedWishlistTag}
        >
          <SelectTrigger>
            <SelectValue placeholder="Razões para Ir" />
          </SelectTrigger>
          <SelectContent>
            {availableWishlistTags.map((tag) => (
              <SelectItem key={tag} value={tag}>
                {tag}
              </SelectItem>
            ))}
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
          Mostrando {filteredPlaces.length} de {allPlaces.length} restaurantes
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
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Nenhum restaurante encontrado
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Tente ajustar seus critérios de busca ou filtros
          </p>
        </div>
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
