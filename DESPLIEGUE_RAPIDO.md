# 🚀 DESPLIEGUE RÁPIDO EN VERCEL

## ✅ Tu aplicación está lista para desplegarse

El build de producción se completó exitosamente:
- ✅ Tamaño del bundle: ~1.3 MB (optimizado)
- ✅ Tailwind CSS configurado correctamente
- ✅ Variables de entorno preparadas

---

## 🎯 ELIGE TU MÉTODO DE DESPLIEGUE

### 🔵 OPCIÓN A: Desde el Dashboard (MÁS FÁCIL - Recomendado)

**Pasos:**

1. **Sube tu código a GitHub** (si no lo has hecho):
   ```bash
   git add .
   git commit -m "Listo para Vercel"
   git push origin main
   ```

2. **Ve a Vercel:**
   - Abre: https://vercel.com/new
   - Inicia sesión con GitHub
   - Haz clic en **"Import Git Repository"**
   - Selecciona tu repositorio **PASO**

3. **Configura la Variable de Entorno:**
   - ANTES de hacer clic en "Deploy"
   - En "Environment Variables", agrega:
     - **Name:** `VITE_GEMINI_API_KEY`
     - **Value:** [Tu API key de Google Gemini]
     - **Environments:** Marca las 3 opciones (Production, Preview, Development)
   - Haz clic en "Add"

4. **Despliega:**
   - Haz clic en **"Deploy"**
   - Espera 1-2 minutos
   - ¡Listo! 🎉

**Obtén tu API key aquí:** https://aistudio.google.com/app/apikey

---

### 🟢 OPCIÓN B: Desde la Terminal (Para desarrolladores)

**Pasos:**

1. **Instala Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Inicia sesión:**
   ```bash
   vercel login
   ```

3. **Despliega:**
   ```bash
   vercel
   ```
   - Responde las preguntas del CLI
   - Vercel detectará automáticamente la configuración

4. **Agrega la API key:**
   ```bash
   vercel env add VITE_GEMINI_API_KEY
   ```
   - Pega tu API key cuando te lo pida
   - Selecciona las 3 opciones de entorno

5. **Redespliega con la variable:**
   ```bash
   vercel --prod
   ```

---

## ⚡ DESPUÉS DEL DESPLIEGUE

1. **Verifica que funcione:**
   - Visita la URL que te dé Vercel
   - Abre la consola del navegador (F12)
   - Verifica que no haya errores
   - Prueba el "Oráculo Sindical" o el "Generador de Posts"

2. **Si ves errores de API:**
   - Ve a tu proyecto en https://vercel.com/dashboard
   - Settings → Environment Variables
   - Verifica que `VITE_GEMINI_API_KEY` esté configurada
   - Si no está, agrégala y haz "Redeploy"

---

## 📋 CHECKLIST PRE-DESPLIEGUE

- ✅ Build local funciona (`npm run build` completado)
- ✅ Tienes tu API key de Google Gemini
- ✅ Tu código está en GitHub (para Opción A)
- ✅ Archivo `vercel.json` configurado
- ⚠️ **IMPORTANTE:** Asegúrate de tener tu API key a mano antes de empezar

---

## 🆘 ¿NECESITAS AYUDA?

**Si prefieres que te ayude paso a paso:**
- Dime "ayúdame con la opción A" → Te guiaré con el dashboard
- Dime "ayúdame con la opción B" → Instalaré Vercel CLI y desplegaremos juntos

**Documentación completa:** Ver `GUIA_DESPLIEGUE_VERCEL.md`

---

## 🎯 TU PRÓXIMO COMANDO

**Si eliges Opción A (Dashboard):**
```bash
git add .
git commit -m "Listo para Vercel"
git push origin main
```
Luego ve a: https://vercel.com/new

**Si eliges Opción B (Terminal):**
```bash
npm install -g vercel
```

---

¿Qué opción prefieres? 🚀
