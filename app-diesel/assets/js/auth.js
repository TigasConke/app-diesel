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

// Função para decodificar o token JWT e pegar os dados (payload)
function parseJwt(token) {
    if (!token) {
        return null;
    }
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    } catch (e) {
        return null; // Retorna nulo se o token for inválido
    }
}

// Nosso "Guardião" atualizado com verificação de cargo
function checkAuth() {
    const token = getToken();

    // 1. Se não há token, expulsa para o login
    if (!token) {
        if (window.location.pathname !== '/index.html' && window.location.pathname !== '/') {
             window.location.replace('/index.html');
        }
        return; // Para a execução aqui
    }

    // 2. Se há token, decodifica para pegar o cargo
    const userData = parseJwt(token);
    if (!userData || !userData.role) {
        logout(); // Se o token for inválido, desloga
        return;
    }

    const userRole = userData.role; // 'admin' ou 'colaborador'
    const currentPath = window.location.pathname;

    // 3. Verifica as permissões
    // Se for admin e estiver fora da pasta /adm/
    if (userRole === 'admin' && !currentPath.startsWith('/pages/adm/')) {
        window.location.replace('/pages/adm/tabela-os.html');
    }
    // Se for colaborador e estiver fora da pasta /funcionario/
    else if (userRole === 'colaborador' && !currentPath.startsWith('/pages/funcionario/')) {
         window.location.replace('/pages/funcionario/tabela-os-funcionario.html');
    }
}


// Função para fazer logout
function logout() {
    document.cookie = 'access_token=;path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT';
    window.location.replace('/index.html');
}

// Função "wrapper" para o fetch que já inclui o header de autorização
async function authenticatedFetch(url, options = {}) {
    const token = getToken();
    if (!token) {
        checkAuth();
        return;
    }

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
    };

    const response = await fetch(`http://localhost:3000${url}`, { ...options, headers });

    if (response.status === 401) {
        logout();
        return;
    }

    return response;
}

// Executa a verificação de autenticação assim que o script é carregado
// Exceto na página de login
if (window.location.pathname !== '/index.html' && window.location.pathname !== '/') {
    checkAuth();
}

// Função para que outros scripts possam pegar os dados do usuário
function getUserData() {
    const token = getToken();
    return parseJwt(token);
}