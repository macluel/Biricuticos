import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { ThemeProvider } from "@/components/ThemeProvider";
import { PlaceStatsProvider } from "@/contexts/PlaceStatsContext";

import { PlacesProvider } from "@/contexts/PlacesContext";
import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import Favorites from "./pages/Favorites";
import MapView from "./pages/MapView";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="places-theme">
      <PlacesProvider>
        <PlaceStatsProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Layout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/catalog" element={<Catalog />} />
                  <Route path="/favorites" element={<Favorites />} />
                  <Route path="/map" element={<MapView />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Layout>
            </BrowserRouter>
          </TooltipProvider>
        </PlaceStatsProvider>
      </PlacesProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

const rootElement = document.getElementById("root")!;

// Prevent double mounting in development
if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    // Cleanup on hot reload
  });
}

// Only create root if it doesn't exist
if (!rootElement.hasChildNodes()) {
  const root = createRoot(rootElement);
  root.render(<App />);
}
