const route = require('express').Router()

const fofocaController = require('../controllers/fofoca.controller');

route.post('/', fofocaController.save)

module.exports = route;


//penisssssss