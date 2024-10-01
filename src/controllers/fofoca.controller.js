//importa a função de salvar no BD
const mongoose = require('mongoose')
const fofocaService = require('../services/fofoca.service')

// função POST criação da postagem
const save = async (req, res) =>{
    const {
        title, description
    } = req.body;
    if(!title || !description){
        res.status(400).send({message: "preencha os campos corretamente"})
    }
    const fofoca = await fofocaService.saveService(req.body)
    if(!fofoca){
        res.status(400).send({message: "Erro ao criar fofoca"})
    }
    res.status(201).send({
        message: "fofoca postado com sucesso",
        fofoca:{
            id: fofoca._id,
            title,
            description  
        }
    })
}


// função GET para exibir todas as fofocas já criadas
const findAll = async (req,res)=>{
    const fofocas = await fofocaService.findAllService()

    if(fofocas.length === 0){
        return res.status(400).send({message:"Não há nenhuma fofoca"})
    }

    res.status(200).send(fofocas)
}

//procurar usário por id
const findById = async (req, res) => {
    //declara o id
    const id = req.params.id
    
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).send({message: 'ID inválido'})
    }
    //declara o usuário
    const fofoca = await fofocaService.findByIdService(id)
    if(!fofoca){
        res.status(400).send({message: "Postagem não encontrada"})
    }
        res.status(200).send(fofoca)
    }

const deleteById = async (req, res) => {
    //declara aonde vai procurar o id
    const id = req.params.id

    //verifica se o id inserido é valido neh
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).send({message: 'ID inválido'})
    }

    const fofoca =  await fofocaService.deleteByIdService(id)

    if(!fofoca){
        res.status(400).send({message: "Postagem não encontrada"})
    }

    res.status(200).send({message: "Delete realizado com sucesso"})
}

//update por id
const updateById = async (req,res) => {

    const {title, description} = req.body;
    const id = req.params.id;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).send({message: 'ID INVÁLIDO'})
    }
    const fofoca = await fofocaService.updateByIdService(id, title, description)
    if(!fofoca){
        res.status(400).send({message: "Postagem não encontrada"})
    }
    res.status(200).send("Update realizado com sucesso")


}

module.exports = { save, findAll, findById, deleteById, updateById }