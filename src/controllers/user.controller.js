require('dotenv').config();

const userService = require('../services/user.service');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'algumaChaveSecretaSegura';

// função POST para criação de usuário
const save = async (req, res) => {
    const { user, email, password } = req.body;

    // Validação dos campos
    if (!user || !email || !password) {
        return res.status(400).send({ message: "Preencha os campos corretamente." });
    }

    const usuarioSalvo = await userService.saveService(req.body);

    if (!usuarioSalvo) {
        return res.status(400).send({ message: "Erro ao criar usuário." });
    }

    return res.status(201).send({
        message: "Usuário criado com sucesso.",
        usuario: {
            id: usuarioSalvo._id,
            user: usuarioSalvo.user,
            email: usuarioSalvo.email
        }
    });
};

// função para login e geração de token
const find = async (req, res) => {
    const { user, password } = req.body;

    const usuarioEncontrado = await userService.findService({ user });

    if (!usuarioEncontrado) {
        return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    // Verifica se a senha enviada corresponde à senha do banco
    const isMatch = await usuarioEncontrado.comparePassword(password);

    if (!isMatch) {
        return res.status(401).json({ message: 'Senha incorreta.' });
    }

    // Gera o token JWT
    const token = jwt.sign({ id: usuarioEncontrado._id, user: usuarioEncontrado.user }, JWT_SECRET, { expiresIn: '1h' });

    // Armazena o token na sessão do usuário
    req.session.token = token;

    return res.status(200).json({
        message: 'Usuário encontrado com sucesso.',
        usuario: {
            user: usuarioEncontrado.user,
            email: usuarioEncontrado.email
        },
        token
    });
};

// função para verificar o token
const verifyToken = (req, res, next) => {
    const authorizationHeader = req.headers['authorization'];
    const token = req.session.token || (authorizationHeader && authorizationHeader.split(' ')[1]);

    if (!token) {
        return res.status(403).json({ message: 'Token não fornecido.' });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Token inválido.' });
        }

        // Armazena as informações do usuário decodificado na requisição
        req.userId = decoded.id;
        req.user = decoded.user;
        next();
    });
};

module.exports = { save, find, verifyToken };