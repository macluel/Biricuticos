# 🗺️ Tutorial Completo - Mapas Interativos

## ✅ **Implementação Atual (React-Leaflet)**

Seu app já está configurado com React-Leaflet! 🎉

### 🔧 **O que já está funcionando:**

1. ✅ **Mapa interativo** com zoom, arraste, etc.
2. ✅ **Marcadores** nos seus restaurantes
3. ✅ **Popups** com informações ao clicar
4. ✅ **Botões de favoritar/visitado** no mapa
5. ✅ **Dark mode** compatível
6. ✅ **Design responsivo**

### 📍 **Como adicionar novos lugares:**

No arquivo `client/data/config.ts`, adicione:

```typescript
{
  id: 5,
  name: "Novo Restaurante",
  location: "Seu Bairro, Rio de Janeiro",
  state: "Rio de Janeiro",
  type: "Tipo de Comida",
  rating: 4.5,
  reviews: 1000,
  price: "$$",
  image: "URL_DA_IMAGEM",
  description: "Descrição do lugar",
  tags: ["tag1", "tag2"],
  lat: -22.9068, // ← IMPORTANTE: Coordenadas do lugar
  lng: -43.1729, // ← IMPORTANTE: Coordenadas do lugar
}
```

### 🎯 **Como pegar coordenadas:**

1. **Google Maps:** Clique direito → "Copiar coordenadas"
2. **Resultado:** `-22.9068, -43.1729`
3. **No config:** `lat: -22.9068, lng: -43.1729`

---

## 🔄 **Outras Opções de Mapas**

### 🟢 **Google Maps (Para mais recursos)**

#### Passo 1: Instalar

```bash
npm install @vis.gl/react-google-maps
```

#### Passo 2: Obter API Key

1. [Google Cloud Console](https://console.cloud.google.com/)
2. Ativar "Maps JavaScript API"
3. Criar API Key
4. Adicionar no `.env.local`:

```env
VITE_GOOGLE_MAPS_API_KEY=sua_chave_aqui
```

#### Passo 3: Componente Google Maps

```typescript
// client/components/GoogleMap.tsx
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';

export function GoogleMapComponent({ places }) {
  return (
    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <Map
        defaultCenter={{ lat: -22.9068, lng: -43.1729 }}
        defaultZoom={12}
        style={{ height: '600px' }}
      >
        {places.map(place => (
          <Marker
            key={place.id}
            position={{ lat: place.lat, lng: place.lng }}
          />
        ))}
      </Map>
    </APIProvider>
  );
}
```

### 🔵 **Mapbox (Para visual moderno)**

#### Passo 1: Instalar

```bash
npm install react-map-gl mapbox-gl
```

#### Passo 2: Token Mapbox

1. [Mapbox.com](https://www.mapbox.com/) → Criar conta
2. Copiar Access Token
3. Adicionar no `.env.local`:

```env
VITE_MAPBOX_ACCESS_TOKEN=seu_token_aqui
```

#### Passo 3: Componente Mapbox

```typescript
// client/components/MapboxMap.tsx
import { Map, Marker } from 'react-map-gl';

export function MapboxMap({ places }) {
  return (
    <Map
      initialViewState={{
        longitude: -43.1729,
        latitude: -22.9068,
        zoom: 12
      }}
      style={{ width: '100%', height: 600 }}
      mapStyle="mapbox://styles/mapbox/streets-v11"
      mapboxAccessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}
    >
      {places.map(place => (
        <Marker
          key={place.id}
          longitude={place.lng}
          latitude={place.lat}
        />
      ))}
    </Map>
  );
}
```

---

## 🎨 **Personalizações Avançadas**

### 🎯 **Ícones Personalizados**

Para React-Leaflet:

```typescript
// Ícone personalizado por tipo de comida
const getCustomIcon = (type: string) => {
  const iconColors = {
    "Fine Dining": "red",
    Pizzaria: "orange",
    Confeitaria: "pink",
    Churrascaria: "green",
    Boteco: "blue",
  };

  return new Icon({
    iconUrl: `marker-icon-${iconColors[type] || "red"}.png`,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });
};
```

### 🌍 **Temas de Mapa**

Para estilos diferentes:

```typescript
// Diferentes tiles para React-Leaflet
const mapStyles = {
  default: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  dark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
  satellite:
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
};
```

### 📱 **Funcionalidades Extras**

```typescript
// Localização atual do usuário
navigator.geolocation.getCurrentPosition((position) => {
  const { latitude, longitude } = position.coords;
  // Centralizar mapa na localização atual
});

// Calcular rota entre pontos
// Integrar com APIs de direção
```

---

## 🚀 **Recursos Implementados no Seu App**

### ✅ **React-Leaflet Features:**

1. **Mapa base** OpenStreetMap
2. **Marcadores** nos restaurantes
3. **Popups** com informações
4. **Ícones** personalizados (vermelho)
5. **Integração** com sistema de favoritos
6. **Responsive** design
7. **Dark mode** compatibility

### 🎯 **Como testar:**

1. Vá para página "Mapa"
2. Veja os marcadores vermelhos
3. Clique nos marcadores → popup aparece
4. Use botões de ❤️ e ✅ no popup
5. Stats na sidebar atualizam!

### 🔧 **Personalizar:**

- **Ícones:** Edite `client/components/InteractiveMap.tsx`
- **Cores:** Mude `restaurantIcon`
- **Centro:** Ajuste coordenadas em `MapView.tsx`
- **Zoom:** Modifique `zoom={12}`

---

## 🆘 **Problemas Comuns**

### ❌ **Mapa não aparece:**

```bash
# Verificar se CSS foi adicionado no index.html
# Verificar console (F12) para erros
npm run typecheck
```

### 📍 **Marcadores em lugar errado:**

- Verificar se `lat` e `lng` estão corretos
- Usar vírgula (.) para decimal, não vírgula (,)
- Latitude negativa para Sul do Equador

### 🐌 **Mapa lento:**

- Muito lugares? Limit com filtros
- Usar clustering para muitos pontos

---

## 🎉 **Pronto para usar!**

Seu mapa já está funcionando com React-Leaflet! É grátis, rápido e tem todos os recursos que você precisa.

**Para trocar para Google Maps ou Mapbox:** Siga os passos acima e substitua o componente `InteractiveMap` no `MapView.tsx`.

🗺️ **Happy mapping!** 🗺️
