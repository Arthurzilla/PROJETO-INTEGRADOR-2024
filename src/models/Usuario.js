const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UsuarioSchema = new mongoose.Schema({
    displayUser: {
        type: String,
        required: true,
        trim: true,
    },
    user: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/, 'Por favor, insira um e-mail válido.'], // Regex para validar e-mail
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
    },
}, {
    timestamps: true,
});

// Middleware para hash da senha antes de salvar o usuário
UsuarioSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

// Método para comparar senhas
UsuarioSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

const Usuario = mongoose.model('Usuario', UsuarioSchema);

module.exports = Usuario;
