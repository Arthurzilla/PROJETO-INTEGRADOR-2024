const registerForm = document.getElementById('registerForm');

// Função de registrar o usuário
registerForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const displayUser = document.getElementById('displayUser').value;
    const usuario = document.getElementById('usuario').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    if (senha.length < 8) {
        document.getElementById("alertPassword").textContent = "A senha deve ter pelo menos 8 caracteres";
        return;
    } else {
        document.getElementById("alertPassword").textContent = "";
    }

    try {
        const response = await fetch('/cadastro', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ displayUser: displayUser, user: usuario, email: email, password: senha })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erro na rede');
        }

        const data = await response.json();

        if (data.hasOwnProperty('error')) {
            document.getElementById("usuario").value = "";
            document.getElementById("email").value = "";
            document.getElementById("senha").value = "";
            document.getElementById("alertPassword").textContent = data.error;
            return;
        }

        localStorage.setItem('userId', data.usuario.id);

        window.location.href = '/login';
    } catch (error) {
        console.error('Erro:', error);
        document.getElementById("alertPassword").textContent = error.message;
    }

    console.log('Requisição enviada:', { displayUser: displayUser, user: usuario, email: email, password: senha });
});
