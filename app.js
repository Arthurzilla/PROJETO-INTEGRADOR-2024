const express = require('express');
const fofocaRoute = require('./src/routes/fofoca.route')
const app = express();
const connectDatabase = require('./src/database/db')
const porta = 3000
const cors = require('cors')
app.use(cors());

connectDatabase()

app.use(express.json())
app.use('/fofoca', fofocaRoute)
app.listen(porta)
console.log(`servidor rodando na porta`)