const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Importe o cors
const db = require('./db');

const app = express();
const PORT = 8800;

// Habilitar CORS para todas as origens
app.use(cors()); // Permite todas as origens por padrão

// Se quiser permitir apenas um domínio específico (por exemplo, http://localhost:3000):
// app.use(cors({
//   origin: 'http://localhost:3000',
// }));

// Middlewares
app.use(bodyParser.json());

// Rotas
// 1. Criar uma senha
app.post('/passwords', (req, res) => {
    const { passname, password } = req.body;

    if (!passname || !password) {
        return res.status(400).json({ error: 'Campos passname e password são obrigatórios.' });
    }

    const query = `INSERT INTO passwords (passname, password) VALUES (?, ?)`;
    db.run(query, [passname, password], function (err) {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Erro ao salvar senha.' });
        }

        res.status(201).json({ id: this.lastID, passname, password });
    });
});

// 2. Listar todas as senhas
app.get('/passwords', (req, res) => {
    const query = `SELECT * FROM passwords`;

    db.all(query, [], (err, rows) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Erro ao listar senhas.' });
        }

        res.json(rows);
    });
});

// 3. Atualizar uma senha pelo ID
app.put('/passwords/:id', (req, res) => {
    const { id } = req.params;
    const { passname, password } = req.body;

    if (!passname || !password) {
        return res.status(400).json({ error: 'Campos passname e password são obrigatórios.' });
    }

    const query = `UPDATE passwords SET passname = ?, password = ? WHERE id = ?`;
    db.run(query, [passname, password, id], function (err) {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Erro ao atualizar senha.' });
        }

        if (this.changes === 0) {
            return res.status(404).json({ error: 'Senha não encontrada.' });
        }

        res.json({ id, passname, password });
    });
});

// 4. Deletar uma senha pelo ID
app.delete('/passwords/:id', (req, res) => {
    const { id } = req.params;

    const query = `DELETE FROM passwords WHERE id = ?`;
    db.run(query, [id], function (err) {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Erro ao deletar senha.' });
        }

        if (this.changes === 0) {
            return res.status(404).json({ error: 'Senha não encontrada.' });
        }

        res.status(204).send();
    });
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});