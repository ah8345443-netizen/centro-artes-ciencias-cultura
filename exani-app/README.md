# Simulador de Evaluación Académica

Aplicación educativa independiente para el Centro de Artes, Ciencias y Cultura.

## Funcionalidad
- Next.js 16.4 + React 19.3
- Supabase conectado
- Autenticación por correo y contraseña
- Acceso protegido mediante RLS
- Evaluaciones aleatorias por materia
- Evaluaciones configurables por cantidad y dificultad
- Práctica por temas
- Matemáticas, Comprensión lectora, Redacción y lenguaje, Pensamiento científico
- Resultados por área y tema
- Panel administrativo para usuarios y reactivos
- Actividades de desarrollo y retos de profundización
- PWA básica

## Variables de entorno
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

No guardar claves secretas o service role en el repositorio.

## Desarrollo
1. `npm install`
2. Crear `.env.local` a partir de `.env.example`
3. `npm run dev`

## Despliegue
La aplicación se despliega en Vercel como proyecto independiente del sitio principal del Centro.

El sitio principal del Centro permanece en la raíz del repositorio y no debe sustituirse.
