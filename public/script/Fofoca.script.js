async function fetchFofoca() {
    const path = window.location.pathname;
    const id = path.split('/').pop(); 

    // Validação do ID da fofoca
    if (!id || id.trim() === "" || id.length !== 24) {
        document.getElementById('fofocaDetails').innerHTML = '<p>ID inválido.</p>';
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/fofocas/${id}/api`);
        if (!response.ok) {
            throw new Error('Fofoca não encontrada.');
        }
        const fofoca = await response.json();
        document.getElementById('fofocaDetails').innerHTML = `
            <h3>${fofoca.usuario.user}</h3>
            <h4>${fofoca.title}</h4>
            <p>${fofoca.description}</p>
            <a href="editFofoca.html?id=${fofoca._id}">Editar</a>
            <div id="comentarios"></div>
        `;

        fetchComentarios(id);
    } catch (error) {
        document.getElementById('fofocaDetails').innerHTML = `<p>${error.message}</p>`;
    }
}


// Envio de comentário
document.getElementById('form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const id = window.location.pathname.split('/').pop();
    const text = document.getElementById('commentText').value;
    const usuario = getUserId(); // Função que deve retornar o ID do usuário autenticado

    if (!usuario || typeof usuario !== 'string' || usuario.length !== 24) {
        console.error("ID do usuário inválido:", usuario);
        alert("Erro: ID de usuário inválido.");
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/fofocas/${id}/comentarios`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuario: usuario, text: text })
        });

        if (!response.ok) {
            throw new Error('Erro ao enviar comentário.');
        }

        const result = await response.json();
        alert(result.message);
        fetchComentarios(id);
    } catch (error) {
        console.error("Erro:", error);
    }
});

async function fetchComentarios(id) {
    try {
        const response = await fetch(`http://localhost:3000/fofocas/${id}/comentarios`);
        if (!response.ok) {
            throw new Error('Erro ao buscar comentários.');
        }
        const comentarios = await response.json();
        const comentariosDiv = document.getElementById('comentarios');
        comentariosDiv.innerHTML = comentarios.map(comentario => `
            <h3>${comentario.usuario.user}</h3>
            <p>${new Date(comentario.date).toLocaleString()}</p>
            <p>${comentario.text}</p>
        `).join('');
    } catch (error) {
        console.error("Erro:", error);
    }
}

function getUserId() {
    const token = localStorage.getItem('token'); // ou outra forma de armazenar o token
    if (token) {
        // Decodificar o token JWT e extrair o ID do usuário
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.id; // Supondo que o ID do usuário está no campo 'id' do payload
    }
    return null;
}

// Chama a função para buscar detalhes da fofoca e comentários ao carregar a página
fetchFofoca();
