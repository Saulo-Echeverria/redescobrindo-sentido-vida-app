#!/bin/bash
# ============================================================
#  BUILD SCRIPT — Redescobrindo o Sentido da Vida
#  Automatiza o processo completo de build para Android e iOS
# ============================================================

set -e  # Para em caso de erro

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Banner
echo -e "${PURPLE}"
echo "  ╔══════════════════════════════════════════════════╗"
echo "  ║   Redescobrindo o Sentido da Vida — Build Tool  ║"
echo "  ║   PWA + Capacitor → Android & iOS               ║"
echo "  ╚══════════════════════════════════════════════════╝"
echo -e "${NC}"

# ── Verificar pré-requisitos ─────────────────────────────────────────────────
check_requirements() {
  echo -e "${BLUE}[1/7] Verificando pré-requisitos...${NC}"

  local missing=()

  command -v node >/dev/null 2>&1 || missing+=("Node.js >= 18")
  command -v npm  >/dev/null 2>&1 || missing+=("npm >= 9")
  command -v npx  >/dev/null 2>&1 || missing+=("npx")

  if [ "$1" = "android" ] || [ "$1" = "all" ]; then
    command -v java >/dev/null 2>&1 || missing+=("Java JDK 17+")
    [ -n "$ANDROID_HOME" ] || missing+=("ANDROID_HOME (Android SDK)")
  fi

  if [ "$1" = "ios" ] || [ "$1" = "all" ]; then
    command -v xcodebuild >/dev/null 2>&1 || missing+=("Xcode (macOS only)")
    command -v pod >/dev/null 2>&1 || missing+=("CocoaPods")
  fi

  if [ ${#missing[@]} -gt 0 ]; then
    echo -e "${RED}✗ Pré-requisitos faltando:${NC}"
    for item in "${missing[@]}"; do
      echo -e "  ${RED}• $item${NC}"
    done
    echo ""
    echo "Consulte o GUIA_PUBLICACAO.md para instruções de instalação."
    exit 1
  fi

  echo -e "${GREEN}✓ Todos os pré-requisitos encontrados${NC}"

  # Versões
  echo "  Node: $(node --version)"
  echo "  npm:  $(npm --version)"
}

# ── Instalar dependências ────────────────────────────────────────────────────
install_deps() {
  echo -e "\n${BLUE}[2/7] Instalando dependências npm...${NC}"
  npm install
  echo -e "${GREEN}✓ Dependências instaladas${NC}"
}

# ── Gerar ícones e splash screens ────────────────────────────────────────────
generate_assets() {
  echo -e "\n${BLUE}[3/7] Gerando ícones e splash screens...${NC}"

  # Verifica se o ícone fonte existe
  if [ ! -f "app/icons/icon-512.png" ]; then
    echo -e "${YELLOW}⚠ icon-512.png não encontrado. Usando ícones SVG existentes.${NC}"
    echo "  Para gerar PNGs de alta qualidade, coloque um icon-1024.png em app/icons/"
  else
    # Gera assets para Capacitor (requer @capacitor/assets)
    npx @capacitor/assets generate \
      --assetPath app/icons/icon-512.png \
      --iconBackgroundColor '#0f0f1a' \
      --iconBackgroundColorDark '#0f0f1a' \
      --splashBackgroundColor '#0f0f1a' \
      --splashBackgroundColorDark '#0f0f1a' \
      2>/dev/null || echo -e "${YELLOW}⚠ @capacitor/assets falhou — usando ícones existentes${NC}"
  fi

  echo -e "${GREEN}✓ Assets prontos${NC}"
}

# ── Inicializar Capacitor ────────────────────────────────────────────────────
init_capacitor() {
  echo -e "\n${BLUE}[4/7] Inicializando Capacitor...${NC}"

  if [ ! -f "capacitor.config.json" ]; then
    echo -e "${RED}✗ capacitor.config.json não encontrado${NC}"
    exit 1
  fi

  echo -e "${GREEN}✓ Capacitor configurado${NC}"
}

# ── Adicionar plataformas ────────────────────────────────────────────────────
add_platforms() {
  local platform=$1
  echo -e "\n${BLUE}[5/7] Adicionando plataforma: $platform...${NC}"

  if [ "$platform" = "android" ] || [ "$platform" = "all" ]; then
    if [ ! -d "android" ]; then
      echo "  Adicionando Android..."
      npx cap add android
      echo -e "${GREEN}  ✓ Android adicionado${NC}"
    else
      echo -e "${YELLOW}  ⚠ Pasta android/ já existe — pulando${NC}"
    fi
  fi

  if [ "$platform" = "ios" ] || [ "$platform" = "all" ]; then
    if [[ "$OSTYPE" != "darwin"* ]]; then
      echo -e "${YELLOW}  ⚠ iOS requer macOS — pulando${NC}"
    elif [ ! -d "ios" ]; then
      echo "  Adicionando iOS..."
      npx cap add ios
      echo -e "${GREEN}  ✓ iOS adicionado${NC}"
    else
      echo -e "${YELLOW}  ⚠ Pasta ios/ já existe — pulando${NC}"
    fi
  fi
}

# ── Sincronizar web assets ───────────────────────────────────────────────────
sync_assets() {
  echo -e "\n${BLUE}[6/7] Sincronizando assets web com plataformas nativas...${NC}"
  npx cap sync
  echo -e "${GREEN}✓ Assets sincronizados${NC}"
}

# ── Build de release ─────────────────────────────────────────────────────────
build_release() {
  local platform=$1
  echo -e "\n${BLUE}[7/7] Gerando build de release...${NC}"

  if [ "$platform" = "android" ] || [ "$platform" = "all" ]; then
    echo "  Building Android AAB (Play Store)..."
    if [ -d "android" ]; then
      cd android
      chmod +x gradlew
      ./gradlew bundleRelease 2>&1 | tail -20
      cd ..
      echo -e "${GREEN}  ✓ Android AAB gerado: android/app/build/outputs/bundle/release/app-release.aab${NC}"
    else
      echo -e "${YELLOW}  ⚠ Pasta android/ não encontrada. Execute: npm run cap:add:android${NC}"
    fi
  fi

  if [ "$platform" = "ios" ] || [ "$platform" = "all" ]; then
    if [[ "$OSTYPE" == "darwin"* ]] && [ -d "ios" ]; then
      echo "  Para iOS: abra o Xcode e faça o Archive manualmente"
      echo "  Comando: npm run cap:open:ios"
      echo -e "${YELLOW}  ⚠ iOS build requer Xcode GUI — abra manualmente${NC}"
    fi
  fi
}

# ── Abrir IDE ────────────────────────────────────────────────────────────────
open_ide() {
  local platform=$1
  echo -e "\n${BLUE}Abrindo IDE para $platform...${NC}"

  if [ "$platform" = "android" ]; then
    npx cap open android
  elif [ "$platform" = "ios" ]; then
    npx cap open ios
  fi
}

# ── MAIN ─────────────────────────────────────────────────────────────────────
COMMAND=${1:-"help"}
PLATFORM=${2:-"android"}

case $COMMAND in
  "setup")
    echo -e "${PURPLE}Modo: Setup completo para $PLATFORM${NC}\n"
    check_requirements $PLATFORM
    install_deps
    generate_assets
    init_capacitor
    add_platforms $PLATFORM
    sync_assets
    echo -e "\n${GREEN}════════════════════════════════════════${NC}"
    echo -e "${GREEN}✓ Setup completo! Próximos passos:${NC}"
    if [ "$PLATFORM" = "android" ] || [ "$PLATFORM" = "all" ]; then
      echo -e "  ${YELLOW}Android:${NC} npm run cap:open:android"
      echo -e "           → No Android Studio: Build → Generate Signed Bundle"
    fi
    if [ "$PLATFORM" = "ios" ] || [ "$PLATFORM" = "all" ]; then
      echo -e "  ${YELLOW}iOS:${NC}     npm run cap:open:ios"
      echo -e "           → No Xcode: Product → Archive"
    fi
    echo -e "${GREEN}════════════════════════════════════════${NC}"
    ;;

  "sync")
    echo -e "${PURPLE}Modo: Sincronizar assets${NC}\n"
    sync_assets
    ;;

  "build")
    echo -e "${PURPLE}Modo: Build de release para $PLATFORM${NC}\n"
    check_requirements $PLATFORM
    sync_assets
    build_release $PLATFORM
    ;;

  "open")
    open_ide $PLATFORM
    ;;

  "update")
    echo -e "${PURPLE}Modo: Atualizar dependências Capacitor${NC}\n"
    npm install
    npx cap update
    sync_assets
    echo -e "${GREEN}✓ Atualizado com sucesso${NC}"
    ;;

  "help"|*)
    echo -e "Uso: ${YELLOW}./build.sh [comando] [plataforma]${NC}"
    echo ""
    echo -e "Comandos:"
    echo -e "  ${GREEN}setup${NC}   [android|ios|all]  — Setup completo (primeira vez)"
    echo -e "  ${GREEN}sync${NC}                       — Sincronizar assets web → nativo"
    echo -e "  ${GREEN}build${NC}   [android|ios|all]  — Gerar build de release"
    echo -e "  ${GREEN}open${NC}    [android|ios]      — Abrir Android Studio / Xcode"
    echo -e "  ${GREEN}update${NC}                     — Atualizar dependências Capacitor"
    echo ""
    echo -e "Exemplos:"
    echo -e "  ${YELLOW}./build.sh setup android${NC}   # Primeira vez no Android"
    echo -e "  ${YELLOW}./build.sh setup ios${NC}       # Primeira vez no iOS (macOS)"
    echo -e "  ${YELLOW}./build.sh sync${NC}            # Após editar o app web"
    echo -e "  ${YELLOW}./build.sh build android${NC}   # Gerar AAB para Play Store"
    echo -e "  ${YELLOW}./build.sh open android${NC}    # Abrir Android Studio"
    ;;
esac