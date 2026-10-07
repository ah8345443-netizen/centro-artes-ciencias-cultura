# Plataforma EXANI 2026

Aplicación independiente para el Centro de Artes, Ciencias y Cultura.

## Incluye
- Inicio
- Login
- Panel del alumno
- Práctica por códigos CL, RI y MT
- Simulacro
- Resultados
- Panel administrativo
- Estructura inicial de Supabase
- Políticas RLS
- Variables de entorno de ejemplo

## Desarrollo local
1. Instalar Node.js 20 o superior.
2. Entrar a la carpeta `exani-app`.
3. Ejecutar `npm install`.
4. Copiar `.env.example` como `.env.local`.
5. Agregar URL y clave pública de Supabase.
6. Ejecutar `npm run dev`.

## Supabase
Abrir el SQL Editor del proyecto Supabase y ejecutar `supabase/schema.sql`.

Después de crear tu usuario, cambia manualmente su rol en `profiles` a `admin` para la primera cuenta administrativa.

## Vercel
Configura el Root Directory del proyecto como `exani-app` y agrega:
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY

El sitio principal actual del repositorio permanece fuera de esta carpeta y no se modifica.
