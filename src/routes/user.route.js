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

route.post('/login/api', userController.find)

route.get('/login', userController.find)


module.exports = route;