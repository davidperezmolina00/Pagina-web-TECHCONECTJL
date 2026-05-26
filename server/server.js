const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const directorioFrontend = path.join(__dirname, '..');
console.log("📂 Sirviendo archivos desde:", directorioFrontend);

app.use(express.static(directorioFrontend));

console.log("📁 Archivos estáticos desde:", directorioFrontend);
const fs = require('fs');
console.log("¿Existe moviles.html?", fs.existsSync(path.join(directorioFrontend, 'moviles.html')));

// 1. Conexión MySQL
const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'techconectjl'
});

db.connect((err) => {
    if (err) { console.error('❌ Error:', err.message); return; }
    console.log('✅ Conectado a MySQL.');
});

// 2. API endpoints
app.get('/api/productos', (req, res) => {
    db.query('SELECT * FROM productos', (err, results) => {
        if (err) return res.status(500).json({ error: 'Error en BD' });
        res.json(results);
    });
});

app.get('/api/productos/:id', (req, res) => {
    const idProducto = req.params.id;
    const query = 'SELECT * FROM productos WHERE id = ? OR id_producto = ?';
    db.query(query, [idProducto, idProducto], (err, results) => {
        if (err) return res.status(500).json({ error: 'Error en BD' });
        if (results.length === 0) return res.status(404).json({ error: 'No encontrado' });
        res.json(results[0]);
    });
});

// 3. Catch-all para HTML — SIEMPRE AL FINAL
// 3. Catch-all para HTML — SIEMPRE AL FINAL
app.get('/{*path}', (req, res) => {
    const filePath = path.join(directorioFrontend, req.path);
    console.log('Buscando archivo en:', filePath);
    res.sendFile(filePath, err => {
        if (err) console.log('Error:', err.message);
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});