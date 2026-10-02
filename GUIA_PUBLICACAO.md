# 📱 Guia Completo de Publicação nas Lojas
## Redescobrindo o Sentido da Vida — PWA + Capacitor

> **Tempo estimado:** Android ~3 dias (revisão do Google) · iOS ~7 dias (revisão da Apple)

---

## 📋 Índice

1. [Visão Geral da Arquitetura](#1-visão-geral)
2. [Pré-requisitos de Ambiente](#2-pré-requisitos)
3. [Passo 1 — Instalar Dependências](#3-instalar-dependências)
4. [Passo 2 — Configurar Capacitor](#4-configurar-capacitor)
5. [Passo 3 — Android (Play Store)](#5-android-play-store)
6. [Passo 4 — iOS (App Store)](#6-ios-app-store)
7. [Configurações de Loja](#7-configurações-de-loja)
8. [Checklist Final](#8-checklist-final)
9. [Manutenção e Atualizações](#9-manutenção)
10. [Solução de Problemas](#10-problemas-comuns)

---

## 1. Visão Geral

```
┌─────────────────────────────────────────────────────────┐
│                  ARQUITETURA DO APP                      │
│                                                         │
│  app/                  ← Seu app web (HTML/CSS/JS)      │
│  ├── index.html        ← PWA com meta tags              │
│  ├── manifest.json     ← Configuração PWA               │
│  ├── sw.js             ← Service Worker (offline)       │
│  ├── style.css         ← Estilos                        │
│  ├── app.js            ← Lógica principal               │
│  ├── data.js           ← Dados dos módulos              │
│  ├── pdf-export.js     ← Exportação PDF                 │
│  └── icons/            ← Ícones PNG gerados             │
│                                                         │
│  capacitor.config.json ← Config do Capacitor            │
│  package.json          ← Dependências npm               │
│  build.sh              ← Script de build                │
│                                                         │
│  android/              ← Gerado pelo Capacitor          │
│  ios/                  ← Gerado pelo Capacitor          │
└─────────────────────────────────────────────────────────┘

Fluxo:
  app web → Capacitor → Android Studio → Play Store
                     → Xcode          → App Store
```

---

## 2. Pré-requisitos

### 🖥️ Sistema Operacional
| Plataforma | Windows | macOS | Linux |
|---|---|---|---|
| Android | ✅ | ✅ | ✅ |
| iOS | ❌ | ✅ apenas | ❌ |

### 📦 Software Necessário

#### Para Android e iOS:
```bash
# Node.js 18+ (https://nodejs.org)
node --version   # deve ser >= 18.0.0

# Java JDK 17 (para Android)
# Download: https://adoptium.net/
java --version   # deve ser >= 17
```

#### Para Android:
```bash
# Android Studio (inclui SDK e emulador)
# Download: https://developer.android.com/studio

# Após instalar, configure:
export ANDROID_HOME=$HOME/Android/Sdk          # Linux/Mac
export ANDROID_HOME=%LOCALAPPDATA%\Android\Sdk  # Windows

export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/platform-tools

# Verificar:
adb --version
```

#### Para iOS (macOS apenas):
```bash
# Xcode 15+ (App Store do Mac)
xcode-select --install

# CocoaPods
sudo gem install cocoapods
pod --version   # deve ser >= 1.12

# Verificar Xcode:
xcodebuild -version
```

### 💳 Contas de Desenvolvedor
| Loja | Custo | URL |
|---|---|---|
| Google Play Console | USD $25 (único) | https://play.google.com/console |
| Apple Developer Program | USD $99/ano | https://developer.apple.com/programs |

---

## 3. Instalar Dependências

```bash
# Clone ou extraia o projeto
cd redescobrindo-sentido-vida

# Instalar dependências npm
npm install

# Verificar instalação do Capacitor CLI
npx cap --version
```

---

## 4. Configurar Capacitor

### 4.1 Inicializar (primeira vez)
```bash
# O capacitor.config.json já está configurado.
# Apenas adicione as plataformas:

# Android
npm run cap:add:android
# ou: npx cap add android

# iOS (macOS apenas)
npm run cap:add:ios
# ou: npx cap add ios
```

### 4.2 Sincronizar após mudanças no app web
```bash
# Sempre que editar arquivos em app/
npm run cap:sync
# ou: npx cap sync

# Apenas copiar (sem atualizar plugins)
npm run cap:copy
# ou: npx cap copy
```

### 4.3 Verificar configuração
```bash
npx cap doctor
```

---

## 5. Android — Play Store

### 5.1 Configurar o projeto Android

```bash
# Abrir no Android Studio
npm run cap:open:android
# ou: npx cap open android
```

No Android Studio, aguarde o Gradle sync completar (~2-5 min na primeira vez).

### 5.2 Personalizar o app Android

**Arquivo: `android/app/src/main/res/values/strings.xml`**
```xml
<resources>
    <string name="app_name">Sentido da Vida</string>
    <string name="title_activity_main">Sentido da Vida</string>
    <string name="package_name">com.redescobrindosentido.app</string>
    <string name="custom_url_scheme">com.redescobrindosentido.app</string>
</resources>
```

**Arquivo: `android/app/build.gradle`** — verifique:
```gradle
android {
    compileSdkVersion 34
    defaultConfig {
        applicationId "com.redescobrindosentido.app"
        minSdkVersion 22
        targetSdkVersion 34
        versionCode 1
        versionName "1.0.0"
    }
}
```

### 5.3 Gerar Keystore (assinatura do app)

> ⚠️ **GUARDE O KEYSTORE COM SEGURANÇA!** Sem ele, você não pode atualizar o app na Play Store.

```bash
# Gerar keystore (execute UMA VEZ e guarde o arquivo)
keytool -genkey -v \
  -keystore release.keystore \
  -alias sentidodavida \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000

# Você será solicitado a criar senhas — ANOTE-AS!
# Preencha: nome, organização, cidade, estado, país
```

**Configurar assinatura no `android/app/build.gradle`:**
```gradle
android {
    signingConfigs {
        release {
            storeFile file('../../release.keystore')
            storePassword 'SUA_SENHA_KEYSTORE'
            keyAlias 'sentidodavida'
            keyPassword 'SUA_SENHA_KEY'
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```

> 💡 **Melhor prática:** Use variáveis de ambiente ou `local.properties` para não commitar senhas.

### 5.4 Gerar AAB para Play Store

```bash
# Via script
npm run android:release

# Via Android Studio:
# Build → Generate Signed Bundle/APK → Android App Bundle → release

# O arquivo gerado estará em:
# android/app/build/outputs/bundle/release/app-release.aab
```

### 5.5 Publicar na Play Store

1. Acesse [Google Play Console](https://play.google.com/console)
2. **Criar app** → Preencha:
   - Nome: `Redescobrindo o Sentido da Vida`
   - Idioma padrão: `Português (Brasil)`
   - Tipo: `App`
   - Categoria: `Saúde e bem-estar`
   - Gratuito ou pago
3. **Configuração do app:**
   - Acesso ao app: `Disponível para todos`
   - Anúncios: `Não contém anúncios`
   - Classificação de conteúdo: Complete o questionário (resultado esperado: **Livre**)
   - Público-alvo: `18+` (conteúdo de saúde mental)
   - Dados do usuário: Preencha a política de privacidade
4. **Presença na loja:**
   - Ícone: `512x512 PNG` (use `app/icons/icon-512.png`)
   - Gráfico de recursos: `1024x500 PNG` (crie um banner)
   - Screenshots: mínimo 2, máximo 8 por tipo de dispositivo
   - Descrição curta (80 chars): `Redescubra seu propósito com a Logoterapia de Viktor Frankl`
   - Descrição completa: veja seção 7
5. **Versões → Produção → Criar nova versão:**
   - Upload do `.aab`
   - Notas da versão
   - Revisar e publicar

### 5.6 Permissões Android

O app usa apenas:
- `INTERNET` — para carregar fontes Google
- `VIBRATE` — para feedback háptico
- Sem câmera, localização, contatos ou microfone

---

## 6. iOS — App Store

> ⚠️ **Requer macOS com Xcode instalado**

### 6.1 Abrir no Xcode

```bash
npm run cap:open:ios
# ou: npx cap open ios
```

### 6.2 Configurar o projeto iOS

No Xcode, selecione o target `App`:

**General:**
- Display Name: `Sentido da Vida`
- Bundle Identifier: `com.redescobrindosentido.app`
- Version: `1.0.0`
- Build: `1`
- Deployment Target: `iOS 14.0+`

**Signing & Capabilities:**
- Team: Selecione sua conta Apple Developer
- Automatically manage signing: ✅
- Bundle Identifier: `com.redescobrindosentido.app`

### 6.3 Configurar Info.plist

Adicione em `ios/App/App/Info.plist`:
```xml
<!-- Descrição de uso (obrigatório para App Store) -->
<key>NSUserTrackingUsageDescription</key>
<string>Este app não rastreia seus dados.</string>

<!-- Suporte a telas -->
<key>UISupportedInterfaceOrientations</key>
<array>
    <string>UIInterfaceOrientationPortrait</string>
    <string>UIInterfaceOrientationPortraitUpsideDown</string>
</array>

<!-- Modo escuro -->
<key>UIUserInterfaceStyle</key>
<string>Dark</string>
```

### 6.4 Instalar dependências iOS

```bash
cd ios/App
pod install
cd ../..
```

### 6.5 Gerar Archive para App Store

No Xcode:
1. Selecione destino: `Any iOS Device (arm64)`
2. Menu: `Product → Archive`
3. Aguarde o build (~5-10 min)
4. Na janela Organizer: `Distribute App → App Store Connect → Upload`

### 6.6 Publicar na App Store

1. Acesse [App Store Connect](https://appstoreconnect.apple.com)
2. **Meus Apps → +** → Nova app:
   - Plataformas: iOS
   - Nome: `Redescobrindo o Sentido da Vida`
   - Idioma principal: Português (Brasil)
   - Bundle ID: `com.redescobrindosentido.app`
   - SKU: `RSV001`
3. **Informações da app:**
   - Categoria principal: `Saúde e forma física`
   - Categoria secundária: `Educação`
   - Classificação: `4+`
4. **Preços e disponibilidade:**
   - Gratuito ou pago (configure In-App Purchases se necessário)
5. **Preparar para envio:**
   - Screenshots: iPhone 6.7", 6.5", 5.5" (obrigatório)
   - iPad screenshots (se suportar iPad)
   - Ícone: `1024x1024 PNG` sem transparência
   - Descrição, palavras-chave, URL de suporte
6. **Build:** Selecione o build enviado via Xcode
7. **Enviar para revisão**

---

## 7. Configurações de Loja

### 📝 Textos para as Lojas

**Nome do App:**
```
Redescobrindo o Sentido da Vida
```

**Subtítulo (iOS, 30 chars):**
```
Logoterapia de Viktor Frankl
```

**Descrição Curta (Google Play, 80 chars):**
```
Redescubra seu propósito com a Logoterapia de Viktor Frankl em 7 semanas
```

**Descrição Completa:**
```
🌟 REDESCOBRINDO O SENTIDO DA VIDA

Um programa estruturado de 7 semanas para redescobrir seu propósito, 
baseado na Logoterapia de Viktor Frankl, Psicologia Positiva, 
Neurociência e Terapia Cognitivo-Comportamental.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🧠 BASEADO EM CIÊNCIA
Estudos demonstram que a percepção de significado na vida está associada 
a uma redução de 15% no risco de mortalidade. Viktor Frankl, sobrevivente 
do Holocausto e psiquiatra, desenvolveu a Logoterapia — a "Terceira Escola 
Vienense de Psicoterapia" — que ajudou milhões de pessoas a encontrar 
sentido mesmo nas circunstâncias mais adversas.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📚 OS 7 MÓDULOS DO PROGRAMA

🌅 Módulo 1 — Despertar Existencial
Reconheça os sinais do vazio existencial e abra-se para o sentido.

📖 Módulo 2 — Compreendendo Sua História
Integre o passado como fonte de sentido e resiliência.

💎 Módulo 3 — Descobrindo Valores Essenciais
Identifique o que realmente importa para você.

🎯 Módulo 4 — Encontrando Propósito
Da busca ao descobrimento do seu sentido único com a ferramenta Ikigai.

🦋 Módulo 5 — Autotranscendência
Vá além de si mesmo em direção ao outro e a causas maiores.

🔥 Módulo 6 — Transformando o Sofrimento
Encontre sentido nas circunstâncias mais difíceis.

🌟 Módulo 7 — Construindo uma Vida com Significado
Integre todos os aprendizados em um plano de vida concreto.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✨ RECURSOS DO APP

• Exercícios práticos interativos por módulo
• Termômetro de Sentido de Vida (acompanhe sua evolução)
• Ferramenta Ikigai expandida
• Diário de reflexões semanais
• Manifesto de Vida pessoal
• Exportação de relatório completo em PDF
• Funciona 100% offline
• Seus dados ficam apenas no seu dispositivo
• Certificado de conclusão

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔒 PRIVACIDADE
Todos os seus dados são armazenados localmente no seu dispositivo. 
Não coletamos, vendemos ou compartilhamos nenhuma informação pessoal.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ AVISO
Este app é uma ferramenta de autoconhecimento e desenvolvimento pessoal. 
Não substitui acompanhamento psicológico ou psiquiátrico profissional. 
Se você está em sofrimento intenso, procure um profissional de saúde mental.
```

**Palavras-chave (iOS, separadas por vírgula):**
```
logoterapia,Viktor Frankl,sentido da vida,propósito,autoconhecimento,psicologia positiva,TCC,bem-estar,mindfulness,desenvolvimento pessoal
```

**Tags (Google Play):**
```
logoterapia, sentido da vida, Viktor Frankl, propósito, autoconhecimento, 
psicologia positiva, bem-estar mental, desenvolvimento pessoal, TCC
```

### 🔒 Política de Privacidade

Você **precisa** de uma URL de política de privacidade. Crie uma página simples com:

```
POLÍTICA DE PRIVACIDADE — Redescobrindo o Sentido da Vida

Última atualização: [data]

1. DADOS COLETADOS
Este aplicativo NÃO coleta nenhum dado pessoal. Todas as suas respostas, 
reflexões e progresso são armazenados exclusivamente no armazenamento local 
do seu dispositivo (localStorage).

2. COMPARTILHAMENTO DE DADOS
Não compartilhamos, vendemos ou transferimos nenhum dado para terceiros.

3. FONTES EXTERNAS
O app carrega fontes tipográficas do Google Fonts. Consulte a política 
de privacidade do Google: https://policies.google.com/privacy

4. CONTATO
[seu email de contato]
```

Hospede em: GitHub Pages, Notion, Google Sites (gratuito).

---

## 8. Checklist Final

### ✅ Antes de Publicar

**App Web (PWA):**
- [ ] `manifest.json` configurado com nome, ícones e cores corretas
- [ ] `sw.js` registrado e funcionando (teste offline)
- [ ] Todos os ícones PNG gerados (72 a 512px)
- [ ] `apple-touch-icon.png` (180x180) presente
- [ ] App funciona offline completamente
- [ ] Testado em Chrome, Firefox, Safari e Edge
- [ ] Testado em dispositivos móveis reais

**Android:**
- [ ] `applicationId` único: `com.redescobrindosentido.app`
- [ ] `versionCode` e `versionName` corretos
- [ ] Keystore gerado e guardado com segurança
- [ ] App assinado com keystore de release
- [ ] AAB gerado sem erros
- [ ] Testado em emulador Android (API 22+)
- [ ] Testado em dispositivo físico Android
- [ ] Screenshots capturadas (mínimo 2)
- [ ] Ícone 512x512 PNG preparado
- [ ] Gráfico de recursos 1024x500 PNG preparado
- [ ] Política de privacidade publicada na web
- [ ] Classificação de conteúdo preenchida

**iOS:**
- [ ] Bundle ID único: `com.redescobrindosentido.app`
- [ ] Certificado de distribuição configurado
- [ ] Provisioning profile criado
- [ ] Archive gerado sem erros no Xcode
- [ ] Testado em simulador iOS (14+)
- [ ] Testado em dispositivo físico iOS
- [ ] Screenshots para iPhone 6.7", 6.5", 5.5"
- [ ] Ícone 1024x1024 PNG sem transparência
- [ ] Política de privacidade publicada
- [ ] Informações de contato preenchidas

---

## 9. Manutenção e Atualizações

### Atualizar o app após mudanças

```bash
# 1. Edite os arquivos em app/
# 2. Sincronize com as plataformas nativas
npm run cap:sync

# 3. Para Android: incremente versionCode em android/app/build.gradle
#    versionCode 2  (incrementar a cada release)
#    versionName "1.1.0"

# 4. Gere novo AAB
npm run android:release

# 5. Para iOS: incremente Build no Xcode e faça novo Archive
```

### Versionamento recomendado
```
versionName: MAJOR.MINOR.PATCH
  1.0.0 → lançamento inicial
  1.0.1 → correção de bugs
  1.1.0 → nova funcionalidade
  2.0.0 → mudança grande

versionCode: número inteiro sempre crescente
  1, 2, 3, 4... (nunca pode diminuir)
```

---

## 10. Problemas Comuns

### ❌ `ANDROID_HOME not set`
```bash
# Linux/Mac — adicione ao ~/.bashrc ou ~/.zshrc:
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/platform-tools

# Windows — variáveis de ambiente do sistema:
ANDROID_HOME = C:\Users\SEU_USUARIO\AppData\Local\Android\Sdk
```

### ❌ `Gradle build failed`
```bash
cd android
./gradlew clean
./gradlew bundleRelease
```

### ❌ `pod install failed` (iOS)
```bash
cd ios/App
pod deintegrate
pod install
```

### ❌ `Service Worker não registra`
- O SW só funciona em HTTPS ou localhost
- Para testar localmente: `npx serve app -p 3000`
- Verifique o caminho: `/sw.js` deve estar na raiz do `webDir`

### ❌ `App não aparece como instalável (PWA)`
- Verifique se `manifest.json` está linkado no HTML
- Verifique se o SW está registrado (DevTools → Application)
- O app precisa ser servido via HTTPS
- Chrome requer: SW registrado + manifest válido + HTTPS

### ❌ `Ícones não aparecem no Android`
```bash
# Regenerar assets do Capacitor
npx @capacitor/assets generate \
  --assetPath app/icons/icon-512.png \
  --iconBackgroundColor '#0f0f1a'
npx cap sync
```

### ❌ `White screen no iOS`
- Verifique `ios/App/App/capacitor.config.json`
- Certifique-se que `webDir` aponta para `app`
- Limpe o build: `Product → Clean Build Folder` no Xcode

### ❌ `localStorage não persiste no iOS`
- Em modo privado/incógnito, localStorage é limitado
- Considere migrar para `@capacitor/preferences` para maior confiabilidade:
```javascript
import { Preferences } from '@capacitor/preferences';
await Preferences.set({ key: 'rsv_state', value: JSON.stringify(state) });
const { value } = await Preferences.get({ key: 'rsv_state' });
```

---

## 📞 Recursos Úteis

| Recurso | URL |
|---|---|
| Documentação Capacitor | https://capacitorjs.com/docs |
| Google Play Console | https://play.google.com/console |
| App Store Connect | https://appstoreconnect.apple.com |
| Android Studio | https://developer.android.com/studio |
| Xcode | https://developer.apple.com/xcode |
| PWA Builder (Microsoft) | https://www.pwabuilder.com |
| Lighthouse (auditoria PWA) | Chrome DevTools → Lighthouse |
| Capacitor Community Plugins | https://github.com/capacitor-community |

---

*"A última das liberdades humanas é a de escolher a própria atitude em qualquer conjunto de circunstâncias." — Viktor Frankl*