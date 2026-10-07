# Plataforma EXANI 2026

Aplicación independiente para el Centro de Artes, Ciencias y Cultura.

## Estado
- Next.js 16.4 + React 19.3
- Supabase conectado
- Auth por correo/contraseña
- RLS habilitado
- Práctica por CL, RI y MT
- Simulacro con registro de intentos
- Resultados por área
- Panel administrativo preparado
- PWA básica
- GitHub Actions para verificación de build

## Supabase
Proyecto configurado: `exani-colima-2026`.

Variables requeridas:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

No guardar claves secretas o service role en el repositorio.

## Desarrollo
1. `npm install`
2. Crear `.env.local` a partir de `.env.example`
3. `npm run dev`

## Vercel
Crear un proyecto separado apuntando a este mismo repositorio y establecer:

**Root Directory:** `exani-app`

Agregar las dos variables públicas de Supabase en Environment Variables.

El sitio principal del Centro permanece en la raíz del repositorio y no debe sustituirse.
