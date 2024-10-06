const route = require('express').Router()
const fofocaController = require('../controllers/fofoca.controller');
const path = require('path')

// rota GET que leva a pagina de crição das fofocas
route.get('/criar', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'criar.html'));
});

// cria a postagem 
route.post('/criar', fofocaController.save)

route.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/timeline.html'));
});

// timeline sem criação(usuario sem conta)
route.get('/convidado', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/convi.timeline.html'));
});

// lista todas as postagens
route.get('/api', fofocaController.findAll)


module.exports = route;