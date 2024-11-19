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

route.get('/usuario-logado', userController.verifyToken, userController.getUserLogado)

route.post('/logout', (req, res) => {
    res.status(200).json({ message: 'Deslogado com sucesso' });
});

route.get('/verificar', userController.verifyToken, (req, res) => {
    res.status(200).json({ message: 'Token verificado com sucesso' });
});

route.get('/perfil/:id/api', userController.verifyToken, userController.getPerfil);

route.get('/perfil/:id', (req, res) => {
    console.log('ID do perfil:', req.params.id);  // Exibe o ID na console para verificar
    res.sendFile(path.join(__dirname, '..', 'views', 'perfil.html'));
});

route.get('/fofocas/api/:id', userController.getFofocasPorUsuario);

module.exports = route;