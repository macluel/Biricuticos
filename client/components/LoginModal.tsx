import { useState } from "react";
import { Eye, EyeOff, User, Mail, Lock, Loader2 } from "lucide-react";
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
import { useAuth } from "@/contexts/AuthContext";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const { login, signup, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (isSignup) {
      if (!formData.name || !formData.email || !formData.password) {
        setError("Todos os campos são obrigatórios");
        return;
      }
      if (formData.password.length < 6) {
        setError("A senha deve ter pelo menos 6 caracteres");
        return;
      }

      const result = await signup(
        formData.name,
        formData.email,
        formData.password,
      );
      if (result.success) {
        onClose();
        setFormData({ name: "", email: "", password: "" });
      } else {
        setError(result.error || "Erro ao criar conta");
      }
    } else {
      if (!formData.email || !formData.password) {
        setError("E-mail e senha são obrigatórios");
        return;
      }

      const result = await login(formData.email, formData.password);
      if (result.success) {
        onClose();
        setFormData({ name: "", email: "", password: "" });
      } else {
        setError(result.error || "Erro ao fazer login");
      }
    }
  };

  const toggleMode = () => {
    setIsSignup(!isSignup);
    setError("");
    setFormData({ name: "", email: "", password: "" });
  };

  const handleClose = () => {
    onClose();
    setFormData({ name: "", email: "", password: "" });
    setError("");
    setIsSignup(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary-600" />
            {isSignup ? "Criar Conta" : "Entrar"}
          </DialogTitle>
          <DialogDescription>
            {isSignup
              ? "Crie sua conta para salvar seus restaurantes favoritos"
              : "Entre na sua conta para acessar seus favoritos"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {isSignup && (
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Seu nome completo"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="pl-10"
                  disabled={isLoading}
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="pl-10"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder={isSignup ? "Mínimo 6 caracteres" : "Sua senha"}
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="pl-10 pr-10"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
              <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-3">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {isSignup ? "Criando conta..." : "Entrando..."}
                </div>
              ) : isSignup ? (
                "Criar Conta"
              ) : (
                "Entrar"
              )}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={toggleMode}
                className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                disabled={isLoading}
              >
                {isSignup
                  ? "Já tem uma conta? Faça login"
                  : "Não tem conta? Crie uma agora"}
              </button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
