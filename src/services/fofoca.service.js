const Fofoca = require('../models/Fofoca')

//faz a postagem no banco de dados
const saveService = (body) => Fofoca.create(body)

// puxa todas as postagens
const findAllService = () => Fofoca.find()

//exporta a função de salvar no banco
module.exports = { saveService, findAllService }