import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Configuración de la base de datos
const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
});

// Funciones de Usuario
export async function registerUser(nombre, email, contraseña, acepta_terminos) {
    try {
        const query = 'INSERT INTO Usuario (nombre, email, contraseña, acepta_terminos) VALUES (?, ?, ?, ?)';
        const [results] = await pool.execute(query, [nombre, email, contraseña, acepta_terminos]);
        return results;
    } catch (error) {
        throw error;
    }
}

export async function loginUser(email, contraseña) {
    try {
        const query = 'SELECT * FROM Usuario WHERE email = ? AND contraseña = ?';
        const [rows] = await pool.execute(query, [email, contraseña]);
        if (rows.length === 0) {
            throw new Error('Credenciales inválidas');
        }
        return rows[0];
    } catch (error) {
        throw error;
    }
}

export async function getUserById(id) {
    try {
        const query = 'SELECT * FROM Usuario WHERE id = ?';
        const [rows] = await pool.execute(query, [id]);
        if (rows.length === 0) {
            throw new Error('Usuario no encontrado');
        }
        return rows[0];
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

export async function deleteCategory(id) {
    try {
        const query = 'DELETE FROM Categoria WHERE id = ?';
        const [results] = await pool.execute(query, [id]);
        return results;
    } catch (error) {
        throw error;
    }
}

// Funciones de Artículo
export async function createArticle(titulo, texto, prioridad, id_categoria) {
    try {
        const query = 'INSERT INTO Articulo (titulo, texto, prioridad, id_categoria) VALUES (?, ?, ?, ?)';
        const [results] = await pool.execute(query, [titulo, texto, prioridad, id_categoria]);
        return results;
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
