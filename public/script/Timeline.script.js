function timeAgo(date) {
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (seconds < 60) {
        return seconds === 1 ? '1s' : `${seconds} s`;
    } else if (minutes < 60) {
        return minutes === 1 ? '1m' : `${minutes} m`;
    } else if (hours < 24) {
        return hours === 1 ? '1h' : `${hours} h`;
    } else if (days < 7) {
        return days === 1 ? '1 dia atrás' : `${days} dias atrás`;
    } else if (days < 30) {
        return days < 7 ? `${days} dias atrás` : `${Math.floor(days / 7)} semanas atrás`;
    } else if (months < 12) {
        return months === 1 ? '1 mês atrás' : `${months} meses atrás`;
    } else {
        return years === 1 ? '1 ano atrás' : `${years} anos atrás`;
    }
}

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
                <a href="/fofocas/${id}">

                  

                    <h3 id='usuarioTimeline' class='small-title'>${usuario.displayUser}-@${usuario.user}</h3>
                    <p id='fofoca-date'>Há ${formattedDate}</p>
                    <p id='fofoca-description'>${description}</p>

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


document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const usuarioDiv = document.getElementById('mostraUsuario');

    if (token) {
        fetch('/usuario-logado', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao obter usuário logado.');
            }
            return response.json();
        })
        .then(data => {
            if (data.displayUser && data.usuario) { // Verifica se displayUser e usuario estão presentes
                usuarioDiv.textContent = `${data.displayUser} @${data.usuario}`;
            } else {
                usuarioDiv.textContent = 'Usuário não encontrado';
            }
        })
        .catch(error => {
            console.error('Erro ao obter usuário logado:', error);
            usuarioDiv.textContent = 'Erro ao obter usuário logado';
        });
    } else {
        usuarioDiv.textContent = 'Você não está logado';
    }
});

document.getElementById('logout-button').addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = '/login'; 
});

document.getElementById('logout-button').addEventListener('click', () => {
    fetch('/logout', { method: 'POST', headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
        .then(response => {
            if (response.ok) {
                localStorage.removeItem('token');
                window.location.href = '/login'; 
            }
        })
        .catch(error => {
            console.error('Erro ao deslogar:', error);
        });
});

loadFofocas();
