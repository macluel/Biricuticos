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
import { AuthProvider } from "@/contexts/AuthContext";
import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import MapView from "./pages/MapView";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
    <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="places-theme">
      <AuthProvider>
        <PlaceStatsProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/catalog" element={<Catalog />} />
                <Route path="/map" element={<MapView />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </BrowserRouter>
        </TooltipProvider>
      </PlaceStatsProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

const rootElement = document.getElementById("root")!;
const root = createRoot(rootElement);
root.render(<App />);