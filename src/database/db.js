const mongoose = require('mongoose');
// require('dotenv').config(); // Carrega as variáveis de ambiente do .env


//CRIA A CONEXÃO DO BANCO DE DADOS ONLINE (RENDER E ATLAS)
const connectOnlineDatabase = () => {
    console.log('Aguardando conexão...');

    const uri = process.env.MONGODB_URI; // Obtém a URI do banco de dados

    mongoose.connect(uri)
        .then(() => console.log('MongoDB conectado com sucesso.'))
        .catch((error) => console.log('Erro ao conectar ao MongoDB:', error));
}

//CRIA A CONEXÃO DO BANCO DE DADOS LOCAL MONGODB
const connectDatabase = ()=>{

    console.log('aguardando conexão')

     mongoose.connect('mongodb://127.0.0.1:27017/orzh')
     .then(() => console.log('MongoDb conectado.'))
     .catch((error) => console.log(error));

}

module.exports = {connectDatabase, connectOnlineDatabase};
