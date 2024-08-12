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
    updateArticle, 
    deleteArticle 
} from './database.js';

// Crea una instancia de Express
const app = express();

// Configuración de CORS
const corsOptions = {
    origin: '*', // Permite todas las orígenes durante el desarrollo
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true,
};

app.use(cors(corsOptions)); // Usa cors antes de definir las rutas

app.use(express.json());

// Rutas de Usuario
app.post('/register', async (req, res) => {
    try {
        const { nombre, email, contraseña, acepta_terminos } = req.body;
        const result = await registerUser(nombre, email, contraseña, acepta_terminos);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { email, contraseña } = req.body;
        const user = await loginUser(email, contraseña);
        res.json(user);
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
});

app.get('/user/:id', async (req, res) => {
    try {
        const user = await getUserById(req.params.id);
        res.json(user);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

app.delete('/user/:id', async (req, res) => {
    try {
        await deleteUser(req.params.id);
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Rutas de Categoría
app.post('/categories', async (req, res) => {
    try {
        const { nombre, icono, color, id_usuario } = req.body;
        const result = await createCategory(nombre, icono, color, id_usuario);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/categories/:id_usuario', async (req, res) => {
    try {
        const categories = await getCategoriesByUserId(req.params.id_usuario);
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/categories/:id', async (req, res) => {
    try {
        const { nombre, icono, color } = req.body;
        const result = await updateCategory(req.params.id, nombre, icono, color);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/categories/:id', async (req, res) => {
    try {
        await deleteCategory(req.params.id);
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Rutas de Artículo
app.post('/articles', async (req, res) => {
    try {
        const { titulo, texto, prioridad, id_categoria } = req.body;
        const result = await createArticle(titulo, texto, prioridad, id_categoria);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/articles/:id_categoria', async (req, res) => {
    try {
        const articles = await getArticlesByCategoryId(req.params.id_categoria);
        res.json(articles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/articles/:id', async (req, res) => {
    try {
        const { titulo, texto, prioridad, id_categoria } = req.body;
        const result = await updateArticle(req.params.id, titulo, texto, prioridad, id_categoria);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/articles/:id', async (req, res) => {
    try {
        await deleteArticle(req.params.id);
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Inicia el servidor
app.listen(8080, '0.0.0.0', () => {
    console.log('Servidor corriendo en el puerto 8080');
});
