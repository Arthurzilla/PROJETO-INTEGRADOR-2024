
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
    loadFofocas();

    const token = localStorage.getItem('token');
    const displayUserDiv = document.getElementById('nav-display');
    const userUserDiv = document.getElementById('nav-user');
    const usuarioDiv = document.getElementById('user-specs')
    const userNav = document.getElementById('user-nav');
    const userModal = document.getElementById('user-modal');
    const buttonCriar = document.getElementById('buttonCriar');
    const criarModal = document.getElementById('creation-modal');
    const closeModalButton = document.getElementById('creation-modal-content-close');
    const logoutButton = document.getElementById('logout-button');
    const creationDisplayDiv = document.getElementById('creation-display');
    const creationUserDiv = document.getElementById('creation-user');


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
            if (data.displayUser && data.usuario) {
                displayUserDiv.textContent = `${data.displayUser}`;
                userUserDiv.textContent = `@${data.usuario}`;

                creationDisplayDiv.textContent = `${data.displayUser}`;
                creationUserDiv.textContent = `@${data.usuario}`;
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
    
   
    if (logoutButton) {
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
    } else {
        console.log('Botão de logout não encontrado.');
    }

    closeModalButton.addEventListener('click', () => {
        criarModal.style.display = 'none'; // Esconde o modal de criar
        overlay.style.display = 'none'; // Esconde o overlay
    });

    buttonCriar.addEventListener('click',() =>{
        criarModal.style.display = 'block'; // mostra o modal de criar
        overlay.style.display = 'block'; // mostra overlay
    })

    document.getElementById('creation-modal-content-post-content').addEventListener('click', async () => {
        const conteudo = document.getElementById('creation-modal-content-fofoca-content').value;
    
        const token = localStorage.getItem('token');
    
        if (!token) {
            alert('Você precisa estar logado para criar uma fofoca.');
            window.location.href = '/login';
            return;
        }
    
        const payload = JSON.parse(atob(token.split('.')[1]));
        const userId = payload.id;
    
        const response = await fetch('/fofocas/criar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                description: conteudo,
                usuario: userId
            })
        });
    
        if (response.ok) {
            window.location.href = '/fofocas';
        } else {
            alert('Erro ao criar fofoca. Verifique os campos.');
        }
    
        console.log('Requisição enviada:', { description: conteudo, usuario: userId });
    });

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
    
});


const loadFofocas = async () => {
    console.log('tentando carregar fofoca');

    try {
        const response = await fetch('/fofocas/api')
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
                

                    <div class='user-specs'>
                    <a href="/perfil/${usuario._id}"><div class='display'>${usuario.displayUser}</div>
                        <div class='user'>@${usuario.user}</div></a>
                    </div>

                <a href="/fofocas/${id}">

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
        document.getElementById('timeline').innerHTML = '<p>Erro ao carregar fofocas. Tente novamente mais tarde.</p>';
    }
};

