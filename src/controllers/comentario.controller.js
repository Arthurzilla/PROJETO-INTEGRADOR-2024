const comentarioService = require('../services/comentario.service');
const Comentario = require('../models/Comentario');

// Salva um novo comentário 
const save = async (req, res) => {
    const { usuario, text } = req.body;
    const fofocaId = req.params.id;

    if (!text || !usuario) {
        console.error("Erro: Campos ausentes.", { text, usuario });
        return res.status(400).send({ message: "Preencha os comentários corretamente." });
    }

    try {
        const novoComentario = await comentarioService.saveService({ usuario, text, fofocaId });

        if (!novoComentario) {
            return res.status(400).send({ message: "Erro ao criar comentário" });
        }

        return res.status(201).send({
            message: "Comentário criado com sucesso.",
            comentario: {
                id: novoComentario._id,
                text: novoComentario.text,
                usuario: novoComentario.usuario,
                date: novoComentario.date
            }
        });

    } catch (error) {
        console.error("Erro ao salvar comentário:", error);
        res.status(500).send({ message: "Erro ao salvar comentário." });
    }
};

// Busca comentários por fofoca
const getByFofoca = async (req, res) => {
    const fofocaId = req.params.id;

    try {
        const comentarios = await comentarioService.getByFofocaService(fofocaId);

        if (!comentarios || comentarios.length === 0) {
            return res.status(404).send({ message: "Nenhum comentário encontrado." });
        }

        return res.status(200).json(comentarios);
    } catch (error) {
        console.error("Erro ao buscar comentários:", error);
        res.status(500).send({ message: "Erro ao buscar comentários." });
    }
};

const findByComentarios = async (req, res) => {
    const fofocaId = req.params.id;
    try {
        const comentarios = await Comentario.find({ fofocaId })
            .sort({ _id: -1 })
            .populate('usuario', 'user displayUser');

        if (!comentarios || comentarios.length === 0) {
            return res.status(404).send({ message: "Nenhum comentário encontrado." });
        }
        
        return res.status(200).json(comentarios);
    } catch (error) {
        console.error('Erro ao buscar comentários:', error);
        res.status(500).json({ error: 'Erro ao buscar comentários.' });
    }
};

module.exports = { save, getByFofoca, findByComentarios };
