require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..')));

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT) || 14857,
    ssl: { rejectUnauthorized: false },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

app.get('/api/productos', (req, res) => {
    // Verificamos antes de ejecutar
    db.getConnection((err, connection) => {
        if (err) {
            console.error('❌ Error obteniendo conexión del pool:', err);
            return res.status(500).json({ error: 'DB no disponible' });
        }
        
        connection.query('SELECT * FROM productos', (err, results) => {
            connection.release(); // ¡MUY IMPORTANTE! Siempre liberar
            if (err) {
                console.error('❌ Error en consulta:', err);
                return res.status(500).json({ error: 'Error en consulta' });
            }
            res.json(results);
        });
    });
});

app.listen(PORT, () => console.log(`🚀 Servidor en puerto ${PORT}`));