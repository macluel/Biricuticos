# 🗺️ Guia Completo - Integração de Mapas

## 🎯 Opções de Mapas

### 1. **React-Leaflet (RECOMENDADO - GRÁTIS)**

- ✅ **Grátis e Open Source**
- ✅ **Fácil de usar**
- ✅ **Boa documentação**
- ✅ **Funciona bem com React**

### 2. **Google Maps**

- ⚠️ **Pago após limite de uso**
- ✅ **Mais conhecido**
- ✅ **Muitos recursos**

### 3. **Mapbox**

- ⚠️ **Pago após limite de uso**
- ✅ **Visual bonito**
- ✅ **Performático**

---

## 🚀 Implementação React-Leaflet (RECOMENDADO)

### Passo 1: Instalar Dependências

```bash
npm install react-leaflet leaflet
npm install --save-dev @types/leaflet
```

### Passo 2: Adicionar CSS do Leaflet

No seu `index.html`, adicione:

```html
<link
  rel="stylesheet"
  href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
  integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
  crossorigin=""
/>
```

### Passo 3: Criar Componente do Mapa

Arquivo: `client/components/InteractiveMap.tsx`

### Passo 4: Usar no MapView

Substitua o placeholder no `client/pages/MapView.tsx`

---

## 🗺️ Implementação Google Maps

### Passo 1: Obter API Key

1. Vá para [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um projeto ou selecione existente
3. Ative a Maps JavaScript API
4. Crie uma API Key
5. Configure restrições (opcional)

### Passo 2: Instalar Dependências

```bash
npm install @vis.gl/react-google-maps
```

### Passo 3: Configurar Variável de Ambiente

No arquivo `.env.local`:

```
VITE_GOOGLE_MAPS_API_KEY=sua_api_key_aqui
```

---

## 🎨 Implementação Mapbox

### Passo 1: Criar Conta Mapbox

1. Vá para [Mapbox](https://www.mapbox.com/)
2. Crie conta gratuita
3. Copie seu Access Token

### Passo 2: Instalar Dependências

```bash
npm install react-map-gl mapbox-gl
```

### Passo 3: Configurar Token

No arquivo `.env.local`:

```
VITE_MAPBOX_ACCESS_TOKEN=seu_token_aqui
```

---

## 💡 Recursos Importantes

### 🗺️ Para Todos os Mapas:

- **Marcadores personalizados**
- **InfoWindows/Popups**
- **Zoom e navegação**
- **Geolocalização**
- **Filtros visuais**

### 📍 Coordenadas dos Seus Lugares

Para seus restaurantes no Rio de Janeiro:

```typescript
const rioPlaces = [
  { name: "Oro", lat: -22.9868, lng: -43.2096 },
  { name: "Pizzaria Guanabara", lat: -22.9068, lng: -43.1729 },
  { name: "Confeitaria Colombo", lat: -22.9035, lng: -43.176 },
  { name: "Bar Urca", lat: -22.9533, lng: -43.1651 },
];
```

### 🎯 Centro do Mapa (Rio de Janeiro)

```typescript
const rioCenter = {
  lat: -22.9068,
  lng: -43.1729,
  zoom: 12,
};
```

---

## ⚡ Implementação Rápida

Escolha uma das opções abaixo baseado na sua preferência:

### 🟢 **Opção 1: React-Leaflet (GRÁTIS)**

- Melhor para começar
- Sem custos
- Fácil implementação

### 🟡 **Opção 2: Google Maps**

- Se você já conhece
- Mais recursos nativos
- Cuidado com os custos

### 🔵 **Opção 3: Mapbox**

- Visual mais moderno
- Boa performance
- Customização avançada

---

## 🔧 Próximos Passos

1. **Escolha a opção** que prefere
2. **Siga o guia** da opção escolhida
3. **Teste** com suas coordenadas
4. **Customize** o visual

Qual opção você gostaria que eu implemente primeiro? React-Leaflet é a mais recomendada para começar! 🗺️
