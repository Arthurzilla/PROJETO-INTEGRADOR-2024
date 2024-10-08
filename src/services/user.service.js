const Usuario = require('../models/Usuario');

const saveService = (body) => Usuario.create(body);

const findService = (body) => Usuario.findOne(body)

const findByEmail = (email) => Usuario.findOne({ email });

const findByUser = (user) => Usuario.findOne({user})

module.exports = { saveService, findService, findByEmail, findByUser };