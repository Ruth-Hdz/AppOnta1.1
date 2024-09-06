import express from 'express';
import cors from 'cors';
import { 
    getUserById, 
    registerUser, 
    loginUser, 
    createArticle,
    createCategory,
    updateArticle,
    updateUserName,
    updateUserEmail,
    updatePassword,
    searchCategoriesAndArticles,
    search_articles_by_date,
    getCategoriesByUserId,
    deleteCategory,
    deleteArticle,
    getArticlesByPriority,
    updateArticlePriority,
    getArticlesByCategoryId,
    getCategoriesWithArticleCount,
    
    
} from './database.js';

// Crea una instancia de Express
const app = express();

// Configuración de CORS
const corsOptions = {
    origin: process.env.CORS_ORIGIN || '*',
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

const authenticate = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Suponiendo que envías el token en el header Authorization: Bearer <token>
    if (!token) {
        return res.status(401).json({ error: 'No autorizado, token no proporcionado' });
    }
    try {
        const decodedToken = await auth.verifyIdToken(token); // Verifica el token usando Firebase
        req.user = decodedToken; // Agrega los datos decodificados del usuario a la solicitud
        next(); // Continúa al siguiente middleware o controlador
    } catch (error) {
        res.status(401).json({ error: 'No autorizado, token inválido' });
    }
};


// Rutas de Usuario
app.post('/register', async (req, res) => {
    try {
        const { nombre, correo_electronico, contrasena, acepta_terminos } = req.body;

        // Verification of required fields
        if (!nombre || !correo_electronico || !contrasena || !acepta_terminos) {
            return res.status(400).json({ error: 'Todos los campos son requeridos' });
        }

        // Call to registerUser function
        const result = await registerUser(nombre, correo_electronico, contrasena, acepta_terminos);

        // Verification of successful insertion
        if (result && result.userId) {
            res.status(201).json({
                message: 'Usuario registrado con éxito',
                userId: result.userId,
                firebaseUserId: result.firebaseUserId,
            });
        } else {
            res.status(400).json({ error: 'No se pudo registrar al usuario' });
        }
    } catch (error) {
        console.error('Error al registrar el usuario:', error);
        res.status(500).json({ error: 'Error al registrar el usuario. Intente nuevamente más tarde.' });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { correo_electronico, contrasena } = req.body;

        // Verificación de campos requeridos
        if (!correo_electronico || !contrasena) {
            return res.status(400).json({ error: 'Correo electrónico y contraseña son requeridos' });
        }

        // Llamada a la función loginUser
        const result = await loginUser(correo_electronico, contrasena);

        if (result) {
            res.status(200).json({
                message: 'Inicio de sesión exitoso',
                userId: result.userId,
                firebaseUserId: result.firebaseUserId,
            });
        } else {
            res.status(401).json({ error: 'Credenciales incorrectas' });
        }
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ error: 'Error al iniciar sesión. Intente nuevamente más tarde.' });
    }
});

