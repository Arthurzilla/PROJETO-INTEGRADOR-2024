const route = require('express').Router();
const fofocaController = require('../controllers/fofoca.controller');
const path = require('path');
const userController = require('../controllers/user.controller');
const comentarioController = require('../controllers/comentario.controller')

// Rota GET para criar fofocas (sem verificação de token)
route.get('/criar', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'criar.html'));
});

route.post('/comentario', comentarioController.save)

// Rota POST para criar fofocas (com verificação de token)
route.post('/criar', userController.verifyToken, fofocaController.save);

// Rota da timeline principal
route.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/timeline.html'));
}); 

// timeline sem criação (usuário sem conta)
route.get('/convidado', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/convi.timeline.html'));
});


route.post('/', fofocaController.save)

// lista todas as postagens
route.get('/api', fofocaController.findAll);
/* route.get('/:id', fofocaController.findById) */
route.delete('/:id', fofocaController.deleteById)
route.patch('/:id', fofocaController.updateById)

route.get('/:id',(req, res) => {
    res.sendFile(path.join(__dirname, '../views/fofoca.html'));
})


module.exports = route;

