const route = require('express').Router()

const fofocaController = require('../controllers/fofoca.controller');

route.post('/fofoca', fofocaController.save)

module.exports = route;


//teste