# 🎯 Guia de Personalização - GuiaFood

Este guia mostra como personalizar seu app com suas próprias informações!

## 📁 Arquivo Principal de Dados

**Arquivo:** `client/data/config.ts`

Este é o arquivo mais importante! Aqui você pode personalizar:

### 🏷️ Nome do App e Marca

```typescript
export const appConfig = {
  name: "GuiaFood", // ← Mude aqui o nome do seu app
  tagline: "Nossa lista gastronômica", // ← Sua frase de efeito
  description: "Nossa coleção pessoal...", // ← Descrição do hero
};
```

### 📊 Estatísticas

```typescript
export const stats = {
  totalPlaces: 89, // ← Total de lugares na sua lista
  triedTogether: 17, // ← Lugares que vocês já provaram
  wantToTry: 72, // ← Lugares que querem provar
};
```

### 🍽️ Suas Categorias de Comida

```typescript
export const categories = [
  { name: "Fine Dining", count: 18, icon: "🍽️" },
  { name: "Churrascaria", count: 12, icon: "🥩" },
  // ← Adicione/remova/modifique suas categorias
];
```

### 📍 Seus Lugares Favoritos

```typescript
export const places = [
  {
    id: 1,
    name: "Nome do Restaurante", // ← Nome do lugar
    location: "Bairro, Cidade", // ← Localização
    state: "Estado", // ← Estado
    type: "Tipo de Comida", // ← Categoria
    rating: 4.8, // ← Nota (1-5)
    reviews: 1500, // ← Número de avaliações
    price: "$$$", // ← Preço ($, $$, $$$, $$$$)
    image: "URL_DA_IMAGEM", // ← Link da foto
    description: "Descrição...", // ← Sua descrição
    tags: ["tag1", "tag2"], // ← Tags para busca
    lat: -22.9068, // ← Latitude para o mapa
    lng: -43.1729, // ← Longitude para o mapa
  },
];
```

## 🗺️ Configuração do Mapa

### Centralizar o Mapa na Sua Cidade

```typescript
export const mapConfig = {
  defaultCenter: {
    lat: -22.9068, // ← Latitude da sua cidade
    lng: -43.1729, // ← Longitude da sua cidade
  },
  defaultZoom: 12, // ← Nível de zoom (maior = mais próximo)
};
```

### 🔍 Como Encontrar Coordenadas

1. Vá no Google Maps
2. Clique com botão direito no local
3. Copie as coordenadas (primeiro número = latitude, segundo = longitude)

## 🔧 Filtros e Opções

### Tipos de Lugares

```typescript
placeTypes: [
  "Todos",
  "Fine Dining",
  "Pizzaria",
  // ← Adicione seus tipos aqui
],
```

### Estados/Regiões

```typescript
states: [
  "Todos",
  "Rio de Janeiro",
  "São Paulo",
  // ← Adicione seus estados aqui
],
```

## 📱 Navegação

### Menu Lateral

```typescript
export const navigationItems = [
  {
    name: "Início", // ← Nome no menu
    href: "/", // ← Link da página
    icon: "Home", // ← Ícone (Lucide React)
  },
];
```

## 🖼️ Imagens dos Lugares

### Opções para Imagens:

1. **Unsplash (Grátis):** `https://images.unsplash.com/photo-ID?w=400&h=300&fit=crop`
2. **Upload próprio:** Coloque na pasta `public/images/` e use `/images/nome.jpg`
3. **Links externos:** Qualquer URL de imagem

### Tamanho Recomendado:

- **Largura:** 400px
- **Altura:** 300px
- **Formato:** JPG ou PNG

## 💡 Dicas Importantes

### 🔄 Após Modificar o config.ts:

1. Salve o arquivo
2. O app atualizará automaticamente
3. Se não funcionar, recarregue a página

### 📍 Para Adicionar Muitos Lugares:

1. Copie o formato de um lugar existente
2. Cole quantas vezes quiser
3. Mude apenas os dados (nome, localização, etc.)
4. **Importante:** Cada lugar precisa de um `id` único!

### 🎨 Personalização Avançada:

- **Cores:** Modifique `client/global.css`
- **Estilo:** Modifique os componentes em `client/components/`
- **Páginas:** Modifique os arquivos em `client/pages/`

## 🆘 Problemas Comuns

### ❌ App não carrega após mudanças:

- Verifique se esqueceu uma vírgula ou aspas
- Confira se todos os `id` são únicos
- Veja o console do navegador (F12) para erros

### 🗺️ Lugares não aparecem no mapa:

- Confira se `lat` e `lng` estão corretos
- Use coordenadas com ponto decimal (ex: -22.9068)

### 🔍 Filtros não funcionam:

- Certifique-se que o `type` do lugar existe em `placeTypes`
- Certifique-se que o `state` do lugar existe em `states`

---

## 🚀 Exemplo Completo de Lugar

```typescript
{
  id: 999, // ← Número único!
  name: "Restaurante da Maria",
  location: "Ipanema, Rio de Janeiro",
  state: "Rio de Janeiro",
  type: "Brasileiro", // ← Deve estar em placeTypes
  rating: 4.5,
  reviews: 850,
  price: "$$",
  image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop",
  description: "Comida caseira deliciosa com vista para a praia de Ipanema. Famoso pelo peixe grelhado e caipirinha de caju.",
  tags: ["brasileiro", "caseiro", "praia", "peixe"],
  lat: -22.9839,
  lng: -43.2096,
}
```

Agora é só personalizar e curtir seu app gastronômico! 🍽️❤️
