# Currency Converter Challenge

Aplicación de conversión de divisas construida con **Next.js 16** como parte de un challenge técnico.

## ¿Por qué Next.js con SSR en lugar de Vite con CSR?

<!-- TODO: Escribir mi justificación aquí -->

---

## Características

- ✅ Conversión en tiempo real mientras escribes
- ✅ Botón de intercambio (swap) entre monedas
- ✅ Título dinámico que refleja la selección actual
- ✅ Server-Side Rendering con ISR (Incremental Static Regeneration)
- ✅ API Proxy interno para evitar problemas de CORS

## Requisitos Previos

- Node.js v18 o superior
- npm

## Instalación y Ejecución

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Ejecutar tests
npm test

# Ejecutar tests con coverage
npm run test:coverage
```

Abrir [http://localhost:3000](http://localhost:3000) en el navegador.

## Stack Tecnológico

| Tecnología | Versión/Detalle |
|------------|-----------------|
| Framework | Next.js 16.1.1 (App Router) |
| UI | React 19 |
| Estilos | CSS vanilla + Poppins/Inter fonts |
| Lenguaje | TypeScript |
| Testing | Jest + React Testing Library |
| API Externa | VatComply |

## Arquitectura

```
src/
├── app/
│   ├── page.tsx          # Server Component - obtiene datos con ISR
│   ├── layout.tsx        # Layout con fuentes Google
│   ├── globals.css       # Estilos globales
│   └── api/rates/
│       └── route.ts      # API Proxy para VatComply
├── components/
│   └── CurrencyConverter.tsx  # Client Component interactivo
└── __tests__/
    ├── components/       # Tests unitarios
    ├── api/              # Tests de API
    ├── integration/      # Tests de integración
    └── utils/            # Tests de utilidades
```

## Tests

El proyecto incluye **56 tests** organizados en:

- **Tests unitarios**: Componente CurrencyConverter, lógica de cálculo
- **Tests de integración**: Flujo completo de conversión
- **Tests de API**: Lógica del endpoint de tasas

```bash
npm test              # Ejecutar todos los tests
npm run test:watch    # Modo watch
npm run test:coverage # Reporte de cobertura
```
