# Trémolo — Backend

Spring Boot REST API for the [Trémolo](../README.md) instrument store: catalogue, JWT authentication with role-based permissions, Mercado Pago checkout with server-side payment verification, product photo uploads, and sales reporting (charts, Excel, PDF).

## Tech stack

- Java 17, Spring Boot 3.2.5, Gradle
- Spring Security + JWT (`jjwt`) — stateless authentication, BCrypt password hashing
- Spring Data JPA / Hibernate + MySQL
- Bean Validation for request payloads
- Apache POI (Excel export) and iText (PDF export)
- Mercado Pago Java SDK
- `spring-boot-devtools` for hot restart during development

## Requirements

- JDK 17
- MySQL 8 running locally (or reachable), with an empty schema created for the app
- A Mercado Pago **test** account and access token (free, from the [Mercado Pago developers dashboard](https://www.mercadopago.com/developers)) — only needed if you want to exercise the checkout flow

## Setup

1. Create an empty MySQL schema:
   ```sql
   CREATE DATABASE instrumentosdb;
   ```
2. Copy the local config template and fill in your own values:
   ```bash
   cp src/main/resources/application-local.properties.example src/main/resources/application-local.properties
   ```
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/instrumentosdb
   spring.datasource.username=root
   spring.datasource.password=your-mysql-password

   mercadopago.access-token=your-mercadopago-test-access-token

   # Random string, 32+ bytes. Generate e.g. with: openssl rand -base64 48
   jwt.secret=a-random-secret-of-at-least-32-bytes
   ```
   This file is gitignored — it never gets committed, unlike `application.properties`, which only holds non-secret defaults.
3. Run it:
   ```bash
   ./gradlew bootRun        # macOS/Linux
   gradlew.bat bootRun       # Windows
   ```

The API comes up on `http://localhost:8080`. On an **empty** database, [`DataInitializer`](src/main/java/com/example/TiendaDeMusica/config/DataInitializer.java) automatically seeds:

- 5 categories (Cuerda, Viento, Percusión, Teclado, Electrónico)
- The 3 demo users below
- 10 instruments with photos already bundled in the jar
- 10 matching paid orders, so the sales charts and Excel export have real data behind them from the start

Each seeding step is guarded by a row-count check, so it's safe to restart the app — it will never duplicate data, but it also won't retroactively seed a database that already has some rows in a table.

### Demo users

| Username | Password | Role |
|---|---|---|
| `admin` | `admin123` | ADMIN |
| `operador` | `operador123` | OPERADOR |
| `visor` | `visor123` | VISOR |

Left visible intentionally — see the [root README](../README.md#demo-credentials) for why.

### Running tests

```bash
./gradlew test
```

## Project layout

```
src/main/java/com/example/TiendaDeMusica/
├── controllers/   REST endpoints
├── services/      business logic (also: PDF/Excel generation, chart queries, image storage)
├── repositories/  Spring Data JPA repositories
├── entities/      JPA entities (+ Enum/ for Rol, Categorias, EstadoPedido)
├── dto/           request/response payloads that aren't raw entities
├── security/      JWT filter and token handling
└── config/        SecurityConfig, CORS, static file serving, DataInitializer
```

## Security model

- Login (`POST /api/auth/login`) checks the BCrypt-hashed password and, on success, issues a JWT carrying the username and role.
- Every other request is stateless: the frontend sends the token as `Authorization: Bearer <token>`, and `JwtAuthFilter` validates it and populates the security context on each request — there's no server-side session.
- Passwords are hashed with BCrypt; the JWT secret and expiration (`jwt.expiration-ms`, default 24h) are configurable.
- A failed/expired token returns `401`; a valid token without the right role returns `403` — the frontend relies on that distinction to tell "log in again" apart from "you don't have access".
- CORS origins are configurable (`app.cors.allowed-origins`), not hardcoded, so the same jar works against a frontend hosted anywhere without a code change.

### Roles

| Role | Can do |
|---|---|
| **VISOR** | Browse the full catalogue including deactivated items, check out and pay |
| **OPERADOR** | Everything VISOR can, plus: create/edit/deactivate/reactivate instruments, upload product photos, generate the instrument PDF datasheet |
| **ADMIN** | Everything OPERADOR can, plus: manage categories, manage users, view/edit/delete any order, see sales charts and the Excel export |

## API reference

Base path: `/api`. Endpoints not listed here for `Categoria`, `Usuario`, `Pedido`, and `DetallePedido` follow the generic CRUD shape (`GET /`, `GET /{id}`, `POST /`, `PUT /{id}`, `DELETE /{id}`) from a shared base controller.

| Method | Path | Access | Notes |
|---|---|---|---|
| POST | `/api/auth/login` | Public | Returns a JWT |
| GET | `/api/instrumentos`, `/api/instrumentos/{id}` | Public | Active instruments only |
| GET | `/api/instrumentos/todos` | Any logged-in role | Includes soft-deleted (deactivated) instruments, for the admin grid |
| POST / PUT | `/api/instrumentos`, `/api/instrumentos/{id}` | ADMIN, OPERADOR | |
| DELETE | `/api/instrumentos/{id}` | ADMIN, OPERADOR | Soft delete — the row and its order history are kept |
| PUT | `/api/instrumentos/{id}/reactivar` | ADMIN, OPERADOR | Restores a deactivated instrument |
| POST | `/api/instrumentos/imagen` | ADMIN, OPERADOR | Multipart upload, returns the generated filename; doesn't touch any instrument by itself |
| GET | `/images/{filename}` | Public | Serves both the seed photos and uploaded ones |
| GET | `/api/categoria`, `/api/categoria/{id}` | Public | |
| POST / PUT / DELETE | `/api/categoria/**` | ADMIN | |
| ALL | `/api/usuario/**` | ADMIN | |
| POST | `/api/mercado_pago/create_preference` | Any logged-in role | Builds the order and its Mercado Pago preference from real DB prices — client-supplied prices are ignored |
| POST | `/api/mercado_pago/confirmar/{paymentId}` | Any logged-in role | Verifies the payment against the Mercado Pago API and updates the order's status accordingly |
| GET | `/api/pedido`, `/api/pedido/{id}` | ADMIN | |
| POST | `/api/pedido` | Any logged-in role | Not restricted to ADMIN like the rest of this resource — in practice unused directly by the frontend, since checkout creates orders through `/api/mercado_pago/create_preference` instead |
| PUT / DELETE | `/api/pedido/{id}` | ADMIN | |
| GET | `/api/pedido/barchart`, `/api/pedido/piechart`, `/api/pedido/downloadExcel` | ADMIN | Figures only count **paid** orders |
| GET | `/api/pedido/downloadPdf/{idInstrumento}` | ADMIN, OPERADOR | Instrument datasheet PDF |
| GET / PUT / DELETE | `/api/detallePedido/**` | ADMIN | |
| POST | `/api/detallePedido` | Any logged-in role | Same asymmetry as `/api/pedido` above |

## Reports

Sales charts and the Excel export deliberately only count orders with status `PAGADO` (paid). An order that was started but never completed at Mercado Pago (`PENDIENTE`) or that Mercado Pago rejected (`RECHAZADO`) is not a sale and never counts as one.

## File uploads

Product photos go through `ImagenService`, which:

- Validates the file extension (`jpg`, `jpeg`, `png`, `webp`, `gif`) and size (5MB max, also enforced by `spring.servlet.multipart.max-*-size`)
- Generates a random UUID filename — the client-supplied name is never trusted or reused
- Saves outside `src/main/resources`, in `app.uploads-dir` (default `uploads/images`, gitignored), because anything under `resources/static` gets baked into the jar at build time and writing there at runtime wouldn't reliably persist

`WebConfig` serves `/images/**` from both the classpath (the 10 seed photos bundled in the jar) and the uploads directory, so the frontend doesn't need to know which one a given file lives in.

## Configuration reference

Non-secret settings, in `application.properties`:

| Property | Purpose | Default |
|---|---|---|
| `app.frontend-url` | Used to build the Mercado Pago return URLs | `http://localhost:5173` |
| `app.cors.allowed-origins` | Comma-separated origins allowed to call the API | `http://localhost:5173,http://localhost:8080` |
| `app.uploads-dir` | Where uploaded product photos are stored | `uploads/images` |
| `jwt.expiration-ms` | Token lifetime, in milliseconds | `86400000` (24h) |
| `spring.servlet.multipart.max-file-size` / `max-request-size` | Upload size cap | `5MB` |

Secrets go in `application-local.properties` instead (see Setup above): the MySQL connection, the Mercado Pago access token, and the JWT secret.
