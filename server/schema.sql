CREATE DATABASE db_ontaapp;

USE db_ontaapp;

CREATE TABLE Usuario (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  contraseña VARCHAR(100),
  acepta_terminos BOOLEAN
);

CREATE TABLE Categoria (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100),
  icono VARCHAR(100),
  color VARCHAR(7),
  id_usuario INT,
  FOREIGN KEY (id_usuario) REFERENCES Usuario(id)
);

CREATE TABLE Articulo (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(100),
  texto TEXT,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  prioridad BOOLEAN,
  id_categoria INT,
  FOREIGN KEY (id_categoria) REFERENCES Categoria(id)
);

INSERT INTO Usuario (nombre, email, contraseña, acepta_terminos)
VALUES ('Juan Pérez', 'juan@example.com', 'password123', TRUE);

INSERT INTO Usuario (nombre, email, contraseña, acepta_terminos)
VALUES ('Ana Gómez', 'ana@example.com', 'password456', TRUE);

INSERT INTO Usuario (nombre, email, contraseña, acepta_terminos)
VALUES ('Carlos Ruiz', 'carlos@example.com', 'password789', TRUE);

INSERT INTO Categoria (nombre, icono, color, id_usuario)
VALUES ('Libros', '📚', '#FF5733', 1);

INSERT INTO Categoria (nombre, icono, color, id_usuario)
VALUES ('Música', '🎵', '#33FF57', 1);
INSERT INTO Categoria (nombre, icono, color, id_usuario)
VALUES ('Recetas', '🍲', '#3357FF', 2);

INSERT INTO Categoria (nombre, icono, color, id_usuario)
VALUES ('Viajes', '✈️', '#FF33A1', 2);
INSERT INTO Categoria (nombre, icono, color, id_usuario)
VALUES ('Deportes', '⚽', '#A133FF', 3);

INSERT INTO Categoria (nombre, icono, color, id_usuario)
VALUES ('Tecnología', '💻', '#33FFA1', 3);
-- Artículos en la categoría 'Libros'
INSERT INTO Articulo (titulo, texto, prioridad, id_categoria)
VALUES ('El Quijote', 'Un clásico de la literatura española.', FALSE, 1);

INSERT INTO Articulo (titulo, texto, prioridad, id_categoria)
VALUES ('Cien Años de Soledad', 'Una obra maestra de Gabriel García Márquez.', TRUE, 1);

-- Artículos en la categoría 'Música'
INSERT INTO Articulo (titulo, texto, prioridad, id_categoria)
VALUES ('Beethoven', 'Compositor alemán, conocido por sus sinfonías.', FALSE, 2);

INSERT INTO Articulo (titulo, texto, prioridad, id_categoria)
VALUES ('The Beatles', 'Banda británica que revolucionó la música.', TRUE, 2);
-- Artículos en la categoría 'Recetas'
INSERT INTO Articulo (titulo, texto, prioridad, id_categoria)
VALUES ('Paella', 'Receta tradicional española con arroz y mariscos.', TRUE, 3);

INSERT INTO Articulo (titulo, texto, prioridad, id_categoria)
VALUES ('Tacos', 'Plato mexicano con tortillas y relleno variado.', FALSE, 3);

-- Artículos en la categoría 'Viajes'
INSERT INTO Articulo (titulo, texto, prioridad, id_categoria)
VALUES ('París', 'La ciudad del amor y la Torre Eiffel.', TRUE, 4);

INSERT INTO Articulo (titulo, texto, prioridad, id_categoria)
VALUES ('Tokio', 'Capital de Japón, conocida por su tecnología y cultura.', FALSE, 4);
 -- Artículos en la categoría 'Deportes'
INSERT INTO Articulo (titulo, texto, prioridad, id_categoria)
VALUES ('Fútbol', 'El deporte más popular del mundo.', TRUE, 5);

INSERT INTO Articulo (titulo, texto, prioridad, id_categoria)
VALUES ('Tenis', 'Deporte de raqueta, conocido por sus torneos Grand Slam.', FALSE, 5);

-- Artículos en la categoría 'Tecnología'
INSERT INTO Articulo (titulo, texto, prioridad, id_categoria)
VALUES ('Inteligencia Artificial', 'El futuro de la tecnología y la automatización.', TRUE, 6);

INSERT INTO Articulo (titulo, texto, prioridad, id_categoria)
VALUES ('Blockchain', 'La tecnología detrás de las criptomonedas.', FALSE, 6);

SELECT 
    Categoria.nombre AS categoria_nombre,
    Articulo.titulo AS articulo_titulo,
    Articulo.texto AS articulo_texto,
    Articulo.fecha_creacion AS articulo_fecha_creacion,
    Articulo.prioridad AS articulo_prioridad
FROM 
    Categoria
LEFT JOIN 
    Articulo ON Categoria.id = Articulo.id_categoria
WHERE 
    Categoria.id_usuario = (SELECT id FROM Usuario WHERE email = 'carlos@example.com');


-- Nuevas categorías para Juan Pérez (id_usuario = 1)
INSERT INTO Categoria (nombre, icono, color, id_usuario)
VALUES ('Cine', '🎬', '#FF9A33', 1);

