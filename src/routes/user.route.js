const route = require('express').Router()
const userController = require('../controllers/user.controller');
const path = require('path')

route.get('/cadastro', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'registrar.html'));
});

route.post('/cadastro', userController.save)


route.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'login.html'));
});

route.get('/login', userController.find)

route.post('/login/api', userController.find, userController.verifyToken, userController.getUserLogado, userController.getPerfil)

route.get('/usuario-logado', userController.getPerfil, userController.getUserLogado)

route.post('/logout', (req, res) => {
    res.status(200).json({ message: 'Deslogado com sucesso' });
});

route.get('/perfil/:id', userController.getUserLogado, userController.getPerfil);

route.get('/perfil/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'perfil.html'));
});

module.exports = route;