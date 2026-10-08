npm-- Base de datos del inventario
CREATE DATABASE IF NOT EXISTS inventario_db;
USE inventario_db;

-- Tabla de productos (campos según la actividad)
CREATE TABLE IF NOT EXISTS products (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(255)   NOT NULL,
  price       DECIMAL(10, 2) NOT NULL,
  stock       INT            NOT NULL,
  description TEXT           NOT NULL,
  brand       VARCHAR(100)   NULL,
  img         TEXT           NULL,
  active      BOOLEAN        NOT NULL DEFAULT TRUE
);

-- Datos de prueba
INSERT INTO products (name, price, stock, description, brand)
VALUES
  ('Teclado Mecánico', 899.00, 12, 'Teclado mecánico RGB con switches rojos', 'Redragon'),
  ('Monitor 24 pulgadas', 2799.50, 7, 'Monitor Full HD de 75 Hz', 'Samsung'),
  ('Audífonos Bluetooth', 649.90, 25, 'Audífonos inalámbricos con micrófono', 'JBL');
  ('PlayStation 5', 14999.00, 5, 'Consola de videojuegos de última generación', 'Sony');
  ('Xbox One series X', 25999.00, 3, 'Consola de videojuegos de última generación 2.0', 'Microsoft');
  ('Nintendo Switch', 8999.00, 10, 'Consola de videojuegos híbrida', 'Nintendo');
