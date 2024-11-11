
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
    console.log('DOM totalmente carregado e analisado');

    console.log('vou chamar o load fofoca');
    loadFofocas();

    const token = localStorage.getItem('token');
    const displayUserDiv = document.getElementById('nav-display');
    const userUserDiv = document.getElementById('nav-user');
    const usuarioDiv = document.getElementById('user-specs')
    const userNav = document.getElementById('user-nav');
    const userModal = document.getElementById('user-modal');

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
    
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            fetch('/logout', { 
                method: 'POST', 
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } 
            })
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
    } else {
        console.log('Botão de logout não encontrado.');
    }
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
        document.getElementById('timeline').innerHTML = '<p>Erro ao carregar fofocas. Tente novamente mais tarde.</p>';
    }
};

// document.addEventListener('DOMContentLoaded', () => {
//     const perfilLink = document.getElementById('user-modal-content-profile');
//     perfilLink.addEventListener('click', () => {
//         const token = localStorage.getItem('token');

//         if (token) {
//             const headers = { 'Authorization': 'Bearer ' + token };
            
//             fetch('/usuario-logado', { 
//                 method: 'GET', 
//                 headers: headers

//             })
//             .then(response => {
//                 if (!response.ok) {
//                     throw new Error('Erro ao obter usuário logado.');
//                 }
//                 return response.json();
//             })
//             .then(data => {
//                 if (data._id) {
//                     console.log("Redirecionando para o perfil...");
//                     window.location.href = `/perfil/${data._id}`; 
//                 } else {
//                     console.log('ID de usuário não encontrado', data._id);
//                 }
//             })
//             .catch(error => {
//                 console.log('Erro ao obter usuário logado:', error);
//                 alert('Erro ao redirecionar para o perfil');
//             });
//         } else {
//             alert('Você não está logado'); 
//         }
//     });
// });

document.addEventListener('DOMContentLoaded', () => {
    const perfilLink = document.getElementById('user-modal-content-profile');
    perfilLink.addEventListener('click', () => {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('id');
       

fetch('/verificar', {
    method: 'GET',
    headers: {
        'Authorization': 'Bearer ' + token
    }
})
.then(response => {
    if (!response.ok) {
        console.log('Erro ao verificar o token');
    }
    return response.json();
})
.then(data => {
    console.log('Token verificado', data);
})
.catch(err => {
    console.error('Erro na requisição', err);
});




        if (token && userId) {
            const headers = { 
                'Authorization': 'Bearer ' + token
            };
            
            fetch('/usuario-logado', { 
                method: 'GET', 
                headers: headers
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao obter usuário logado.');
                }
                return response.json();
            })
            .then(data => {
                if (data._id) {
                    console.log("Redirecionando para o perfil...");
                    window.location.href = `/perfil/${data._id}`; 
                } else {
                    console.log('ID de usuário não encontrado', data._id);
                }
            })
            .catch(error => {
                console.log('Erro ao obter usuário logado:', error);
                alert('Erro ao redirecionar para o perfil');
            });
        } else {
            alert('Você não está logado'); 
        }
    });
});