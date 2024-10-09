//importa a função de salvar no BD
const Fofoca = require('../models/Fofoca.js');
const fofocaService = require('../services/fofoca.service');
const mongoose = require('mongoose');

// função POST criação da postagem
const save = async (req, res) => {
    const { description, usuario } = req.body;

    if (!description || !usuario) {
        console.error("Erro: Campos ausentes.", { description, usuario });
        return res.status(400).send({ message: "Preencha os campos corretamente." });
    }

    try {
        const novaFofoca = new Fofoca({ description, usuario });
        await novaFofoca.save();
        console.log("ID da nova fofoca:", novaFofoca._id);
        return res.status(201).send({ message: "Fofoca criada com sucesso.", fofoca: novaFofoca });
    } catch (error) {
        console.error("Erro ao salvar fofoca:", error);
        return res.status(500).send({ message: "Erro ao criar fofoca.", error });
    }
};



// função GET para exibir todas as fofocas já criadas
const findAll = async (req,res)=>{
    const fofocas = await fofocaService.findAllService().populate('usuario','user');

    if(fofocas.length === 0){
        return res.status(400).send({message:"Não há nenhuma fofoca"});
    }

    res.status(200).send(fofocas);
}

const findById = async (req, res) => {
    try {
        const fofoca = await Fofoca.findById(req.params.id).populate('usuario','user');
        if (!fofoca) {
            return res.status(404).send({ message: 'Fofoca não encontrada.' });
        }
        res.json(fofoca);
    } catch (error) {
        console.error('Erro ao buscar fofoca:', error);
        res.status(500).send({ message: 'Erro ao buscar fofoca.' });
    }
};

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

