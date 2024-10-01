const route = require('express').Router()
const fofocaController = require('../controllers/fofoca.controller');
const path = require('path')

// Servir o arquivo criar.html da pasta views
route.get('/criar', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'criar.html'));
});

// cria a postagem 
route.post('/criar', fofocaController.save)

// lista todas as postagens
route.get('/', fofocaController.findAll)


module.exports = route;