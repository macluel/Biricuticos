// 🎯 CUSTOMIZE YOUR APP HERE!
// This file contains all the data you can easily modify to personalize your food guide

// ===== APP BRANDING =====
export const appConfig = {
  name: "Biricuticos", // Change this to your preferred app name
  tagline: "Nossa lista gastronômica", // Your tagline
  description:
    "Nossa coleção pessoal de lugares incríveis que queremos conhecer juntos. ❤️",
};

// ===== STATISTICS =====
export const stats = {
  totalPlaces: 3,
  triedTogether: 0,
  wantToTry: 3,
};

// ===== FOOD CATEGORIES =====
export const categories = [
  { name: "Fine Dining", count: 1, icon: "🍽️" },
  { name: "Pizzaria", count: 1, icon: "🍕" },
  { name: "Confeitaria", count: 1, icon: "🧁" },
  { name: "Churrascaria", count: 0, icon: "🥩" },
  { name: "Botecos", count: 0, icon: "🍺" },
  { name: "Açaí", count: 0, icon: "🫐" },
];

// ===== FILTER OPTIONS =====
export const filterOptions = {
  placeTypes: [
    "Todos",
    "Fine Dining",
    "Pizzaria",
    "Confeitaria",
    "Churrascaria",
    "Boteco",
    "Galeto",
    "Açaí",
    "Cafeteria",
    "Padaria",
    // Add more types as needed
  ],
  states: [
    "Todos",
    "Rio de Janeiro",
    "São Paulo",
    "Minas Gerais",
    "Bahia",
    "Pernambuco",
    "Rio Grande do Sul",
    // Add more states as needed
  ],
  priceRanges: ["Todos", "$", "$$", "$$$", "$$$$"],
};

// ===== YOUR FOOD PLACES =====
const defaultPlaces = [
  {
    id: 1,
    name: "Oro",
    location: "Leblon, Rio de Janeiro",
    fullAddress: "Rua Humaitá, 462 - Leblon, Rio de Janeiro - RJ, 22261-001",
    state: "Rio de Janeiro",
    type: "Fine Dining",
    price: "$$$",
    image:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop",
    // Contact Information
    phone: "(21) 2540-8768",
    instagram: "@ororestaurante",
    whatsapp: "+5521998887777",
    website: "https://www.ororestaurante.com.br",
    // Quality tags for visited places
    qualityTags: [
      "Comida saborosa",
      "Bem temperada",
      "Boa aparência",
      "Bons ingredientes",
    ],
    // Tags for places never visited (reasons to go)
    wishlistTags: ["Estrela Michelin", "Alta gastronomia", "Chef renomado"],
    tags: ["brasileiro", "fine-dining", "leblon"],
    // For map positioning (Rio de Janeiro coordinates)
    lat: -22.9868,
    lng: -43.2096,
  },
  {
    id: 2,
    name: "Pizzaria Guanabara",
    location: "Copacabana, Rio de Janeiro",
    fullAddress:
      "Av. Atlântica, 1702 - Copacabana, Rio de Janeiro - RJ, 22021-001",
    state: "Rio de Janeiro",
    type: "Pizzaria",
    price: "$$",
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop",
    // Contact Information
    phone: "(21) 2548-9747",
    instagram: "@pizzariaguanabara",
    whatsapp: "+5521987654321",
    website: "https://www.pizzariaguanabara.com.br",
    // Quality tags for visited places
    qualityTags: [
      "Massa fininha",
      "Ingredientes frescos",
      "Boa quantidade",
      "Temperatura certa",
    ],
    // Tags for places never visited (reasons to go)
    wishlistTags: ["Tradição carioca", "Pizza famosa", "Desde 1969"],
    tags: ["pizza", "tradicional", "carioca"],
    lat: -22.9068,
    lng: -43.1729,
  },
  {
    id: 3,
    name: "Confeitaria Colombo",
    location: "Centro, Rio de Janeiro",
    fullAddress:
      "R. Gonçalves Dias, 32 - Centro, Rio de Janeiro - RJ, 20050-030",
    state: "Rio de Janeiro",
    type: "Confeitaria",
    price: "$$",
    image:
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop",
    // Contact Information
    phone: "(21) 2505-1500",
    instagram: "@confeitariacolombo",
    whatsapp: "+5521912345678",
    website: "https://www.confeitariacolombo.com.br",
    // Quality tags for visited places
    qualityTags: [
      "Doces tradicionais",
      "Boa aparência",
      "Arquitetura belle époque",
      "Ambiente histórico",
    ],
    // Tags for places never visited (reasons to go)
    wishlistTags: ["Local histórico", "Confeitaria de 1894", "Doces famosos"],
    tags: ["confeitaria", "histórica", "doces"],
    lat: -22.9035,
    lng: -43.176,
  },
  // ✨ ADD YOUR OWN PLACES HERE! ✨
  // Copy the format above and add as many places as you want
  /*
  {
    id: 4,
    name: "Seu Restaurante",
    location: "Seu Bairro, Sua Cidade",
    state: "Seu Estado", 
    type: "Tipo de Comida",
    rating: 4.5,
    reviews: 1000,
    price: "$$",
    image: "URL_DA_IMAGEM",
    description: "Sua descrição aqui",
    tags: ["tag1", "tag2", "tag3"],
    lat: -22.0000, // Coordenada latitude
    lng: -43.0000, // Coordenada longitude
  },
    */
];

// Function to get all places including user-added ones
export function getAllPlaces() {
  const userAddedPlaces = JSON.parse(
    localStorage.getItem("user-added-places") || "[]",
  );
  return [...defaultPlaces, ...userAddedPlaces];
}

// Export default places for backwards compatibility and initial render
export const places = defaultPlaces;

// ===== MAP CONFIGURATION =====
export const mapConfig = {
  // Default center for your map (currently set to Rio de Janeiro)
  defaultCenter: {
    lat: -22.9068,
    lng: -43.1729,
  },
  // Zoom level (higher = more zoomed in)
  defaultZoom: 12,
};

// ===== NAVIGATION ITEMS =====
export const navigationItems = [
  
];
