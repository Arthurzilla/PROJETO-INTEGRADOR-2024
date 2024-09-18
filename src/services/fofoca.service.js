const Fofoca = require('../models/Fofoca')


//faz a postagem no banco de dados
const saveService = (body) => Fofoca.create(body)

//exporta a função de salvar no banco
module.exports = { saveService }