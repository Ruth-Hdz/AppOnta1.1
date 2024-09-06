-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS bd_onta;
USE bd_onta;

-- Eliminar tablas existentes si es necesario
DROP TABLE IF EXISTS Articulo;
DROP TABLE IF EXISTS Categoria;
DROP TABLE IF EXISTS Usuario;

CREATE TABLE Usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    correo_electronico VARCHAR(255) NOT NULL UNIQUE,
    acepta_terminos BOOLEAN NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    firebase_uid VARCHAR(255) NOT NULL,
    token_recuperacion VARCHAR(255), 
    token_expiracion TIMESTAMP
);

-- Crear la tabla Usuario UNIQUE EN EL ID DE USUARIO
CREATE TABLE Usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    correo_electronico VARCHAR(255) UNIQUE NOT NULL,
    contrasena VARCHAR(255) NOT NULL,
    acepta_terminos BOOLEAN,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear la tabla Categoria
CREATE TABLE Categoria (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    icono VARCHAR(255) NOT NULL,
    color VARCHAR(7) NOT NULL,
    id_usuario INT,
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id)
);

ALTER TABLE articulo
MODIFY COLUMN prioridad VARCHAR(3);
ALTER TABLE articulo
ADD COLUMN fecha_actualizacion DATETIME DEFAULT NULL;
UPDATE articulo
SET prioridad = 'Sí',
    fecha_actualizacion = NOW()
WHERE id = 1;
SELECT * FROM articulo
WHERE prioridad = 'Sí'
ORDER BY fecha_actualizacion DESC;

-- Crear la tabla Articulo
CREATE TABLE Articulo (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    texto TEXT NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    prioridad INT NOT NULL,
    id_categoria INT,
    FOREIGN KEY (id_categoria) REFERENCES Categoria(id)
);
CREATE TABLE PasswordResetTokens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    correo_electronico VARCHAR(255) NOT NULL,
    token VARCHAR(64) NOT NULL,
    expiracion DATETIME NOT NULL,
    FOREIGN KEY (correo_electronico) REFERENCES Usuario(correo_electronico)
);
ALTER TABLE Articulo ADD COLUMN id_usuario INT;

-- Insertar usuarios de ejemplo
INSERT INTO Usuario (nombre, correo_electronico, contrasena, acepta_terminos) VALUES
('Juan Pérez', 'juan.perez@example.com', 'password123', TRUE),
('Ana Gómez', 'ana.gomez@example.com', 'password123', TRUE),
('Luis Martínez', 'luis.martinez@example.com', 'password123', TRUE);

-- Insertar categorías para el primer usuario (Juan Pérez)
INSERT INTO Categoria (nombre, icono, color, id_usuario) VALUES
('Electrónica', 'phone', '#ff5733', 1),
('Libros', 'book', '#33c1ff', 1),
('Deportes', 'fitness', '#4caf50', 1),
('Ropa', 'shirt', '#f44336', 1),
('Hogar', 'home', '#9c27b0', 1);

