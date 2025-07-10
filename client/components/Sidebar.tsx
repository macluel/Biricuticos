import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/ThemeProvider";
import {
  Home,
  Search,
  Map,
  MapPin,
  Menu,
  X,
  Star,
  Heart,
  Moon,
  Sun,
  UtensilsCrossed,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { appConfig } from "@/data/config";
import { usePlaceStats } from "@/contexts/PlaceStatsContext";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const navItems = [
  {
    name: "Início",
    href: "/",
    icon: Home,
  },
  {
    name: "Restaurantes",
    href: "/catalog",
    icon: UtensilsCrossed,
  },
  {
    name: "Mapa",
    href: "/mapview",
    icon: Map,
  },
];

export function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const { stats } = usePlaceStats();

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-lg border border-gray-200 dark:border-gray-700 lg:hidden hover:bg-white dark:hover:bg-gray-800 transition-colors"
      >
        {isOpen ? (
          <X className="h-5 w-5 text-gray-600" />
        ) : (
          <Menu className="h-5 w-5 text-gray-600" />
        )}
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-full w-64 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-r border-gray-200/50 dark:border-gray-700/50 shadow-xl z-40 transition-all duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo/Brand */}
          <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                <UtensilsCrossed className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-lg text-gray-900 dark:text-gray-100">
                  {appConfig.name}
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {appConfig.tagline}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {navItems.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      to={item.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                        isActive
                          ? "bg-primary-500 text-white shadow-lg shadow-primary-500/25"
                          : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100",
                      )}
                    >
                      <item.icon
                        className={cn(
                          "h-5 w-5 transition-transform duration-200",
                          isActive
                            ? "text-white"
                            : "text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300",
                        )}
                      />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Dark Mode Toggle */}
          <div className="p-4 border-t border-gray-200/50 dark:border-gray-700/50">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Tema
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="w-auto h-8 px-3"
                >
                  {theme === "dark" ? (
                    <Sun className="h-4 w-4" />
                  ) : (
                    <Moon className="h-4 w-4" />
                  )}
                  <span className="ml-2 text-xs">
                    {theme === "dark" ? "Claro" : "Escuro"}
                  </span>
                </Button>
              </div>

              {/* Quick stats/info */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">
                    Quero Provar
                  </span>
                  <div className="flex items-center gap-1">
                    <Heart className="h-4 w-4 text-red-400" />
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      {stats.wantToTry}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">
                    Provamos Juntos
                  </span>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400" />
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      {stats.triedTogether}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
