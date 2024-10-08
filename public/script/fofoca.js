
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');

async function fetchFofoca() {
    try {
        const response = await fetch(`http://localhost:3000/fofocas/${id}`);
        if (!response.ok) {
            throw new Error('Fofoca não encontrada.');
        }
        const fofoca = await response.json();
        document.getElementById('fofocaDetails').innerHTML = `
            <h2>${fofoca.title}</h2>
            <p>${fofoca.description}</p>
            <p><strong>Usuário:</strong> ${fofoca.usuario}</p>
            <a href="editFofoca.html?id=${fofoca._id}">Editar</a>
        `;
    } catch (error) {
        document.getElementById('fofocaDetails').innerHTML = `<p>${error.message}</p>`;
    }
}

fetchFofoca();
