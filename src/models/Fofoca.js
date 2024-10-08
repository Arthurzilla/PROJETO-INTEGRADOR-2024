const mongoose = require('mongoose');

const FofocaSchema = new mongoose.Schema({
    usuario:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required:true
    },

    title: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },
})

const Fofoca = mongoose.model("Fofoca", FofocaSchema);

module.exports = Fofoca;