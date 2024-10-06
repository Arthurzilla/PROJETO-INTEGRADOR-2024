const userService = require('../services/user.service');

// função POST criação da postagem
const save = async (req, res) => {
    const { user, email, password } = req.body;

    if (!user || !email || !password) {
        return res.status(400).send({ message: "Preencha os campos corretamente." });
    }

    // Chama o serviço para salvar o usuário
    const usuarioSalvo = await userService.saveService(req.body);

    // Verifica se o usuário foi salvo com sucesso
    if (!usuarioSalvo) {
        return res.status(400).send({ message: "Erro ao criar usuário." });
    }

    // Resposta de sucesso
    return res.status(201).send({
        message: "Usuário criado com sucesso.",
        usuario: {
            id: usuarioSalvo._id,
            user,
            email
        }
    });
};

const find = async (req, res) => {
    const { user, password } = req.body;

    const usuarioEncontrado = await userService.findService({ user });

    if (!usuarioEncontrado) {
        return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    req.session.usuario = usuarioEncontrado.usuario;

    // Compara a senha enviada com a senha no banco de dados
    const isMatch = await usuarioEncontrado.comparePassword(password);

    if (!isMatch) {
        return res.status(401).json({ message: 'Senha incorreta.' });
    }

    return res.status(200).json({
        message: 'Usuário encontrado com sucesso.',
        user: {
            user: usuarioEncontrado.user,
            email: usuarioEncontrado.email,
        },
    });
};

module.exports = {save, find};