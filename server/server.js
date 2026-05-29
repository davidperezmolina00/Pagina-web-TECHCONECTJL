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

// Cambiado: Ahora prioriza el puerto que le asigne Render/Railway, si no, usa el 3001
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
const mysql = require('mysql2');

// Configuración recomendada para conexiones remotas y estables
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    // Añade estas dos líneas para solucionar el error de conexión SSL:
    ssl: { 
        rejectUnauthorized: false 
    },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
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
// 4. ARRANQUE DEL SERVIDOR (Puerto dinámico)
// =====================================================================
app.listen(PORT, () => {
    console.log(`🚀 Servidor backend unificado corriendo en el puerto ${PORT}`);
});