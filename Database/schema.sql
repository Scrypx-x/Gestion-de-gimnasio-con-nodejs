    DROP DATABASE  IF  EXISTS gimnasio_db;
CREATE DATABASE gimnasio_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE gimnasio_db;

CREATE TABLE clientes (
    id_cliente INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    fecha_nacimiento DATE,
    fecha_registro DATE NOT NULL DEFAULT (CURRENT_DATE),
    estado ENUM('activo', 'inactivo') NOT NULL DEFAULT 'activo',
    INDEX idx_clientes_nombre (apellido, nombre),
    INDEX idx_clientes_estado (estado)
);

CREATE TABLE planes (
    id_plan INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion VARCHAR(255),
    duracion_meses INT NOT NULL,
    meta_fisica VARCHAR(255),
    nivel ENUM('principiante', 'intermedio', 'avanzado') NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    estado ENUM('activo', 'inactivo') NOT NULL DEFAULT 'activo',
    CONSTRAINT chk_plan_duracion CHECK (duracion_meses > 0),
    CONSTRAINT chk_plan_precio CHECK (precio >= 0),
    INDEX idx_planes_nivel (nivel),
    INDEX idx_planes_estado (estado)
);

CREATE TABLE contratos (
    id_contrato INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT NOT NULL,
    id_plan INT NOT NULL,
    condiciones TEXT,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    estado ENUM('activo', 'cancelado', 'finalizado') NOT NULL DEFAULT 'activo',
    CONSTRAINT fk_contrato_cliente FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente),
    CONSTRAINT fk_contrato_plan FOREIGN KEY (id_plan) REFERENCES planes(id_plan),
    CONSTRAINT chk_contrato_precio CHECK (precio >= 0),
    CONSTRAINT chk_contrato_fechas CHECK (fecha_fin >= fecha_inicio),
    INDEX idx_contratos_cliente (id_cliente),
    INDEX idx_contratos_plan (id_plan),
    INDEX idx_contratos_estado (estado),
    INDEX idx_contratos_fechas (fecha_inicio, fecha_fin)
);

CREATE TABLE seguimiento (
    id_seguimiento INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT NOT NULL,
    id_contrato INT,
    fecha DATE NOT NULL,
    peso DECIMAL(5,2),
    grasa_corporal DECIMAL(5,2),
    cintura DECIMAL(5,2),
    pecho DECIMAL(5,2),
    brazo DECIMAL(5,2),
    pierna DECIMAL(5,2),
    foto VARCHAR(255),
    comentarios TEXT,
    CONSTRAINT fk_seguimiento_cliente FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente) ON DELETE CASCADE,
    CONSTRAINT fk_seguimiento_contrato FOREIGN KEY (id_contrato) REFERENCES contratos(id_contrato) ON DELETE SET NULL,
    CONSTRAINT chk_seguimiento_peso CHECK (peso IS NULL OR peso > 0),
    CONSTRAINT chk_seguimiento_grasa CHECK (grasa_corporal IS NULL OR (grasa_corporal >= 0 AND grasa_corporal <= 100)),
    INDEX idx_seguimiento_cliente_fecha (id_cliente, fecha),
    INDEX idx_seguimiento_contrato (id_contrato)
);

CREATE TABLE planes_nutricion (
    id_plan_nutricion INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT NOT NULL,
    id_contrato INT,
    nombre VARCHAR(100) NOT NULL,
    objetivo VARCHAR(255),
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE,
    estado ENUM('activo', 'finalizado', 'cancelado') NOT NULL DEFAULT 'activo',
    CONSTRAINT fk_nutricion_cliente FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente) ON DELETE CASCADE,
    CONSTRAINT fk_nutricion_contrato FOREIGN KEY (id_contrato) REFERENCES contratos(id_contrato) ON DELETE SET NULL,
    CONSTRAINT chk_nutricion_fechas CHECK (fecha_fin IS NULL OR fecha_fin >= fecha_inicio),
    INDEX idx_nutricion_cliente (id_cliente),
    INDEX idx_nutricion_estado (estado)
);

CREATE TABLE alimentos (
    id_alimento INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    calorias_por_porcion DECIMAL(8,2) NOT NULL,
    unidad VARCHAR(30) NOT NULL,
    CONSTRAINT chk_alimento_calorias CHECK (calorias_por_porcion >= 0),
    INDEX idx_alimentos_nombre (nombre)
);

CREATE TABLE plan_alimentos (
    id_plan_alimento INT AUTO_INCREMENT PRIMARY KEY,
    id_plan_nutricion INT NOT NULL,
    id_alimento INT NOT NULL,
    dia_semana ENUM('lunes','martes','miercoles','jueves','viernes','sabado','domingo') NOT NULL,
    cantidad DECIMAL(8,2) NOT NULL,
    comida ENUM('desayuno','almuerzo','cena','refaccion') NOT NULL,
    CONSTRAINT fk_plan_alimento_nutricion FOREIGN KEY (id_plan_nutricion) REFERENCES planes_nutricion(id_plan_nutricion) ON DELETE CASCADE,
    CONSTRAINT fk_plan_alimento_alimento FOREIGN KEY (id_alimento) REFERENCES alimentos(id_alimento),
    CONSTRAINT chk_plan_alimento_cantidad CHECK (cantidad > 0),
    INDEX idx_plan_alimentos_dia (id_plan_nutricion, dia_semana),
    INDEX idx_plan_alimentos_alimento (id_alimento)
);

CREATE TABLE movimientos_financieros (
    id_movimiento INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT,
    tipo ENUM('ingreso','egreso') NOT NULL,
    categoria ENUM('mensualidad','sesion','servicio','suplementos','operativo','otro') NOT NULL,
    descripcion VARCHAR(255),
    monto DECIMAL(10,2) NOT NULL,
    fecha DATE NOT NULL DEFAULT (CURRENT_DATE),
    CONSTRAINT fk_movimiento_cliente FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente) ON DELETE SET NULL,
    CONSTRAINT chk_movimiento_monto CHECK (monto > 0),
    INDEX idx_movimientos_fecha (fecha),
    INDEX idx_movimientos_tipo (tipo),
    INDEX idx_movimientos_cliente (id_cliente),
    INDEX idx_movimientos_categoria (categoria)
);

CREATE TABLE pagos (
    id_pago INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT NOT NULL,
    id_contrato INT,
    monto DECIMAL(10,2) NOT NULL,
    metodo_pago ENUM('efectivo','tarjeta','transferencia') NOT NULL,
    fecha_pago DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    estado ENUM('completado','cancelado') NOT NULL DEFAULT 'completado',
    CONSTRAINT fk_pago_cliente FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente) ON DELETE CASCADE,
    CONSTRAINT fk_pago_contrato FOREIGN KEY (id_contrato) REFERENCES contratos(id_contrato) ON DELETE SET NULL,
    CONSTRAINT chk_pago_monto CHECK (monto > 0),
    INDEX idx_pagos_cliente (id_cliente),
    INDEX idx_pagos_contrato (id_contrato),
    INDEX idx_pagos_fecha (fecha_pago),
    INDEX idx_pagos_estado (estado)
);
