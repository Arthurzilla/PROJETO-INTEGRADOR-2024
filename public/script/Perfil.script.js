document.addEventListener('DOMContentLoaded', () => {
    const usuarioId = window.location.pathname.split('/').pop();

    // Função para carregar os dados do perfil
    const loadPerfil = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Token não encontrado');
            }

            const response = await fetch(`/perfil/${usuarioId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Erro ao carregar perfil');
            }

            const data = await response.json();

            // Preencher os dados do perfil na página
            document.getElementById('profile-username').textContent = `@${data.usuario}`;
            document.getElementById('display-name').textContent = data.displayUser;

        } catch (error) {
            console.error('Erro ao carregar perfil:', error);
        }
    };

    loadPerfil();
});
