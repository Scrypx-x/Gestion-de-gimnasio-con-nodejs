Comandos de terminal (capa de interacción con inquirer). No contienen SQL ni reglas de negocio:
solo piden datos, llaman a los services y muestran resultados.

`BaseCommand` implementa el menú en bucle; cada comando define `titulo` y `acciones()`.
