# Repositories (patrón Repository)

Cada repository contiene únicamente acceso a datos MySQL (SQL parametrizado).
Todos extienden `BaseRepository` y aceptan un `connection` opcional para poder
participar en una transacción abierta por un service.

| Repository | Tabla(s) |
|---|---|
| ClienteRepository | clientes |
| PlanRepository | planes |
| ContratoRepository | contratos |
| PagoRepository | pagos |
| MovimientoRepository | movimientos_financieros |
| SeguimientoRepository | seguimiento |
| NutricionRepository | planes_nutricion |
| AlimentoRepository | alimentos |
| PlanAlimentoRepository | plan_alimentos |
