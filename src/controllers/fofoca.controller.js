//importa a função de salvar no BD
const fofocaService = require('../services/fofoca.service')


const save = async (req, res) =>{


    const {
        title, description
    } = req.body;

    if(!title || !description){
        res.status(400).send({message: "preencha os campos corretamente"})
    }

    const fofoca = await fofocaService.saveService(req.body)

    if(!fofoca){
        res.status(400).send({message: "erro ao criar fofoca"})
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

module.exports = { save }