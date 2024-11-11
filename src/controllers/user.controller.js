require('dotenv').config();
const mongoose = require('mongoose');
const Usuario = require('../models/Usuario');  

const userService = require('../services/user.service');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'algumaChaveSecretaSegura';

// Função POST para criação de usuário
const save = async (req, res) => {
    const { user, email, password, displayUser } = req.body;
    try {
        if (!user || !email || !password || !displayUser) {
            return res.status(400).send({ error: "Preencha os campos corretamente." });
        }

        if(password.length < 8) {
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
    } catch (error) {
        console.log(error);
        return res.status(500).send({ error: 'Erro interno ao criar usuário.' });
    }
};

// Função para login e geração de token
const find = async (req, res) => {
    const { user, password } = req.body;

    const usuarioEncontrado = await userService.findService({ user });

    if (!usuarioEncontrado) {
        return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    const isMatch = await usuarioEncontrado.comparePassword(password);

    if (!isMatch) {
        return res.status(401).json({ error: 'Senha incorreta.' });
    }

    const token = jwt.sign({ id: usuarioEncontrado._id, user: usuarioEncontrado.user }, JWT_SECRET);

    req.session.token = token;
    console.log('Token gerado:', token);

    return res.status(200).json({
        message: 'Usuário encontrado com sucesso.',
        usuario: {
            _id: usuarioEncontrado._id,
            user: usuarioEncontrado.user,
            email: usuarioEncontrado.email,
            usuarioId: usuarioEncontrado._id
        },
        token
    });
};

// Função para verificar o token
const verifyToken = (req, res, next) => {
    const authorizationHeader = req.headers['authorization'];
    const token = authorizationHeader && authorizationHeader.split(' ')[1]; 

    if (!token) {
        return res.status(403).json({ message: 'Token não fornecido. verifytoken' });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Token inválido.' });
        }
        req.userId = decoded.id;
        next();
    });
};

// Função para obter o perfil do usuário
const getPerfil = async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    console.log()

    if (!token) {
        return res.status(401).json({ message: 'Token não fornecido. getPerfil' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const usuarioId = decoded.id;  
        const user = await Usuario.findById(usuarioId);
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        res.json({
            _id: user._id,
            displayUser: user.displayUser,
            usuario: user.user,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro ao obter o perfil' });
    }
};

// Função para obter o usuário logado
const getUserLogado = (req, res) => {
    const authorizationHeader = req.headers['authorization'];
    const token = authorizationHeader && authorizationHeader.split(' ')[1];

    if (!token) {
        return res.status(403).json({ message: 'Token não fornecido. gerUserLogado' });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Token inválido.' });
        }

        Usuario.findById(decoded.id)
            .then((usuario) => {
                if (!usuario) {
                    return res.status(404).json({ message: 'Usuário não encontrado.' });
                }

                res.status(200).json({ usuarioId: usuario._id });
            })
            .catch((err) => res.status(500).json({ message: 'Erro ao buscar usuário.', error: err }));
    });
};

// const getUserLogado = (req,res) => {
//     const token = localStorage.getItem(data)

//             Usuario.findById(data)
//             .then((usuario) => {
//                 if (!usuario) {
//                     return res.status(404).json({ message: 'Usuário não encontrado.' });
//                 }

//                 res.status(200).json({ usuarioId: usuario._id });
//             })
//             .catch((err) => res.status(500).json({ message: 'Erro ao buscar usuário.', error: err }));
//     };

module.exports = { save, find, verifyToken, getUserLogado, getPerfil };
