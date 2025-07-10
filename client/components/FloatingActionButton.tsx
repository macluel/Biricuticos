import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddPlaceModal } from "@/components/AddPlaceModal";
import { useAuth } from "@/contexts/AuthContext";
import { usePlaces } from "@/contexts/PlacesContext";
import { clearUserInteractions } from "@/utils/clearUserData";

export function FloatingActionButton() {
  const [showAddModal, setShowAddModal] = useState(false);
  const { user } = useAuth();
  const { places } = usePlaces();

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
