const mongoose = require('mongoose');

const ComentarioSchema = new mongoose.Schema({
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
    text: { type: String, required: true },
    date: { type: Date, default: Date.now },
    fofocaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Fofoca', required: true }
});

const Comentario = mongoose.model('Comentario', ComentarioSchema);
module.exports = Comentario;
