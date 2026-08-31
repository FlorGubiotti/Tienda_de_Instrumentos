# Trémolo — Frontend

React + TypeScript single-page app for the [Trémolo](../README.md) instrument store: public catalogue, cart, Mercado Pago checkout, and a role-aware admin panel.

## Tech stack

- React 18, TypeScript, Vite
- React Router 6
- Bootstrap 5.3.3 — loaded from a CDN in `index.html`, not an npm dependency
- react-google-charts (admin sales stats)
- react-modal (confirmation dialogs)
- Mercado Pago React SDK (`@mercadopago/sdk-react`) — renders the hosted checkout button

## Requirements

- Node 18+
- The [backend](../Backend/README.md) running (the app calls it for essentially everything — without it the catalogue just shows request errors)

## Setup

```bash
npm install
npm run dev
```

Opens on `http://localhost:5173`. The API base URL comes from `.env`:

```
VITE_API_URL= http://localhost:8080/api/
```

This file is tracked in git with a sane local default (it's not a secret), so a fresh clone works out of the box against a backend running on `localhost:8080`. Point it elsewhere if your backend runs somewhere else.

## Scripts

| Command | Does |
|---|---|
| `npm run dev` | Starts the Vite dev server with hot reload |
| `npm run build` | Type-checks (`tsc`) and builds a production bundle into `dist/` |
| `npm run lint` | ESLint over the whole project |
| `npm run preview` | Serves the built `dist/` bundle locally, to sanity-check a production build |

## Project layout

```
src/
├── components/     one folder per screen/UI piece (Home, Navbar, Footer, GrillaInstrumentos,
│                   Formulario, ChartsGoogle, Carrito, CheckoutMP, DetalleInstrumentos, Login, ...)
├── services/       API clients — BaseService.ts (generic CRUD over fetch) plus one service per
│                   resource (Instrumento, Categoria, Pedido, Pago/PreferenceMP, Auth), and small
│                   helpers (sesion.ts, imagenes.ts, tema.ts, formato.ts, descargarArchivo.ts)
├── entities/       TypeScript types mirroring the backend's entities/DTOs
├── context/        CarritoContext — global cart state
├── hooks/          useCarrito
├── controlAcceso/  route guards: RutaPrivada (must be logged in) and RolUsuario (must have one
│                   of a given set of roles)
├── routes/         AppRoutes.tsx — the route table
└── styles/         tokens.css (design tokens, light/dark) and shared admin-panel styles
```

## Routing

| Path | Screen | Access |
|---|---|---|
| `/` | Home | Public |
| `/products` | Catalogue | Public |
| `/products/detalle/:id` | Product detail | Public |
| `/DondeEstamos` | Store location | Public |
| `/login` | Login | Public |
| `/grilla` | Admin grid | Any logged-in role (`RutaPrivada`) — what you can do inside still depends on role |
| `/formulario/:id` | Create/edit instrument | ADMIN, OPERADOR (`RolUsuario`) |
| `/googlecharts` | Sales stats | ADMIN (`RolUsuario`) |
| `/mpsuccess`, `/mppending`, `/mpfailure` | Payment result | Public — Mercado Pago redirects here after checkout |
| `*` | 404 | Public |

## Auth

Login calls the backend, stores the returned JWT (via `services/sesion.ts`), and every authenticated request attaches it as a `Bearer` header through `BaseService`. Session/token-expiry handling is centralized there too, so individual screens don't each reimplement "redirect to login if the token is gone or expired."

## Theming

`styles/tokens.css` defines semantic CSS custom properties (`--superficie-*`, `--texto-*`, `--acento`, ...) for both light and dark palettes, switched by setting `data-tema="oscuro"` on `<html>`. An inline script in `index.html` applies the saved/preferred theme *before* the first paint, so there's no flash of the wrong theme on load. `services/tema.ts` also re-themes `react-google-charts` live on toggle, since that library paints onto a canvas and doesn't pick up CSS variables on its own.

## Talking to the backend

- `VITE_API_URL` is the only required config — every service builds its requests from it.
- Product photos are served by the backend at `/images/{filename}`; `services/imagenes.ts` derives that origin from `VITE_API_URL` so the frontend never hardcodes a host.
- Uploading a new photo (`Formulario`) posts the file to the backend first and only wires the returned filename into the instrument once the rest of the form is saved — picking a file never changes anything by itself.

## Mercado Pago

`CheckoutMP` calls the backend for a checkout preference, then renders Mercado Pago's own `Wallet` button via the SDK, which hands off to Mercado Pago's hosted payment page. The public key passed to `initMercadoPago` is a **test** key — public by design, safe to keep in source (unlike the access token, which stays server-side only). No real money moves through this checkout.
