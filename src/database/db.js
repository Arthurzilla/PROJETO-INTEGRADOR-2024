const mongoose = require('mongoose');

const connectDatabase = ()=>{

    console.log('aguardando conexão')

    mongoose.connect('mongodb://127.0.0.1:27017/orzh')
    .then(() => console.log('MongoDb conectado.'))
    .catch((error) => console.log(error));

}

module.exports = connectDatabase;