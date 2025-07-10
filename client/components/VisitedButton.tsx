import { Check, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePlaceStats } from "@/contexts/PlaceStatsContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

interface VisitedButtonProps {
  placeId: number;
  size?: "sm" | "lg" | "default";
  variant?: "button" | "icon";
  className?: string;
}

export function VisitedButton({
  placeId,
  size = "sm",
  variant = "button",
  className,
}: VisitedButtonProps) {
  const { getPlaceInteraction, toggleVisited } = usePlaceStats();
  const { user, updateUserPreferences } = useAuth();
  const interaction = getPlaceInteraction(placeId);

  // Check if user has visited this place
  const isUserVisited = user?.preferences.visited.includes(placeId) || false;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleVisited(placeId);

    // Also update user preferences if logged in
    if (user) {
      const currentVisited = user.preferences.visited;
      const newVisited = currentVisited.includes(placeId)
        ? currentVisited.filter((id) => id !== placeId)
        : [...currentVisited, placeId];

      updateUserPreferences({ visited: newVisited });
    }
  };

  if (variant === "icon") {
    return (
      <button
        onClick={handleClick}
        className={cn(
          "p-1 rounded-full transition-all duration-200 hover:scale-110",
          interaction.isVisited || isUserVisited
            ? "text-green-500 hover:text-green-600"
            : "text-gray-400 hover:text-green-500",
          className,
        )}
        title={
          interaction.isVisited || isUserVisited
            ? "Marcar como não visitado"
            : "Marcar como visitado"
        }
      >
        {interaction.isVisited || isUserVisited ? (
          <Check className="h-4 w-4 fill-current" />
        ) : (
          <MapPin className="h-4 w-4" />
        )}
      </button>
    );
  }

  return (
    <Button
      size={size}
      variant={interaction.isVisited || isUserVisited ? "default" : "outline"}
      onClick={handleClick}
      className={cn(
        "gap-2",
        interaction.isVisited || isUserVisited
          ? "bg-green-500 hover:bg-green-600 text-white"
          : "border-green-500 text-green-500 hover:bg-green-50 dark:hover:bg-green-950",
        className,
      )}
    >
      {interaction.isVisited || isUserVisited ? (
        <>
          <Check className="h-4 w-4" />
          Visitamos!
        </>
      ) : (
        <>
          <MapPin className="h-4 w-4" />
          Marcar como Visitado
        </>
      )}
    </Button>
  );
}
