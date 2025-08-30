// Função para pegar o token dos cookies do navegador
function getToken() {
    const cookies = document.cookie.split(';').map(cookie => cookie.trim());
    for (const cookie of cookies) {
        if (cookie.startsWith('access_token=')) {
            return cookie.substring('access_token='.length);
        }
    }
    return null;
}

// Nosso "Guardião". Verifica se o usuário tem um token.
// Se não tiver, redireciona para a página de login.
function checkAuth() {
    const token = getToken();
    if (!token) {
        // Se o caminho atual não for a página de login, redireciona.
        // O replace evita que o usuário use o botão "voltar" do navegador para acessar a página protegida.
        if (window.location.pathname !== '/index.html' && window.location.pathname !== '/') {
             window.location.replace('/index.html');
        }
    }
}

// Função para fazer logout
function logout() {
    // Apaga o cookie do token e redireciona para o login
    document.cookie = 'access_token=;path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT';
    window.location.replace('/index.html');
}

// Função "wrapper" para o fetch que já inclui o header de autorização
async function authenticatedFetch(url, options = {}) {
    const token = getToken();
    if (!token) {
        checkAuth(); // Redireciona se não houver token
        return;
    }

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
    };

    const response = await fetch(`http://localhost:3000${url}`, { ...options, headers });

    // Se o token for inválido/expirado, o backend retornará 401
    if (response.status === 401) {
        logout(); // Desloga o usuário
        return;
    }

    return response;
}

// Executa a verificação de autenticação assim que o script é carregado
checkAuth();