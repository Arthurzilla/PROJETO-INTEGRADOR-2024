const comentarioService = require('../services/comentario.service');

const save = async (req, res) => {
    const { usuario, text } = req.body;

    // Validação dos campos
    if (!text || !usuario) {
        console.error("Erro: Campos ausentes.", { text, usuario });
        return res.status(400).send({ message: "Preencha os comentários corretamente." });
    }

        const novoComentario = await comentarioService.saveService({ usuario, text });

        if(!novoComentario){
            res.status(400).send({message: "erro ao criar comentario"})
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

};

module.exports = { save };
