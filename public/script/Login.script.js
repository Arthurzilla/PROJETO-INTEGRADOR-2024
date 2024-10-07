const entrarForm = document.getElementById('entrarForm');

entrarForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const usuario = document.getElementById('usuario').value;
    const senha = document.getElementById('senha').value;

    const response = await fetch('http://localhost:3000/login/api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: usuario, password: senha })
    });
    
    if (response.ok) {
        const data = await response.json();
        console.log(data); // Adicione esta linha para verificar o que está sendo retornado
        localStorage.setItem('token', data.token); // Armazena o token no localStorage
        window.location.href = 'http://localhost:3000/fofocas'; // Redireciona para a página de fofocas
    } else {
        alert('Erro ao entrar. Verifique os campos.');
    }

    console.log('Requisição enviada:', { user: usuario, password: senha });
});
