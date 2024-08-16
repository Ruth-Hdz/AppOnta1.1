import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

dotenv.config();

// Configuración de la base de datos
const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
});

// Funciones de Usuario
//Esta funcion registra al usuario
export async function registerUser(nombre, correo_electronico, contrasena, acepta_terminos) {
    try {
        const query = 'INSERT INTO Usuario (nombre, correo_electronico, contrasena, acepta_terminos) VALUES (?, ?, ?, ?)';
        const [results] = await pool.execute(query, [nombre, correo_electronico, contrasena, acepta_terminos]);
        return results;
    } catch (error) {
        throw error;
    }
}
//Esta funcion loguea al usuario
export async function loginUser(correo_electronico, contrasena) {
    try {
        if (!correo_electronico || !contrasena) {
            throw new Error('Email o contraseña no proporcionados');
        }

        const query = 'SELECT * FROM Usuario WHERE correo_electronico = ? AND contrasena = ?';
        const [rows] = await pool.execute(query, [correo_electronico, contrasena]);

        if (rows.length === 0) {
            throw new Error('Credenciales inválidas');
        }

        return rows[0];
    } catch (error) {
        throw error;
    }
}

// esta funcion muestra toda la informacion del usuario 
//desde  id , nombre , correo_electronico ,contrasena , acepta_terminos , fecha_creacion
// muestra que categorias tiene vinculadas junto con toda su informacion
//Muestra artículos vinculados a cada categoría, todo esto segun el id de usuario
export async function getUserById(id) {
    try {
        // Consulta principal del usuario
        const userQuery = 'SELECT * FROM Usuario WHERE id = ?';
        const [userRows] = await pool.execute(userQuery, [id]);
        
        if (userRows.length === 0) {
            throw new Error('Usuario no encontrado');
        }
        
        const user = userRows[0];

        // Consulta para obtener categorías vinculadas al usuario
        const categoriesQuery = 'SELECT * FROM Categoria WHERE id_usuario = ?';
        const [categoriesRows] = await pool.execute(categoriesQuery, [id]);

        // Consulta para obtener artículos vinculados a cada categoría
        const articlesQuery = 'SELECT * FROM Articulo WHERE id_categoria IN (SELECT id FROM Categoria WHERE id_usuario = ?)';
        const [articlesRows] = await pool.execute(articlesQuery, [id]);

        return {
            user,
            categories: categoriesRows,
            articles: articlesRows
        };
    } catch (error) {
        throw error;
    }
}

export async function getArticleCountByUserId(id_usuario) {
    try {
        // Consulta para contar artículos por usuario
        const query = `
            SELECT COUNT(a.id) AS numero_articulos
            FROM Articulo a
            JOIN Categoria c ON a.id_categoria = c.id
            WHERE c.id_usuario = ?
        `;
        const [rows] = await pool.execute(query, [id_usuario]);
        
        // Devuelve el conteo de artículos
        return rows[0].numero_articulos;
    } catch (error) {
        throw error;
    }
}

export async function deleteUser(id) {
    try {
        const query = 'DELETE FROM Usuario WHERE id = ?';
        const [results] = await pool.execute(query, [id]);
        return results;
    } catch (error) {
        throw error;
    }
}

// Funciones de Categoría
export async function createCategory(nombre, icono, color, id_usuario) {
    try {
        const query = 'INSERT INTO Categoria (nombre, icono, color, id_usuario) VALUES (?, ?, ?, ?)';
        const [results] = await pool.execute(query, [nombre, icono, color, id_usuario]);
        return results;
    } catch (error) {
        throw error;
    }
}

export async function updateCategory(id, nombre, icono, color) {
    try {
        const query = 'UPDATE Categoria SET nombre = ?, icono = ?, color = ? WHERE id = ?';
        const [results] = await pool.execute(query, [nombre, icono, color, id]);
        return results;
    } catch (error) {
        throw error;
    }
}
//// Elimina la categoría usando su ID
export async function deleteCategory(id) {
    try {
        const query = 'DELETE FROM Categoria WHERE id = ?'; 
        const [results] = await pool.execute(query, [id]);
        if (results.affectedRows === 0) {
            throw new Error('Categoría no encontrada');
        }
        return results;
    } catch (error) {
        console.error('Error en deleteCategory:', error.message); // Registra el error
        throw error;
    }
}


