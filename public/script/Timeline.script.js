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

        // Verifica se a resposta é um array ou se contém uma mensagem
        if (Array.isArray(fofocas) && fofocas.length > 0) {
            fofocas.forEach(fofoca => {
                const fofocaElement = document.createElement('div');
                fofocaElement.className = 'fofoca';
                
                // Verifica se os campos existem para evitar erros
                const usuario = fofoca.usuario ? fofoca.usuario : 'Anônimo';
                const title = fofoca.title ? fofoca.title : 'Sem título';
                const description = fofoca.description ? fofoca.description : 'Sem descrição';

                fofocaElement.innerHTML = `
                    <h3>${usuario.user}</h3>
                    <h4>${title}</h4>
                    <p>${description}</p>
                `;
                timelineDiv.appendChild(fofocaElement);
            });
        } else if (fofocas.message) {
            timelineDiv.innerHTML = `<p>${fofocas.message}</p>`;
        } else {
            timelineDiv.innerHTML = '<p>Nenhuma fofoca disponível no momento.</p>';
        }
    } catch (error) {
        console.error('Erro ao carregar fofocas:', error);
        document.getElementById('timeline').innerHTML = '<p>Erro ao carregar fofocas. Tente novamente mais tarde.</p>';
    }
};

// Chama a função para carregar as fofocas ao abrir a página
loadFofocas();
