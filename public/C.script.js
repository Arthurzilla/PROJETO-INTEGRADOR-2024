const fofocaForm = document.getElementById('fofocaForm');

// Função de criar a Fofoca
fofocaForm.addEventListener('submit', async (event) => {
    // definição de evento padrão nesse botão, ou seja sempre que é clicado isso acontece:
    event.preventDefault();
    // puxa as variaveis TITULO e CONTEUDO para cá envia para o banco
    const titulo = document.getElementById('titulo').value;
    const conteudo = document.getElementById('conteudo').value;

    //
    const response = await fetch('http://localhost:3000/fofocas/criar', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({title: titulo, description: conteudo})
    });

    // mostra para o usuario se criou ou não a fofoca
    if (response.ok) {
        alert('Fofoca criada com sucesso');
    } else {
        alert('Erro ao criar fofoca. Verifique os campos.');
    }

    // resposta do console
    console.log('Requisição enviada:', {title: titulo, description: conteudo});
});