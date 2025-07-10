# 🗺️ Guia Simples - Como Adicionar Mapas Reais

## ✅ **Status Atual**

Seu mapa está funcionando! É um **mapa visual simples** que mostra seus restaurantes em posições fixas. Não é um mapa real do Google/OpenStreetMap, mas funciona perfeitamente para ver seus lugares.

## 🎯 **O que Funciona Agora:**

- ✅ **Visual de mapa** com fundo bonito
- ✅ **Marcadores vermelhos** em seus restaurantes
- ✅ **Clique nos marcadores** → popup com informações
- ✅ **Botões favoritar/visitado** funcionando
- ✅ **Busca e filtros** funcionam
- ✅ **Lista de lugares** abaixo do mapa
- ✅ **Dark mode** compatível
- ✅ **Responsivo** em mobile

## 🚀 **Para Mapas Reais (Futuro)**

Se quiser um mapa real do Google Maps ou similar, aqui estão as opções:

### 🟢 **Opção 1: Google Maps (Mais Popular)**

1. **Criar conta Google Cloud:**

   - Ir para [console.cloud.google.com](https://console.cloud.google.com)
   - Criar projeto novo
   - Ativar "Maps JavaScript API"
   - Criar API Key

2. **Instalar dependência:**

   ```bash
   npm install @vis.gl/react-google-maps
   ```

3. **Criar arquivo `.env.local`:**

   ```env
   VITE_GOOGLE_MAPS_API_KEY=sua_chave_aqui
   ```

4. **Substituir o mapa atual** por componente do Google Maps

### 🔵 **Opção 2: Mapbox (Visual Bonito)**

1. **Criar conta Mapbox:**

   - Ir para [mapbox.com](https://mapbox.com)
   - Pegar Access Token

2. **Instalar dependência:**

   ```bash
   npm install react-map-gl mapbox-gl
   ```

3. **Criar arquivo `.env.local`:**
   ```env
   VITE_MAPBOX_ACCESS_TOKEN=seu_token_aqui
   ```

### 🟡 **Opção 3: OpenStreetMap (Grátis)**

1. **Instalar dependência:**

   ```bash
   npm install react-leaflet leaflet
   ```

2. **Não precisa** de API key ou conta

## 📁 **Como Criar `.env.local`**

1. **Criar arquivo** na raiz do projeto (mesmo nível que `package.json`)
2. **Nome exato:** `.env.local`
3. **Conteúdo:**
   ```env
   VITE_GOOGLE_MAPS_API_KEY=sua_api_key_aqui
   # ou
   VITE_MAPBOX_ACCESS_TOKEN=seu_token_aqui
   ```

## 💰 **Custos**

- **Google Maps:** Grátis até 28.000 visualizações/mês
- **Mapbox:** Grátis até 50.000 visualizações/mês
- **OpenStreetMap:** Sempre grátis

## 🎯 **Recomendação**

**Para agora:** Use o mapa atual! Funciona bem e não tem custos.

**Para o futuro:** Se quiser mapas reais, Google Maps é a opção mais conhecida.

## 🔧 **Seu Mapa Atual**

- **Arquivo:** `client/pages/MapView.tsx`
- **Posições:** Estão fixas no código (25%, 40%, etc.)
- **Personalizar:** Edite as posições em `positions` no arquivo

**Seu mapa está funcionando perfeitamente! 🗺️✨**
