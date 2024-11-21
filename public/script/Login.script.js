entrarForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const usuario = document.getElementById('usuario').value;
    const senha = document.getElementById('senha').value;

    try {
        const response = await fetch('/login/api', {
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
            document.getElementById("usuario").value = "";
            document.getElementById("senha").value = "";
            document.getElementById("alertERROR").textContent = data.error;
            return;
        }

        localStorage.setItem('authorization', data.token);
        localStorage.setItem('token', data.token);
        localStorage.setItem('id', data.usuario._id);
        localStorage.setItem('data', JSON.stringify(data));

        window.location.href = '/fofocas';
    } catch (error) {
        console.error('Erro:', error);
        document.getElementById("alertERROR").textContent = error.message;
    }

    console.log('Requisição enviada:', { user: usuario, password: senha });
});
