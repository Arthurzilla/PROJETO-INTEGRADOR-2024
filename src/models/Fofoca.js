//criar o modelo que será usado no JSON

const mongoose = require('mongoose');

const FofocaSchema = new mongoose.Schema({
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