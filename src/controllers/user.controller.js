require('dotenv').config();
const mongoose = require('mongoose');
const Usuario = require('../models/Usuario');  
const Fofoca = require('../models/Fofoca')

const { format } = require('date-fns');

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

    const token = jwt.sign({ id: usuarioEncontrado._id, user: usuarioEncontrado.user }, JWT_SECRET,{ expiresIn: '5h' });

    req.session.token = token;

    console.log('\nfind | Token gerado:', token);

    return res.status(200).json({
        message: 'Usuário encontrado com sucesso.',
        usuario: {
            _id: usuarioEncontrado._id,
            user: usuarioEncontrado.user,
            email: usuarioEncontrado.email,
            usuarioId: usuarioEncontrado._id
        },
        token,
        usuarioId: usuarioEncontrado._id
    });
};


// Função para verificar o token
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    console.log('\nverifyToken | Token extraído:', token);

    if (!token) {
        return res.status(403).json({ message: 'verifyToken | Token não fornecido' });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            console.error('Erro ao verificar o token:', err);
            return res.status(401).json({ message: 'Token inválido.' });
        }

        console.log("\nverifyToken | Token decodificado:", decoded);
        req.usuarioId = decoded.id;
        next();
    });
};

// Função para obter o perfil do usuário
const getPerfil = async (req, res) => {
    const userId = req.params.id;

    if (!userId) {
        return res.status(401).json({ message: 'getPerfil | ID do usuário não encontrado.' });
    }

    try {
        const user = await Usuario.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        const dataCriacao = format(user.createdAt, 'MM/dd/yyyy HH:mm:ss');

        res.json({
            _id: user._id,
            displayUser: user.displayUser,
            usuario: user.user,
            dataCriacao: dataCriacao
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro ao obter o perfil' });
    }
};


const getUserLogado = async (req, res) => {
    const id = req.usuarioId;

    console.log('\ngetUserLogado | ID recebido no getUserLogado:', id);

    if (!id) {
        return res.status(403).json({ message: 'getUserLogado | ID não fornecido no token.' });
    }

    try {
        const usuario = await Usuario.findById(id);
        if (!usuario) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        console.log('\ngetUserLogado | Usuário encontrado:', usuario);

        res.status(200).json({
            _id: usuario._id,
            displayUser: usuario.displayUser,
            usuario: usuario.user, 
        });
    } catch (err) {
        console.error("Erro ao buscar usuário:", err);
        res.status(500).json({ message: 'Erro ao buscar usuário.', error: err });
    }
};

const getFofocasPorUsuario = async (req, res) => {
    const userId = req.params.id;

    if (!userId) {
        return res.status(400).json({ message: 'ID do usuário não fornecido.' });
    }

    try {
        const fofocas = await Fofoca.find({ usuario: userId }).sort({ date: -1 }).populate('usuario', 'user displayUser');

        if (!fofocas || fofocas.length === 0) {
            return res.status(404).json({ message: 'Nenhuma fofoca encontrada para este usuário.' });
        }

        res.json(fofocas);
    } catch (err) {
        console.error('Erro ao buscar fofocas:', err);
        res.status(500).json({ message: 'Erro ao obter as fofocas' });
    }
};

module.exports = { save, find, verifyToken, getUserLogado, getPerfil, getFofocasPorUsuario };