-- Insertar artículos para las categorías del primer usuario
INSERT INTO Articulo (titulo, texto, prioridad, id_categoria) VALUES
-- Electrónica
('Smartphone Samsung', 'Un excelente smartphone con una cámara de alta calidad.', 1, 1),
('Laptop HP', 'Laptop de alto rendimiento para gaming y trabajo.', 2, 1),
('Auriculares Sony', 'Auriculares inalámbricos con cancelación de ruido.', 3, 1),
('Televisor LG', 'Televisor 4K Ultra HD con Smart TV.', 4, 1),
('Cámara Canon', 'Cámara digital con lentes intercambiables.', 5, 1),
('Tablet Apple', 'Tablet con pantalla Retina y alto rendimiento.', 6, 1),
('Reloj Fitbit', 'Reloj inteligente con monitor de actividad.', 7, 1),
-- Libros
('1984 de George Orwell', 'Una novela distópica sobre el totalitarismo.', 1, 2),
('Cien años de soledad', 'Obra maestra de Gabriel García Márquez.', 2, 2),
('El hobbit', 'Una novela de fantasía de J.R.R. Tolkien.', 3, 2),
('Don Quijote de la Mancha', 'La famosa novela de Cervantes.', 4, 2),
('Orgullo y prejuicio', 'Una novela romántica de Jane Austen.', 5, 2),
('Los juegos del hambre', 'Una serie de novelas distópicas.', 6, 2),
('El código Da Vinci', 'Un thriller basado en un misterio religioso.', 7, 2),
-- Deportes
('Balón de Fútbol Adidas', 'Balón de fútbol de alta calidad para juegos profesionales.', 1, 3),
('Raqueta de Tenis Wilson', 'Raqueta de tenis con tecnología avanzada.', 2, 3),
('Zapatillas de Running Nike', 'Zapatillas ligeras para correr y entrenar.', 3, 3),
('Equipación de Ciclismo', 'Ropa y accesorios para ciclismo.', 4, 3),
('Pelota de Baloncesto Spalding', 'Pelota oficial de la NBA.', 5, 3),
('Patines en Línea', 'Patines con ruedas de alta calidad.', 6, 3),
('Gafas de Natación', 'Gafas con protección UV para nadar.', 7, 3),
-- Ropa
('Camisa de Algodón', 'Camisa cómoda y transpirable.', 1, 4),
('Jeans Levi\'s', 'Jeans de denim duraderos y a la moda.', 2, 4),
('Chaqueta de Cuero', 'Chaqueta elegante de cuero.', 3, 4),
('Zapatillas Deportivas', 'Zapatillas casuales y cómodas.', 4, 4),
('Abrigo de Lana', 'Abrigo cálido para invierno.', 5, 4),
('Vestido de Noche', 'Vestido elegante para eventos.', 6, 4),
('Sudadera con Capucha', 'Sudadera suave y cómoda.', 7, 4),
-- Hogar
('Sofá de Cuero', 'Sofá cómodo y elegante para el salón.', 1, 5),
('Mesa de Comedor', 'Mesa de comedor de madera con capacidad para seis personas.', 2, 5),
('Silla Ergónomica', 'Silla de oficina con soporte lumbar.', 3, 5),
('Lámpara de Techo', 'Lámpara moderna para iluminar la habitación.', 4, 5),
('Cortinas de Tela', 'Cortinas que bloquean la luz y ofrecen privacidad.', 5, 5),
('Alfombra de Lana', 'Alfombra suave y cálida para el suelo.', 6, 5),
('Ropa de Cama', 'Juego de sábanas y fundas para cama.', 7, 5),
('Aspiradora Robot', 'Aspiradora que limpia de forma automática.', 8, 5),
('Espejo de Pared', 'Espejo grande para el salón o la entrada.', 9, 5);

-- Insertar categorías para el segundo usuario (Ana Gómez)
INSERT INTO Categoria (nombre, icono, color, id_usuario) VALUES
('Música', 'musical-notes', '#ffeb3b', 2),
('Películas', 'film', '#9e9e9e', 2),
('Viajes', 'airplane', '#00bcd4', 2),
('Juegos', 'game-controller', '#8bc34a', 2),
('Tecnología', 'laptop', '#ff5722', 2);

