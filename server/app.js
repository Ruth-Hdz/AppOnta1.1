import express from 'express';
import cors from 'cors';
import { 
    getUserById, 
    registerUser, 
    loginUser, 
    deleteUser, 
    createCategory, 
    getCategoriesByUserId, 
    updateCategory, 
    deleteCategory, 
    createArticle,
    getArticlesByUserId, 
    updateArticle, 
    deleteArticle,
    getArticleCountByUserId,
    categoryExists,
    updatePassword,
    updateUserName,
    updateUserEmail,    
    searchCategoriesAndArticles

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

// Middleware para verificar autenticación (ejemplo de protección de ruta)
const authenticate = (req, res, next) => {
    // Implementa tu lógica de autenticación aquí
    next();
};

// Rutas de Usuario
app.post('/register', async (req, res) => {
    try {
        const { nombre, correo_electronico, contrasena, acepta_terminos } = req.body;
        if (!nombre || !correo_electronico || !contrasena || !acepta_terminos) {
            return res.status(400).json({ error: 'Todos los campos son requeridos' });
        }

        const result = await registerUser(nombre, correo_electronico, contrasena, acepta_terminos);

        if (result.affectedRows > 0) {
            res.status(201).json({
                message: 'Usuario registrado con éxito',
                userId: result.insertId
            });
        } else {
            res.status(400).json({ message: 'No se pudo registrar al usuario' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/login', async (req, res) => {
    console.log('Datos recibidos:', req.body);
    const { correo_electronico, contrasena } = req.body;

    if (!correo_electronico || !contrasena) {
        return res.status(400).json({ error: 'Email o contraseña no proporcionados' });
    }

    try {
        const user = await loginUser(correo_electronico, contrasena);
        res.status(200).json({ user });
    } catch (error) {
        res.status(401).json({ error: error.message });
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

app.get('/article_count/:id_usuario', authenticate, async (req, res) => {
    try {
        const id_usuario = req.params.id_usuario;
        if (!id_usuario) {
            return res.status(400).json({ error: 'User ID is missing' });
        }
        const articleCount = await getArticleCountByUserId(id_usuario);
        res.json({ numero_articulos: articleCount });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/user/:id', authenticate, async (req, res) => {
    try {
        await deleteUser(req.params.id);
        res.status(204).end();
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


app.get('/categories/:id_usuario', authenticate, async (req, res) => {
    try {
        const categories = await getCategoriesByUserId(req.params.id_usuario);
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/categories/:id', authenticate, async (req, res) => {
    try {
        const { nombre, icono, color } = req.body;
        const result = await updateCategory(req.params.id, nombre, icono, color);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/categories/:id', authenticate, async (req, res) => {
    try {
        await deleteCategory(req.params.id);
        res.status(200).send('Category deleted');
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

// Rutas de Artículo
app.post('/articles', authenticate, async (req, res) => {
    try {
        const { titulo, texto, prioridad, id_categoria } = req.body;

        if (!titulo || !id_categoria) {
            return res.status(400).json({ error: 'Faltan datos requeridos' });
        }

        const categoryExistsResult = await categoryExists(id_categoria);
        if (!categoryExistsResult) {
            return res.status(400).json({ error: 'Categoría no encontrada' });
        }

        const result = await createArticle(titulo, texto, prioridad, id_categoria);

        // Añade el mensaje de éxito junto con la respuesta del artículo creado
        res.status(201).json({
            message: 'Artículo creado con éxito',
            article: result
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear el artículo' });
    }
});

app.get('/articles_list/:id', async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({ error: 'User ID is missing' });
        }
        const articles = await getArticlesByUserId(id);
        res.json(articles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// CREACION DE ARTICULO
app.put('/articles/:id', authenticate, async (req, res) => {
    try {
        const { titulo, texto, prioridad, id_categoria } = req.body;
        const result = await updateArticle(req.params.id, titulo, texto, prioridad, id_categoria);

        // Verifica si se actualizó al menos una fila
        if (result.affectedRows > 0) {
            res.json({ message: 'Artículo actualizado con éxito', result });
        } else {
            res.status(404).json({ message: 'Artículo no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.delete('/articles/:id', authenticate, async (req, res) => {
    try {
        await deleteArticle(req.params.id);
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

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
// Ruta para actualizar el nombre del usuario
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

// Inicia el servidor
const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});