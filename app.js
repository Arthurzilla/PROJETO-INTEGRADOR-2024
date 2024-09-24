const express = require('express');
const fofocaRoute = require('./src/routes/fofoca.route')
const app = express();
const connectDatabase = require('./src/database/db')
const porta = 3000

connectDatabase()

app.use(express.json())
app.use(fofocaRoute)
app.listen(porta)
console.log(`servidor rodando na porta`)