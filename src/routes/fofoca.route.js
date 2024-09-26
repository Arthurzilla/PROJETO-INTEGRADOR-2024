const route = require('express').Router()

const fofocaController = require('../controllers/fofoca.controller');

// cria a postagem 
route.post('/criar', fofocaController.save)

// lista todas as postagens
route.get('/', fofocaController.findAll)


module.exports = route;