# 🚀 Guia Rápido - Como Personalizar Seu App

## 📁 Arquivo Principal: `client/data/config.ts`

### ✅ Para Começar Rapidamente:

1. **Abra o arquivo:** `client/data/config.ts`
2. **Edite o nome do app:**

   ```typescript
   export const appConfig = {
     name: "MeuApp", // ← Seu nome aqui
     tagline: "Minha lista de restaurantes",
   };
   ```

3. **Adicione seus lugares:**
   ```typescript
   {
     id: 5, // ← Próximo número disponível
     name: "Restaurante do João",
     location: "Ipanema, Rio de Janeiro",
     state: "Rio de Janeiro",
     type: "Brasileiro", // ← Deve estar em filterOptions.placeTypes
     rating: 4.7,
     reviews: 1200,
     price: "$$",
     image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop",
     description: "Melhor feijoada da cidade!",
     tags: ["feijoada", "brasileiro", "ipanema"],
     lat: -22.9839, // ← Google Maps: clique direito → copiar coordenadas
     lng: -43.2096,
   },
   ```

### 🔧 Customizações Importantes:

#### **Tipos de Lugar** (para filtros funcionarem):

```typescript
placeTypes: [
  "Todos",
  "Brasileiro",    // ← Adicione seus tipos aqui
  "Japonês",
  "Italiano",
  // ...
],
```

#### **Estados/Cidades:**

```typescript
states: [
  "Todos",
  "Rio de Janeiro",
  "São Paulo",     // ← Adicione seus estados
  // ...
],
```

#### **Suas Estatísticas:**

```typescript
export const stats = {
  totalPlaces: 25, // ← Seu total
  triedTogether: 8, // ← Provaram juntos
  wantToTry: 17, // ← Querem provar
};
```

### 🗺️ Para o Mapa:

**Encontrar Coordenadas:**

1. Abra Google Maps
2. Clique direito no restaurante
3. Clique "Copiar coordenadas"
4. Cole no `lat` e `lng`

### 💡 Dicas Importantes:

- **IDs únicos:** Cada lugar deve ter um `id` diferente
- **Salvar:** O app atualiza automaticamente ao salvar
- **Erros:** Abra F12 (console) se algo não funcionar
- **Imagens:** Use Unsplash ou suas próprias fotos

### 🆘 Problemas?

**App não carrega?**

- Verifique vírgulas e aspas no `config.ts`
- Todo lugar deve ter `id` único
- `type` deve existir em `placeTypes`

**Filtros não funcionam?**

- Certifique-se que `type` do lugar está em `filterOptions.placeTypes`
- Certifique-se que `state` do lugar está em `filterOptions.states`

---

## 🎯 Exemplo Completo de Lugar:

```typescript
{
  id: 999,
  name: "Pizzaria do Mario",
  location: "Leblon, Rio de Janeiro",
  state: "Rio de Janeiro",
  type: "Pizzaria",
  rating: 4.8,
  reviews: 2500,
  price: "$$$",
  image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop",
  description: "A melhor pizza napolitana do Rio, massa artesanal e ingredientes importados.",
  tags: ["pizza", "italiana", "artesanal"],
  lat: -22.9839,
  lng: -43.2096,
}
```

Pronto! Agora é só personalizar e curtir! 🍕❤️
