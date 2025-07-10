import { Check, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePlaceStats } from "@/contexts/PlaceStatsContext";
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
  const interaction = getPlaceInteraction(placeId);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleVisited(placeId);
  };

  if (variant === "icon") {
    return (
      <button
        onClick={handleClick}
        className={cn(
          "p-1 rounded-full transition-all duration-200 hover:scale-110",
          interaction.isVisited
            ? "text-green-500 hover:text-green-600"
            : "text-gray-400 hover:text-green-500",
          className,
        )}
        title={
          interaction.isVisited
            ? "Marcar como não visitado"
            : "Marcar como visitado"
        }
      >
        {interaction.isVisited ? (
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
      variant={interaction.isVisited ? "default" : "outline"}
      onClick={handleClick}
      className={cn(
        "gap-2",
        interaction.isVisited
          ? "bg-green-500 hover:bg-green-600 text-white"
          : "border-green-500 text-green-500 hover:bg-green-50 dark:hover:bg-green-950",
        className,
      )}
    >
      {interaction.isVisited ? (
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
