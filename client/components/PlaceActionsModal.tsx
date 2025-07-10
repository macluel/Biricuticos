import { useState } from "react";
import {
  Edit3,
  Trash2,
  Star,
  MapPin,
  DollarSign,
  Type,
  Camera,
  Save,
  X,
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
import { useNetlifyAuth as useAuth } from "@/contexts/NetlifyAuthContext";
import { usePlaces } from "@/contexts/PlacesContext";

interface PlaceActionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  place: any;
}

export function PlaceActionsModal({
  isOpen,
  onClose,
  place,
}: PlaceActionsModalProps) {
  const [mode, setMode] = useState<"actions" | "edit">("actions");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const { refreshPlaces } = usePlaces();

  const [editData, setEditData] = useState({
    name: place?.name || "",
    location: place?.location || "",
    type: place?.type || "",
    description: place?.description || "",
    price: place?.price || "",
    rating: place?.rating || 5,
    reviews: place?.reviews || 0,
    imageUrl: place?.image || "",
  });

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

  const canEdit = user && (place?.addedBy === user.id || !place?.addedBy);
  const canDelete = user && place?.addedBy === user.id;

  const handleDelete = async () => {
    if (!user || !canDelete) {
      setError("Você só pode deletar lugares que você adicionou");
      return;
    }

    if (!confirm(`Tem certeza que deseja deletar "${place.name}"?`)) {
      return;
    }

    setIsSubmitting(true);
    try {
      // Remove from user-added places
      const userAddedPlaces = JSON.parse(
        localStorage.getItem("user-added-places") || "[]",
      );
      const filteredPlaces = userAddedPlaces.filter(
        (p: any) => p.id !== place.id,
      );
      localStorage.setItem("user-added-places", JSON.stringify(filteredPlaces));

      refreshPlaces();
      onClose();
      alert(`${place.name} foi deletado com sucesso!`);
    } catch (error) {
      setError("Erro ao deletar lugar");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async () => {
    if (!user || !canEdit) {
      setError("Você não tem permissão para editar este lugar");
      return;
    }

    if (!editData.name || !editData.location || !editData.type) {
      setError("Nome, localização e tipo são obrigatórios");
      return;
    }

    setIsSubmitting(true);
    try {
      // Update in user-added places
      const userAddedPlaces = JSON.parse(
        localStorage.getItem("user-added-places") || "[]",
      );
      const updatedPlaces = userAddedPlaces.map((p: any) => {
        if (p.id === place.id) {
          return {
            ...p,
            name: editData.name,
            location: editData.location,
            type: editData.type,
            description: editData.description,
            price: editData.price,
            rating: editData.rating,
            reviews: editData.reviews,
            image: editData.imageUrl || p.image,
            updatedAt: new Date().toISOString(),
            updatedBy: user.id,
          };
        }
        return p;
      });

      localStorage.setItem("user-added-places", JSON.stringify(updatedPlaces));
      refreshPlaces();
      onClose();
      alert(`${editData.name} foi atualizado com sucesso!`);
    } catch (error) {
      setError("Erro ao atualizar lugar");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onClose();
    setMode("actions");
    setError("");
    setEditData({
      name: place?.name || "",
      location: place?.location || "",
      type: place?.type || "",
      description: place?.description || "",
      price: place?.price || "",
      rating: place?.rating || 5,
      reviews: place?.reviews || 0,
      imageUrl: place?.image || "",
    });
  };

  if (!user) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Login Necessário</DialogTitle>
            <DialogDescription>
              Você precisa estar logado para gerenciar lugares.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center pt-4">
            <Button onClick={handleClose}>Entendi</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (mode === "edit") {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit3 className="h-5 w-5 text-primary-600" />
              Editar {place?.name}
            </DialogTitle>
            <DialogDescription>
              Atualize as informações do lugar
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Nome do Lugar *</Label>
                <Input
                  id="edit-name"
                  value={editData.name}
                  onChange={(e) =>
                    setEditData({ ...editData, name: e.target.value })
                  }
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-location">Localização *</Label>
                <Input
                  id="edit-location"
                  value={editData.location}
                  onChange={(e) =>
                    setEditData({ ...editData, location: e.target.value })
                  }
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Type and Price */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tipo de Comida *</Label>
                <Select
                  value={editData.type}
                  onValueChange={(value) =>
                    setEditData({ ...editData, type: value })
                  }
                  disabled={isSubmitting}
                >
                  <SelectTrigger>
                    <SelectValue />
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
                <Label>Faixa de Preço</Label>
                <Select
                  value={editData.price}
                  onValueChange={(value) =>
                    setEditData({ ...editData, price: value })
                  }
                  disabled={isSubmitting}
                >
                  <SelectTrigger>
                    <SelectValue />
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

            {/* Rating and Reviews */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Avaliação</Label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setEditData({ ...editData, rating: star })}
                      className="p-1 hover:scale-110 transition-transform"
                      disabled={isSubmitting}
                    >
                      <Star
                        className={`h-6 w-6 ${
                          star <= editData.rating
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-sm text-gray-600">
                    {editData.rating} de 5
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-reviews">Número de Avaliações</Label>
                <Input
                  id="edit-reviews"
                  type="number"
                  min="0"
                  value={editData.reviews}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      reviews: parseInt(e.target.value) || 0,
                    })
                  }
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="edit-description">Descrição</Label>
              <Textarea
                id="edit-description"
                value={editData.description}
                onChange={(e) =>
                  setEditData({ ...editData, description: e.target.value })
                }
                disabled={isSubmitting}
              />
            </div>

            {/* Image URL */}
            <div className="space-y-2">
              <Label htmlFor="edit-image">URL da Imagem</Label>
              <Input
                id="edit-image"
                type="url"
                value={editData.imageUrl}
                onChange={(e) =>
                  setEditData({ ...editData, imageUrl: e.target.value })
                }
                disabled={isSubmitting}
              />
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                <p className="text-red-700 dark:text-red-300 text-sm">
                  {error}
                </p>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setMode("actions")}
                className="flex-1"
                disabled={isSubmitting}
              >
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
              <Button
                onClick={handleEdit}
                className="flex-1"
                disabled={isSubmitting}
              >
                <Save className="h-4 w-4 mr-2" />
                {isSubmitting ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit3 className="h-5 w-5 text-primary-600" />
            Gerenciar {place?.name}
          </DialogTitle>
          <DialogDescription>
            O que você gostaria de fazer com este lugar?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 mt-4">
          {canEdit && (
            <Button
              onClick={() => setMode("edit")}
              variant="outline"
              className="w-full justify-start"
              disabled={isSubmitting}
            >
              <Edit3 className="h-4 w-4 mr-2" />
              Editar informações
            </Button>
          )}

          {canDelete && (
            <Button
              onClick={handleDelete}
              variant="destructive"
              className="w-full justify-start"
              disabled={isSubmitting}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {isSubmitting ? "Deletando..." : "Deletar lugar"}
            </Button>
          )}

          {!canEdit && !canDelete && (
            <p className="text-sm text-gray-500 text-center py-4">
              Você só pode editar lugares que você adicionou.
            </p>
          )}

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
              <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
            </div>
          )}

          <Button variant="outline" onClick={handleClose} className="w-full">
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
