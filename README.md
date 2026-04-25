# Prueba Tecnica - Frontend (Angular 21)

Cliente web de la prueba tecnica de banca. Consume el [backend Spring Boot](../backend) y permite gestionar clientes, cuentas, movimientos y generar el reporte de estado de cuenta.

## Stack

- Angular 21.2 (zoneless por defecto, Vitest, Signal-based components)
- Componentes standalone con lazy loading por feature
- HttpClient + funcional interceptor para errores
- SCSS global + per-component
- Sin dependencias UI extras (toda la UI esta hecha con HTML + SCSS para mantener el bundle minimo)

## Requisitos

- Node 20+ (probado con 22.12)
- npm 10+

## Como levantar

```bash
npm install
npm start          # equivalente a 'ng serve' en http://localhost:4200
```

Asegurate de que el backend este corriendo en `http://localhost:8080` (ajustable en `src/environments/environment.ts`).

## Build / tests

```bash
npm run build      # ng build
npm test           # ng test (vitest, ejecuta tests no-watch)
```

## Estructura

```
src/app/
├── core/
│   ├── interceptors/error.interceptor.ts   # captura HttpErrorResponse y muestra toast
│   ├── models/                              # interfaces TypeScript de los DTOs
│   └── services/                            # ClienteService, CuentaService, MovimientoService, ReporteService, NotificationService
├── features/
│   ├── clientes/                            # list + form
│   ├── cuentas/                             # list + form
│   ├── movimientos/                         # list + form
│   └── reportes/                            # filtros + tabla con totales
├── app.config.ts                            # provideRouter + provideHttpClient + interceptor
└── app.routes.ts                            # lazy-loaded routes
```

## Flujo recomendado

1. Crear los 4 clientes desde la pestana "Clientes".
2. Crear las cuentas asociadas en "Cuentas".
3. Registrar los movimientos del caso 4 del PDF en "Movimientos".
4. Provocar errores (retiro con saldo cero, retiro >1000) para ver los mensajes del backend en el toast.
5. Generar reportes desde "Reportes" filtrando por cliente y rango de fechas.

## Manejo de errores

`error.interceptor.ts` lee el body de error del backend (formato estandar: `timestamp/status/error/message/path` + lista opcional `errores`) y lo muestra en un toast rojo via `NotificationService`. Esto cubre:

- "Saldo no disponible" → 400 cuando se intenta retirar con saldo 0 o saldo resultante negativo.
- "Cupo diario Excedido" → 400 cuando los retiros del dia superan el cupo de 1000.
- 404 cuando se accede a una entidad que no existe.
- 400 con lista `errores` cuando falla la validacion bean del backend.
