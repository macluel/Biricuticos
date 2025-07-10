import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddPlaceModal } from "@/components/AddPlaceModal";
import { useAuth } from "@/contexts/AuthContext";
import { clearUserInteractions } from "@/utils/clearUserData";

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
      {/* Floating Action Button */}
      <Button
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-40 group"
        title="Adicionar novo lugar"
      >
        <Plus className="h-6 w-6 group-hover:scale-110 transition-transform duration-200" />
      </Button>

      {/* Add Place Modal */}
      <AddPlaceModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onPlaceAdded={handlePlaceAdded}
      />
    </>
  );
}
