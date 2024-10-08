const mongoose = require('mongoose');

const comentarioSchema = new mongoose.Schema({
    usuario:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },

    text: {
        type: String,
        maxlength: 150,
        required: true
    },

    
})