-- Insertar artículos para las categorías del segundo usuario
INSERT INTO Articulo (titulo, texto, prioridad, id_categoria) VALUES
-- Música
('Guitarra Eléctrica Fender', 'Guitarra con un sonido potente y claro.', 1, 6),
('Teclado MIDI', 'Teclado para producción musical y composición.', 2, 6),
('Altavoces Bluetooth JBL', 'Altavoces portátiles con sonido envolvente.', 3, 6),
('Micrófono Shure', 'Micrófono de alta calidad para grabación.', 4, 6),
('Auriculares AKG', 'Auriculares con sonido de estudio.', 5, 6),
('Bajo Eléctrico Ibanez', 'Bajo de excelente calidad para músicos.', 6, 6),
('Vinilos Clásicos', 'Colección de vinilos de música clásica.', 7, 6),
('Ampli para Guitarra', 'Amplificador con gran potencia y claridad.', 8, 6),
('Cajón Flamenco', 'Instrumento musical de percusión.', 9, 6),
-- Películas
('Inception', 'Película de ciencia ficción sobre sueños dentro de sueños.', 1, 7),
('The Godfather', 'Clásico del cine sobre una familia mafiosa.', 2, 7),
('The Dark Knight', 'Película de superhéroes con el Caballero Oscuro.', 3, 7),
('Pulp Fiction', 'Película con historias entrelazadas de Quentin Tarantino.', 4, 7),
('Interstellar', 'Cinta de ciencia ficción sobre viajes espaciales.', 5, 7),
('Forrest Gump', 'Historia de vida de un hombre con un gran corazón.', 6, 7),
('The Matrix', 'Película de acción y ciencia ficción sobre la realidad virtual.', 7, 7),
('The Shawshank Redemption', 'Historia de redención en una prisión.', 8, 7),
('Parasite', 'Película surcoreana ganadora del Oscar a Mejor Película.', 9, 7),
-- Viajes
('Boleto a París', 'Boleto de avión para un viaje a París.', 1, 8),
('Guía de Tokio', 'Guía completa para explorar Tokio.', 2, 8),
('Reserva en Nueva York', 'Hotel reservado en el centro de Nueva York.', 3, 8),
('Crucero por el Caribe', 'Crucero con itinerario por el Caribe.', 4, 8),
('Cámara de Viaje', 'Cámara compacta para capturar recuerdos.', 5, 8),
('Mochila de Senderismo', 'Mochila resistente para aventuras al aire libre.', 6, 8),
('Mapas de Europa', 'Mapas detallados para planificar viajes por Europa.', 7, 8),
('Adaptador de Enchufe', 'Adaptador universal para enchufes en diferentes países.', 8, 8),
('Guía de Roma', 'Guía turística para visitar Roma.', 9, 8),
-- Juegos
('PlayStation 5', 'Consola de videojuegos de última generación.', 1, 9),
('Xbox Series X', 'Consola con gráficos de alta definición.', 2, 9),
('Nintendo Switch', 'Consola portátil y de sobremesa.', 3, 9),
('Joystick para PC', 'Joystick con alta precisión para juegos de PC.', 4, 9),
('VR Headset', 'Gafas de realidad virtual para una experiencia inmersiva.', 5, 9),
('Juegos de Mesa', 'Colección de juegos de mesa para todas las edades.', 6, 9),
('Puzzles 1000 Piezas', 'Puzzles desafiantes para horas de diversión.', 7, 9),
('Juego de Cartas', 'Juego de cartas para jugar con amigos.', 8, 9),
-- Tecnología
('Smartphone Google Pixel', 'Teléfono inteligente con Android puro.', 1, 10),
('Auriculares Apple AirPods', 'Auriculares inalámbricos con buena calidad de sonido.', 2, 10),
('Smartwatch Samsung', 'Reloj inteligente con muchas funcionalidades.', 3, 10),
('Tablet Samsung Galaxy', 'Tablet con una pantalla brillante y rendimiento rápido.', 4, 10),
('Teclado Mecánico', 'Teclado con retroiluminación RGB y teclas mecánicas.', 5, 10),
('Router Wi-Fi 6', 'Router con la última tecnología Wi-Fi para mejor rendimiento.', 6, 10),
('Drone DJI', 'Drone con cámara para fotografía aérea.', 7, 10),
('Portátil Lenovo', 'Portátil con buen rendimiento para tareas diarias.', 8, 10);
