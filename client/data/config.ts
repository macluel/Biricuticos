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
      "https://res.cloudinary.com/dg6jtjgzr/image/upload/v1752520496/466547258_17900922300080173_3660658923503141199_n_ia7i5y.jpg",
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
  {
    id: 7,
    name: "Nosso Bar",
    location: "Piratininga, Niterói",
    fullAddress:
      "Av. Alm Tamandaré, 360 - 113 - Piratininga, Niterói - RJ, 24350-380",
    state: "Rio de Janeiro",
    type: "Botecos",
    price: "$$",
    image:
      "https://res.cloudinary.com/dg6jtjgzr/image/upload/v1752693871/503734421_1325751629553041_6320010109812966470_n_itujml.jpg",
    // Contact Information
    phone: "(21) 96820-1043",
    instagram: "@nossobar_niteroi",
    whatsapp: "5521968201043",
    website: "nossobarlinks.idlab.art.br",

    // Quality tags for visited places
    qualityTags: [
      "Ótimo atendimento",
      "Lugar agradável",
    ],
    // Tags for places never visited (reasons to go)
    wishlistTags: ["Placeholder"],
    tags: ["cerveja"],
    lat: -22.944375235091204,
    lng: -43.05820527423068,
  },
  {
    id: 8,
    name: "Arretado",
    location: "Centro, Niterói",
    fullAddress:
      "Av. Visconde do Rio Branco, 655 - Centro, Niterói - RJ, 24020-005",
    state: "Rio de Janeiro",
    type: "Botecos",
    price: "$$",
    image:
      "https://res.cloudinary.com/dg6jtjgzr/image/upload/v1752694395/465050812_18255798745265803_8121681329966714632_n_aw1ydn.jpg",
    // Contact Information
    phone: "(21) 98494-7663",
    instagram: "@botequimarretado",
    whatsapp: "5521984947663",
    website: "linktr.ee/botequiimarretado",

    // Quality tags for visited places
    qualityTags: [
      "Ótimo atendimento",
      "Lugar agradável",
    ],
    // Tags for places never visited (reasons to go)
    wishlistTags: ["Placeholder"],
    tags: ["hamburguer"],
    lat: -22.89654491959188,
    lng: -43.1265887403429,
  },
  {
    id: 9,
    name: "Areias",
    location: "Itacoatiara, Niterói",
    fullAddress:
      "Estr. Francisco da Cruz Nunes, 11500 - Itaipu, Niterói - RJ, 24340-000",
    state: "Rio de Janeiro",
    type: "Botecos",
    price: "$$",
    image:
      "https://res.cloudinary.com/dg6jtjgzr/image/upload/v1752695025/brave_screenshot_www.google.com_xbxop4.png",
    // Contact Information
    phone: "(21) 3628-4427",
    instagram: "@areiasdeitacoa",

    // Quality tags for visited places
    qualityTags: [
      "Ótimo atendimento",
      "Lugar agradável",
    ],
    // Tags for places never visited (reasons to go)
    wishlistTags: ["Placeholder"],
    tags: ["drink"],
    lat: -22.9631689025678,
    lng: -43.03162790674655,
  },
  {
    id: 10,
    name: "Braseiro do Roque",
    location: "Vila da Penha, Rio de Janeiro",
    fullAddress:
      "R. Feliciano Pena, 332 - Loja A - Vila da Penha, Rio de Janeiro - RJ, 21221-450",
    state: "Rio de Janeiro",
    type: "Botecos",
    price: "$$",
    image:
      "https://res.cloudinary.com/dg6jtjgzr/image/upload/v1752695821/509786913_18049423664385691_2796890573581820179_n_fjrlw2.jpg",
    // Contact Information
    phone: "(21) 99823-0519",
    instagram: "@braseirodoroque",
    whatsapp: "5521998230519",

    // Quality tags for visited places
    qualityTags: [
      "Ótimo atendimento",
      "Lugar agradável",
    ],
    // Tags for places never visited (reasons to go)
    wishlistTags: ["Placeholder"],
    tags: ["drink"],
    lat: -22.845779971362788,
    lng: -43.31251654291311,
  },
  {
    id: 11,
    name: "Braseiro Labuta",
    location: "Centro, Rio de Janeiro",
    fullAddress:
      "R. do Senado, 65 - Centro, Rio de Janeiro - RJ, 20231-000",
    state: "Rio de Janeiro",
    type: "Botecos",
    price: "$$",
    image:
      "https://res.cloudinary.com/dg6jtjgzr/image/upload/v1752696159/503729127_17965223894926002_1482595041412921748_n_by2tgm.jpg",
    // Contact Information
    phone: "(21) 97577-3209",
    instagram: "@labuta_braseiro",
    whatsapp: "5521975773209",

    // Quality tags for visited places
    qualityTags: [
      "Ótimo atendimento",
      "Lugar agradável",
    ],
    // Tags for places never visited (reasons to go)
    wishlistTags: ["Placeholder"],
    tags: ["drink"],
    lat: -22.909369048373705,
    lng: -43.18484305619088,
  },
  {
    id: 12,
    name: "Labuta",
    location: "Centro, Rio de Janeiro",
    fullAddress:
      "Av. Gomes Freire, 256 - Centro, Rio de Janeiro - RJ, 20231-014",
    state: "Rio de Janeiro",
    type: "Botecos",
    price: "$$",
    image:
      "https://res.cloudinary.com/dg6jtjgzr/image/upload/v1752711397/511642384_18066728309114375_5445677988844832138_n_pqurb0.jpg",
    // Contact Information
    instagram: "@labuta_bar",

    // Quality tags for visited places
    qualityTags: [
      "Ótimo atendimento",
      "Lugar agradável",
    ],
    // Tags for places never visited (reasons to go)
    wishlistTags: ["Placeholder"],
    tags: ["drink"],
    lat: -22.909194183545086,
    lng: -43.18462193087723,
  },
  {
    id: 13,
    name: "7 Brasas",
    location: "Piratininga, Niterói",
    fullAddress:
      "Av. Dr. Raul de Oliveira Rodrigues, 1190 - Piratininga, Niterói - RJ, 24350-630",
    state: "Rio de Janeiro",
    type: "Botecos",
    price: "$$",
    image:
      "https://res.cloudinary.com/dg6jtjgzr/image/upload/v1752711855/519593966_17912196195157184_4547811834035780272_n_pgimxj.jpg",
    // Contact Information
    instagram: "@7brasasrestaurante",
    whatsapp: "5521991606767",

    // Quality tags for visited places
    qualityTags: [
      "Ótimo atendimento",
      "Lugar agradável",
    ],
    // Tags for places never visited (reasons to go)
    wishlistTags: ["Placeholder"],
    tags: ["drink"],
    lat: -22.93920815913406,
    lng: -43.06630990935325,
  },
  {
    id: 14,
    name: "Endorfina Bar",
    location: "Icaraí, Niterói",
    fullAddress:
      "R. Pres. João Pessoa, 307 - Icaraí, Niterói - RJ, 24220-330",
    state: "Rio de Janeiro",
    type: "Botecos",
    price: "$$",
    image:
      "https://res.cloudinary.com/dg6jtjgzr/image/upload/v1752712130/466906657_17934143897944124_7053930716083052797_n_y0v0dc.jpg",
    // Contact Information
    instagram: "@endorfinabar",
    website: "linktr.ee/endorfinabar",
    whatsapp: "552135872193",
    phone: "(21) 3587-2193",

    // Quality tags for visited places
    qualityTags: [
      "Ótimo atendimento",
      "Lugar agradável",
    ],
    // Tags for places never visited (reasons to go)
    wishlistTags: ["Placeholder"],
    tags: ["drink"],
    lat: -22.90511220661925,
    lng: -43.10048275034704,
  },
  {
    id: 15,
    name: "Surreal",
    location: "Botafogo, Rio de Janeiro",
    fullAddress:
      "R. Paulo Barreto, 102 - Botafogo, Rio de Janeiro - RJ, 22280-010",
    state: "Rio de Janeiro",
    type: "Botecos",
    price: "$$",
    image:
      "https://res.cloudinary.com/dg6jtjgzr/image/upload/v1752712387/502371006_18183842263320225_7537553032690259590_n_qwwctc.jpg",
    // Contact Information
    instagram: "@surrealrio",
    website: "linktr.ee/surrealrio",
    phone: "(21) 96894-6337",
    whatsapp: "5521968946337",

    // Quality tags for visited places
    qualityTags: [
      "Ótimo atendimento",
      "Lugar agradável",
    ],
    // Tags for places never visited (reasons to go)
    wishlistTags: ["Placeholder"],
    tags: ["drink"],
    lat: -22.955756003935083,
    lng: -43.18631309180633,
  },
  {
    id: 16,
    name: "O Terrazzo",
    location: "Icaraí, Niterói",
    fullAddress:
      "R. Mem de Sá, 151 - 3° Piso - Icaraí, Niterói - RJ, 24220-260",
    state: "Rio de Janeiro",
    type: "Fine Dining",
    price: "$$",
    image:
      "https://res.cloudinary.com/dg6jtjgzr/image/upload/v1752713092/466756101_18097443061475109_3683011362419688562_n_xw3pzg.jpg",
    // Contact Information
    instagram: "@oterrazzo",
    website: "my.bio/oterrazzo",
    phone: "(21) 97571-7831",
    whatsapp: "5521975717831",

    // Quality tags for visited places
    qualityTags: [
      "Ótimo atendimento",
      "Lugar agradável",
    ],
    // Tags for places never visited (reasons to go)
    wishlistTags: ["Placeholder"],
    tags: ["drink"],
    lat: -22.90244091626859,
    lng: -43.10931517413874,
  },
  {
    id: 17,
    name: "Salinas",
    location: "Recreio dos Bandeirantes, Rio de Janeiro",
    fullAddress:
      "Av. Lúcio Costa, 16580 - Recreio dos Bandeirantes, Rio de Janeiro - RJ, 22795-008",
    state: "Rio de Janeiro",
    type: "Fine Dining",
    price: "$$",
    image:
      "https://res.cloudinary.com/dg6jtjgzr/image/upload/v1752713344/461052405_1073240000819337_2303698800529274025_n_kjr3zu.jpg",
    // Contact Information
    instagram: "@salinasartesal",
    website: "linktr.ee/artesalsalinas",
    phone: "(21) 97571-7831",
    whatsapp: "5521992977979",

    // Quality tags for visited places
    qualityTags: [
      "Ótimo atendimento",
      "Lugar agradável",
    ],
    // Tags for places never visited (reasons to go)
    wishlistTags: ["Placeholder"],
    tags: ["drink"],
    lat: -23.024784763229988,
    lng: -43.45802489155884,
  },
  {
    id: 18,
    name: "Pit Burguer",
    location: "Grajaú, Rio de Janeiro",
    fullAddress:
      "R. Uberaba, 49 - Grajaú, Rio de Janeiro - RJ, 20561-240",
    state: "Rio de Janeiro",
    type: "Hamburgueria",
    price: "$$",
    image:
      "https://res.cloudinary.com/dg6jtjgzr/image/upload/v1752713742/Image-439_exgqil.jpg",
    // Contact Information
    instagram: "@pitburguergrajau",
    phone: "(21) 99737-2209",
    whatsapp: "5521997372209",

    // Quality tags for visited places
    qualityTags: [
      "Ótimo atendimento",
      "Lugar agradável",
    ],
    // Tags for places never visited (reasons to go)
    wishlistTags: ["Placeholder"],
    tags: ["drink"],
    lat: -22.92506953935698,
    lng: -43.25637587508013,
  },
  {
    id: 19,
    name: "CoZi",
    location: "Botafogo, Rio de Janeiro",
    fullAddress:
      "Rua Conde de Irajá, 247 - Botafogo, Rio de Janeiro - RJ, 22271-020",
    state: "Rio de Janeiro",
    type: "Fine Dining",
    price: "$$",
    image:
      "https://res.cloudinary.com/dg6jtjgzr/image/upload/v1753547189/469119653_18098527276481119_8880700075544632645_n_smjzv4.jpg",
    // Contact Information
    instagram: "@cozi.bistrobar",
    phone: "(21) 3215-7216",
    website: "cozibistro.com.br",

    // Quality tags for visited places
    qualityTags: [
      "Ótimo atendimento",
      "Lugar agradável",
    ],
    // Tags for places never visited (reasons to go)
    wishlistTags: ["Placeholder"],
    tags: ["drink"],
    lat: -22.954575075397337,  
    lng: -43.19534476372439,
  },
  {
    id: 20,
    name: "On Fire",
    location: "São Francisco, Niterói",
    fullAddress:
      "Av. Quintino Bocaiúva, 291 - São Francisco, Niterói - RJ, 24360-022",
    state: "Rio de Janeiro",
    type: "Churrascaria",
    price: "$$",
    image:
      "https://res.cloudinary.com/dg6jtjgzr/image/upload/v1753547744/520252877_1388325372460217_1863535635873485514_n_kba3zg.jpg",
    // Contact Information
    instagram: "@onfireamericanbbq",
    phone: "(21) 98068-9518",
    website: "onfireamericanbbq.com.br",
    whatsapp: "5521980689518",

    // Quality tags for visited places
    qualityTags: [
      "Placeholder",
    ],
    // Tags for places never visited (reasons to go)
    wishlistTags: ["Placeholder"],
    tags: ["Churrascaria"],
    lat: -22.91976333370703,
    lng: -43.0938430168482,
  },
  {
    id: 21,
    name: "Baixo Araguaia",
    location: "Jardim Botânico, Rio de Janeiro",
    fullAddress:
      "R. Visc. da Graça, 63 - Jardim Botânico, Rio de Janeiro - RJ, 22461-030",
    state: "Rio de Janeiro",
    type: "Botecos",
    price: "$$",
    image:
      "https://res.cloudinary.com/dg6jtjgzr/image/upload/v1753549207/516502959_18287228374251155_7535751900026544257_n_u9wbzx.jpg",
    // Contact Information
    instagram: "@baixoaraguaia",
    phone: "(21) 97668-6463",
    website: "linktr.ee/baixoaraguaia",
    whatsapp: "5521976686463",

    // Quality tags for visited places
    qualityTags: [
      "Placeholder",
    ],
    // Tags for places never visited (reasons to go)
    wishlistTags: ["Placeholder"],
    tags: ["Placeholder"],
    lat: -22.963886882854517,
    lng: -43.21812353856438,
  },
  {
    id: 22,
    name: "Baked",
    location: "Ipanema, Rio de Janeiro",
    fullAddress:
      "R. Visc. de Pirajá, 183 - Ipanema, Rio de Janeiro - RJ, 22410-001",
    state: "Rio de Janeiro",
    type: "Padaria",
    price: "$",
    image:
      "https://res.cloudinary.com/dg6jtjgzr/image/upload/v1753549581/487814318_18047722049457824_9002385884327670896_n_ff6rkq.jpg",
    // Contact Information
    instagram: "@baked.padaria",
    phone: "(21) 3798-8417",
    website: "linktr.ee/bakedpadaria",

    // Quality tags for visited places
    qualityTags: [
      "Placeholder",
    ],
    // Tags for places never visited (reasons to go)
    wishlistTags: ["Placeholder"],
    tags: ["Placeholder"],
    lat: -22.98459808499907,
  lng: -43.20087466217107,
  },
  {
    id: 23,
    name: "Malta Beef Club",
    location: "Leblon, Rio de Janeiro",
    fullAddress:
      "Av. Gen. San Martin, 359 - Leblon, Rio de Janeiro - RJ, 22441-015",
    state: "Rio de Janeiro",
    type: "Churrascaria",
    price: "$$",
    image:
      "https://res.cloudinary.com/dg6jtjgzr/image/upload/v1753550308/502543315_18363711628151874_937455573690701440_n_apaave.jpg",
    // Contact Information
    instagram: "@malta.beefclub",
    website: "linktr.ee/maltabeef",
    whatsapp: "552120423101",

    // Quality tags for visited places
    qualityTags: [
      "Placeholder",
    ],
    // Tags for places never visited (reasons to go)
    wishlistTags: ["Placeholder"],
    tags: ["Placeholder"],
    lat: -22.9848175525249,
    lng: -43.21950962505084,
  },
  {
    id: 24,
    name: "Surreal",
    location: "Botafogo, Rio de Janeiro",
    fullAddress:
      "R. Paulo Barreto, 102 - Botafogo, Rio de Janeiro - RJ, 22280-010",
    state: "Rio de Janeiro",
    type: "Botecos",
    price: "$$",
    image:
      "https://res.cloudinary.com/dg6jtjgzr/image/upload/v1753550679/502950023_18181874320320225_2085019338976834793_n_a6xmqe.jpg",
    // Contact Information
    instagram: "@surrealrio",
    phone: "(21) 96894-6337",
    website: "linktr.ee/surrealrio",
    whatsapp: "5521968946337",

    // Quality tags for visited places
    qualityTags: [
      "Placeholder",
    ],
    // Tags for places never visited (reasons to go)
    wishlistTags: ["Placeholder"],
    tags: ["Placeholder"],
    lat: -22.95574772864953,
    lng: -43.18632097097115,
  },
  /*
  {
    id: ,
    name: "",
    location: "",
    fullAddress:
      "",
    state: "",
    type: "",
    price: "$",
    image:
      "",
    // Contact Information
    instagram: "@",
    phone: "() -",
    website: "",
    whatsapp: "",

    // Quality tags for visited places
    qualityTags: [
      "Placeholder",
    ],
    // Tags for places never visited (reasons to go)
    wishlistTags: ["Placeholder"],
    tags: ["Placeholder"],
    lat: -,  
    lng: -,
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
