Los services contienen las reglas de negocio y transacciones.

Las operaciones críticas usan `withTransaction` (utils/transaction.js):

- `ContratoService.asignarPlan` / `cancelarPlan`
- `PagoService.registrarPago` / `cancelarPago` (pago + movimiento financiero)
