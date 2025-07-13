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
  User,
  LogOut,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { appConfig } from "@/data/config";
import { usePlaceStats } from "@/contexts/PlaceStatsContext";
import { copyShareableLink } from "@/utils/urlSharing";

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
    href: "/map",
    icon: Map,
  },
];

export function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const { stats, interactions } = usePlaceStats();

  const handleShare = () => {
    copyShareableLink(interactions);
  };

  return (
    <>
      {/* Mobile menu button - fixed z-index issue */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed top-4 left-4 p-2 rounded-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-lg border border-gray-200 dark:border-gray-700 lg:hidden hover:bg-white dark:hover:bg-gray-800 transition-all duration-300",
          isOpen ? "z-50" : "z-50",
        )}
        style={{
          transform: isOpen ? "translateX(200px)" : "translateX(0)",
        }}
      >
        {isOpen ? (
          <X className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        ) : (
          <Menu className="h-5 w-5 text-gray-600 dark:text-gray-300" />
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
                <svg
                  width="22"
                  height="21"
                  viewBox="0 0 22 21"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 text-white"
                >
                  <path
                    d="M2.99598 0.191632C2.63314 0.593585 2.71034 0.705668 4.86418 2.83911C7.53138 5.48273 7.64332 5.63346 7.88649 6.95914C7.96369 7.38428 8.04089 7.55434 8.25704 7.79396L8.52724 8.09156L8.34582 8.28481C8.12195 8.52444 8.04861 8.52057 7.85175 8.27708C7.72437 8.12248 7.55068 8.05291 6.98327 7.93697C5.75196 7.68574 5.58212 7.5582 3.05388 5.05759C0.625988 2.64973 0.55265 2.59949 0.166658 2.98598C-0.200034 3.35315 -0.149855 3.41499 2.30891 5.8499C4.86804 8.3853 5.04173 8.51671 6.41972 8.9032C7.4233 9.18534 7.4619 9.23172 7.4619 10.1207C7.4619 10.9478 7.65104 11.4386 8.19528 12.0299C8.36512 12.2116 8.50408 12.3816 8.50408 12.401C8.50408 12.4242 7.20329 13.7344 5.60914 15.319C3.49005 17.4254 2.67174 18.2873 2.55981 18.5346C1.8573 20.0883 3.70234 21.6536 5.13437 20.7183C5.54738 20.4478 8.58514 17.1974 10.6811 14.7779C10.7197 14.7315 10.8625 14.8281 11.0439 15.0291C11.4145 15.4349 11.6576 15.4543 12.0012 15.1142L12.2405 14.8707L13.3637 16.0224C13.9852 16.6524 15.1933 17.9433 16.0579 18.8902C17.8142 20.8227 18.0458 20.9966 18.8216 20.9966C20.2344 20.9966 21.0758 19.4738 20.2923 18.3336C20.1996 18.1984 19.5319 17.5336 18.8062 16.8572C15.3168 13.5914 14.5024 12.8377 14.3982 12.7759C14.3094 12.7295 14.3982 12.5942 14.7996 12.1691C15.6025 11.3188 15.8572 10.596 15.6488 9.78054L15.5253 9.29356L15.7183 9.10031C15.8842 8.93412 15.9807 8.90706 16.4709 8.9032C19.5319 8.86069 22.944 4.12614 21.759 1.57141C20.6165 -0.878956 16.7527 0.118198 14.5526 3.42658C13.8925 4.41601 13.7188 4.98415 13.715 6.11658V7.04416L13.4525 7.37268C13.2749 7.59299 13.1283 7.7012 13.0047 7.7012C12.7345 7.7012 12.3022 7.90218 11.9433 8.19592L11.6268 8.45487L11.4376 8.30413C11.0516 7.99107 10.4765 7.75918 9.99786 7.72053C9.31466 7.66255 9.13324 7.45385 8.86305 6.38713C8.4925 4.92231 8.44232 4.85275 5.92179 2.30962C3.49391 -0.140753 3.37425 -0.225781 2.99598 0.191632ZM20.2459 1.4632C21.0913 1.91539 21.1607 3.0826 20.4312 4.57061C19.4238 6.62675 17.6559 7.91378 15.9383 7.84034C15.5909 7.82488 15.5098 7.8558 15.2088 8.09929L14.8691 8.37757L14.6838 8.2307C14.5834 8.14954 14.4522 8.05291 14.3943 8.02199C14.3094 7.97561 14.3596 7.88672 14.6027 7.64323C14.9154 7.32631 14.9193 7.31471 14.8575 6.95141C14.7571 6.34461 14.7919 5.52911 14.9386 5.07305C15.6835 2.77727 18.7676 0.682479 20.2459 1.4632ZM13.9967 8.97663C14.5255 9.32448 14.7687 10.2521 14.4947 10.9014C14.4368 11.0405 13.7613 11.7942 12.9932 12.5788L11.5959 14.0011L10.2179 12.6097C8.42688 10.8047 8.17984 10.2637 8.75497 9.42883C9.37256 8.5399 10.2449 8.55535 11.04 9.47134C11.5418 10.0511 11.4917 10.0511 12.1594 9.42883C12.9932 8.65198 13.3599 8.56309 13.9967 8.97663ZM9.65433 13.5295C9.88207 13.7614 9.96699 13.9044 9.92453 13.974C9.62731 14.4687 4.88348 19.6168 4.50906 19.8564C4.03429 20.1579 3.45917 19.8255 3.50163 19.2728C3.52479 18.9791 3.65988 18.8284 6.38112 16.0881C7.95211 14.5074 9.25676 13.2087 9.27992 13.201C9.30308 13.1933 9.47292 13.344 9.65433 13.5295ZM15.4095 15.1257C19.941 19.3153 19.86 19.2226 19.3196 19.7675C18.8409 20.2429 18.6634 20.1231 16.8029 18.0863C15.9537 17.1587 14.761 15.8678 14.1511 15.2185C12.9507 13.9353 13.0009 14.0474 13.3985 13.5952C13.5451 13.4252 13.5528 13.4252 13.7111 13.5604C13.796 13.6377 14.5641 14.3412 15.4095 15.1257Z"
                    fill="currentColor"
                  />
                  <path
                    d="M1.64886 1.55982C1.17409 1.8922 1.29375 2.06613 3.46688 4.24209C5.5937 6.37167 5.72493 6.46442 6.06075 6.08953C6.41972 5.69144 6.33866 5.57549 4.20027 3.43045C2.10433 1.33565 2.03871 1.28927 1.64886 1.55982Z"
                    fill="currentColor"
                  />
                </svg>
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
              {/* Share Button */}
              <Button
                onClick={handleShare}
                className="w-full bg-green-500 hover:bg-green-600 text-white"
                size="sm"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Compartilhar Dados
              </Button>

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
