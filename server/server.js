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
    host: process.env.DB_HOST ? process.env.DB_HOST.trim() : '',
    user: process.env.DB_USER ? process.env.DB_USER.trim() : '',
    password: process.env.DB_PASSWORD ? process.env.DB_PASSWORD.trim() : '',
    database: process.env.DB_NAME ? process.env.DB_NAME.trim() : 'defaultdb',
    port: parseInt(process.env.DB_PORT) || 14857,
    ssl: { rejectUnauthorized: false },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// LOG DE DEPURACIÓN TÉCNICA
const rawHost = process.env.DB_HOST || '';
console.log(`DEBUG: Host original: '${rawHost}' | Longitud: ${rawHost.length}`);

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