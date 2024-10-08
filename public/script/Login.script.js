    entrarForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const usuario = document.getElementById('usuario').value;
    const senha = document.getElementById('senha').value;

    try {
        const response = await fetch('http://localhost:3000/login/api', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user: usuario, password: senha })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Erro na rede');
        }

        const data = await response.json();

        if (data.hasOwnProperty('error')) {
            document.getElementById("usuario").textContent = "";
            document.getElementById("senha").textContent = "";
            document.getElementById("alertERROR").textContent = data.error;
            return;
        }

        localStorage.setItem('token', data.token);
        window.location.href = 'http://localhost:3000/fofocas';
    } catch (error) {
        console.error('Erro:', error);
        document.getElementById("alertERROR").textContent = error.message;
    }

    console.log('Requisição enviada:', { user: usuario, password: senha });
});
