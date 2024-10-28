const overlay = document.getElementById('overlay');

function timeAgo(date) {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
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
        <div class='user-specs'>
            <h3 id='fofoca-user'>${fofoca.usuario.user}</h3>
        </div>
            <p id="fofoca-description">${fofoca.description}</p>
            <p id='fofoca-date'>${dataFormatada}</p>
        `;

        const loggedUserId = getUserId();
        const editButton = document.getElementById('editFofocaButton');
        const trashButton = document.getElementById('trashButton');

        if (editButton && trashButton) {
            if (loggedUserId === fofoca.usuario._id.toString()) {
                editButton.style.display = 'block';
                trashButton.style.display = 'block';
            } else {
                editButton.style.display = 'none';
                trashButton.style.display = 'none';
            }
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

    try {
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
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao enviar comentário.');
    }
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
                    <div id='comentarios-user-specs'>
                    <h3 id='comentarios-usuario'>${usuario}</h3>
                    <p id='comentarios-data'>${dataFormatada}</p>
                    </div>
                    <p id='comentarios-description'>${texto}</p>
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
                usuarioDiv.textContent = `${data.usuario}`;
            } else {
                usuarioDiv.textContent = '';
            }
        });
    } else {
        document.getElementById('mostraUsuario').textContent = 'Usuário não logado';
    }
});

fetchFofoca();

let currentFofocaId;

document.getElementById('editFofocaButton').addEventListener('click', () => {
    overlay.style.display = 'block';
    overlay.style.animation = 'escurecerFundo 0.5s forwards';

    const fofocaDescription = document.getElementById('fofoca-description').innerText;
    document.getElementById('editDescription').value = fofocaDescription;
    currentFofocaId = window.location.pathname.split('/').pop();
    document.getElementById('editModal').style.display = 'block';
});

document.getElementById('closeEditButton').addEventListener('click', function() {
    document.getElementById('editModal').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
});

document.getElementById('saveEditButton').addEventListener('click', async () => {
    const newDescription = document.getElementById('editDescription').value;

    try {
        const response = await fetch(`/fofocas/${currentFofocaId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ description: newDescription })
        });

        if (!response.ok) {
            throw new Error('Erro ao editar fofoca.');
        }

        fetchFofoca();
        document.getElementById('editModal').style.display = 'none';
        overlay.style.display = 'none';
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao editar.');
    }
});

document.getElementById('openCommentModalButton').addEventListener('click', () => {
    document.getElementById('commentModal').style.display = 'block';
    overlay.style.display = 'block';
    overlay.style.animation = 'escurecerFundo 0.5s forwards';
});

document.getElementById('closeCommentButton').addEventListener('click', function() {
    document.getElementById('commentModal').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
});

document.getElementById('saveCommentButton').addEventListener('click', async () => {
    const text = document.getElementById('commentTextModal').value;
    const usuario = getUserId();
    const id = window.location.pathname.split('/').pop();

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
        fetchComentarios(id);
        document.getElementById('commentModal').style.display = 'none';
        overlay.style.display = 'none';
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao enviar comentário.');
    }
});


document.getElementById('trashButton').addEventListener('click', () => {
    const modal = document.getElementById('trashModal');
    modal.style.display = 'block'; // Exibe o modal de confirmação
    overlay.style.display = 'block';
    overlay.style.animation = 'escurecerFundo 0.5s forwards';
});

// Cancelar exclusão
document.getElementById('closeTrashButton').addEventListener('click', function() {
    document.getElementById('trashModal').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
});

// Confirmar exclusão
document.getElementById('apagarButton').addEventListener('click', async () => {
    const id = window.location.pathname.split('/').pop(); // Obtém o ID da fofoca

    try {
        const response = await fetch(`/fofocas/${id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
            throw new Error('Erro ao deletar fofoca');
        }

        window.location.href = '/fofocas'; // Redireciona para a timeline após a exclusão
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao deletar fofoca.');
    }
});
