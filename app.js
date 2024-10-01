const express = require('express');
const fofocaRoute = require('./src/routes/fofoca.route')
const app = express();
const connectDatabase = require('./src/database/db')
const porta = 3000
const cors = require('cors');

app.use(cors());
app.use(express.json())

connectDatabase()

// rota principal
app.use('/fofocas', fofocaRoute)

app.listen(porta)
console.log(`servidor rodando na porta http://localhost:${porta}`)