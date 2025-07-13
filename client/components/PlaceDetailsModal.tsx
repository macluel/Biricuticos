import { useState } from "react";
import {
  MapPin,
  Star,
  Phone,
  Globe,
  MessageCircle,
  Instagram,
  Navigation,
  Tag,
  Heart,
  Clock,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FavoriteButton } from "@/components/FavoriteButton";
import { VisitedButton } from "@/components/VisitedButton";
import { UserRating, UserRatingDisplay } from "@/components/UserRating";
import { usePlaceStats } from "@/contexts/PlaceStatsContext";

interface Place {
  id: number;
  name: string;
  location: string;
  fullAddress?: string;
  state: string;
  type: string;
  rating: number;
  price: string;
  image: string;
  phone?: string;
  instagram?: string;
  whatsapp?: string;
  website?: string;
  qualityTags?: string[];
  wishlistTags?: string[];
  tags: string[];
  lat: number;
  lng: number;
}

interface PlaceDetailsModalProps {
  place: Place | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PlaceDetailsModal({
  place,
  isOpen,
  onClose,
}: PlaceDetailsModalProps) {
  const { interactions, getUserRating } = usePlaceStats();

  if (!place) return null;

  const hasVisited = interactions.some(
    (interaction) => interaction.placeId === place.id && interaction.isVisited,
  );
  const userRating = getUserRating(place.id);

  const handlePhoneCall = () => {
    if (place.phone) {
      window.open(`tel:${place.phone}`, "_blank");
    }
  };

  const handleWhatsApp = () => {
    if (place.whatsapp) {
      const cleanNumber = place.whatsapp.replace(/[^\d+]/g, "");
      window.open(`https://wa.me/${cleanNumber}`, "_blank");
    }
  };

  const handleInstagram = () => {
    if (place.instagram) {
      const handle = place.instagram.replace("@", "");
      window.open(`https://instagram.com/${handle}`, "_blank");
    }
  };

  const handleWebsite = () => {
    if (place.website) {
      window.open(place.website, "_blank");
    }
  };

  const handleNavigate = () => {
    const googleMapsUrl = `https://www.google.com/maps/dir//${place.lat},${place.lng}`;
    window.open(googleMapsUrl, "_blank");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {place.name}
              </DialogTitle>
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600 dark:text-gray-300">
                  {place.location}
                </span>
                <Badge
                  variant="secondary"
                  className="dark:bg-primary-800 dark:text-gray-300"
                >
                  {place.type}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <FavoriteButton placeId={place.id} />
              <VisitedButton placeId={place.id} />
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Image */}
          <div className="relative overflow-hidden rounded-lg">
            <img
              src={place.image}
              alt={place.name}
              className="w-full h-64 object-cover"
            />
            <div className="absolute top-4 right-4">
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg px-3 py-2">
                <UserRatingDisplay
                  userRating={userRating}
                  size="sm"
                  showLabel
                />
              </div>
            </div>
            <div className="absolute top-4 left-4">
              <Badge
                variant="outline"
                className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm"
              >
                {place.price}
              </Badge>
            </div>
          </div>

          {/* Address */}
          {place.fullAddress && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Endereço Completo
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {place.fullAddress}
              </p>
            </div>
          )}

          {/* Contact Information */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Contato e Redes Sociais
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {place.phone && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePhoneCall}
                  className="flex items-center gap-2 justify-start"
                >
                  <Phone className="h-4 w-4" />
                  Telefone
                </Button>
              )}
              {place.whatsapp && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleWhatsApp}
                  className="flex items-center gap-2 justify-start text-green-600 border-green-200 hover:bg-green-50"
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </Button>
              )}
              {place.instagram && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleInstagram}
                  className="flex items-center gap-2 justify-start text-pink-600 border-pink-200 hover:bg-pink-50"
                >
                  <Instagram className="h-4 w-4" />
                  Instagram
                </Button>
              )}
              {place.website && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleWebsite}
                  className="flex items-center gap-2 justify-start"
                >
                  <Globe className="h-4 w-4" />
                  Website
                </Button>
              )}
            </div>
          </div>

          {/* Tags - Quality tags for visited places or wishlist tags for unvisited */}
          {((hasVisited && place.qualityTags) ||
            (!hasVisited && place.wishlistTags)) && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                <Tag className="h-4 w-4" />
                {hasVisited ? "O que gostamos" : "Por que queremos ir"}
              </h3>
              <div className="flex flex-wrap gap-2">
                {(hasVisited ? place.qualityTags : place.wishlistTags)?.map(
                  (tag, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className={
                        hasVisited
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                      }
                    >
                      {tag}
                    </Badge>
                  ),
                )}
              </div>
            </div>
          )}

          {/* General Tags */}
          {place.tags && place.tags.length > 0 && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {place.tags.map((tag, index) => (
                  <Badge key={index} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* User Rating Section */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
              <Star className="h-4 w-4" />
              Sua Avaliação
            </h3>
            <div className="flex items-center justify-between">
              <UserRating placeId={place.id} size="lg" showLabel />
            </div>
            {!userRating && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Clique nas estrelas para avaliar este lugar
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button onClick={handleNavigate} className="flex-1">
              <Navigation className="h-4 w-4 mr-2" />
              Como Chegar
            </Button>
            <Button variant="outline" onClick={onClose}>
              <X className="h-4 w-4 mr-2" />
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
