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
        res.status(400).send({message: "erro ao cadastrar user"})
    }

    res.status(201).send({
        message: "usuário criado com sucesso",
        fofoca:{
            id: fofoca._id,
            title,
            description  
        }
    })
}

module.exports = { save }

//teste de commit fgfdgfdg