INSERT INTO Categoria (nombre, icono, color, id_usuario)
VALUES ('Arte', '🎨', '#33D4FF', 1);

-- Nuevas categorías para Ana Gómez (id_usuario = 2)
INSERT INTO Categoria (nombre, icono, color, id_usuario)
VALUES ('Café', '☕', '#FF8C33', 2);

INSERT INTO Categoria (nombre, icono, color, id_usuario)
VALUES ('Jardinería', '🌱', '#33FF8C', 2);

-- Nuevas categorías para Carlos Ruiz (id_usuario = 3)
INSERT INTO Categoria (nombre, icono, color, id_usuario)
VALUES ('Historia', '📜', '#FF3357', 3);

INSERT INTO Categoria (nombre, icono, color, id_usuario)
VALUES ('Cómics', '🦸', '#5733FF', 3);

-- Artículos en la categoría 'Cine' para Juan Pérez (id_usuario = 1)
INSERT INTO Articulo (titulo, texto, prioridad, id_categoria)
VALUES ('Inception', 'Película de ciencia ficción dirigida por Christopher Nolan.', TRUE, (SELECT id FROM Categoria WHERE nombre = 'Cine' AND id_usuario = 1));

INSERT INTO Articulo (titulo, texto, prioridad, id_categoria)
VALUES ('The Godfather', 'Un clásico del cine dirigido por Francis Ford Coppola.', FALSE, (SELECT id FROM Categoria WHERE nombre = 'Cine' AND id_usuario = 1));

-- Artículos en la categoría 'Arte' para Juan Pérez (id_usuario = 1)
INSERT INTO Articulo (titulo, texto, prioridad, id_categoria)
VALUES ('Guernica', 'Pintura de Pablo Picasso que representa la guerra y la violencia.', TRUE, (SELECT id FROM Categoria WHERE nombre = 'Arte' AND id_usuario = 1));

INSERT INTO Articulo (titulo, texto, prioridad, id_categoria)
VALUES ('La noche estrellada', 'Obra maestra de Vincent van Gogh.', FALSE, (SELECT id FROM Categoria WHERE nombre = 'Arte' AND id_usuario = 1));

-- Artículos en la categoría 'Café' para Ana Gómez (id_usuario = 2)
INSERT INTO Articulo (titulo, texto, prioridad, id_categoria)
VALUES ('Espresso', 'Café concentrado con un sabor fuerte.', TRUE, (SELECT id FROM Categoria WHERE nombre = 'Café' AND id_usuario = 2));

INSERT INTO Articulo (titulo, texto, prioridad, id_categoria)
VALUES ('Latte', 'Café con leche, suave y cremoso.', FALSE, (SELECT id FROM Categoria WHERE nombre = 'Café' AND id_usuario = 2));

-- Artículos en la categoría 'Jardinería' para Ana Gómez (id_usuario = 2)
INSERT INTO Articulo (titulo, texto, prioridad, id_categoria)
VALUES ('Cultivo de tomates', 'Consejos para cultivar tomates en casa.', TRUE, (SELECT id FROM Categoria WHERE nombre = 'Jardinería' AND id_usuario = 2));

INSERT INTO Articulo (titulo, texto, prioridad, id_categoria)
VALUES ('Plantas suculentas', 'Cómo cuidar las plantas suculentas.', FALSE, (SELECT id FROM Categoria WHERE nombre = 'Jardinería' AND id_usuario = 2));

-- Artículos en la categoría 'Historia' para Carlos Ruiz (id_usuario = 3)
INSERT INTO Articulo (titulo, texto, prioridad, id_categoria)
VALUES ('La Segunda Guerra Mundial', 'Un análisis de los eventos de la Segunda Guerra Mundial.', TRUE, (SELECT id FROM Categoria WHERE nombre = 'Historia' AND id_usuario = 3));

INSERT INTO Articulo (titulo, texto, prioridad, id_categoria)
VALUES ('La caída del Imperio Romano', 'Estudio sobre el declive del Imperio Romano.', FALSE, (SELECT id FROM Categoria WHERE nombre = 'Historia' AND id_usuario = 3));

-- Artículos en la categoría 'Cómics' para Carlos Ruiz (id_usuario = 3)
INSERT INTO Articulo (titulo, texto, prioridad, id_categoria)
VALUES ('Spider-Man', 'Cómic sobre el superhéroe arácnido creado por Stan Lee.', TRUE, (SELECT id FROM Categoria WHERE nombre = 'Cómics' AND id_usuario = 3));

INSERT INTO Articulo (titulo, texto, prioridad, id_categoria)
VALUES ('Batman', 'El Caballero Oscuro, uno de los superhéroes más icónicos.', FALSE, (SELECT id FROM Categoria WHERE nombre = 'Cómics' AND id_usuario = 3));

SELECT 
    Categoria.nombre AS categoria_nombre,
    Articulo.titulo AS articulo_titulo,
    Articulo.texto AS articulo_texto,
    Articulo.fecha_creacion AS articulo_fecha_creacion,
    Articulo.prioridad AS articulo_prioridad
FROM 
    Categoria
LEFT JOIN 
    Articulo ON Categoria.id = Articulo.id_categoria
WHERE 
    Categoria.id_usuario = (SELECT id FROM Usuario WHERE email = 'carlos@example.com');
