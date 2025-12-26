# 🚀 Guía Paso a Paso: Deploy a Vercel

Esta guía te llevará desde cero hasta tener tu PDF Splitter en producción.

## 📋 Pre-requisitos

- Git instalado
- Cuenta en GitHub (gratis)
- Cuenta en Vercel (gratis)

## 🎯 Paso 1: Probar Localmente

Primero asegúrate de que todo funciona localmente:

```bash
# Navega al directorio deploy
cd deploy

# Instala dependencias
npm install

# Ejecuta el servidor de desarrollo
npm run dev
```

Esto abrirá automáticamente http://localhost:8000 en tu navegador.

**Verifica**:
- ✅ El selector de idioma funciona (ES/EN/PT)
- ✅ El toggle de tema funciona (Dark/Light)
- ✅ Puedes cargar y dividir un PDF
- ✅ El banner de cookies aparece
- ✅ Las traducciones funcionan correctamente

## 🔧 Paso 2: Configurar IDs (Opcional por ahora)

Por ahora puedes dejar los placeholders. Más adelante, cuando tengas tus cuentas de AdSense y Analytics, actualizarás:

**Para AdSense**: `index.html` (líneas 71, 83, 241)
**Para Analytics**: `js/app.js` (línea 73)

## 📦 Paso 3: Inicializar Git (si aún no lo has hecho)

```bash
# En el directorio deploy
git init
git add .
git commit -m "Initial commit: PDF Splitter production version"
```

## 🌐 Paso 4: Crear Repositorio en GitHub

### Opción A: Desde la Web (Más fácil)

1. Ve a https://github.com/new
2. Nombre del repo: `pdf-splitter` (o el que prefieras)
3. Descripción: "Free online PDF splitter tool"
4. **NO marques** "Initialize this repository with a README" (ya tienes uno)
5. Click en "Create repository"

### Opción B: Desde la Línea de Comandos

GitHub te mostrará instrucciones como estas:

```bash
# Conecta tu repo local con GitHub
git remote add origin https://github.com/TU_USUARIO/pdf-splitter.git
git branch -M main
git push -u origin main
```

Reemplaza `TU_USUARIO` con tu nombre de usuario de GitHub.

## 🚀 Paso 5: Deploy en Vercel

### Opción A: Importar desde GitHub (Recomendado)

1. Ve a https://vercel.com
2. Click en "Sign Up" o "Login"
3. **Importante**: Inicia sesión con GitHub
4. Click en "New Project"
5. Importa tu repositorio `pdf-splitter`
6. Vercel detectará automáticamente que es un sitio estático
7. **No necesitas cambiar ninguna configuración**
8. Click en "Deploy"

¡Listo! En 1-2 minutos tu sitio estará en vivo.

### Opción B: Vercel CLI

```bash
# Instala Vercel CLI globalmente
npm install -g vercel

# Desde el directorio deploy
vercel

# Sigue las instrucciones:
# - Link to existing project? No
# - Project name? pdf-splitter (o el que prefieras)
# - Directory? ./ (actual)
# - Auto-detect? Yes

# Para deploy a producción
vercel --prod
```

## 🎉 Paso 6: Tu Sitio Está en Vivo

Vercel te dará una URL como: `https://pdf-splitter-xxxxx.vercel.app`

**Ahora puedes**:
- Compartir el link
- Configurar un dominio personalizado (opcional)
- Ver analytics de Vercel

## 🔄 Paso 7: Actualizaciones Futuras

Cada vez que hagas cambios:

```bash
# Haz tus cambios en los archivos
# Luego:

git add .
git commit -m "Descripción de tus cambios"
git push

# Vercel automáticamente detectará el push y re-deployará
# ¡No necesitas hacer nada más!
```

## 🎨 Paso 8: Configurar Dominio Personalizado (Opcional)

1. En Vercel Dashboard → tu proyecto → Settings → Domains
2. Agrega tu dominio (ej: `mipdfsplitter.com`)
3. Sigue las instrucciones para configurar DNS
4. Vercel configurará automáticamente HTTPS

## 💰 Paso 9: Configurar Monetización (Cuando estés listo)

### Google AdSense

1. Aplica en https://www.google.com/adsense
2. Agrega tu dominio de Vercel
3. Espera aprobación (1-2 semanas)
4. Una vez aprobado:
   - Copia tu Publisher ID (ca-pub-XXXXXXXXXXXXXXXX)
   - Actualiza `index.html` (líneas 71, 83, 241)
   - Crea ad units y copia los slot IDs
   - Haz commit y push

### Google Analytics 4

1. Ve a https://analytics.google.com
2. Crea una propiedad
3. Copia el Measurement ID (G-XXXXXXXXXX)
4. Actualiza `js/app.js` línea 73
5. Haz commit y push

## 📊 Monitoreo

### Ver Deployments
- Vercel Dashboard: https://vercel.com/dashboard
- Cada deploy tiene su preview URL
- Logs en tiempo real
- Analytics de performance

### Ver Analytics (después de configurar GA4)
- Google Analytics: https://analytics.google.com
- Ver visitantes en tiempo real
- Reportes de engagement
- Eventos personalizados

## 🐛 Solución de Problemas

### "Error: Cannot find module 'http-server'"
```bash
npm install
```

### "Permission denied" en Git
```bash
# Verifica tu autenticación de GitHub
git config --global user.name "Tu Nombre"
git config --global user.email "tu@email.com"
```

### Los archivos JSON no se cargan (404 en /locales/*.json)
- Verifica que la carpeta `locales` esté en el root del deploy
- Verifica que los archivos estén incluidos en git: `git status`
- Si no están: `git add locales/ && git commit -m "Add locales" && git push`

### El sitio no se ve en mobile
- Vercel sirve automáticamente con HTTPS
- Prueba en modo incógnito
- Limpia caché del navegador

### Las traducciones no cambian
- Abre DevTools (F12) → Console
- Busca errores
- Verifica que los archivos JSON estén correctos (sin comas finales)

## ✅ Checklist Final

Antes de compartir tu sitio:

- [ ] Probado localmente con `npm run dev`
- [ ] Selector de idioma funciona (ES/EN/PT)
- [ ] Toggle de tema funciona (Dark/Light)
- [ ] PDFs se pueden cargar y dividir
- [ ] Banner de cookies aparece
- [ ] Repositorio en GitHub
- [ ] Deploy en Vercel exitoso
- [ ] Sitio accesible desde la URL de Vercel
- [ ] Probado en mobile
- [ ] (Opcional) Dominio personalizado configurado
- [ ] (Opcional) AdSense configurado
- [ ] (Opcional) Analytics configurado

## 🎊 ¡Felicitaciones!

Tienes tu PDF Splitter en producción. Ahora puedes:

1. **Compartir**: Envía el link a amigos/redes sociales
2. **Mejorar**: Agrega features, mejora el diseño
3. **Monetizar**: Solicita AdSense cuando tengas tráfico
4. **Promover**: SEO, redes sociales, directorios de herramientas

## 📞 Necesitas Ayuda?

- **GitHub Issues**: Crea un issue en tu repo
- **Vercel Support**: https://vercel.com/support
- **AdSense Help**: https://support.google.com/adsense

---

¡Buena suerte con tu proyecto! 🚀
