const userService = require('../services/user.service');

// função POST criação da postagem
const save = async (req, res) =>{
    const {user,email, password} = req.body;

    const usuario = await userService.saveService(req.body);

    if(!user || !email ||!password ){
        res.status(400).send({message: "preencha os campos corretamente"});
    }

    if(!usuario){
        res.status(400).send({message: "erro ao criar usuario"});
    }

    res.status(201).send({
        message: "usuario criado com sucesso",
        usuario:{
            id: usuario._id, user,email, password
        }
    })
}

module.exports = {save};