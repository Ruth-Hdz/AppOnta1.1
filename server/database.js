import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { signInWithEmailAndPassword } from "firebase/auth";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from './firebaseConfig.js';

export { pool };
dotenv.config();

// Configuración de la base de datos
const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Funciones de Usuario
//Esta funcion registra al usuario
export async function registerUser(nombre, correo_electronico, contrasena, acepta_terminos) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        console.log('Transaction begun');

        // Register user in Firebase Authentication
        console.log('Attempting to create user in Firebase');
        const userCredential = await createUserWithEmailAndPassword(auth, correo_electronico, contrasena);
        const user = userCredential.user;
        console.log('User created in Firebase:', user.uid);

        // Save additional information in MySQL database
        const query = `
            INSERT INTO usuario (nombre, correo_electronico, acepta_terminos, firebase_uid, fecha_creacion)
            VALUES (?, ?, ?, ?, NOW())
        `;
        console.log('Executing MySQL query:', query);
        const [results] = await connection.execute(query, [nombre, correo_electronico, acepta_terminos, user.uid]);
        console.log('MySQL query results:', results);

        await connection.commit();
        console.log('Transaction committed');

        return { userId: results.insertId, firebaseUserId: user.uid };
    } catch (error) {
        await connection.rollback();
        console.error("Error al registrar el usuario:", error);
        throw error;
    } finally {
        connection.release();
    }
}


