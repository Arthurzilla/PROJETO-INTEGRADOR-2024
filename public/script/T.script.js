const loadFofocas = async () => {
    try {
        const response = await fetch('http://localhost:3000/fofocas/api');

        // Verifica se a resposta foi bem-sucedida
        if (!response.ok) {
            throw new Error('Erro ao carregar fofocas: ' + response.statusText);
        }

        const fofocas = await response.json();
        const timelineDiv = document.getElementById('timeline');
        timelineDiv.innerHTML = '';

        if (fofocas.message) {
            timelineDiv.innerHTML = `<p>${fofocas.message}</p>`;
        } else {
            fofocas.forEach(fofoca => {
                const fofocaElement = document.createElement('div');
                fofocaElement.className = 'fofoca';
                fofocaElement.innerHTML = `
                    <h3>${fofoca.usuario.user}</h3> <!-- Acesse o nome do usuário após a população -->
                    <h4>${fofoca.title}</h4>
                    <p>${fofoca.description}</p>
                `;
                timelineDiv.appendChild(fofocaElement);
            });
        }
    } catch (error) {
        console.error('Erro ao carregar fofocas:', error);
    }
};

// Chama a função para carregar as fofocas ao abrir a página
loadFofocas();
