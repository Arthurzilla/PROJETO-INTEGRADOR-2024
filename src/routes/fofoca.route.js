const route = require('express').Router();
const fofocaController = require('../controllers/fofoca.controller');
const userController = require('../controllers/user.controller');
const comentarioController = require('../controllers/comentario.controller');
const path = require('path');


// Rota POST para criar fofocas (com verificação de token)
route.post('/criar', userController.verifyToken, fofocaController.save);

// Rota da timeline principal
route.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/timeline.html'));
}); 

route.get('/convidado', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/convi.timeline.html'));
}); 

route.get('/api', fofocaController.findAll);
route.delete('/:id', fofocaController.deleteById);
route.patch('/:id', fofocaController.updateById);

// Rota para buscar detalhes da fofoca (API) e comentários
route.get('/:id/api', fofocaController.findById, comentarioController.getByFofoca);

route.post('/:id/comentarios', comentarioController.save);

// Rota para buscar comentários de uma fofoca específica
route.get('/:id/comentarios', comentarioController.findByComentarios);

// Rota GET para a página da fofoca
route.get('/:id', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/fofoca.html'));
});

route.delete('/fofocas/:id', fofocaController.deleteById);

module.exports = route;