export async function loginUser(correo_electronico, contrasena) {
    const connection = await pool.getConnection();
    try {
        // Verificar usuario en Firebase Authentication
        console.log('Iniciando sesión en Firebase con:', correo_electronico);
        const userCredential = await signInWithEmailAndPassword(auth, correo_electronico, contrasena);
        const user = userCredential.user;
        console.log('Usuario autenticado en Firebase:', user.uid);

        // Buscar usuario en la base de datos MySQL
        const query = `
            SELECT id 
            FROM usuario 
            WHERE correo_electronico = ? AND firebase_uid = ?
        `;
        const [results] = await connection.execute(query, [correo_electronico, user.uid]);

        if (results.length > 0) {
            return { userId: results[0].id, firebaseUserId: user.uid };
        } else {
            console.log('Usuario no encontrado en MySQL');
            return null;
        }
    } catch (error) {
        console.error('Error al iniciar sesión en Firebase o MySQL:', error);
        throw error;
    } finally {
        connection.release();
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

// Crea el artículo
// Función para crear un artículo
// Función para crear un artículo
// Función para crear un artículo
// Función para crear un artículo
export async function createArticle(titulo, texto, prioridad, id_categoria, id_usuario) {
    try {
        const query = 'INSERT INTO Articulo (titulo, texto, prioridad, id_categoria, id_usuario) VALUES (?, ?, ?, ?, ?)';
        const [results] = await pool.execute(query, [titulo, texto, prioridad, id_categoria, id_usuario]);
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

export async function updateArticle(id, titulo) {
    try {
        const query = 'UPDATE Articulo SET titulo = ? WHERE id = ?';
        const [results] = await pool.execute(query, [titulo, id]);
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
export async function searchCategoriesAndArticles(query, id_usuario) {
    try {
        if (!query || !id_usuario) {
            throw new Error("Se requieren tanto query como id_usuario.");
        }

        const searchQuery = `%${query}%`; // Formatea el término de búsqueda para LIKE

        // Consulta para buscar en Categoria
        const [categorias] = await pool.execute(
            `SELECT 'categoria' as tipo, id, nombre AS titulo 
            FROM Categoria 
            WHERE id_usuario = ? AND nombre LIKE ?`,
            [id_usuario, searchQuery]
        );

        // Consulta para buscar en Articulo
        const [articulos] = await pool.execute(
            `SELECT 'articulo' as tipo, id, titulo 
            FROM Articulo 
            WHERE id_categoria IN (SELECT id FROM Categoria WHERE id_usuario = ?) 
            AND (titulo LIKE ? OR texto LIKE ?)`,
            [id_usuario, searchQuery, searchQuery]
        );

        // Combina los resultados
        return [...categorias, ...articulos];
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

export async function search_articles_by_date(id_usuario, fecha) {
    try {
        if (!id_usuario || !fecha) {
            throw new Error("Se requieren tanto id_usuario como fecha.");
        }

        // Consulta para buscar en Categoria y Articulo
        const [results] = await pool.execute(
            `SELECT 
                Categoria.nombre AS categoria,
                Articulo.titulo AS articulo,
                Articulo.texto,
                Articulo.fecha_creacion,
                Articulo.prioridad
            FROM 
                Categoria
            JOIN 
                Articulo ON Categoria.id = Articulo.id_categoria
            WHERE 
                Categoria.id_usuario = ? AND
                DATE(Articulo.fecha_creacion) = ?
            ORDER BY 
                Categoria.nombre, Articulo.fecha_creacion;`,
            [id_usuario, fecha]
        );

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
//// Elimina la categoría usando su ID
export async function deleteCategory(id) {
    const connection = await pool.getConnection(); // Obtén una conexión del pool
    try {
        await connection.beginTransaction(); // Comienza la transacción

        // Elimina los artículos que pertenecen a la categoría
        const deleteArticlesQuery = 'DELETE FROM articulo WHERE id_categoria = ?';
        await connection.execute(deleteArticlesQuery, [id]);

        // Elimina la categoría
        const deleteCategoryQuery = 'DELETE FROM categoria WHERE id = ?';
        const [results] = await connection.execute(deleteCategoryQuery, [id]);

        if (results.affectedRows === 0) {
            throw new Error('Categoría no encontrada');
        }

        await connection.commit(); // Confirma la transacción
        return results;
    } catch (error) {
        await connection.rollback(); // Revertir la transacción en caso de error
        console.error('Error en deleteCategory:', error.message);
        throw error;
    } finally {
        connection.release(); // Libera la conexión de vuelta al pool
    }
}


// Función para eliminar un artículo
export async function deleteArticle(id) {
    try {
        const query = 'DELETE FROM Articulo WHERE id = ?';
        const [results] = await pool.execute(query, [id]);

        if (results.affectedRows === 0) {
            throw new Error('Artículo no encontrado');
        }

        return results;
    } catch (error) {
        throw error;
    }
}
// Función para obtener artículos por prioridad
export async function getArticlesByPriority(id_usuario) {
    try {
        const query = `
            SELECT a.*, c.nombre AS nombre_categoria 
            FROM Articulo a
            JOIN Categoria c ON a.id_categoria = c.id
            WHERE a.id_usuario = ?
            ORDER BY 
                prioridad = 'Sí' DESC, -- Primero los artículos con prioridad
                CASE
                    WHEN prioridad = 'Sí' THEN a.fecha_actualizacion
                    ELSE a.fecha_creacion
                END DESC;
        `;
        const [rows] = await pool.execute(query, [id_usuario]);
        return rows;
    } catch (error) {
        throw error;
    }
}
// Función para actualizar la prioridad de un artículo
export async function updateArticlePriority(id, prioridad) {
    // Convierte el booleano a "Sí" o "No"
    const prioridadStr = prioridad ? 'Sí' : 'No';

    try {
        // Actualizar la prioridad del artículo en la base de datos
        const [result] = await pool.execute(
            'UPDATE articulo SET prioridad = ? WHERE id = ?',
            [prioridadStr, id]
        );

        return result; // Devuelve el resultado de la operación
    } catch (error) {
        console.error(error);
        throw new Error('Error al actualizar la prioridad del artículo');
    }
}

// Función para obtener artículos por ID de categoría
export async function getArticlesByCategoryId(id_categoria) {
    try {
        const query = 'SELECT * FROM Articulo WHERE id_categoria = ?';
        const [rows] = await pool.execute(query, [id_categoria]);
        return rows;
    } catch (error) {
        throw error;
    }
}

// Función para obtener el número de artículos por categoría
export async function getCategoriesWithArticleCount(id_usuario) {
    try {
        const query = `
            SELECT c.nombre AS Categoria, COUNT(a.id) AS NumeroDeArticulos
            FROM Categoria c
            LEFT JOIN Articulo a ON c.id = a.id_categoria
            WHERE c.id_usuario = ?
            GROUP BY c.id, c.nombre
        `;
        const [rows] = await pool.execute(query, [id_usuario]);
        return rows;
    } catch (error) {
        throw error;
    }
}