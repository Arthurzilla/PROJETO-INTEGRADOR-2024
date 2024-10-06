const Usuario = require('../models/Usuario');

const saveService = (body) => Usuario.create(body);

module.exports = { saveService };