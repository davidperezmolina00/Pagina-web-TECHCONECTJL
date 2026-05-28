require('dotenv').config();
const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');

console.log("🟢 [TEST] El script ha arrancado con éxito.");
console.log("📌 Datos detectados en tu .env:");
console.log("- Host:", process.env.DB_HOST);
console.log("- Puerto:", process.env.DB_PORT);
console.log("- DB:", process.env.DB_NAME);

// Buscamos tu archivo SQL
const rutaSql = path.join(__dirname, 'techconectjl.sql');
console.log("📂 Buscando archivo SQL en:", rutaSql);

if (!fs.existsSync(rutaSql)) {
    console.error("❌ ERROR: ¡El archivo techconectjl.sql NO está en la carpeta /server!");
    process.exit(1);
}

const sql = fs.readFileSync(rutaSql, 'utf8');

// Creamos la conexión directa a Aiven
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    multipleStatements: true // Permite ejecutar todo el archivo SQL de golpe
});

console.log("📡 Conectando a Aiven...");
db.connect((err) => {
    if (err) {
        console.error("❌ ERROR DE CONEXIÓN A AIVEN:", err.message);
        process.exit(1);
    }
    
    console.log("🚀 ¡Conectado con éxito! Subiendo tus tablas y productos...");

    // 🌟 TRUCO: Le decimos a Aiven que no exija claves primarias durante esta importación
    db.query("SET SESSION sql_require_primary_key = 0;", (err) => {
        if (err) {
            console.error("❌ Error al cambiar la variable del sistema:", err.message);
            db.end();
            process.exit(1);
        }

        // Ahora que la regla está apagada, subimos tu archivo SQL
        db.query(sql, (error, results) => {
            if (error) {
                console.error("❌ ERROR AL IMPORTAR LOS DATOS:", error.message);
            } else {
                console.log("✅ ¡ÉXITO TOTAL! Tus datos ya están guardados en la nube de Aiven.");
            }
            db.end();
            process.exit(0);
        });
    });
});