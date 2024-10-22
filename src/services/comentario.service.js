const Comentario = require('../models/Comentario');

// Salva comentário no banco de dados
const saveService = (body) => Comentario.create(body);

// Busca comentários relacionados a uma fofoca específica
const getByFofocaService = (fofocaId) => Comentario.find({ fofocaId }).populate('usuario');

module.exports = { saveService, getByFofocaService };
