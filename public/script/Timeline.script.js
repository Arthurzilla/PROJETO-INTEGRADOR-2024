const loadFofocas = async () => {
    try {
        const response = await fetch('/fofocas/api');

        if (!response.ok) {
            throw new Error('Erro ao carregar fofocas: ' + response.statusText);
        }

        const fofocas = await response.json();
        const timelineDiv = document.getElementById('timeline');
        timelineDiv.innerHTML = '';

        if (Array.isArray(fofocas) && fofocas.length > 0) {
            fofocas.forEach(fofoca => {
                const fofocaElement = document.createElement('div');
                fofocaElement.className = 'fofoca';
            
                const id = fofoca._id;
                const usuario = fofoca.usuario ? fofoca.usuario : 'Anônimo';
                const description = fofoca.description ? fofoca.description : 'Sem descrição';
                
                const data = new Date(fofoca.date);
                const formattedDate = timeAgo(data);
            
                fofocaElement.innerHTML = `
                <a href="http://localhost:3000/fofocas/${id}">
                    <h3>${usuario.user}</h3>
                    <p>Há ${formattedDate}</p>
                    <p>${description}</p>
                </a>
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

function timeAgo(date) {
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (seconds < 60) {
        return `${seconds} segundos atrás`;
    } else if (minutes < 60) {
        return `${minutes} minutos atrás`;
    } else if (hours < 24) {
        return `${hours} horas atrás`;
    } else if (days < 30) {
        return `${days} dias atrás`;
    } else if (months < 12) {
        return `${months} meses atrás`;
    } else {
        return `${years} anos atrás`;
    }
}

loadFofocas();
