# Gimnasio CLI

Sistema de línea de comandos para administrar un gimnasio: clientes, planes de entrenamiento, contratos, pagos, seguimiento físico, nutrición y finanzas.

## Tecnologías

- Node.js 18+ (ES Modules)
- MySQL 8+ (usa `CHECK` y `DEFAULT (CURRENT_DATE)`)
- mysql2, Inquirer, Chalk, Day.js, dotenv

## Instalación

1. Crear la base de datos: `mysql -u root -p < database/schema.sql`
2. (Opcional) datos de ejemplo: `mysql -u root -p < database/seed.sql`
3. Copiar `.env.example` a `.env` y configurar las credenciales de MySQL.
4. Ejecutar:

```bash
npm install
npm start
```

Pruebas unitarias (no necesitan MySQL): `npm test`

## Arquitectura por capas

```
commands/      Interacción con la terminal (inquirer). Sin SQL ni reglas de negocio.
services/      Reglas de negocio y transacciones.
factories/     Creación de objetos de dominio (patrón Factory).
repositories/  Acceso a MySQL (patrón Repository).
models/        Entidades y validaciones.
config/        Pool de conexión.
utils/         Consola, validadores y helper de transacciones.
```

Flujo: `command → service → (factory / model) → repository → MySQL`.

## Patrones de diseño

### 1. Repository
Cada tabla tiene su repository (`ClienteRepository`, `PlanRepository`, `ContratoRepository`, `PagoRepository`,
`MovimientoRepository`, `SeguimientoRepository`, `NutricionRepository`, `AlimentoRepository`, `PlanAlimentoRepository`).
Todos extienden `BaseRepository` y reciben un `connection` opcional para participar en transacciones.
Los services nunca escriben SQL.

### 2. Factory
- `MovimientoFactory`: ingresos, egresos, ingreso generado por pago y reversión de pago.
- `PagoFactory`: pagos completados.
- `ContratoFactory`: arma el contrato a partir de un plan (calcula la fecha fin y toma el precio vigente).

## Operaciones transaccionales (`utils/transaction.js`)

| Operación | Qué garantiza |
|---|---|
| `ContratoService.asignarPlan` | Valida cliente activo, plan activo y que no exista un contrato solapado; crea el contrato. |
| `ContratoService.cancelarPlan` | Cancela el contrato, **elimina su seguimiento físico** y cancela sus planes de nutrición. |
| `PagoService.registrarPago` | El pago y su movimiento financiero (ingreso) se guardan juntos o no se guarda ninguno. |
| `PagoService.cancelarPago` | Marca el pago como cancelado y registra un egreso de reversión. |

## Módulos del menú

Clientes · Planes de entrenamiento · Contratos · Pagos · Seguimiento físico · Nutrición · Finanzas

## Reglas de negocio destacadas

- Los contratos vencidos pasan automáticamente a `finalizado` al consultarlos.
- Un pago o seguimiento solo puede asociarse a un contrato del mismo cliente y que no esté cancelado.
- Los planes de nutrición solo aceptan alimentos mientras estén `activo`; el detalle calcula calorías por día y total semanal.
- El resumen financiero calcula ingresos, egresos, balance y desglose por categoría, con rango de fechas opcional.

## Nota

El enunciado original menciona MongoDB, pero esta implementación está preparada para MySQL, según la especificación solicitada para este proyecto.
