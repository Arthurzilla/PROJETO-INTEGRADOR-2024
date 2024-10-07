const registerForm = document.getElementById('registerForm');

// Função de registrar o usuário
registerForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const usuario = document.getElementById('usuario').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

        const response = await fetch('http://localhost:3000/cadastro', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user: usuario, email: email, password: senha })
        });

        if (response.ok) {
            alert('usuario registrado com sucesso');
            window.location.href= 'http://localhost:3000/login';
        } else {
            alert('Erro ao registrar. Verifique os campos.');
        }

        if(senha.length<8){
            document.getElementById("alertPassword").textContent = "A senha deve ter pelo menos 8 caracteres";
        }

        console.log('Requisição enviada:', { user: usuario, email: email, password: senha });
});
