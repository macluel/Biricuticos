import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePlaceStats } from "@/contexts/PlaceStatsContext";

interface FavoriteButtonProps {
  placeId: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function FavoriteButton({
  placeId,
  size = "md",
  className,
}: FavoriteButtonProps) {
  const { getPlaceInteraction, toggleFavorite } = usePlaceStats();
  const interaction = getPlaceInteraction(placeId);

  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  return (
    <button
      onClick={(e) => {
        e.preventDefault(); // Prevent any parent link clicks
        e.stopPropagation();
        toggleFavorite(placeId);
      }}
      className={cn(
        "p-1 rounded-full transition-all duration-200 hover:scale-110",
        interaction.isFavorited
          ? "text-red-500 hover:text-red-600"
          : "text-gray-400 hover:text-red-500",
        className,
      )}
      title={
        interaction.isFavorited
          ? "Remover dos favoritos"
          : "Adicionar aos favoritos"
      }
    >
      <Heart
        className={cn(
          sizeClasses[size],
          "transition-all duration-200",
          interaction.isFavorited ? "fill-current" : "",
        )}
      />
    </button>
  );
}
