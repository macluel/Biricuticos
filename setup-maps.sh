#!/bin/bash

echo "🗺️ Configurando React-Leaflet para mapas..."

# Install required packages
echo "📦 Instalando dependências..."
npm install react-leaflet leaflet
npm install --save-dev @types/leaflet

echo "✅ Dependências instaladas!"

echo ""
echo "📝 PRÓXIMOS PASSOS:"
echo ""
echo "1. Adicione o CSS do Leaflet no seu index.html:"
echo ""
echo '<link'
echo '  rel="stylesheet"'
echo '  href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"'
echo '  integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="'
echo '  crossorigin=""'
echo '/>'
echo ""
echo "2. O componente InteractiveMap já foi criado!"
echo "3. O MapView será atualizado automaticamente!"
echo ""
echo "🎉 Setup concluído! Seu mapa estará funcionando!"
