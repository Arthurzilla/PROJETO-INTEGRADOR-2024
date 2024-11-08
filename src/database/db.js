const mongoose = require('mongoose');
require('dotenv').config(); // Carrega as variáveis de ambiente do .env

// CRIA A CONEXÃO DO BANCO DE DADOS ONLINE (RENDER E ATLAS)
const connectOnlineDatabase = async () => {
    try {
      await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 15000, // Aumente o tempo limite se necessário
      });
      console.log("MongoDB conectado com sucesso!");
    } catch (error) {
      console.error("Erro na conexão com o MongoDB:", error);
      process.exit(1);
    }
  };

// CRIA A CONEXÃO DO BANCO DE DADOS LOCAL MONGODB
const connectDatabase = ()=>{

    console.log('aguardando conexão')

     mongoose.connect('mongodb://127.0.0.1:27017/orzh')
     .then(() => console.log('MongoDb conectado.'))
     .catch((error) => console.log(error));

}

// module.exports = {connectDatabase, connectOnlineDatabase};

module.exports = { connectOnlineDatabase};
