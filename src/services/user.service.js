const Usuario = require('../models/Usuario');

const saveService = (body) => Usuario.create(body);

const findService = (body) => Usuario.findOne(body)

module.exports = { saveService, findService };