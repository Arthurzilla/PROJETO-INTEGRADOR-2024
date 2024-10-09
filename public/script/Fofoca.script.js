function timeAgo(date) {
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (seconds < 60) {
        return `${seconds} segundos atrás`;
    } else if (minutes < 60) {
        return `${minutes} minutos atrás`;
    } else if (hours < 24) {
        return `${hours} horas atrás`;
    } else if (days < 30) {
        return `${days} dias atrás`;
    } else if (months < 12) {
        return `${months} meses atrás`;
    } else {
        return `${years} anos atrás`;
    }
}

async function fetchFofoca() {
    const path = window.location.pathname;
    const id = path.split('/').pop(); 

    // Validação do ID da fofoca
    if (!id || id.trim() === "" || id.length !== 24) {
        document.getElementById('fofocaDetails').innerHTML = '<p>ID inválido.</p>';
        return;
    }

    try {
        const response = await fetch(`/fofocas/${id}/api`);
        if (!response.ok) {
            throw new Error('Fofoca não encontrada.');
        }
        const fofoca = await response.json();
        
        // Formata a data para "tempo atrás"
        const dataFormatada = timeAgo(new Date(fofoca.date));

        document.getElementById('fofocaDetails').innerHTML = `
            <h3>${fofoca.usuario.user}</h4>
            <p id="dataFor">${dataFormatada}</p>
            <p>${fofoca.description}</p>
            <a href="editFofoca.html?id=${fofoca._id}">Editar</a>
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
        const response = await fetch(`/fofocas/${id}/comentarios`, {
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
        const response = await fetch(`/fofocas/${id}/comentarios`);
        if (!response.ok) {
            throw new Error('Erro ao buscar comentários.');
        }
        const comentarios = await response.json();

        // Seleciona a div onde os comentários serão exibidos
        const comentarioDiv = document.getElementById('comentarioDiv');
        comentarioDiv.innerHTML = ''; // Limpa a div antes de adicionar novos elementos

        // Itera pelos comentários e cria os elementos
        comentarios.forEach(comentario => {

            const comentarioContainer = document.createElement('div');
            comentarioContainer.className = 'comentario-container';

            const usuarioElement = document.createElement('h3');
            usuarioElement.textContent = comentario.usuario.user;

            // Formata a data para "tempo atrás"
            const dataElement = document.createElement('p');
            dataElement.textContent = timeAgo(new Date(comentario.date));

            const textoElement = document.createElement('p');
            textoElement.textContent = comentario.text;

            // Adiciona os elementos ao contêiner do comentário
            comentarioContainer.appendChild(usuarioElement);
            comentarioContainer.appendChild(dataElement);
            comentarioContainer.appendChild(textoElement);

            // Adiciona o contêiner do comentário à div principal
            comentarioDiv.appendChild(comentarioContainer);
        });
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