export async function categoryExists(id_categoria) {
    try {
        const query = 'SELECT COUNT(*) AS count FROM Categoria WHERE id = ?';
        const [rows] = await pool.execute(query, [id_categoria]);
        return rows[0].count > 0;
    } catch (error) {
        throw error;
    }
}

// Funciones de Artículo
//crea el articulo
export async function createArticle(titulo, texto, prioridad, id_categoria) {
    try {
        const query = 'INSERT INTO Articulo (titulo, texto, prioridad, id_categoria) VALUES (?, ?, ?, ?)';
        const [results] = await pool.execute(query, [titulo, texto, prioridad, id_categoria]);
        return results;
    } catch (error) {
        throw error;
    }
}

export async function getArticlesByUserId(id) {
    try {
        const query = 'SELECT * FROM Articulo WHERE id_usuario = ?';
        const [rows] = await pool.execute(query, [id]);
        return rows;
    } catch (error) {
        throw error;
    }
}

export async function getAllArticles() {
    try {
        const query = 'SELECT * FROM Articulo'; // Asegúrate de que el nombre de la tabla sea correcto
        const [rows] = await pool.execute(query);
        return rows;
    } catch (error) {
        throw error;
    }
}

export async function getCategoriesByUserId(id_usuario) {
    try {
        const query = `
            SELECT c.*, COUNT(a.id) AS numero_articulos
            FROM Categoria c
            LEFT JOIN Articulo a ON a.id_categoria = c.id
            WHERE c.id_usuario = ?
            GROUP BY c.id
        `;
        const [rows] = await pool.execute(query, [id_usuario]);
        return rows;
    } catch (error) {
        throw error;
    }
}

export async function updateArticle(id, titulo, texto, prioridad, id_categoria) {
    try {
        const query = 'UPDATE Articulo SET titulo = ?, texto = ?, prioridad = ?, id_categoria = ? WHERE id = ?';
        const [results] = await pool.execute(query, [titulo, texto, prioridad, id_categoria, id]);
        return results;
    } catch (error) {
        throw error;
    }
}

export async function deleteArticle(id) {
    try {
        const query = 'DELETE FROM Articulo WHERE id = ?';
        const [results] = await pool.execute(query, [id]);
        return results;
    } catch (error) {
        throw error;
    }
}

// Función para verificar la contraseña actual y actualizarla
export async function updatePassword(userId, currentPassword, nuevaContrasena) {
    try {
        // Recuperar la contraseña almacenada
        const query = 'SELECT contrasena FROM Usuario WHERE id = ?';
        const [rows] = await pool.execute(query, [userId]);

        if (rows.length === 0) {
            throw new Error('Usuario no encontrado');
        }

        const storedPassword = rows[0].contrasena;

        // Comparar la contraseña actual con la almacenada
        if (currentPassword !== storedPassword) {
            throw new Error('Contraseña actual incorrecta');
        }

        // Actualizar la contraseña en la base de datos
        const updateQuery = 'UPDATE Usuario SET contrasena = ? WHERE id = ?';
        const [results] = await pool.execute(updateQuery, [nuevaContrasena, userId]);

        if (results.affectedRows === 0) {
            throw new Error('No se pudo actualizar la contraseña');
        }

        return results;
    } catch (error) {
        throw error;
    }
}
export async function updateUserName(userId, newName) {
    try {
        // Consulta para actualizar el nombre del usuario
        const query = 'UPDATE Usuario SET nombre = ? WHERE id = ?';
        const [results] = await pool.execute(query, [newName, userId]);

        if (results.affectedRows === 0) {
            throw new Error('Usuario no encontrado o nombre no cambiado');
        }

        return results;
    } catch (error) {
        throw error;
    }
}

export async function updateUserEmail(userId, newEmail) {
    try {
        // Consulta para actualizar el correo electrónico del usuario
        const query = 'UPDATE Usuario SET correo_electronico = ? WHERE id = ?';
        const [results] = await pool.execute(query, [newEmail, userId]);

        if (results.affectedRows === 0) {
            throw new Error('Usuario no encontrado o correo electrónico no cambiado');
        }

        return results;
    } catch (error) {
        throw error;
    }
}

