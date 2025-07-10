import { useState } from "react";
import {
  Plus,
  MapPin,
  Star,
  DollarSign,
  Type,
  Loader2,
  Camera,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { usePlaces } from "@/contexts/PlacesContext";

interface AddPlaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlaceAdded?: (place: any) => void;
}

interface PlaceFormData {
  name: string;
  address: string;
  neighborhood: string;
  city: string;
  state: string;
  type: string;
  description: string;
  price: string;
  rating: number;
  imageUrl: string;
  lat?: number;
  lng?: number;
}

export function AddPlaceModal({
  isOpen,
  onClose,
  onPlaceAdded,
}: AddPlaceModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const { addPlace } = usePlaces();

  const [formData, setFormData] = useState<PlaceFormData>({
    name: "",
    address: "",
    neighborhood: "",
    city: "Rio de Janeiro",
    state: "Rio de Janeiro",
    type: "",
    description: "",
    price: "",
    rating: 5,
    imageUrl: "",
    lat: -22.9068,
    lng: -43.1729,
  });

  const [isGeocoding, setIsGeocoding] = useState(false);
  const [coordinatesSet, setCoordinatesSet] = useState(false);

  const foodTypes = [
    "Fine Dining",
    "Pizzaria",
    "Confeitaria",
    "Churrascaria",
    "Boteco",
    "Cafeteria",
    "Padaria",
    "Açaí",
    "Japonês",
    "Italiano",
    "Chinês",
    "Mexicano",
    "Árabe",
    "Vegetariano",
    "Hambúrguer",
    "Sushi",
    "Outro",
  ];

  const priceRanges = [
    { value: "$", label: "$ - Barato" },
    { value: "$$", label: "$$ - Médio" },
    { value: "$$$", label: "$$$ - Caro" },
    { value: "$$$$", label: "$$$$ - Muito Caro" },
  ];

  // Geocoding function using Nominatim (free OpenStreetMap service)
  const geocodeAddress = async (fullAddress: string) => {
    setIsGeocoding(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullAddress)}&limit=1&countrycodes=br`,
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);

        setFormData((prev) => ({ ...prev, lat, lng }));
        setCoordinatesSet(true);
        console.log("Geocoded coordinates:", {
          lat,
          lng,
          address: fullAddress,
        });
        return { lat, lng };
      } else {
        console.log("No coordinates found for address:", fullAddress);
        return null;
      }
    } catch (error) {
      console.error("Geocoding error:", error);
      return null;
    } finally {
      setIsGeocoding(false);
    }
  };

  // Auto-geocode when address changes
  const handleAddressChange = async () => {
    const fullAddress = [
      formData.address,
      formData.neighborhood,
      formData.city,
      formData.state,
      "Brazil",
    ]
      .filter(Boolean)
      .join(", ");

    if (formData.address && formData.city) {
      await geocodeAddress(fullAddress);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError("Você precisa estar logado para adicionar lugares");
      return;
    }

    // Validation
    if (
      !formData.name ||
      !formData.address ||
      !formData.city ||
      !formData.type
    ) {
      setError("Nome, endereço, cidade e tipo são obrigatórios");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Create full address for display
      const fullLocation = [
        formData.address,
        formData.neighborhood,
        formData.city,
        formData.state,
      ]
        .filter(Boolean)
        .join(", ");

      // Create new place object
      const newPlace = {
        id: Date.now(), // In real app, this would come from the server
        name: formData.name,
        location: fullLocation,
        address: formData.address,
        neighborhood: formData.neighborhood || "",
        city: formData.city,
        state: formData.state,
        type: formData.type,
        rating: formData.rating,
        reviews: 0, // New place starts with 0 reviews
        price: formData.price || "$$",
        image:
          formData.imageUrl ||
          "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop",
        description: formData.description,
        tags: [formData.type.toLowerCase(), "user-added"],
        lat: formData.lat || -22.9068 + (Math.random() - 0.5) * 0.1,
        lng: formData.lng || -43.1729 + (Math.random() - 0.5) * 0.1,
        addedBy: user.id,
        addedAt: new Date().toISOString(),
      };

      // Add place using context (automatically updates all components)
      addPlace(newPlace);

      // Trigger callback
      onPlaceAdded?.(newPlace);

      // Reset form and close modal
      setFormData({
        name: "",
        address: "",
        neighborhood: "",
        city: "Rio de Janeiro",
        state: "Rio de Janeiro",
        type: "",
        description: "",
        price: "",
        rating: 5,
        imageUrl: "",
        lat: -22.9068,
        lng: -43.1729,
      });
      setCoordinatesSet(false);
      onClose();
    } catch (error) {
      setError("Erro ao adicionar lugar. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onClose();
    setError("");
    setFormData({
      name: "",
      address: "",
      neighborhood: "",
      city: "Rio de Janeiro",
      state: "Rio de Janeiro",
      type: "",
      description: "",
      price: "",
      rating: 5,
      imageUrl: "",
      lat: -22.9068,
      lng: -43.1729,
    });
    setCoordinatesSet(false);
  };

  if (!user) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary-600" />
              Login Necessário
            </DialogTitle>
            <DialogDescription>
              Você precisa estar logado para adicionar novos lugares.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center pt-4">
            <Button onClick={handleClose}>Entendi</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-primary-600" />
            Adicionar Novo Lugar
          </DialogTitle>
          <DialogDescription>
            Compartilhe um lugar especial que você descobriu! Ele aparecerá para
            todos os usuários.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Lugar *</Label>
              <div className="relative">
                <Type className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Ex: Restaurante do João"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="pl-10"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Endereço *</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="address"
                  type="text"
                  placeholder="Ex: Rua Visconde de Pirajá, 120"
                  value={formData.address}
                  onChange={(e) => {
                    setFormData({ ...formData, address: e.target.value });
                  }}
                  onBlur={handleAddressChange}
                  className="pl-10"
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>

          {/* Address Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="neighborhood">Bairro</Label>
              <Input
                id="neighborhood"
                type="text"
                placeholder="Ex: Ipanema"
                value={formData.neighborhood}
                onChange={(e) => {
                  setFormData({ ...formData, neighborhood: e.target.value });
                }}
                onBlur={handleAddressChange}
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">Cidade *</Label>
              <Input
                id="city"
                type="text"
                placeholder="Ex: Rio de Janeiro"
                value={formData.city}
                onChange={(e) => {
                  setFormData({ ...formData, city: e.target.value });
                }}
                onBlur={handleAddressChange}
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">Estado</Label>
              <Input
                id="state"
                type="text"
                placeholder="Ex: Rio de Janeiro"
                value={formData.state}
                onChange={(e) => {
                  setFormData({ ...formData, state: e.target.value });
                }}
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Coordinates Display */}
          {coordinatesSet && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="text-green-500 mt-0.5">📍</div>
                <div>
                  <h3 className="font-medium text-green-800 dark:text-green-200 mb-1">
                    Localização Encontrada!
                  </h3>
                  <p className="text-green-700 dark:text-green-300 text-sm mb-2">
                    Coordenadas: {formData.lat?.toFixed(6)},{" "}
                    {formData.lng?.toFixed(6)}
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-400">
                    O local será exibido no mapa usando essas coordenadas.
                  </p>
                </div>
              </div>
            </div>
          )}

          {isGeocoding && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                <span className="text-blue-700 dark:text-blue-300 text-sm">
                  Procurando localização no mapa...
                </span>
              </div>
            </div>
          )}

          {/* Type and Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Tipo de Comida *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) =>
                  setFormData({ ...formData, type: value })
                }
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  {foodTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Faixa de Preço</Label>
              <Select
                value={formData.price}
                onValueChange={(value) =>
                  setFormData({ ...formData, price: value })
                }
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a faixa" />
                </SelectTrigger>
                <SelectContent>
                  {priceRanges.map((range) => (
                    <SelectItem key={range.value} value={range.value}>
                      {range.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Rating */}
          <div className="space-y-2">
            <Label htmlFor="rating">Sua Avaliação</Label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData({ ...formData, rating: star })}
                  className="p-1 hover:scale-110 transition-transform"
                  disabled={isSubmitting}
                >
                  <Star
                    className={`h-6 w-6 ${
                      star <= formData.rating
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                {formData.rating} de 5 estrelas
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              placeholder="Conte sobre sua experiência neste lugar..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="min-h-[100px]"
              disabled={isSubmitting}
            />
          </div>

          {/* Image URL */}
          <div className="space-y-2">
            <Label htmlFor="imageUrl">URL da Imagem (opcional)</Label>
            <div className="relative">
              <Camera className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="imageUrl"
                type="url"
                placeholder="https://exemplo.com/imagem.jpg"
                value={formData.imageUrl}
                onChange={(e) =>
                  setFormData({ ...formData, imageUrl: e.target.value })
                }
                className="pl-10"
                disabled={isSubmitting}
              />
            </div>
            <p className="text-xs text-gray-500">
              Cole a URL de uma foto do lugar. Se não informar, usaremos uma
              imagem padrão.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
              <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Adicionando...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Adicionar Lugar
                </div>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
