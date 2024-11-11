document.addEventListener('DOMContentLoaded', () => {
    const usuarioId = window.location.pathname.split('/').pop();

    const loadPerfil = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Token não encontrado');
            }

            const response = await fetch(`/perfil/${data.usuario._id}`, {
                headers: {
                    'Authorization': `Bearer ` + token
                }
            });

            if (!response.ok) {
                throw new Error('Erro ao carregar perfil');
            }

            const data = await response.json();

            document.getElementById('profile-username').textContent = `@${data.usuario}`;
            document.getElementById('display-name').textContent = data.displayUser;

        } catch (error) {
            console.error('Erro ao carregar perfil:', error);
        }
    };

    loadPerfil();
});
