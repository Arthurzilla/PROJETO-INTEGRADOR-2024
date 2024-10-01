const route = require('express').Router()

const fofocaController = require('../controllers/fofoca.controller');

route.post('/', fofocaController.save)
route.get('/', fofocaController.findAll)
route.get('/:id', fofocaController.findById)
route.delete('/:id', fofocaController.deleteById)
route.patch('/:id', fofocaController.updateById)
module.exports = route;