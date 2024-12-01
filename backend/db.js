const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./passwords.db', (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err.message);
    } else {
        console.log('Conectado ao banco de dados SQLite.');
    }
});

// Criar tabela se não existir
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS passwords (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            passname TEXT NOT NULL,
            password TEXT NOT NULL
        )
    `);
});

module.exports = db;