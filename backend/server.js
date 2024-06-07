const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const userRoutes = require('./routes/userRoutes');
const { authenticateToken, authorize } = require('./middleware');

const app = express();
const port = process.env.PORT || 3000;
const secretKey = 'your_secret_key'; // Substitua por uma chave secreta segura

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Rotas
app.use('/users', userRoutes);

// Servir arquivos estáticos do frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Conexão com o MongoDB
const mongoUri = 'mongodb+srv://lucassaraivaxl:Se35216agb@web.aqux87z.mongodb.net/WebDev?retryWrites=true&w=majority';
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB conectado'))
    .catch(err => {
        console.error('Erro ao conectar ao MongoDB:', err.message);
    });

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
