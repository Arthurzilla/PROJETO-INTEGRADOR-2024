fofocaForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const conteudo = document.getElementById('conteudo').value;

    const token = localStorage.getItem('token');

    if (!token) {
        alert('Você precisa estar logado para criar uma fofoca.');
        window.location.href = '/login';
        return;
    }

    const payload = JSON.parse(atob(token.split('.')[1]));
    const userId = payload.id;

    const response = await fetch('/fofocas/criar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            description: conteudo,
            usuario: userId
        })
    });

    if (response.ok) {
        alert('Fofoca criada com sucesso');
        window.location.href = '/fofocas';
    } else {
        alert('Erro ao criar fofoca. Verifique os campos.');
    }

    console.log('Requisição enviada:', { description: conteudo, usuario: userId });
});


document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const usuarioDiv = document.getElementById('mostraUsuario');

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
            if (data.displayUser && data.usuario) { // Verifica se displayUser e usuario estão presentes
                usuarioDiv.textContent = `${data.displayUser} @${data.usuario}`;
            } else {
                usuarioDiv.textContent = 'Usuário não encontrado';
            }
        })
        .catch(error => {
            console.error('Erro ao obter usuário logado:', error);
            usuarioDiv.textContent = 'Erro ao obter usuário logado';
        });
    } else {
        usuarioDiv.textContent = 'Você não está logado';
    }
});