app.get('/user/:id', authenticate, async (req, res) => {
    try {
        const userInfo = await getUserById(req.params.id);
        res.json(userInfo);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});
//crear articulo
// Crear artículo sin autenticación
// Crear artículo
app.post('/articles', async (req, res) => {
    try {
        const { titulo, texto, prioridad, id_categoria, id_usuario } = req.body;

        // Llama a la función createArticle con id_usuario
        const result = await createArticle(titulo, texto, prioridad, id_categoria, id_usuario);

        // Verifica si se creó al menos una fila
        if (result.affectedRows > 0) {
            res.json({ message: 'Artículo creado con éxito', result });
        } else {
            res.status(404).json({ message: 'Artículo no creado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Rutas de Categoría
app.post('/categories', authenticate, async (req, res) => {
    try {
        const { nombre, icono, color, id_usuario } = req.body;

        // Llama a la función para crear la categoría
        const result = await createCategory(nombre, icono, color, id_usuario);

        // Responde con un mensaje de éxito y los detalles de la categoría creada
        res.status(201).json({
            message: 'Categoría creada con éxito',
            category: {
                id: result.insertId,
                nombre,
                icono,
                color,
                id_usuario
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear la categoría' });
    }
});
//Actualizar Articulo
app.put('/articles/:id', authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const { titulo } = req.body;

        if (!titulo) {
            return res.status(400).json({ error: 'El título es requerido' });
        }

        const result = await updateArticle(id, titulo);

        if (result.affectedRows > 0) {
            res.json({ message: 'Título del artículo actualizado con éxito' });
        } else {
            res.status(404).json({ error: 'Artículo no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
//Actualizar nombre de usuario
app.put('/user/:id/name', authenticate, async (req, res) => {
    try {
        const userId = req.params.id;
        const { nuevoNombre } = req.body;

        if (!nuevoNombre) {
            return res.status(400).json({ error: 'Nuevo nombre es requerido' });
        }

        const result = await updateUserName(userId, nuevoNombre);

        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Nombre actualizado con éxito' });
        } else {
            res.status(404).json({ error: 'Usuario no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Ruta para actualizar el correo electrónico del usuario
app.put('/user/:id/email', authenticate, async (req, res) => {
    try {
        const userId = req.params.id;
        const { nuevoCorreo } = req.body;

        if (!nuevoCorreo) {
            return res.status(400).json({ error: 'Nuevo correo electrónico es requerido' });
        }

        const result = await updateUserEmail(userId, nuevoCorreo);

        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Correo electrónico actualizado con éxito' });
        } else {
            res.status(404).json({ error: 'Usuario no encontrado o correo electrónico no cambiado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
//Ruta para búsqueda 
app.get('/Buscar/:id', async (req, res) => {
    try {
        const { query } = req.query;
        const id_usuario = req.params.id; // Obtén id_usuario de los parámetros de la URL
        const results = await searchCategoriesAndArticles(query, id_usuario);
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
//actualizar contraseña
app.put('/user/:id/password', authenticate, async (req, res) => {
    try {
        const { contrasenaActual, nuevaContrasena } = req.body;
        const userId = req.params.id;

        if (!contrasenaActual || !nuevaContrasena) {
            return res.status(400).json({ error: 'Contraseña actual y nueva contraseña son requeridas' });
        }

        // Llama a la función para actualizar la contraseña
        const result = await updatePassword(userId, contrasenaActual, nuevaContrasena);

        res.status(200).json({ message: 'Contraseña actualizada con éxito' });
    } catch (error) {
        // Envía un mensaje de error específico según el problema
        res.status(500).json({ error: error.message });
    }
});

app.get('/search_articles_by_date/:id_usuario', async (req, res) => {
    try {
        const id_usuario = req.params.id_usuario;
        const { fecha } = req.query; // Obtener fecha desde los parámetros de consulta

        // Validar los parámetros
        if (!fecha) {
            return res.status(400).json({ error: 'Fecha requerida' });
        }

        // Llamar a la función de búsqueda
        const results = await search_articles_by_date(id_usuario, fecha); // Llama a la función sin el parámetro query
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/categories/:id_usuario', authenticate, async (req, res) => {
    try {
        const categories = await getCategoriesByUserId(req.params.id_usuario);
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/categories/:id', authenticate, async (req, res) => {
    try {
        await deleteCategory(req.params.id);
        res.status(200).send('Categoría eliminada');
    } catch (error) {
        res.status(500).send('Error Interno del Servidor');
    }
});

// Ruta para eliminar un artículo
app.delete('/articles/:id', authenticate, async (req, res) => {
    try {
        await deleteArticle(req.params.id);
        res.status(200).send('Artículo eliminado');
    } catch (error) {
        res.status(500).send('Error Interno del Servidor');
    }
});

// Ruta para obtener artículos por prioridad
app.get('/articles/priority', authenticate, async (req, res) => {
    try {
        const { id_usuario } = req.query;

        if (!id_usuario) {
            return res.status(400).json({ error: 'ID de usuario es requerido' });
        }

        const articles = await getArticlesByPriority(id_usuario);

        if (articles.length > 0) {
            res.status(200).json(articles);
        } else {
            res.status(404).json({ message: 'No se encontraron artículos' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Ruta para actualizar la prioridad de un artículo
app.put('/articles/:id/priority', authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const { prioridad } = req.body;

        if (typeof prioridad !== 'boolean') {
            return res.status(400).json({ error: 'Prioridad debe ser true o false' });
        }

        const result = await updateArticlePriority(id, prioridad);

        if (result.affectedRows > 0) {
            res.json({ message: 'Prioridad del artículo actualizada con éxito' });
        } else {
            res.status(404).json({ error: 'Artículo no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Ruta para obtener artículos por ID de categoría
app.get('/articles/category/:id_categoria', async (req, res) => {
    try {
        const id_categoria = parseInt(req.params.id_categoria, 10);

        if (isNaN(id_categoria)) {
            return res.status(400).json({ error: 'ID de categoría inválido' });
        }

        const articles = await getArticlesByCategoryId(id_categoria);

        if (articles.length > 0) {
            res.status(200).json(articles);
        } else {
            res.status(404).json({ message: 'No se encontraron artículos para esta categoría' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Ruta para obtener el número de artículos por categoría
app.get('/categories/article-count/:id_usuario', async (req, res) => {
    try {
        const id_usuario = req.params.id_usuario;
        const result = await getCategoriesWithArticleCount(id_usuario);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Inicia el servidor
const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});