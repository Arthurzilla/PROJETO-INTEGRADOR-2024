const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDatabase = require('./src/database/db');
const session = require('express-session'); // Importando o middleware de sessão

const app = express();
const porta = 3000;

// Rotas
const fofocaRoute = require('./src/routes/fofoca.route');
const userRoute = require('./src/routes/user.route');

// Middleware para permitir CORS
app.use(cors());

// Middleware para gerenciar sessões
app.use(session({
    secret: 'algumaChaveSecretaSegura', // Substitua por uma chave secreta segura
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true } // Defina como true se estiver usando HTTPS
}));

// Middleware para manipulação de JSON
app.use(express.json());

// Conexão de pastas estáticas
app.use('/public', express.static(path.join(__dirname, 'public')));

// Conexão ao banco de dados
connectDatabase();

// Rotas
app.use('/', userRoute);
app.use('/fofocas', fofocaRoute);

// Iniciar o servidor
app.listen(porta, () => {
    console.log(`Servidor rodando na porta http://localhost:${porta}`);
});
