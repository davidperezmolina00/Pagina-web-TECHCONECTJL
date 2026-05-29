// =====================================================================
// 0. CARGAR DOTENV AL PRINCIPIO DEL ARCHIVO
// =====================================================================
require('dotenv').config(); 

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();

const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const directorioFrontend = path.join(__dirname, '..');
console.log("📂 Sirviendo archivos desde:", directorioFrontend);

app.use(express.static(directorioFrontend));

console.log("📁 Archivos estáticos desde:", directorioFrontend);
console.log("¿Existe moviles.html?", fs.existsSync(path.join(directorioFrontend, 'moviles.html')));

// =====================================================================
// 1. CONEXIÓN MYSQL (Adaptada con variables de entorno para la nube)
// =====================================================================
const db = mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : '',
    database: process.env.DB_NAME || 'techconectjl',
    // Los servicios en la nube suelen exigir especificar el puerto de MySQL (por defecto 3306)
    port: process.env.DB_PORT || 3306 
});

db.connect((err) => {
    if (err) { console.error('❌ Error:', err.message); return; }
    console.log('✅ Conectado a MySQL con éxito.');
});

// =====================================================================
// 2. ENDPOINT GENERAL: Obtener TODOS los productos (Para catálogos)
// =====================================================================
app.get('/api/productos', (req, res) => {
    console.log("📦 Catálogo pidiendo todos los productos...");
    const query = 'SELECT * FROM productos';
    
    db.query(query, (err, results) => {
        if (err) {
            console.error('❌ Error al obtener todos los productos:', err);
            return res.status(500).json({ error: 'Error en el servidor de base de datos' });
        }
        res.json(results);
    });
});

// =====================================================================
// 3. ENDPOINT INDIVIDUAL: Obtener UN solo producto por ID (Para productos.html)
// =====================================================================
app.get('/api/productos/:id', (req, res) => {
    const idProducto = req.params.id;
    console.log(`\n🔍 Frontend pidiendo producto individual. ID recibida: "${idProducto}"`);

    const query = 'SELECT * FROM productos WHERE id = ?';

    db.query(query, [idProducto], (err, results) => {
        if (err) {
            console.error('❌ Error crítico en la consulta MySQL:', err);
            return res.status(500).json({ error: 'Error interno del servidor en MySQL' });
        }

        if (results.length === 0) {
            console.warn(`⚠️ El producto con ID ${idProducto} NO existe en la base de datos.`);
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        console.log('✅ ¡Producto encontrado con éxito! Enviando:', results[0].modelo);
        res.json(results[0]);
    });
});

// =====================================================================
// NUEVO: ENDPOINT PARA STIPE (Checkout Session)
// =====================================================================
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Asegúrate de tener esta variable en tu .env

app.post('/api/create-checkout-session', async (req, res) => {
    try {
        // El frontend solo nos envía un array de objetos con {id, cantidad}
        const { productos } = req.body; 

        const line_items = [];

        for (const item of productos) {
            // Buscamos el precio real en la base de datos para cada ID
            // Esto evita que un usuario malintencionado cambie el precio en su navegador
            const [rows] = await db.promise().query('SELECT modelo, precio_euro FROM productos WHERE id = ?', [item.id]);
            
            if (rows.length > 0) {
                const productoBD = rows[0];
                line_items.push({
                    price_data: {
                        currency: 'eur',
                        product_data: {
                            name: productoBD.modelo, 
                        },
                        unit_amount: Math.round(productoBD.precio_euro * 100), // Stripe requiere centavos (ej: 500€ = 50000)
                    },
                    quantity: item.cantidad,
                });
            }
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: line_items,
            mode: 'payment',
            success_url: 'https://pagina-web-techconectjl.onrender.com/exito.html',
            cancel_url: 'https://pagina-web-techconectjl.onrender.com/carrito.html',
        });

        res.json({ url: session.url });
    } catch (error) {
        console.error("Error en Stripe:", error);
        res.status(500).json({ error: error.message });
    }
});

// =====================================================================
// 4. ARRANQUE DEL SERVIDOR (Puerto dinámico)
// =====================================================================
app.listen(PORT, () => {
    console.log(`🚀 Servidor backend unificado corriendo en el puerto ${PORT}`);
});