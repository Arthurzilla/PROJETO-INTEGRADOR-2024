const Fofoca = require('../models/Fofoca')

//faz a postagem no banco de dados
const saveService = (body) => Fofoca.create(body)

// puxa todas as postagens
const findAllService = () => Fofoca.find().sort({_id: -1})

//encontra postagem por id
const findByIdService = (id) => Fofoca.findById(id)

//deleta postagem por id
const deleteByIdService  = (id) => Fofoca.findByIdAndDelete(id)

//update de postagem por id
const updateByIdService = (id, date, description) => Fofoca.findOneAndUpdate({_id: id}, {date, description})

//exporta a função de salvar no banco
module.exports = { saveService, findAllService, findByIdService, deleteByIdService, updateByIdService }
