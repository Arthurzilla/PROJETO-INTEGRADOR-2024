const express = require('express');
const cors = require('cors');
const path = require('path')
const fofocaRoute = require('./src/routes/fofoca.route')
const connectDatabase = require('./src/database/db')
const app = express();
const porta = 3000

app.use(cors());
app.use(express.json())
// conexão de pastas
app.use(express.static(path.join(__dirname, 'public')));

// banco de dados
connectDatabase()

// rota principal
app.use('/fofocas', fofocaRoute)

app.listen(porta)
console.log(`servidor rodando na porta http://localhost:${porta}`)