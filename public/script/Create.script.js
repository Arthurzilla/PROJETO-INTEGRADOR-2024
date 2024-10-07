// Supondo que o token tenha sido armazenado no localStorage durante o login
const fofocaForm = document.getElementById('fofocaForm');

fofocaForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Previne o comportamento padrão do formulário

    // Obtendo os valores dos campos do formulário
    const titulo = document.getElementById('titulo').value;
    const conteudo = document.getElementById('conteudo').value;

    // Obtendo o token do localStorage ou sessionStorage
    const token = localStorage.getItem('token'); // Ou sessionStorage.getItem('token')

    // Verifica se o token existe
    if (!token) {
        alert('Você precisa estar logado para criar uma fofoca.');
        window.location.href = 'http://localhost:3000/login'; // Redireciona para a página de login se não estiver logado
        return; // Sai da função se o usuário não estiver logado
    }

    // Decodificando o token para obter informações do usuário
    const payload = JSON.parse(atob(token.split('.')[1]));
    const userId = payload.id; // Obtém o ID do usuário do payload
    const userName = payload.user; // Se você armazenou o nome do usuário no token, também pode obter aqui

    // Exibir nome do usuário ou outras informações, se necessário
    console.log(`Usuário logado: ${userName}`);

    // Enviando a requisição para criar a fofoca
    const response = await fetch('http://localhost:3000/fofocas/criar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Incluindo o token no cabeçalho
        },
        body: JSON.stringify({
            title: titulo,
            description: conteudo,
            usuario: userId // Passando o campo usuario
        })
    });

    // Verificando a resposta da requisição
    if (response.ok) {
        alert('Fofoca criada com sucesso');
        window.location.href = 'http://localhost:3000/fofocas'; // Redireciona para a lista de fofocas
    } else {
        alert('Erro ao criar fofoca. Verifique os campos.'); // Mensagem de erro caso a criação falhe
    }

    // Log dos dados enviados
    console.log('Requisição enviada:', { title: titulo, description: conteudo, usuario: userId }); // Verifica se os campos estão corretos
});
