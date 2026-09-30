-- Datos de ejemplo OPCIONALES. Ejecutar después de schema.sql.
USE gimnasio_db;

INSERT INTO planes (nombre, descripcion, duracion_meses, meta_fisica, nivel, precio) VALUES
('Inicio Fit', 'Rutina base para nuevos usuarios', 1, 'Adaptación y hábito', 'principiante', 250.00),
('Definición Trimestral', 'Pérdida de grasa con pesas y cardio', 3, 'Reducir grasa corporal', 'intermedio', 650.00),
('Hipertrofia Pro', 'Ganancia de masa muscular', 6, 'Aumentar masa muscular', 'avanzado', 1100.00);

INSERT INTO alimentos (nombre, calorias_por_porcion, unidad) VALUES
('Pechuga de pollo', 165.00, '100 g'),
('Arroz cocido', 130.00, '100 g'),
('Huevo', 78.00, 'unidad'),
('Avena', 150.00, 'taza'),
('Plátano', 105.00, 'unidad'),
('Frijoles negros', 132.00, '100 g');
