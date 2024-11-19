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
    const userModal = document.getElementById('user-modal');
    const logoutButton = document.getElementById('logout-button');

    const userNav = document.getElementById('user-nav');
    const userDisplay = document.getElementById('nav-display');
    const userName = document.getElementById('nav-user');


    logoutButton.addEventListener('click', () => {
        fetch('/logout', { 
            method: 'POST', 
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } 
        })
        .then(response => {
            if (response.ok) {
                localStorage.removeItem('token');
                localStorage.removeItem('authorization');
                localStorage.removeItem('id');
                localStorage.removeItem('data');
                window.location.href = '/login'; 
            }
        })
        .catch(error => {
            console.error('Erro ao deslogar:', error);
        });
    });

    userNav.addEventListener('click', () => {
        userModal.style.display = 'block';
    });

    document.addEventListener('click', (event) => {
        const isClickInsideUserNav = userNav.contains(event.target);
        const isClickInsideUserModal = userModal.contains(event.target);

        if (!isClickInsideUserNav && !isClickInsideUserModal) {
            userModal.style.display = 'none';
        }
    })

    const perfilLink = document.getElementById('user-modal-content-profile');
    
    perfilLink.addEventListener('click', () => {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('id');
        
        console.log('Front | Token armazenado:', token);

        if (token && userId) {
            fetch('/verificar', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                if (!response.ok) {
                    console.log('Front | Erro ao verificar o token');
                    throw new Error('Erro ao verificar o token');
                }
                return response.json();
            })
            .then(data => {
                console.log('Front | Token verificado', data);
                
                if (data.message === 'Token verificado com sucesso') {
                    fetch(`/usuario-logado`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Erro ao obter usuário logado');
                        }
                        return response.json();
                    })
                    .then(userData => {
                        if (userData._id) {
                            console.log("Front | Redirecionando para o perfil...");
                            window.location.href = `/perfil/${userData._id}`; 
                        } else {
                            console.log('Front | ID de usuário não encontrado');
                        }
                    })
                    .catch(error => {
                        console.error('Erro ao obter usuário logado:', error);
                        alert('Erro ao redirecionar para o perfil');
                    });
                } else {
                    console.log('Front | Token inválido ou expirado');
                }
            })
            .catch(err => {
                console.error('Erro na requisição de verificação', err);
            });
        } else {
            alert('Você não está logado'); 
        }
    });

    

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

            

            userDisplay.textContent = data.displayUser;
            userName.textContent = `@${data.usuario}`;


            document.getElementById('account-creation').textContent = `Conta criada em: ${new Date(data.dataCriacao).toLocaleDateString('pt-BR')}`;
            
        } catch (error) {

            const userDisplayElements =  document.getElementsByClassName('display');
            const userNameElements = document.getElementsByClassName('user');

            console.error('Erro ao carregar perfil:', error);
            userDisplayElements.textContent = 'Erro ao carregar o perfil';
            userNameElements.textContent = '';
        }
    };

    loadPerfil();  
});

/* const loadFofocas = async () => {
    console.log('Tentando carregar fofocas de um usuário específico');

    const usuarioId = window.location.pathname.split('/perfil/')[1]; 

    try {
        const response = await fetch(`/fofocas/api/${usuarioId}`); 
        if (!response.ok) {
            throw new Error('Erro ao carregar fofocas: ' + response.statusText);
        }

        const fofocas = await response.json();
        console.log("Dados recebidos da API:", fofocas);
        const timelineDiv = document.getElementById('timeline-container');
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

 */
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
        const timelineDiv = document.getElementById('timeline-container');
        timelineDiv.innerHTML = '';

        if (Array.isArray(fofocas) && fofocas.length > 0) {
            fofocas.forEach(fofoca => {
                const fofocaElement = document.createElement('div');
                fofocaElement.className = 'fofoca';
            
                const id = fofoca._id;
                const usuario = fofoca.usuario ? fofoca.usuario : 'Anônimo';
                const displayUser = fofoca.usuario.displayUser ? fofoca.usuario.displayUser : 'Usuário anônimo';
                const userName = fofoca.usuario.user ? fofoca.usuario.user : 'anonimo';
                const description = fofoca.description ? fofoca.description : 'Sem descrição';
                
                const data = new Date(fofoca.date);
                const formattedDate = timeAgo(data);
            
                fofocaElement.innerHTML = `
                <a href="/fofocas/${id}">
                    <div class='user-specs'>
                        <div class='display'>${displayUser}</div>
                        <div class='user'>@${userName}</div>
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
        document.getElementById('timeline-container').innerHTML = '<p>Nenhuma fofoca disponível no momento.</p>';
    }
};

loadFofocas();

