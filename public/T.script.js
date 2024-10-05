const loadFofocas = async () => {
    // aqui ele tenta isso caso ao contrario faz o catch la embaixo
    try {
        // puxa todas as fofocas da api para ca
        const response = await fetch('http://localhost:3000/fofocas/api'); // Chama a rota que retorna todas as fofocas
        const fofocas = await response.json();

        //puxa a div timeline lá do html
        const timelineDiv = document.getElementById('timeline');
        timelineDiv.innerHTML = '';

        // 
        if (fofocas.message) {
            timelineDiv.innerHTML = `<p>${fofocas.message}</p>`;
        } else {
            //criação do elemento que se no lá no HTML, titulo e texto do html, tranformando e um objetivo HMTL e visivel
            fofocas.forEach(fofoca => {
                const fofocaElement = document.createElement('div');
                fofocaElement.className = 'fofoca';
                fofocaElement.innerHTML = `
                    <h3>${fofoca.title}</h3>
                    <p>${fofoca.description}</p>
                `;
                // aqui ele junta tudo num só obejto
                timelineDiv.appendChild(fofocaElement);
            });
        }
    } catch (error) {
        // tentou ali em cima não deu certo e mostrou o erro no console
        console.error('Erro ao carregar fofocas:', error);
    }
};

// Chama a função para carregar as fofocas ao abrir a página
loadFofocas();