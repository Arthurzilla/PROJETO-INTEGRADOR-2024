const fofocaForm = document.getElementById('fofocaForm');

// Função de criar a Fofoca
fofocaForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const titulo = document.getElementById('titulo').value;
    const conteudo = document.getElementById('conteudo').value;

    const response = await fetch('http://localhost:3000/fofocas/criar', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({title: titulo, description: conteudo})
    });

    if (response.ok) {
        alert('Fofoca criada com sucesso');
    } else {
        alert('Erro ao criar fofoca. Verifique os campos.');
    }

    console.log('Requisição enviada:', {title: titulo, description: conteudo});
});