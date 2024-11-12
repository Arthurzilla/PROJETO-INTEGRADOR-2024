// importa a função de salvar no BD
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
const findAll = async (req, res) => {
    try {
        const fofocas = await fofocaService.findAllService().populate('usuario', 'user displayUser');

        if (fofocas.length === 0) {
            return res.status(400).send({ message: "Não há nenhuma fofoca" });
        }

        res.status(200).send(fofocas);
    } catch (error) {
        console.error("Erro ao buscar fofocas:", error);
        res.status(500).send({ message: "Erro ao buscar fofocas" });
    }
};

// função GET para exibir uma fofoca pelo ID
const findById = async (req, res) => {
    try {
        const fofoca = await Fofoca.findById(req.params.id).populate('usuario', 'user displayUser');
        if (!fofoca) {
            return res.status(404).send({ message: 'Fofoca não encontrada.' });
        }
        res.json(fofoca);
    } catch (error) {
        console.error('Erro ao buscar fofoca:', error);
        res.status(500).send({ message: 'Erro ao buscar fofoca.' });
    }
};

// função DELETE para deletar uma fofoca pelo ID
const deleteById = async (req, res) => {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({ message: 'ID inválido' });
    }

    try {
        const fofoca = await fofocaService.deleteByIdService(id);
        if (!fofoca) {
            return res.status(404).send({ message: "Postagem não encontrada" });
        }

        res.status(200).send({ message: "Fofoca deletada com sucesso" });
    } catch (error) {
        console.error("Erro ao deletar fofoca:", error);
        res.status(500).send({ message: "Erro ao deletar fofoca" });
    }
};

// função PATCH para atualizar uma fofoca pelo ID
const updateById = async (req, res) => {
    const { date, description } = req.body;
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({ message: 'ID inválido' });
    }

    if (!description) {
        return res.status(400).send({ message: 'Descrição não pode ser vazia.' });
    }

    try {
        const fofoca = await fofocaService.updateByIdService(id, date, description);
        if (!fofoca) {
            return res.status(404).send({ message: "Postagem não encontrada" });
        }

        res.status(200).send("Update realizado com sucesso");
    } catch (error) {
        console.error("Erro ao atualizar fofoca:", error);
        res.status(500).send({ message: "Erro ao atualizar fofoca" });
    }
};

module.exports = { save, findAll, findById, deleteById, updateById};
