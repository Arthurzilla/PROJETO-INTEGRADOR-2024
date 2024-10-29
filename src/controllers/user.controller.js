require('dotenv').config();
const mongoose = require('mongoose');
const Usuario = require('../models/Usuario');

const userService = require('../services/user.service');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'algumaChaveSecretaSegura';

// função POST para criação de usuário
const save = async (req, res) => {
    const { user, email, password, displayUser } = req.body;
    try{
    // Validação dos campos
    if (!user || !email || !password || !displayUser) {
        return res.status(400).send({ error: "Preencha os campos corretamente." });
    }

    if(password.length<8){
        return res.status(400).send({ error: "A senha deve ter pelo menos 8 caracteres" });
    }
    
    const userExiste = await userService.findByUser(user);
    if (userExiste) {
        return res.status(400).send({ message: "Usuário já cadastrado." });
    }

    const emailExiste = await userService.findByEmail(email);
        if (emailExiste) {
            return res.status(400).send({ message: "Email já cadastrado." });
        }

    const usuarioSalvo = await userService.saveService(req.body);

    if (!usuarioSalvo) {
        return res.status(400).send({ error: "Erro ao criar usuário." });
    }

    return res.status(201).send({
        message: "Usuário criado com sucesso.",
        usuario: {
            id: usuarioSalvo._id,
            user: usuarioSalvo.user,
            email: usuarioSalvo.email,
            displayUser: usuarioSalvo.displayUser
        }
    });
}catch(error){
    console.log(error)
    return
}};

// função para login e geração de token
const find = async (req, res) => {
    const { user, password } = req.body;

    const usuarioEncontrado = await userService.findService({ user });

    if (!usuarioEncontrado) {
        return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    // Verifica se a senha enviada corresponde à senha do banco
    const isMatch = await usuarioEncontrado.comparePassword(password);

    if (!isMatch) {
        console.log("erro")
        return res.status(401).json({ error: 'Senha incorreta.' });
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

const getUserLogado = (req, res) => {
    const authorizationHeader = req.headers['authorization'];
    const token = req.session.token || (authorizationHeader && authorizationHeader.split(' ')[1]);

    if (!token) {
        return res.status(403).json({ message: 'Token não fornecido.' });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Token inválido.' });
        }

        // Aqui você deve buscar o usuário completo para obter o `displayUser`
        Usuario.findById(decoded.id)
            .then((usuario) => {
                if (!usuario) {
                    return res.status(404).json({ message: 'Usuário não encontrado.' });
                }
                // Certifique-se de enviar `displayUser` no retorno
                res.status(200).json({ usuario: usuario.user, displayUser: usuario.displayUser });
            })
            .catch((err) => res.status(500).json({ message: 'Erro ao buscar usuário.', error: err }));
    });
};

const findById = async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.params.id)
        if (!usuario) {
            return res.status(404).send({ message: 'usuario não encontrada.' });
        }
        res.json(usuario);
    } catch (error) {
        console.error('Erro ao buscar usuario:', error);
        res.status(500).send({ message: 'Erro ao buscar usuario.' });
    }
}; 
module.exports = { save, find, verifyToken, getUserLogado, findById };