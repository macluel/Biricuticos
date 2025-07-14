// 🎯 CUSTOMIZE YOUR APP HERE!
// This file contains all the data you can easily modify to personalize your food guide

// ===== APP BRANDING =====
export const appConfig = {
  name: "Biricuticos",
  tagline: "Nossa lista gastronômica",
  description:
    "Nossa coleção pessoal de lugares incríveis que queremos conhecer juntos. ❤️",
};

// ===== STATISTICS =====
export const stats = {
  totalPlaces: 5,
  triedTogether: 0,
  wantToTry: 5,
};

// ===== FOOD CATEGORIES =====
export const categories = [
  { name: "Fine Dining", count: 1, icon: "🍽️" },
  { name: "Pizzaria", count: 1, icon: "🍕" },
  { name: "Confeitaria", count: 1, icon: "🧁" },
  { name: "Churrascaria", count: 2, icon: "🥩" },
  { name: "Botecos", count: 0, icon: "🍺" },
  { name: "Açaí", count: 0, icon: "🫐" },
  { name: "Pastelaria", count: 1, icon: "🥟" },
  { name: "Hamburgueria", count: 1, icon: "🍔" },
];

// ===== FILTER OPTIONS =====
export const filterOptions = {
  placeTypes: [
    "Todos",
    "Fine Dining",
    "Pizzaria",
    "Confeitaria",
    "Churrascaria",
    "Botecos",
    "Galeto",
    "Açaí",
    "Cafeteria",
    "Padaria",
    "Pastelaria",
    "Hamburgueria",
  ],
  states: [
    "Todos",
    "Rio de Janeiro",
    "São Paulo",
    "Minas Gerais",
    "Bahia",
    "Pernambuco",
    "Rio Grande do Sul",
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
      "https://res.cloudinary.com/dg6jtjgzr/image/upload/v1752519056/487459308_122118852074768421_4916690963563226743_n_qtuwbd.jpg",
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
      "https://res.cloudinary.com/dg6jtjgzr/image/upload/v1752519057/491438143_18064315673487075_9140240618207150797_n_rar4xp.jpg",
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
    name: "NaBrasa Oro - Camboinhas",
    location: "Camboinhas, Niterói",
    fullAddress:
      "Av. Professor Carlos Nelson Ferreira dos Santos, 125 - Lj 131 - Camboinhas, Niterói - RJ, 24358-705",
    state: "Rio de Janeiro",
    type: "Churrascaria",
    price: "$$$",
    image:
      "https://res.cloudinary.com/dg6jtjgzr/image/upload/v1752519056/479978311_18271622911254932_5467649839238398457_n_akvt2j.jpg",
    // Contact Information
    phone: "(21) 98934-3750",
    instagram: "@nabrasa.oro",
    whatsapp: "5521989343750",
    website: "nabrasalinks.idlab.art.br",
    // Quality tags for visited places
    qualityTags: [
      "Massa fininha",
      "Ingredientes frescos",
      "Boa quantidade",
      "Temperatura certa",
    ],
    // Tags for places never visited (reasons to go)
    wishlistTags: ["Placeholder"],
    tags: ["churrasco"],
    lat: -22.952132058659256,
    lng: -43.058341506339886,
  },
  {
    id: 4,
    name: "NaBrasa Oro - Piratininga",
    location: "Piratininga, Niterói",
    fullAddress:
      "Av. Alm Tamandaré, 657 - Piratininga, Niterói - RJ, 24350-380",
    state: "Rio de Janeiro",
    type: "Churrascaria",
    price: "$$$",
    image:
      "https://res.cloudinary.com/dg6jtjgzr/image/upload/v1752519056/479978311_18271622911254932_5467649839238398457_n_akvt2j.jpg",
    // Contact Information
    phone: "(21) 97586-7354",
    instagram: "@nabrasa.oro",
    whatsapp: "5521975867354",
    website: "nabrasalinks.idlab.art.br",
    // Quality tags for visited places
    qualityTags: [
      "Massa fininha",
      "Ingredientes frescos",
      "Boa quantidade",
      "Temperatura certa",
    ],
    // Tags for places never visited (reasons to go)
    wishlistTags: ["Placeholder"],
    tags: ["churrasco"],
    lat: -22.94685009938863,
    lng: -43.057571362161916,
  },
  {
    id: 5,
    name: "Dainer",
    location: "Botafogo, Rio de Janeiro",
    fullAddress:
      "R. Real Grandeza, 193 - Botafogo, Rio de Janeiro - RJ, 22281-033",
    state: "Rio de Janeiro",
    type: "Fine Dining",
    price: "$$",
    image:
      "https://res.cloudinary.com/dg6jtjgzr/image/upload/v1752519056/487164950_17962384988863876_7463303187188727839_n_j90kmo.jpg",
    // Contact Information
    instagram: "@dainer.restaurante",
    website: "widget.getinapp.com.br/yPAMKXPz?fbclid=PAZXh0bgNhZW0CMTEAAabSDjZ-UcOqH09rBJkR9Y48_-YOoGNiPkqOsTc_HanFFnLQFgRY40e2NCQ_aem_AU8SZbR3huNWq1jLadG76osTraxSVVnVT2X-8VY2jEB6Z6bJByrqyOE_VerPa1n41GyQQUM5-PXQ9KuCUDTEBtU7",
    // Quality tags for visited places
    qualityTags: [
      "Massa fininha",
      "Ingredientes frescos",
      "Boa quantidade",
      "Temperatura certa",
    ],
    // Tags for places never visited (reasons to go)
    wishlistTags: ["Placeholder"],
    tags: ["churrasco"],
    lat: -22.955274352666493,
    lng: -43.19241061177635,
  },
  {
    id: 6,
    name: "The House",
    location: "Gragoatá, Niterói",
    fullAddress:
      "R. Cel. Tamarindo, 43 - Gragoatá, Niterói - RJ, 24210-380",
    state: "Rio de Janeiro",
    type: "Hamburgueria",
    price: "$$",
    image:
      "https://res.cloudinary.com/dg6jtjgzr/image/upload/v1752519056/487164950_17962384988863876_7463303187188727839_n_j90kmo.jpg",
    // Contact Information
    instagram: "@thehouseniteroi",
    // Quality tags for visited places
    qualityTags: [
      "Massa fininha",
      "Ingredientes frescos",
      "Boa quantidade",
      "Temperatura certa",
    ],
    // Tags for places never visited (reasons to go)
    wishlistTags: ["Placeholder"],
    tags: ["hamburguer"],
    lat: -22.901495660294685,
    lng: -43.13294901869038,
  },
  /*
  {
    id: 5,
    name: "Bartô",
    location: "",
    fullAddress:
      "",
    state: "Rio de Janeiro",
    type: "Boteco",
    price: "$$$",
    image:
      "https://instagram.fsdu24-1.fna.fbcdn.net/v/t51.2885-15/484505250_18035529563532032_502048064740952570_n.jpg?stp=dst-jpg_e35_tt6&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0uaW1hZ2VfdXJsZ2VuLjEwODB4MTM1MC5zZHIuZjc1NzYxLmRlZmF1bHRfaW1hZ2UifQ&_nc_ht=instagram.fsdu24-1.fna.fbcdn.net&_nc_cat=108&_nc_oc=Q6cZ2QEz9m-218k5wJyywt8SUgHjtFy0ZZNbM_RsZcSPAUAu-qVQrzs3iXhO_4Ck6Yaa9wg&_nc_ohc=uZTSonWUDKgQ7kNvwEMs9mx&_nc_gid=YOEq6Uw8FinYb608juNOgQ&edm=APs17CUBAAAA&ccb=7-5&ig_cache_key=MzU4ODM0OTM0NjA3ODU0ODY1Mw%3D%3D.3-ccb7-5&oh=00_AfRW124k3lYR7zMJn_C3m8uQux-gcO4Ik_PeJzzwx8zAKw&oe=687AFC22&_nc_sid=10d13b",
    // Contact Information
    phone: "",
    instagram: "@barto.galatico",
    whatsapp: "",
    website: "usetag.me/barto",
    // Quality tags for visited places
    qualityTags: [
      "Massa fininha",
      "Ingredientes frescos",
      "Boa quantidade",
      "Temperatura certa",
    ],
    // Tags for places never visited (reasons to go)
    wishlistTags: [""],
    tags: ["churrasco"],
    lat: , 
    lng: ,
  },
  */
];

// Function to get all places including user-added ones
export function getAllPlaces() {
  const userAddedPlaces = JSON.parse(
    localStorage.getItem("user-added-places") || "[]"
  );
  return [...defaultPlaces, ...userAddedPlaces];
}

// Export default places for backwards compatibility and initial render
export const places = defaultPlaces;

// ===== MAP CONFIGURATION =====
export const mapConfig = {
  defaultCenter: {
    lat: -22.9068,
    lng: -43.1729,
  },
  defaultZoom: 12,
};

// ===== NAVIGATION ITEMS =====
export const navigationItems = [
  {
    name: "Início",
    href: "/",
    icon: "Home",
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
];
