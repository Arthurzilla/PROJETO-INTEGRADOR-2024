const route = require('express').Router()
const fofocaController = require('../controllers/fofoca.controller');
const path = require('path')

route.get('/criar', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'criar.html'));
});

// cria a postagem 
route.post('/criar', fofocaController.save)

route.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/timeline.html'));
});

// lista todas as postagens
route.get('/api', fofocaController.findAll)


module.exports = route;