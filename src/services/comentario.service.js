const Comentario = require('../models/Comentario');

//Salva comentario no banco de dados
const saveService = (body) => Comentario.create(body);

module.exports = {saveService}

