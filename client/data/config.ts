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
  { name: "Pastelaria", count: 1, icon: "🥟" },
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
    "Pastelaria",
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
    name: "Pastel Carioca",
    location: "Icaraí, Niterói",
    fullAddress: "R. Geraldo Martins, 176 - Icaraí, Niterói - RJ, 24220-380",
    state: "Rio de Janeiro",
    type: "Pastelaria",
    price: "$$",
    image:
      "https://instagram.fsdu24-1.fna.fbcdn.net/v/t39.30808-6/487459308_122118852074768421_4916690963563226743_n.jpg?stp=dst-jpg_e35_s640x640_sh0.08_tt6&efg=eyJ2ZW5jb2RlX3RhZyI6IkZFRUQuaW1hZ2VfdXJsZ2VuLjIwNDh4MTM1Ni5zZHIuZjMwODA4LmRlZmF1bHRfaW1hZ2UifQ&_nc_ht=instagram.fsdu24-1.fna.fbcdn.net&_nc_cat=109&_nc_oc=Q6cZ2QFsqntv39zTt8ooliyxwTgsFnNflMQX66wLXm88Z7CUEr0HzBUux5Ncbr7ZVEgegUU&_nc_ohc=jj4bkdNFWjAQ7kNvwECMSm_&_nc_gid=ZXP0m-UwBc2eMsvGSb-emQ&edm=APoiHPcAAAAA&ccb=7-5&ig_cache_key=MzYwMTIyNjAzOTc3MjM4NDI2NA%3D%3D.3-ccb7-5&oh=00_AfRfRHTluUAUDAOpTHLquDCkzlBlSzC5sM_p2fIYizXLqw&oe=6879EDAD&_nc_sid=22de04 640w",
    // Contact Information
    phone: "(21) 98604-8063",
    instagram: "@pastelcariocaniteroi",
    whatsapp: "+5521986048063",
    website: "https://www.linktr.ee/pastelcarioca",
    // Quality tags for visited places
    qualityTags: [
      "Comida saborosa",
      "Bem temperada",
      "Boa aparência",
      "Bons ingredientes",
    ],
    // Tags for places never visited (reasons to go)
    wishlistTags: ["Cara boa"],
    tags: ["brasileiro", "perto", "pastel", "niterói"],
    // For map positioning (Rio de Janeiro coordinates)
    lat: -22.902202162336444,
    lng: -43.10172335348864,
  },
  {
    id: 2,
    name: "Mr Cone",
    location: "Barreto, Niterói",
    fullAddress:
      "R. Dr. March, 1 - Barreto, Niterói - RJ, 24410-650",
    state: "Rio de Janeiro",
    type: "Pizzaria",
    price: "$$",
    image:
      "https://scontent.cdninstagram.com/v/t51.75761-15/491438143_18064315673487075_9140240618207150797_n.jpg?stp=dst-jpg_e15_tt6&_nc_cat=111&ig_cache_key=MzYxNDQ3MzkxNzk3NDIwOTY2Mw%3D%3D.3-ccb1-7&ccb=1-7&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjIyNjh4NDAzMi5zZHIifQ%3D%3D&_nc_ohc=IDLoLGn-Qc8Q7kNvwF6xRrI&_nc_oc=AdmvdfNS-_MNvJE9_MTa23QqLkpfcSi4dqpKOsZuK8cIb1rkrlKkLWVpNi93g4xCrx0&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent.cdninstagram.com&_nc_gid=_TQJCPZX5ZbxaBtFc0vDlA&oh=00_AfSXy3WXVDYK848AFhAZeZb-XDDotICchlnM41uNUeQABA&oe=6879E9B1",
    // Contact Information
    phone: "(21) 96714-7357",
    instagram: "@mrconepizzas",
    whatsapp: "5521967147357",
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
    lat: -22.8598387958669,
    lng: -43.101097537630785,
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
  {
    name: "Início",
    href: "/",
    icon: "Home", // Icon name from Lucide React
  },
  {
    name: "Restaurantes",
    href: "/catalog",
    icon: "UtensilsCrossed",
  },
  {
    name: "Favoritos",
    href: "/favorites",
    icon: "heart",
  },
  {
    name: "Mapa",
    href: "/map",
    icon: "Map",
  },
  // Add more navigation items if needed
];
