require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

console.log("--- DEBUG DE VARIABLES ---");
console.log("Host:", process.env.DB_HOST);
console.log("User:", process.env.DB_USER);
console.log("DB:", process.env.DB_NAME);
console.log("Port:", process.env.DB_PORT);
console.log("--- FIN DEBUG ---");

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..')));

// CONFIGURACIÓN DE POOL
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 14857,
    ssl: { rejectUnauthorized: false },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// TEST DE CONEXIÓN
db.getConnection((err, connection) => {
    if (err) {
        console.error('❌ Error fatal al conectar con Aiven:', err);
    } else {
        console.log('✅ Conexión establecida con Aiven.');
        connection.release();
    }
});

// RUTA SEGURA
app.get('/api/productos', (req, res) => {
    db.query('SELECT * FROM productos', (err, results) => {
        if (err) {
            console.error('❌ Error en query:', err);
            return res.status(500).json({ error: 'Error interno' });
        }
        res.json(results);
    });
});

app.listen(PORT, () => console.log(`🚀 Servidor en puerto ${PORT}`));