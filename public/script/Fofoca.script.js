async function fetchFofoca() {
    // Obtém o caminho da URL
    const path = window.location.pathname;
    // Divide o caminho em partes e pega a última parte (que é o ID)
    const id = path.split('/').pop(); 

    console.log("ID extraído:", id); // Verifica o ID

    // Verifica se o ID é válido
    if (!id || id.trim() === "" || id.length !== 24) {
        document.getElementById('fofocaDetails').innerHTML = '<p>ID inválido.</p>';
        return;
    }
    
    try {
        const response = await fetch(`http://localhost:3000/fofocas/${id}/api`); // Chamada para a rota da API
        if (!response.ok) {
            throw new Error('Fofoca não encontrada.');
        }
        const fofoca = await response.json();
        document.getElementById('fofocaDetails').innerHTML = `
            <h3>${fofoca.usuario.user}</h3>
            <h4>${fofoca.title}</h4>
            <p>${fofoca.description}</p>
            <a href="editFofoca.html?id=${fofoca._id}">Editar</a>
        `;
    } catch (error) {
        document.getElementById('fofocaDetails').innerHTML = `<p>${error.message}</p>`; // Exibe mensagem de erro
    }
}

fetchFofoca(); // Chama a função para buscar a fofoca
