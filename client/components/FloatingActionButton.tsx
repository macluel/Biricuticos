import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddPlaceModal } from "@/components/AddPlaceModal";
import { useAuth } from "@/contexts/AuthContext";

export function FloatingActionButton() {
  const [showAddModal, setShowAddModal] = useState(false);
  const { user } = useAuth();

  const handlePlaceAdded = (newPlace: any) => {
    // Success notification
    console.log("New place added:", newPlace);

    // You could add a toast notification here
    alert(
      `🎉 ${newPlace.name} foi adicionado com sucesso! Você pode vê-lo na lista de restaurantes.`,
    );
  };

  return (
    <>
      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-40">
        {/* Test Add Place Button */}
        <Button
          onClick={() => {
            const testPlace = {
              id: Date.now(),
              name: "Teste Restaurant",
              location: "Copacabana, Rio de Janeiro",
              state: "Rio de Janeiro",
              type: "Teste",
              rating: 4.5,
              reviews: 100,
              price: "$$",
              image:
                "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop",
              description: "Restaurant de teste para ver se funciona",
              tags: ["teste"],
              lat: -22.9068,
              lng: -43.1729,
            };
            console.log("Adding test place:", testPlace);

            // Add to localStorage directly for testing
            const userAddedPlaces = JSON.parse(
              localStorage.getItem("user-added-places") || "[]",
            );
            userAddedPlaces.push(testPlace);
            localStorage.setItem(
              "user-added-places",
              JSON.stringify(userAddedPlaces),
            );

            console.log("Test place added to localStorage");
            alert("Lugar de teste adicionado! Verifique se aparece na lista.");

            // Force page reload to see if it appears
            window.location.reload();
          }}
          variant="secondary"
          className="h-10 w-10 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 group text-xs"
          title="Teste: Adicionar lugar de teste"
        >
          T
        </Button>

        {/* Debug Button */}
        <Button
          onClick={() => {
            console.log("Current places:", places);
            const userPlaces = JSON.parse(
              localStorage.getItem("user-added-places") || "[]",
            );
            console.log("User places in localStorage:", userPlaces);
            alert(
              `Total places: ${places.length}\nUser places in storage: ${userPlaces.length}`,
            );
          }}
          variant="outline"
          className="h-10 w-10 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 group text-xs"
          title="Debug: Show places count"
        >
          {places.length}
        </Button>

        {/* Clear Data Button (temporary) */}
        <Button
          onClick={() => {
            if (
              confirm(
                "Tem certeza que deseja limpar todos os favoritos e lugares visitados?",
              )
            ) {
              clearUserInteractions();
            }
          }}
          variant="destructive"
          className="h-12 w-12 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 group"
          title="Limpar favoritos e visitados"
        >
          <Trash2 className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
        </Button>

        {/* Add Place Button */}
        <Button
          onClick={() => setShowAddModal(true)}
          className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 group"
          title="Adicionar novo lugar"
        >
          <Plus className="h-6 w-6 group-hover:scale-110 transition-transform duration-200" />
        </Button>
      </div>

      {/* Add Place Modal */}
      <AddPlaceModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onPlaceAdded={handlePlaceAdded}
      />
    </>
  );
}
