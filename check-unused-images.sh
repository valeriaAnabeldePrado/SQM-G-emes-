#!/bin/bash

# Script para identificar imágenes no utilizadas en el proyecto

echo "=== ANÁLISIS DE IMÁGENES NO UTILIZADAS ==="
echo ""

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Archivos temporales
USED_IMAGES=$(mktemp)
ALL_IMAGES=$(mktemp)

echo "📊 Recopilando imágenes utilizadas..."

# Buscar todas las referencias a imágenes en el código
grep -r --include="*.js" --include="*.jsx" --include="*.ts" --include="*.tsx" --include="*.json" --include="*.css" --include="*.scss" \
     -E '\.(jpg|jpeg|png|gif|svg|webp)' src/ public/ | \
     grep -oE '[^"'\'']*\.(jpg|jpeg|png|gif|svg|webp)' | \
     sed 's|^/||' | \
     sed 's|^src/||' | \
     sort -u > "$USED_IMAGES"

echo "📁 Recopilando todas las imágenes del proyecto..."

# Buscar todas las imágenes en el proyecto
find src/ public/ -type f \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" -o -name "*.gif" -o -name "*.svg" -o -name "*.webp" \) | \
     sed 's|^\./||' | \
     sed 's|^src/||' | \
     sed 's|^public/||' | \
     sort -u > "$ALL_IMAGES"

echo ""
echo "📈 RESULTADOS:"
echo "   Imágenes encontradas: $(wc -l < "$ALL_IMAGES")"
echo "   Imágenes utilizadas: $(wc -l < "$USED_IMAGES")"
echo ""

# Encontrar imágenes no utilizadas
echo "🗑️  IMÁGENES NO UTILIZADAS:"
echo "   (Estas pueden ser eliminadas de forma segura)"
echo ""

UNUSED_COUNT=0
while IFS= read -r image; do
    # Verificar si la imagen está siendo usada
    if ! grep -Fxq "$image" "$USED_IMAGES"; then
        # Buscar el archivo real
        REAL_PATH=""
        if [ -f "src/$image" ]; then
            REAL_PATH="src/$image"
        elif [ -f "public/$image" ]; then
            REAL_PATH="public/$image"
        elif [ -f "src/assets/$image" ]; then
            REAL_PATH="src/assets/$image"
        fi
        
        if [ -n "$REAL_PATH" ]; then
            echo -e "${RED}   ❌ $REAL_PATH${NC}"
            ((UNUSED_COUNT++))
        fi
    fi
done < "$ALL_IMAGES"

echo ""
echo "📊 RESUMEN:"
echo "   Imágenes no utilizadas encontradas: $UNUSED_COUNT"

# Limpiar archivos temporales
rm "$USED_IMAGES" "$ALL_IMAGES"

echo ""
echo "💡 Para eliminar estas imágenes, ejecuta:"
echo "   git rm <archivo_imagen>"
echo "   o usa rm para eliminar manualmente"
