# 🚀 Deployment en Vercel - P.A.S.O. Campaign Hub

## 📋 Pasos para configurar en Vercel

### 1. Configurar Variables de Entorno

Después de hacer el deployment inicial, necesitas configurar la API key:

1. Ve a tu proyecto en Vercel: https://vercel.com/dashboard
2. Selecciona tu proyecto **PASO**
3. Ve a **Settings** → **Environment Variables**
4. Agrega la siguiente variable:

   | Name | Value | Environments |
   |------|-------|--------------|
   | `VITE_GEMINI_API_KEY` | Tu API key de Google Gemini | Production, Preview, Development |

5. **Obtén tu API key** en: https://aistudio.google.com/app/apikey

### 2. Redeploy

Después de configurar la variable de entorno:

1. Ve a **Deployments**
2. En el último deployment, haz clic en los tres puntos (⋮)
3. Selecciona **Redeploy**
4. Espera a que termine el build (~30 segundos)

### 3. Verificar

Una vez completado el redeploy:
- Visita tu URL de Vercel
- La aplicación debería cargar correctamente (sin pantalla negra)
- Prueba alguna funcionalidad que use la API (ej: Oráculo Sindical)

## ⚠️ Solución de Problemas

### Pantalla negra después del deployment
- **Causa**: Falta la variable de entorno `VITE_GEMINI_API_KEY`
- **Solución**: Sigue los pasos 1 y 2 de arriba

### Error de API en consola
- Abre las DevTools del navegador (F12)
- Ve a la pestaña **Console**
- Si ves errores relacionados con "API key", verifica que la variable esté configurada correctamente en Vercel

### Build exitoso pero funcionalidades no funcionan
- Verifica que la API key sea válida
- Asegúrate de tener habilitada la API de Gemini en Google Cloud Console
- Revisa que la API key tenga permisos para usar Gemini API

## 📝 Notas

- El archivo `.env.local` **NO se sube a Git** por seguridad
- Debes configurar las variables de entorno manualmente en cada plataforma de deployment
- Vercel automáticamente detecta que es un proyecto Vite y usa `npm run build`

## 🔗 Enlaces Útiles

- [Dashboard de Vercel](https://vercel.com/dashboard)
- [Google AI Studio - API Keys](https://aistudio.google.com/app/apikey)
- [Documentación de Vercel - Environment Variables](https://vercel.com/docs/projects/environment-variables)
