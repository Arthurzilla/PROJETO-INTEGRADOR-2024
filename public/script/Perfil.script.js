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


document.addEventListener('DOMContentLoaded', () => {
    const usuarioId = window.location.pathname.split('perfil/').pop();

    const loadPerfil = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Token não encontrado');
            }

            const response = await fetch(`/perfil/${usuarioId}/api`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Erro ao carregar perfil');
            }

            const data = await response.json();

            document.getElementById('profile-username').textContent = `${data.displayUser}`;
            document.getElementById('display-name').textContent = `@${data.usuario}`;
            document.getElementById('account-creation').textContent = `Conta criada em: ${new Date(data.dataCriacao).toLocaleDateString('pt-BR')}`;

        } catch (error) {
            console.error('Erro ao carregar perfil:', error);
            document.getElementById('profile-username').textContent = 'Erro ao carregar o perfil';
            document.getElementById('display-name').textContent = '';
        }
    };

    loadPerfil();  
});

const loadFofocas = async () => {
    console.log('Tentando carregar fofocas de um usuário específico');

    const usuarioId = window.location.pathname.split('/perfil/')[1]; 

    try {
        const response = await fetch(`/fofocas/api/${usuarioId}`); 
        if (!response.ok) {
            throw new Error('Erro ao carregar fofocas: ' + response.statusText);
        }

        const fofocas = await response.json();
        console.log("Dados recebidos da API:", fofocas);
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
                    <div class='user-specs'>
                        <div class='display'>${usuario.displayUser}</div>
                        <div class='user'>@${usuario.user}</div>
                    </div>
                    
                    <div class='description'>${description}</div>

                    <div class='date'>Há ${formattedDate}</div>
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
        document.getElementById('timeline').innerHTML = '<p>Nenhuma fofoca disponível no momento.</p>';
    }
};

loadFofocas();
