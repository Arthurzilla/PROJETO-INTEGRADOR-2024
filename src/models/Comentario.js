const mongoose = require('mongoose');

const comentarioSchema = new mongoose.Schema({
    usuario:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },

    date: {
        type: Date,
        default: Date.now
    },

    text: {
        type: String,
        maxlength: 150,
        required: true
    }
})

const Comentario = mongoose.model('Comentario', comentarioSchema);

module.exports = Comentario;