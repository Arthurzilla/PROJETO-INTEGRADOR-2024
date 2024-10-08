const registerForm = document.getElementById('registerForm');

// Função de registrar o usuário
registerForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const usuario = document.getElementById('usuario').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    // Verificação da senha antes de enviar a requisição
    if (senha.length < 8) {
        document.getElementById("alertPassword").textContent = "A senha deve ter pelo menos 8 caracteres";
        return; // Interrompe a execução se a senha não for válida
    } else {
        document.getElementById("alertPassword").textContent = "";
    }

    try {
        const response = await fetch('/cadastro', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user: usuario, email: email, password: senha })
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

        alert('Usuário registrado com sucesso');
        window.location.href = '/login';
    } catch (error) {
        console.error('Erro:', error);
        document.getElementById("alertPassword").textContent = error.message;
    }

    console.log('Requisição enviada:', { user: usuario, email, password: senha });
});
