# 🚀 Guía de Despliegue en Vercel - P.A.S.O. Campaign Hub

## ✅ Pre-requisitos Completados

- ✅ Build de producción funciona correctamente
- ✅ Configuración de Tailwind CSS optimizada
- ✅ Variables de entorno configuradas para Vite
- ✅ Archivo `vercel.json` listo

## 📦 Opción 1: Despliegue desde la Terminal (Recomendado)

### Paso 1: Instalar Vercel CLI

```bash
npm install -g vercel
```

### Paso 2: Iniciar sesión en Vercel

```bash
vercel login
```

Esto abrirá tu navegador para que inicies sesión con tu cuenta de Vercel.

### Paso 3: Desplegar

Desde la carpeta del proyecto, ejecuta:

```bash
vercel
```

El CLI te hará algunas preguntas:
- **Set up and deploy?** → `Y` (Sí)
- **Which scope?** → Selecciona tu cuenta
- **Link to existing project?** → `N` (No, si es la primera vez)
- **What's your project's name?** → `paso-campaign-hub` (o el nombre que prefieras)
- **In which directory is your code located?** → `./` (presiona Enter)

Vercel detectará automáticamente que es un proyecto Vite y usará la configuración correcta.

### Paso 4: Configurar la Variable de Entorno

Después del primer despliegue, necesitas agregar tu API key:

```bash
vercel env add VITE_GEMINI_API_KEY
```

Cuando te pregunte:
- **What's the value?** → Pega tu API key de Google Gemini
- **Add to which environments?** → Selecciona `Production`, `Preview`, y `Development`

### Paso 5: Redesplegar con la Variable de Entorno

```bash
vercel --prod
```

¡Listo! Tu aplicación estará disponible en la URL que te proporcione Vercel.

---

## 🌐 Opción 2: Despliegue desde el Dashboard de Vercel

### Paso 1: Subir el código a GitHub

Si aún no lo has hecho:

```bash
git add .
git commit -m "Preparado para despliegue en Vercel"
git push origin main
```

### Paso 2: Importar en Vercel

1. Ve a [vercel.com/new](https://vercel.com/new)
2. Haz clic en **"Import Git Repository"**
3. Selecciona tu repositorio **PASO**
4. Vercel detectará automáticamente que es un proyecto Vite

### Paso 3: Configurar Variables de Entorno

**ANTES de hacer clic en "Deploy":**

1. En la sección **"Environment Variables"**, agrega:
   - **Name:** `VITE_GEMINI_API_KEY`
   - **Value:** Tu API key de Google Gemini (obtén una en [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey))
   - **Environments:** Selecciona `Production`, `Preview`, y `Development`

2. Haz clic en **"Add"**

### Paso 4: Desplegar

Haz clic en **"Deploy"** y espera aproximadamente 1-2 minutos.

---

## 🔧 Configuración Automática de Vercel

Gracias al archivo `vercel.json`, Vercel usará automáticamente:

```json
{
    "buildCommand": "npm run build",
    "outputDirectory": "dist"
}
```

No necesitas configurar nada más manualmente.

---

## ✅ Verificar el Despliegue

Una vez completado el despliegue:

1. **Visita la URL** que te proporcione Vercel (algo como `https://paso-campaign-hub.vercel.app`)
2. **Verifica que cargue** con el tema oscuro cyberpunk
3. **Abre la consola del navegador** (F12) y verifica que no haya errores
4. **Prueba una funcionalidad** que use la API, como:
   - Oráculo Sindical (Consultorio)
   - Generador de Posts
   - Validador de Acrónimos

---

## ⚠️ Solución de Problemas

### Error: "An API Key must be set when running in a browser"

**Causa:** La variable de entorno no está configurada en Vercel.

**Solución:**
1. Ve a tu proyecto en [vercel.com/dashboard](https://vercel.com/dashboard)
2. **Settings** → **Environment Variables**
3. Agrega `VITE_GEMINI_API_KEY` con tu API key
4. **Deployments** → Selecciona el último → **Redeploy**

### La página carga pero las funcionalidades de IA no funcionan

**Verifica:**
- ✅ Que la API key sea válida
- ✅ Que tengas habilitada la API de Gemini en Google AI Studio
- ✅ Que la variable de entorno esté en las tres opciones (Production, Preview, Development)

### Build falla en Vercel

**Revisa los logs** en el dashboard de Vercel. Los errores más comunes:
- Falta alguna dependencia en `package.json`
- Error de TypeScript (poco probable, ya que el build local funciona)

---

## 📝 Comandos Útiles

```bash
# Ver el estado de tu proyecto
vercel

# Desplegar a producción
vercel --prod

# Ver logs en tiempo real
vercel logs

# Listar todas tus variables de entorno
vercel env ls

# Eliminar un despliegue
vercel remove [deployment-url]
```

---

## 🎯 Próximos Pasos Después del Despliegue

1. **Configura un dominio personalizado** (opcional):
   - Ve a **Settings** → **Domains** en tu proyecto de Vercel
   - Agrega tu dominio personalizado

2. **Habilita Analytics** (opcional):
   - Vercel ofrece analytics gratuitos
   - Ve a **Analytics** en tu proyecto

3. **Configura notificaciones**:
   - Puedes recibir notificaciones de despliegues en Slack, Discord, etc.

---

## 🔗 Enlaces Útiles

- 📊 [Dashboard de Vercel](https://vercel.com/dashboard)
- 🔑 [Google AI Studio - API Keys](https://aistudio.google.com/app/apikey)
- 📖 [Documentación de Vercel](https://vercel.com/docs)
- 🌍 [Variables de Entorno en Vercel](https://vercel.com/docs/projects/environment-variables)

---

## 💡 Notas Importantes

- ✅ El archivo `.env.local` **NO se sube a Git** por seguridad
- ✅ Cada vez que hagas `git push`, Vercel desplegará automáticamente
- ✅ Los despliegues de ramas que no sean `main` serán "Preview Deployments"
- ✅ El build tarda aproximadamente 1-2 minutos

---

¡Tu aplicación P.A.S.O. Campaign Hub está lista para el mundo! 🎉
