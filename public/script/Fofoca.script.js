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
        
        const dataFormatada = timeAgo(new Date(fofoca.date));

        document.getElementById('fofocaDetails').innerHTML = `
            <h3>${fofoca.usuario.user}</h4>
            <p id="dataFor">${dataFormatada}</p>
            <p>${fofoca.description}</p>
        `;

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

        const comentarioDiv = document.getElementById('comentarioDiv');
        comentarioDiv.innerHTML = ''; 

        comentarios.forEach(comentario => {
            const usuario = comentario.usuario ? comentario.usuario.user : 'Usuário desconhecido';
            const dataFormatada = timeAgo(new Date(comentario.date));
            const texto = comentario.text || 'Sem conteúdo';

            comentarioDiv.innerHTML += `
                <div class="comentario-container">
                    <h3>${usuario}</h3>
                    <p>${dataFormatada}</p>
                    <p>${texto}</p>
                </div>
            `;
        });
    } catch (error) {
        console.error("Erro:", error);
        document.getElementById('comentarioDiv').innerHTML = '<p>Por enquanto, nenhum comentario</p>';
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
                usuarioDiv.textContent = 'Usuário não encontrado';
            }
        })
    } else {
        document.getElementById('mostraUsuario').textContent = 'Usuário não logado';
    }
});

fetchFofoca();
