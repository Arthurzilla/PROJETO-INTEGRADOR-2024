function timeAgo(date) {
    if (!(date instanceof Date) || isNaN(date)) {
        return 'Data inválida';
    }

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

    if (!id || id.trim() === "" || !/^[0-9a-fA-F]{24}$/.test(id)) {
        document.getElementById('fofocaDetails').innerHTML = '<p>ID inválido.</p>';
        return;
    }

    try {
        const response = await fetch(`/fofocas/${id}/api`);
        if (!response.ok) {
            throw new Error('Fofoca não encontrada.');
        }
        const fofoca = await response.json();

        const dataFormatada = timeAgo(new Date(fofoca.date));

        document.getElementById('fofocaDetails').innerHTML = `
            <h3>${fofoca.usuario.user}</h3>
            <p class="fofoca-date" id="dataFor">${dataFormatada}</p>
            <p class="fofoca-description">${fofoca.description}</p>
        `;

        // Verificar se o usuário logado é o mesmo que o usuário da fofoca
        const loggedUserId = getUserId(); // Função já existente
        if (loggedUserId === fofoca.usuario._id.toString()) {
            document.getElementById('editFofocaButton').style.display = 'block'; // Mostrar botão de edição
        } else {
            document.getElementById('editFofocaButton').style.display = 'none'; // Ocultar botão de edição
        }

        fetchComentarios(id);
    } catch (error) {
        document.getElementById('fofocaDetails').innerHTML = `<p>${error.message}</p>`;
    }
}

document.getElementById('form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const id = window.location.pathname.split('/').pop();
    const text = document.getElementById('commentText').value;
    const usuario = getUserId(); 

    if (!usuario || typeof usuario !== 'string' || usuario.length !== 24) {
        console.error("ID do usuário inválido:", usuario);
        alert("Você precisa estar logado!");
        return;
    }
    
    if (!text || text.trim() === '') {
        alert("Comentário não pode ser vazio.");
        return;
    }

    const response = await fetch(`/fofocas/${id}/comentarios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario: usuario, text: text })
    });

    if (!response.ok) {
        throw new Error('Erro ao enviar comentário.');
    }

    document.getElementById('commentText').value = '';
    fetchComentarios(id);
});

async function fetchComentarios(id) {
    try {
        const response = await fetch(`/fofocas/${id}/comentarios`);
        if (!response.ok) {
            throw new Error('Erro ao buscar comentários.');
        }
        const comentarios = await response.json();

        const comentariosList = document.getElementById('comentariosList');
        comentariosList.innerHTML = ''; // Limpa a lista anterior

        if (comentarios.length === 0) {
            comentariosList.innerHTML = '<p>Não há comentários ainda.</p>';
            return;
        }

        comentarios.forEach(comentario => {
            const usuario = comentario.usuario ? comentario.usuario.user : 'Usuário desconhecido';
            const dataFormatada = timeAgo(new Date(comentario.date));
            const texto = comentario.text || 'Sem conteúdo';

            comentariosList.innerHTML += `
                <div class="comentario-item">
                    <h3>${usuario}</h3>
                    <p>${dataFormatada}</p>
                    <p>${texto}</p>
                </div>
            `;
        });
    } catch (error) {
        console.error("Erro:", error);
        document.getElementById('comentariosList').innerHTML = '<p>Por enquanto, nenhum comentário.</p>';
    }
}

function getUserId() {
    const token = localStorage.getItem('token'); 
    if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.id; 
    }
    return null;
}

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (token) {
        fetch('/usuario-logado', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao obter usuário logado.');
            }
            return response.json();
        })
        .then(data => {
            const usuarioDiv = document.getElementById('mostraUsuario');
            if (data.usuario) {
                usuarioDiv.textContent = `Logado como: ${data.usuario}`;
            } else {
                usuarioDiv.textContent = '';
            }
        });
    } else {
        document.getElementById('mostraUsuario').textContent = 'Usuário não logado';
    }
});

fetchFofoca();

let currentFofocaId; // Variável para armazenar o ID da fofoca atual

document.getElementById('editFofocaButton').addEventListener('click', () => {
    const fofocaDescription = document.querySelector('#fofocaDetails .fofoca-description').innerText;
    document.getElementById('editDescription').value = fofocaDescription;
    currentFofocaId = window.location.pathname.split('/').pop(); // Obter ID da fofoca atual
    document.getElementById('editModal').style.display = 'block'; // Mostrar modal
});

// Cancelar a edição
document.getElementById('cancelEditButton').addEventListener('click', () => {
    document.getElementById('editModal').style.display = 'none'; // Ocultar modal
});

// Salvar as alterações
document.getElementById('saveEditButton').addEventListener('click', async () => {
    const newDescription = document.getElementById('editDescription').value;

    try {
        const response = await fetch(`/fofocas/${currentFofocaId}`, {
            method: 'PATCH', // Use PATCH para atualizar parcialmente
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ description: newDescription }) // Enviar nova descrição
        });

        if (!response.ok) {
            throw new Error('Erro ao editar fofoca.');
        }

        fetchFofoca(); // Atualizar a fofoca exibida
        document.getElementById('editModal').style.display = 'none'; // Ocultar modal
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao editar.');
    }
});

// Abertura do modal de comentários
document.getElementById('openCommentModalButton').addEventListener('click', () => {
    document.getElementById('commentModal').style.display = 'block'; // Mostrar modal de comentários
});

// Cancelar a adição de comentário
document.getElementById('cancelCommentButton').addEventListener('click', () => {
    document.getElementById('commentModal').style.display = 'none'; // Ocultar modal de comentários
});

// Salvar o comentário
document.getElementById('saveCommentButton').addEventListener('click', async () => {
    const text = document.getElementById('commentTextModal').value; // Obter texto do comentário
    const usuario = getUserId(); 
    const id = window.location.pathname.split('/').pop(); // Obter ID da fofoca atual

    if (!usuario || typeof usuario !== 'string' || usuario.length !== 24) {
        console.error("ID do usuário inválido:", usuario);
        alert("Você precisa estar logado!");
        return;
    }
    
    if (!text || text.trim() === '') {
        alert("Comentário não pode ser vazio.");
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

        document.getElementById('commentTextModal').value = '';
        fetchComentarios(id); // Atualizar a lista de comentários
        document.getElementById('commentModal').style.display = 'none'; // Ocultar modal de comentários
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao enviar comentário.');
    }
});
