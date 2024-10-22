const mongoose = require('mongoose');

const FofocaSchema = new mongoose.Schema({
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },

    date: {
        type: Date,
        default: Date.now
    },

    description: {
        type: String,
        required: true
    },

    comentario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comentario',
        required: false
    }
})

const Fofoca = mongoose.model("Fofoca", FofocaSchema);

module.exports = Fofoca;
