import { useState, useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  Search,
  Filter,
  Star,
  Heart,
  MapPin,
  Navigation,
  Crosshair,
  Route,
  LocateFixed,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { usePlaces } from "@/contexts/PlacesContext";
import { FavoriteButton } from "@/components/FavoriteButton";
import { VisitedButton } from "@/components/VisitedButton";
import { FallbackMap } from "@/components/FallbackMap";

// Mapbox access token
mapboxgl.accessToken =
  "pk.eyJ1IjoibWFjbHVlbCIsImEiOiJjbWN4dmplYTYwZ2pqMmxva2M4eHprOXk2In0.gauez6de-WZWDhQiJzLIqg";

// Handle Mapbox telemetry gracefully to prevent fetch errors
if (typeof window !== "undefined") {
  // Properly disable Mapbox telemetry to prevent fetch errors
  // @ts-ignore
  if (window.mapboxgl) {
    // @ts-ignore
    window.mapboxgl.accessToken = mapboxgl.accessToken;
    // @ts-ignore
    window.mapboxgl.config = {
      REQUIRE_ACCESS_TOKEN: true,
      EVENTS_URL: false,
    };
  }

  // Also set the global config before Mapbox initializes
  // @ts-ignore
  if (typeof mapboxgl !== "undefined") {
    // @ts-ignore
    mapboxgl.config = {
      REQUIRE_ACCESS_TOKEN: true,
      EVENTS_URL: false,
    };
  }

  // Comprehensive error suppression for Mapbox telemetry
  window.addEventListener("unhandledrejection", (event) => {
    const message = event.reason?.message || "";
    const stack = event.reason?.stack || "";

    // Suppress all Mapbox telemetry-related fetch errors
    if (
      message.includes("Failed to fetch") ||
      message.includes("TypeError: Failed to fetch")
    ) {
      // Check if it's from Mapbox telemetry/events
      if (
        stack.includes("mapbox") ||
        stack.includes("telemetry") ||
        stack.includes("postEvent") ||
        stack.includes("postTurnstileEvent") ||
        stack.includes("processRequests") ||
        stack.includes("queueRequest")
      ) {
        event.preventDefault();
        return;
      }
    }
  });

  // Also handle regular errors
  window.addEventListener("error", (event) => {
    const message = event.message || "";
    if (
      message.includes("Failed to fetch") &&
      event.filename?.includes("mapbox")
    ) {
      event.preventDefault();
    }
  });
}

// This will be moved inside the component

// Calculate geographic distance between two coordinates (Haversine formula)
const calculateGeographicDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Calculate travel distance using routing API (with fallback to geographic distance)
const calculateTravelDistance = async (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): Promise<{ distance: number; travelTime?: number; isTravel: boolean }> => {
  // First check geographic distance - if it's over 10km, don't bother with routing API
  const geoDistance = calculateGeographicDistance(lat1, lng1, lat2, lng2);

  // If geographic distance is over 10km, skip routing API to save calls
  if (geoDistance > 10) {
    console.log(
      `Geographic distance ${geoDistance.toFixed(1)}km > 10km, skipping routing API`,
    );
    return { distance: geoDistance, isTravel: false };
  }

  try {
    // Use OpenRouteService (free routing API) for travel distance
    const response = await fetch(
      `https://api.openrouteservice.org/v2/directions/driving-car?api_key=5b3ce3597851110001cf6248a3b6b9b4e36b48ad9e7e4a03bebb4d75&start=${lng1},${lat1}&end=${lng2},${lat2}`,
      {
        headers: {
          Accept:
            "application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8",
        },
      },
    );

    if (response.ok) {
      const data = await response.json();
      if (data.features && data.features[0] && data.features[0].properties) {
        const route = data.features[0].properties.segments[0];
        const distanceKm = route.distance / 1000; // Convert meters to km
        const durationMinutes = route.duration / 60; // Convert seconds to minutes

        // Validate the travel distance - if it's unreasonably large, use geographic instead
        if (distanceKm > 50 || distanceKm < 0) {
          console.log(
            `Invalid travel distance ${distanceKm}km, using geographic distance ${geoDistance.toFixed(1)}km`,
          );
          return { distance: geoDistance, isTravel: false };
        }

        console.log(
          `Travel distance: ${distanceKm.toFixed(1)}km, ${durationMinutes.toFixed(0)} min (vs ${geoDistance.toFixed(1)}km geo)`,
        );
        return {
          distance: distanceKm,
          travelTime: durationMinutes,
          isTravel: true,
        };
      }
    }
  } catch (error) {
    console.log(
      "Travel distance calculation failed, using geographic distance:",
      error,
    );
  }

  // Fallback to geographic distance
  return { distance: geoDistance, isTravel: false };
};

// Backward compatibility - use geographic distance by default
const calculateDistance = calculateGeographicDistance;

export default function MapView() {
  const { places } = usePlaces();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const userLocationMarker = useRef<mapboxgl.Marker | null>(null);

  // Use places from context for map markers
  const mapPlaces = places.map((place) => ({
    id: place.id,
    name: place.name,
    location: place.location,
    type: place.type,
    rating: place.rating,
    lat: place.lat || -22.9068,
    lng: place.lng || -43.1729,
    price: place.price,
    description: place.description,
  }));
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("Todos");
  const [selectedPlace, setSelectedPlace] = useState<
    (typeof mapPlaces)[0] | null
  >(null);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isTrackingLocation, setIsTrackingLocation] = useState(false);
  const [nearestPlaces, setNearestPlaces] = useState<
    (typeof mapPlaces & { distance: number })[]
  >([]);
  const [mapboxFailed, setMapboxFailed] = useState(false); // Allow real Mapbox map

  // Filter places based on search and type
  const filteredPlaces = mapPlaces.filter((place) => {
    const matchesSearch =
      place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === "Todos" || place.type === selectedType;
    return matchesSearch && matchesType;
  });

  // Get user's current location
  const getCurrentLocation = async () => {
    setLocationError(null);
    setIsTrackingLocation(true);

    // Check if geolocation is supported
    if (!navigator.geolocation) {
      setLocationError(
        "🚫 Geolocalização não é suportada neste navegador\n\n💡 Tente usar:\n• Google Chrome\n• Safari\n• Firefox\n• Edge\n\nOu ative a localização nas configurações do navegador",
      );
      setIsTrackingLocation(false);
      return;
    }

    console.log("Starting geolocation request...");
    console.log("Navigator geolocation available:", !!navigator.geolocation);
    console.log("HTTPS:", location.protocol === "https:");
    console.log("User agent:", navigator.userAgent);

    try {
      // First check permissions if supported
      if ("permissions" in navigator) {
        try {
          const permission = await navigator.permissions.query({
            name: "geolocation",
          });
          console.log("Permission state:", permission.state);

          if (permission.state === "denied") {
            setLocationError(
              "🚫 Permissão de localização negada permanentemente\n\n📱 Para corrigir:\n• Vá em Configurações do navegador\n• Procure 'Permissões' ou 'Sites'\n• Encontre este site\n• Ative a permissão de localização\n• Atualize a página",
            );
            setIsTrackingLocation(false);
            return;
          }
        } catch (permError: any) {
          console.log(
            "Permission API not supported:",
            permError?.message || permError,
          );
        }
      }

      // Start with simple, reliable settings
      const options = {
        enableHighAccuracy: false, // Start with network-based location
        timeout: 15000, // 15 seconds
        maximumAge: 60000, // 1 minute cache
      };

      console.log("Requesting geolocation with options:", options);

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          console.log("Location found:", { latitude, longitude, accuracy });

          setUserLocation({ lat: latitude, lng: longitude });
          setIsTrackingLocation(false);
          setLocationError(null);

          // Update map center to user location
          if (map.current) {
            map.current.flyTo({
              center: [longitude, latitude],
              zoom: 15,
              duration: 1500,
            });
          }

          // Calculate nearest places with travel distance
          const calculateNearestPlaces = async () => {
            const placesWithTravelDistance = await Promise.all(
              mapPlaces.map(async (place) => {
                const travelData = await calculateTravelDistance(
                  latitude,
                  longitude,
                  place.lat,
                  place.lng,
                );
                return {
                  ...place,
                  distance: travelData.distance,
                  travelTime: travelData.travelTime,
                  isTravel: travelData.isTravel,
                };
              }),
            );

            // Sort by distance and take top 5
            const nearest = placesWithTravelDistance
              .sort((a, b) => a.distance - b.distance)
              .slice(0, 5);

            setNearestPlaces(nearest);
            console.log(
              "Nearest places calculated with travel distance:",
              nearest,
            );
          };

          // Calculate travel distances asynchronously
          calculateNearestPlaces();

          // If accuracy is poor and we used low accuracy, try high accuracy
          if (accuracy > 100 && !options.enableHighAccuracy) {
            console.log("Low accuracy location, trying high accuracy...");
            const highAccuracyOptions = {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 0,
            };

            navigator.geolocation.getCurrentPosition(
              (betterPosition) => {
                const {
                  latitude: betterLat,
                  longitude: betterLng,
                  accuracy: betterAcc,
                } = betterPosition.coords;
                console.log("Better location found:", {
                  latitude: betterLat,
                  longitude: betterLng,
                  accuracy: betterAcc,
                });

                if (betterAcc < accuracy) {
                  setUserLocation({ lat: betterLat, lng: betterLng });

                  if (map.current) {
                    map.current.flyTo({
                      center: [betterLng, betterLat],
                      zoom: 16,
                      duration: 1000,
                    });
                  }
                }
              },
              (betterError) => {
                console.log(
                  "High accuracy failed, keeping network location:",
                  betterError?.code,
                );
              },
              highAccuracyOptions,
            );
          }
        },
        (error) => {
          console.error("Geolocation error details:", {
            code: error.code,
            message: error.message,
            PERMISSION_DENIED: error.PERMISSION_DENIED || 1,
            POSITION_UNAVAILABLE: error.POSITION_UNAVAILABLE || 2,
            TIMEOUT: error.TIMEOUT || 3,
            errorType: "GeolocationPositionError",
          });

          let errorMessage = "Erro ao obter localização";

          switch (error.code) {
            case 1: // PERMISSION_DENIED
              errorMessage =
                "❌ Permissão de localização negada\n\n📱 Para ativar no celular:\n• Vá em Configurações do navegador\n• Procure por 'Permissões do site'\n• Encontre este site e ative 'Localização'\n\n💻 Para ativar no computador:\n• Clique no ícone de cadeado na barra do navegador\n• Selecione 'Permitir localização'\n• Atualize a página";
              break;
            case 2: // POSITION_UNAVAILABLE
              errorMessage =
                "📍 Sua localizaç��o não está disponível\n\n✅ Verifique se:\n• O GPS está ligado no dispositivo\n• Você tem conexão com a internet\n• Não está em local fechado (shopping, subsolo)\n• Tente sair ao ar livre por alguns segundos";
              break;
            case 3: // TIMEOUT
              errorMessage =
                "⏱️ GPS demorou para responder\n\n🔄 Dicas:\n• Aguarde alguns segundos e tente novamente\n• Saia ao ar livre se estiver em local fechado\n• Verifique sua conexão com a internet\n• No celular pode demorar mais que no computador";
              break;
            default:
              errorMessage = `🚨 Erro de localização\n\nCódigo: ${error.code}\nDetalhes: ${error.message || "Erro desconhecido"}\n\n💡 Tente:\n• Atualizar a página\n• Verificar permissões do navegador\n• Usar outro navegador`;
          }

          // Try again with lower accuracy if the first attempt failed
          if (error.code === 3 && options.enableHighAccuracy) {
            console.log("High accuracy failed, trying with lower accuracy...");

            const fallbackOptions = {
              enableHighAccuracy: false,
              timeout: 30000,
              maximumAge: 60000,
            };

            navigator.geolocation.getCurrentPosition(
              (position) => {
                const { latitude, longitude, accuracy } = position.coords;
                console.log("Fallback location found:", {
                  latitude,
                  longitude,
                  accuracy,
                });

                setUserLocation({ lat: latitude, lng: longitude });
                setIsTrackingLocation(false);
                setLocationError(null);

                // Update map center to user location
                if (map.current) {
                  map.current.flyTo({
                    center: [longitude, latitude],
                    zoom: 15,
                    duration: 1500,
                  });
                }

                // Calculate nearest places with travel distance
                const calculateNearestPlaces = async () => {
                  const placesWithTravelDistance = await Promise.all(
                    mapPlaces.map(async (place) => {
                      const travelData = await calculateTravelDistance(
                        latitude,
                        longitude,
                        place.lat,
                        place.lng,
                      );
                      return {
                        ...place,
                        distance: travelData.distance,
                        travelTime: travelData.travelTime,
                        isTravel: travelData.isTravel,
                      };
                    }),
                  );

                  const nearest = placesWithTravelDistance
                    .sort((a, b) => a.distance - b.distance)
                    .slice(0, 5);

                  setNearestPlaces(nearest);
                };

                calculateNearestPlaces();
              },
              (fallbackError) => {
                console.error("Fallback geolocation also failed:", {
                  code: fallbackError.code,
                  message: fallbackError.message,
                  errorType: "FallbackGeolocationError",
                });
                setLocationError(errorMessage);
                setIsTrackingLocation(false);
              },
              fallbackOptions,
            );
          } else {
            setLocationError(errorMessage);
            setIsTrackingLocation(false);
          }
        },
        options,
      );
    } catch (err) {
      console.error("Error in getCurrentLocation:", err);
      setLocationError("Erro ao acessar a localização. Tente novamente.");
      setIsTrackingLocation(false);
    }
  };

  // Open navigation to a place
  const navigateToPlace = (place: (typeof mapPlaces)[0]) => {
    if (!userLocation) {
      alert(
        "Sua localização é necessária para navegação. Clique em 'Minha Localização' primeiro.",
      );
      return;
    }

    // Create Google Maps navigation URL
    const googleMapsUrl = `https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${place.lat},${place.lng}`;
    window.open(googleMapsUrl, "_blank");
  };

  useEffect(() => {
    if (!mapContainer.current || mapboxFailed) return;

    try {
      console.log("Initializing Mapbox map...");

      // Disable telemetry before creating map
      // @ts-ignore
      if (mapboxgl.config) {
        // @ts-ignore
        mapboxgl.config.EVENTS_URL = false;
      }

      // Initialize map
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [-43.1729, -22.9068], // Rio de Janeiro
        zoom: 12,
        attributionControl: false,
        // Disable telemetry at map level too
        trackResize: true,
        // @ts-ignore - disable events
        collectResourceTiming: false,
      });

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

      // Handle errors gracefully without breaking the map
      map.current.on("error", (e) => {
        const error = e.error || e;
        console.warn("Mapbox encountered an issue:", error);

        // Only fallback for critical errors, not telemetry issues
        if (
          error &&
          error.message &&
          !error.message.includes("fetch") &&
          !error.message.includes("telemetry") &&
          !error.message.includes("events")
        ) {
          console.log("Critical map error, falling back to visual map...");
          setMapboxFailed(true);
        } else {
          console.log("Non-critical error, continuing with map...");
        }
      });

      // Set a timeout to fallback if map doesn't load
      const loadTimeout = setTimeout(() => {
        if (map.current && !map.current.loaded()) {
          console.log("Mapbox load timeout, falling back to visual map...");
          setMapboxFailed(true);
        }
      }, 10000); // 10 second timeout

      map.current.on("load", () => {
        clearTimeout(loadTimeout);
        console.log("Mapbox map loaded successfully");
        addMarkersToMap();
        if (userLocation) {
          addUserLocationMarker();
        }
      });
    } catch (error) {
      console.error("Failed to initialize Mapbox:", error);
      setMapboxFailed(true);
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }

      // Cleanup global error handlers
      // @ts-ignore
      if (window.__mapboxTelemetryHandler) {
        // @ts-ignore
        window.removeEventListener(
          "unhandledrejection",
          window.__mapboxTelemetryHandler,
        );
      }
      // @ts-ignore
      if (window.__mapboxErrorHandler) {
        // @ts-ignore
        window.removeEventListener("error", window.__mapboxErrorHandler);
      }
    };
  }, [mapboxFailed]);

  // Update markers when places change
  useEffect(() => {
    if (!mapboxFailed && map.current) {
      addMarkersToMap();
    }
  }, [filteredPlaces, mapboxFailed]);

  // Update user location marker when location changes
  useEffect(() => {
    if (!mapboxFailed && map.current && userLocation) {
      addUserLocationMarker();
    }
  }, [userLocation, mapboxFailed]);

  const addUserLocationMarker = () => {
    if (!map.current || !userLocation) return;

    try {
      // Remove existing user location marker
      if (userLocationMarker.current) {
        userLocationMarker.current.remove();
      }

      // Create user location marker element
      const userMarkerElement = document.createElement("div");
      userMarkerElement.className = "user-location-marker";

      // Apply styles via properties instead of innerHTML for CSP safety
      const markerDiv = document.createElement("div");
      markerDiv.style.width = "20px";
      markerDiv.style.height = "20px";
      markerDiv.style.backgroundColor = "#3b82f6";
      markerDiv.style.border = "3px solid white";
      markerDiv.style.borderRadius = "50%";
      markerDiv.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.3)";

      userMarkerElement.appendChild(markerDiv);

      // Create user location marker
      userLocationMarker.current = new mapboxgl.Marker(userMarkerElement)
        .setLngLat([userLocation.lng, userLocation.lat])
        .addTo(map.current);
    } catch (error) {
      console.warn("Error adding user location marker:", error);
    }
  };

  const addMarkersToMap = () => {
    if (!map.current) return;

    try {
      // Clear existing markers (but keep user location marker)
      markers.current.forEach((marker) => {
        try {
          marker.remove();
        } catch (e) {
          console.warn("Error removing marker:", e);
        }
      });
      markers.current = [];

      // Add markers for filtered places
      filteredPlaces.forEach((place) => {
        try {
          // Create a custom marker element using DOM properties instead of innerHTML
          const markerElement = document.createElement("div");
          markerElement.className = "custom-marker";

          // Color based on distance if user location is available
          const distanceFromUser = userLocation
            ? calculateDistance(
                userLocation.lat,
                userLocation.lng,
                place.lat,
                place.lng,
              )
            : null;
          const isNearby = distanceFromUser && distanceFromUser <= 5; // Within 5km
          const markerColor = isNearby ? "#10b981" : "#ef4444"; // Green if nearby, red otherwise

          // Create marker container
          const markerContainer = document.createElement("div");
          markerContainer.style.width = "32px";
          markerContainer.style.height = "32px";
          markerContainer.style.backgroundColor = markerColor;
          markerContainer.style.border = "2px solid white";
          markerContainer.style.borderRadius = "50%";
          markerContainer.style.display = "flex";
          markerContainer.style.alignItems = "center";
          markerContainer.style.justifyContent = "center";
          markerContainer.style.boxShadow = "0 2px 4px rgba(0,0,0,0.3)";
          markerContainer.style.cursor = "pointer";
          markerContainer.style.position = "relative";

          // Create SVG icon
          const svg = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "svg",
          );
          svg.setAttribute("width", "16");
          svg.setAttribute("height", "16");
          svg.setAttribute("viewBox", "0 0 24 24");
          svg.setAttribute("fill", "white");

          const path1 = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "path",
          );
          path1.setAttribute(
            "d",
            "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z",
          );

          const circle = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "circle",
          );
          circle.setAttribute("cx", "12");
          circle.setAttribute("cy", "10");
          circle.setAttribute("r", "3");

          svg.appendChild(path1);
          svg.appendChild(circle);
          markerContainer.appendChild(svg);

          // Create rating badge
          const ratingBadge = document.createElement("div");
          ratingBadge.style.position = "absolute";
          ratingBadge.style.top = "-8px";
          ratingBadge.style.right = "-8px";
          ratingBadge.style.width = "20px";
          ratingBadge.style.height = "20px";
          ratingBadge.style.background = "white";
          ratingBadge.style.border = `2px solid ${markerColor}`;
          ratingBadge.style.borderRadius = "50%";
          ratingBadge.style.display = "flex";
          ratingBadge.style.alignItems = "center";
          ratingBadge.style.justifyContent = "center";
          ratingBadge.style.fontSize = "10px";
          ratingBadge.style.fontWeight = "bold";
          ratingBadge.style.color = markerColor;
          ratingBadge.textContent = place.rating.toString();

          markerContainer.appendChild(ratingBadge);
          markerElement.appendChild(markerContainer);

          // Create simple popup without complex inline onclick
          const distanceText = distanceFromUser
            ? `\n📍 ${distanceFromUser.toFixed(1)}km de você`
            : "";

          const popupContent = document.createElement("div");
          popupContent.style.padding = "8px";
          popupContent.style.minWidth = "200px";

          const title = document.createElement("h3");
          title.textContent = place.name;
          title.style.margin = "0 0 8px 0";
          title.style.fontWeight = "bold";
          title.style.color = "#1f2937";
          popupContent.appendChild(title);

          const info = document.createElement("p");
          info.textContent = `${place.type} • ⭐ ${place.rating}\n${place.location}${distanceText}`;
          info.style.margin = "0";
          info.style.fontSize = "12px";
          info.style.color = "#6b7280";
          info.style.lineHeight = "1.4";
          info.style.whiteSpace = "pre-line";
          popupContent.appendChild(info);

          if (place.description) {
            const desc = document.createElement("p");
            desc.textContent = place.description;
            desc.style.margin = "8px 0 0 0";
            desc.style.fontSize = "12px";
            desc.style.color = "#6b7280";
            desc.style.lineHeight = "1.4";
            popupContent.appendChild(desc);
          }

          const popup = new mapboxgl.Popup({ offset: 25 }).setDOMContent(
            popupContent,
          );

          // Create marker
          const marker = new mapboxgl.Marker(markerElement)
            .setLngLat([place.lng, place.lat])
            .setPopup(popup)
            .addTo(map.current!);

          // Add click event to marker
          markerElement.addEventListener("click", () => {
            setSelectedPlace(place);
          });

          markers.current.push(marker);
        } catch (error) {
          console.warn("Error creating marker for place:", place.name, error);
        }
      });
    } catch (error) {
      console.error("Error adding markers to map:", error);
    }
  };

  const flyToPlace = (place: (typeof mapPlaces)[0]) => {
    if (map.current) {
      map.current.flyTo({
        center: [place.lng, place.lat],
        zoom: 15,
        duration: 1000,
      });
      setSelectedPlace(place);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            GPS dos Restaurantes
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Encontre restaurantes próximos à sua localização com GPS
          </p>
        </div>

        {/* Location Controls */}
        <div className="flex gap-2">
          <Button
            onClick={getCurrentLocation}
            disabled={isTrackingLocation}
            variant={userLocation ? "default" : "outline"}
            className="flex items-center gap-2"
          >
            {isTrackingLocation ? (
              <div className="animate-spin h-4 w-4 border-2 border-primary-600 border-t-transparent rounded-full" />
            ) : userLocation ? (
              <LocateFixed className="h-4 w-4 text-green-500" />
            ) : (
              <LocateFixed className="h-4 w-4" />
            )}
            {isTrackingLocation
              ? "Localizando..."
              : userLocation
                ? "Localização Ativa"
                : "Ativar Localização"}
          </Button>
          {locationError && (
            <Button
              onClick={getCurrentLocation}
              disabled={isTrackingLocation}
              variant="outline"
              size="sm"
              className="text-xs"
            >
              Tentar Novamente
            </Button>
          )}
        </div>
      </div>

      {/* Location Error */}
      {locationError && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="text-amber-500 mt-0.5">📍</div>
            <div className="flex-1">
              <h3 className="font-medium text-amber-800 dark:text-amber-200 mb-1">
                Problema com a Localização
              </h3>
              <pre className="text-amber-700 dark:text-amber-300 text-sm mb-3 whitespace-pre-wrap font-sans">
                {locationError}
              </pre>
              <div className="space-y-1 text-xs text-amber-600 dark:text-amber-400">
                <p>
                  💡 <strong>Informações do sistema:</strong>
                </p>
                <p>
                  • Navegador:{" "}
                  {navigator.userAgent.includes("Mobile")
                    ? "Mobile"
                    : "Desktop"}
                </p>
                <p>
                  • HTTPS:{" "}
                  {location.protocol === "https:"
                    ? "Sim"
                    : "Não (necessário para GPS)"}
                </p>
                <p>
                  • Geolocalização suportada:{" "}
                  {navigator.geolocation ? "Sim" : "Não"}
                </p>
                <hr className="my-2 border-amber-300/50" />
                <p>
                  🎯 <strong>Sem GPS você ainda pode:</strong>
                </p>
                <p>• Ver todos os restaurantes no mapa visual</p>
                <p>• Navegar para qualquer lugar</p>
                <p>• Usar todas as funcionalidades normalmente</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Nearest Places Alert */}
      {nearestPlaces.length > 0 && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">
            🎯 Restaurantes Próximos a Você
          </h3>
          <div className="space-y-2">
            {nearestPlaces.slice(0, 3).map((place) => (
              <div key={place.id} className="flex items-center justify-between">
                <div>
                  <span className="font-medium text-green-700 dark:text-green-300">
                    {place.name}
                  </span>
                  <div className="text-green-600 dark:text-green-400 text-sm ml-2">
                    <span>
                      {place.distance.toFixed(1)}km
                      {place.isTravel ? " 🚗" : " ✈️"}
                    </span>
                    {place.travelTime && (
                      <span className="ml-1">
                        • {place.travelTime.toFixed(0)} min
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => flyToPlace(place)}
                    className="text-xs"
                  >
                    Ver no Mapa
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => navigateToPlace(place)}
                    className="text-xs"
                  >
                    <Route className="h-3 w-3 mr-1" />
                    Navegar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar restaurantes no mapa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12"
            />
          </div>
        </div>

        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger>
            <SelectValue placeholder="Tipo de Comida" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Todos">Todos os Tipos</SelectItem>
            <SelectItem value="Fine Dining">Fine Dining</SelectItem>
            <SelectItem value="Pizzaria">Pizzaria</SelectItem>
            <SelectItem value="Confeitaria">Confeitaria</SelectItem>
            <SelectItem value="Churrascaria">Churrascaria</SelectItem>
            <SelectItem value="Boteco">Boteco</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Map Container */}
      <div className="relative rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
        {mapboxFailed ? (
          <FallbackMap
            places={filteredPlaces}
            userLocation={userLocation}
            onPlaceSelect={setSelectedPlace}
            onNavigate={navigateToPlace}
          />
        ) : (
          <div ref={mapContainer} className="w-full h-[600px]" />
        )}

        {/* Map Legend */}
        <div className="absolute top-4 left-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-gray-700 dark:text-gray-300">
                Sua Localização
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-700 dark:text-gray-300">
                Próximo (≤5km)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-gray-700 dark:text-gray-300">
                Outros Lugares
              </span>
            </div>
          </div>
        </div>

        {/* Place Info Popup - only show for Mapbox, FallbackMap handles its own */}
        {selectedPlace && !mapboxFailed && (
          <div className="absolute bottom-4 left-4 right-4 lg:left-4 lg:right-auto lg:w-80 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-4 z-20">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                {selectedPlace.name}
              </h3>
              <button
                onClick={() => setSelectedPlace(null)}
                className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 text-xl leading-none"
              >
                ×
              </button>
            </div>

            <div className="flex items-center gap-2 mb-2">
              <Badge
                variant="secondary"
                className="dark:bg-primary-800 dark:text-primary-100"
              >
                {selectedPlace.type}
              </Badge>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="text-sm font-medium">
                  {selectedPlace.rating}
                </span>
              </div>
              {selectedPlace.price && (
                <Badge variant="outline">{selectedPlace.price}</Badge>
              )}
            </div>

            <div className="flex items-center gap-1 mb-3">
              <MapPin className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {selectedPlace.location}
              </span>
              {userLocation && (
                <span className="text-sm text-green-600 dark:text-green-400 font-medium ml-2">
                  {calculateDistance(
                    userLocation.lat,
                    userLocation.lng,
                    selectedPlace.lat,
                    selectedPlace.lng,
                  ).toFixed(1)}
                  km
                </span>
              )}
            </div>

            {selectedPlace.description && (
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                {selectedPlace.description}
              </p>
            )}

            <div className="flex gap-2">
              <FavoriteButton placeId={selectedPlace.id} size="sm" />
              <VisitedButton placeId={selectedPlace.id} size="sm" />
              {userLocation && (
                <Button
                  size="sm"
                  onClick={() => navigateToPlace(selectedPlace)}
                  className="flex items-center gap-1"
                >
                  <Route className="h-3 w-3" />
                  Navegar
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Places List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Lugares no Mapa ({filteredPlaces.length})
          {userLocation && " - Ordenados por Distância"}
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(userLocation
            ? filteredPlaces
                .map((place) => ({
                  ...place,
                  distance: calculateDistance(
                    userLocation.lat,
                    userLocation.lng,
                    place.lat,
                    place.lng,
                  ),
                }))
                .sort((a, b) => a.distance - b.distance)
            : filteredPlaces
          ).map((place) => (
            <div
              key={place.id}
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary-300 transition-colors cursor-pointer"
              onClick={() => flyToPlace(place)}
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-gray-900 dark:text-gray-100">
                  {place.name}
                </h4>
                <FavoriteButton placeId={place.id} size="sm" />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                {place.location}
                {userLocation && "distance" in place && (
                  <span className="block text-green-600 dark:text-green-400 font-medium">
                    📍 {(place as any).distance.toFixed(1)}km de você
                  </span>
                )}
              </p>
              <div className="flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className="text-xs dark:bg-primary-800 dark:text-primary-100"
                >
                  {place.type}
                </Badge>
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 text-yellow-400 fill-current" />
                  <span className="text-xs">{place.rating}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
