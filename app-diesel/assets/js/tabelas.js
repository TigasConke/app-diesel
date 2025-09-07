document.addEventListener('DOMContentLoaded', () => {

    // ===================================================================
    // Início Tabelas com dados fictícios (hardcode)
    // ===================================================================


    // ===================================================================
    // LÓGICA PARA A PÁGINA DE ORDENS DE SERVIÇO
    // ===================================================================
    if (document.getElementById('osTableBody')) {
        console.log("Página de Ordens de Serviço detectada. Inicializando script...");

        const osTableBody = document.getElementById('osTableBody');
        const searchInput = document.getElementById('searchInput');
        const filterStatus = document.getElementById('filterStatus');
        const sortOrder = document.getElementById('sortOrder');
        const paginationContainer = document.getElementById('pagination');

        const mockOrdensDeServico = [
            { id: 1, servico: 'Limpeza de tanque 10.000L', responsavel: 'Jorge', situacao: 'Em andamento', data: '2026-01-26' },
            { id: 2, servico: 'Troca de filtro da bomba', responsavel: 'Samuel', situacao: 'Em andamento', data: '2026-01-28' },
            { id: 3, servico: 'Inspeção de segurança anual', responsavel: 'Samuel', situacao: 'Em andamento', data: '2026-01-29' },
            { id: 4, servico: 'Reparo de vazamento na válvula', responsavel: 'Jorge', situacao: 'Em andamento', data: '2026-01-26' },
            { id: 5, servico: 'Instalação de medidor de nível', responsavel: 'Samuel', situacao: 'Concluído', data: '2026-01-26' },
            { id: 6, servico: 'Limpeza de tanque 5.000L', responsavel: 'Jorge', situacao: 'Em andamento', data: '2026-01-28' },
            { id: 7, servico: 'Calibração de bomba', responsavel: 'Samuel', situacao: 'Em andamento', data: '2026-01-29' },
            { id: 8, servico: 'Reparo na bacia de contenção', responsavel: 'Jorge', situacao: 'Concluído', data: '2026-01-26' },
            { id: 9, servico: 'Troca de mangueira de abastecimento', responsavel: 'Samuel', situacao: 'Concluído', data: '2026-01-26' },
            { id: 10, servico: 'Inspeção geral do kit de abastecimento', responsavel: 'Jorge', situacao: 'Concluído', data: '2026-01-28' },
            { id: 11, servico: 'Troca do bico da bomba', responsavel: 'Samuel', situacao: 'Concluído', data: '2026-01-29' },
            { id: 12, servico: 'Teste de estanqueidade', responsavel: 'Jorge', situacao: 'Em andamento', data: '2026-02-01' },
            { id: 13, servico: 'Aferição do medidor de vazão', responsavel: 'Samuel', situacao: 'Concluído', data: '2026-02-02' },
        ];

        let allOsData = [];
        let currentOsPage = 1;
        const osRowsPerPage = 10;

        function formatDate(dateString) {
            const [year, month, day] = dateString.split('-');
            return `${day}/${month}/${year}`;
        }

        function renderOsTable(data) {
            osTableBody.innerHTML = '';
            if (data.length === 0) {
                osTableBody.innerHTML = `<tr><td colspan="5" class="text-center">Nenhum resultado encontrado.</td></tr>`;
                return;
            }
            const startIndex = (currentOsPage - 1) * osRowsPerPage;
            const endIndex = startIndex + osRowsPerPage;
            const pageData = data.slice(startIndex, endIndex);
            pageData.forEach(item => {
                const statusClass = item.situacao === 'Em andamento' ? 'status-em-andamento' : 'status-concluido';
                const row = `
                    <tr>
                        <td>${item.servico}</td>
                        <td>${item.responsavel}</td>
                        <td><span class="badge ${statusClass}">${item.situacao}</span></td>
                        <td>${formatDate(item.data)}</td>
                        <td class="text-end"><button class="btn btn-visualizar btn-sm" onclick="alert('Visualizando OS ID: ${item.id}')">Visualizar</button></td>
                    </tr>`;
                osTableBody.innerHTML += row;
            });
        }

        function renderOsPagination(totalItems) {
            paginationContainer.innerHTML = '';
            const totalPages = Math.ceil(totalItems / osRowsPerPage);
            if (totalPages <= 1) return;
            paginationContainer.innerHTML += `<li class="page-item ${currentOsPage === 1 ? 'disabled' : ''}"><a class="page-link" href="#" data-page="${currentOsPage - 1}">‹</a></li>`;
            for (let i = 1; i <= totalPages; i++) {
                paginationContainer.innerHTML += `<li class="page-item ${i === currentOsPage ? 'active' : ''}"><a class="page-link" href="#" data-page="${i}">${i}</a></li>`;
            }
            paginationContainer.innerHTML += `<li class="page-item ${currentOsPage === totalPages ? 'disabled' : ''}"><a class="page-link" href="#" data-page="${currentOsPage + 1}">›</a></li>`;
        }

        function applyOsFiltersAndSort(resetPage = true) {
            let filteredData = [...allOsData];
            const searchTerm = searchInput.value.toLowerCase();
            if (searchTerm) {
                filteredData = filteredData.filter(item => item.servico.toLowerCase().includes(searchTerm) || item.responsavel.toLowerCase().includes(searchTerm) || formatDate(item.data).includes(searchTerm));
            }
            const status = filterStatus.value;
            if (status !== 'todos') {
                filteredData = filteredData.filter(item => item.situacao === status);
            }
            const sortValue = sortOrder.value;
            filteredData.sort((a, b) => {
                switch (sortValue) {
                    case 'data-asc': return new Date(a.data) - new Date(b.data);
                    case 'servico-asc': return a.servico.localeCompare(b.servico);
                    case 'responsavel-asc': return a.responsavel.localeCompare(b.responsavel);
                    default: return new Date(b.data) - new Date(a.data);
                }
            });
            if (resetPage) currentOsPage = 1;
            renderOsTable(filteredData);
            renderOsPagination(filteredData.length);
        }

        allOsData = mockOrdensDeServico;
        applyOsFiltersAndSort();
        searchInput.addEventListener('input', () => applyOsFiltersAndSort(true));
        filterStatus.addEventListener('change', () => applyOsFiltersAndSort(true));
        sortOrder.addEventListener('change', () => applyOsFiltersAndSort(true));
        paginationContainer.addEventListener('click', (e) => {
            if (e.target.tagName === 'A' && e.target.dataset.page) {
                e.preventDefault();
                if (e.target.parentElement.classList.contains('disabled')) return;
                const page = parseInt(e.target.dataset.page, 10);
                if (!isNaN(page) && page !== currentOsPage) {
                    currentOsPage = page;
                    applyOsFiltersAndSort(false);
                }
            }
        });
    }

    // ===================================================================
    // LÓGICA PARA A PÁGINA DE CLIENTES
    // ===================================================================
    if (document.getElementById('clientesTableBody')) {
        console.log("Página de Clientes detectada. Inicializando script...");

        const clientesTableBody = document.getElementById('clientesTableBody');
        const searchInput = document.getElementById('searchInput');
        const sortOrder = document.getElementById('sortOrder');
        const paginationContainer = document.getElementById('pagination');

        const mockClientes = [
            { id: 101, nome: 'Ana Silva', cpf_cnpj: '123.456.789-00', telefone: '(11) 98765-4321', email: 'ana.silva@example.com' },
            { id: 102, nome: 'Bruno Costa', cpf_cnpj: '11.222.333/0001-44', telefone: '(21) 91234-5678', email: 'bruno.costa@empresa.com.br' },
            { id: 103, nome: 'Carlos Dias', cpf_cnpj: '987.654.321-11', telefone: '(31) 95555-4444', email: 'carlos.dias@email.com' },
            { id: 104, nome: 'Daniela Souza', cpf_cnpj: '22.333.444/0001-55', telefone: '(71) 98888-7777', email: 'daniela@domain.net' },
            { id: 105, nome: 'Eduardo Lima', cpf_cnpj: '456.789.123-22', telefone: '(11) 93333-2222', email: 'e.lima@example.com' },
            { id: 106, nome: 'Fernanda Alves', cpf_cnpj: '654.321.987-33', telefone: '(41) 97777-6666', email: 'fernanda.alves@email.com' },
            { id: 107, nome: 'Gustavo Pereira', cpf_cnpj: '33.444.555/0001-66', telefone: '(51) 92222-1111', email: 'gustavo@empresa.com.br' },
            { id: 108, nome: 'Helena Santos', cpf_cnpj: '789.123.456-44', telefone: '(21) 94444-3333', email: 'helena.s@domain.net' },
            { id: 109, nome: 'Igor Martins', cpf_cnpj: '890.123.456-55', telefone: '(11) 96666-5555', email: 'igor.martins@example.com' },
            { id: 110, nome: 'Juliana Rocha', cpf_cnpj: '44.555.666/0001-77', telefone: '(81) 91111-0000', email: 'juliana.rocha@email.com' },
        ];

        let allClientesData = [];
        let currentClientesPage = 1;
        const clientesRowsPerPage = 10;

        function renderClientesTable(data) {
            clientesTableBody.innerHTML = '';
            if (data.length === 0) {
                clientesTableBody.innerHTML = `<tr><td colspan="5" class="text-center">Nenhum cliente encontrado.</td></tr>`;
                return;
            }
            const startIndex = (currentClientesPage - 1) * clientesRowsPerPage;
            const endIndex = startIndex + clientesRowsPerPage;
            const pageData = data.slice(startIndex, endIndex);
            pageData.forEach(item => {
                const row = `
                    <tr>
                        <td>${item.nome}</td>
                        <td>${item.cpf_cnpj}</td>
                        <td>${item.telefone}</td>
                        <td>${item.email}</td>
                        <td class="text-end">
                            <button class="btn btn-visualizar btn-sm" onclick="alert('Visualizando cliente ID: ${item.id}')">Visualizar</button>
                        </td>
                    </tr>`;
                clientesTableBody.innerHTML += row;
            });
        }

        function renderClientesPagination(totalItems) {
            paginationContainer.innerHTML = '';
            const totalPages = Math.ceil(totalItems / clientesRowsPerPage);
            if (totalPages <= 1) return;
            paginationContainer.innerHTML += `<li class="page-item ${currentClientesPage === 1 ? 'disabled' : ''}"><a class="page-link" href="#" data-page="${currentClientesPage - 1}">‹</a></li>`;
            for (let i = 1; i <= totalPages; i++) {
                paginationContainer.innerHTML += `<li class="page-item ${i === currentClientesPage ? 'active' : ''}"><a class="page-link" href="#" data-page="${i}">${i}</a></li>`;
            }
            paginationContainer.innerHTML += `<li class="page-item ${currentClientesPage === totalPages ? 'disabled' : ''}"><a class="page-link" href="#" data-page="${currentClientesPage + 1}">›</a></li>`;
        }

        function applyClientesFiltersAndSort(resetPage = true) {
            let filteredData = [...allClientesData];
            const searchTerm = searchInput.value.toLowerCase();
            if (searchTerm) {
                filteredData = filteredData.filter(item => 
                    item.nome.toLowerCase().includes(searchTerm) || 
                    item.cpf_cnpj.toLowerCase().includes(searchTerm) || 
                    item.email.toLowerCase().includes(searchTerm)
                );
            }
            const sortValue = sortOrder.value;
            filteredData.sort((a, b) => {
                switch (sortValue) {
                    case 'nome-desc': return b.nome.localeCompare(a.nome);
                    case 'email-asc': return a.email.localeCompare(b.email);
                    default: return a.nome.localeCompare(b.nome);
                }
            });
            if (resetPage) currentClientesPage = 1;
            renderClientesTable(filteredData);
            renderClientesPagination(filteredData.length);
        }

        allClientesData = mockClientes;
        applyClientesFiltersAndSort();
        searchInput.addEventListener('input', () => applyClientesFiltersAndSort(true));
        sortOrder.addEventListener('change', () => applyClientesFiltersAndSort(true));
        paginationContainer.addEventListener('click', (e) => {
            if (e.target.tagName === 'A' && e.target.dataset.page) {
                e.preventDefault();
                if (e.target.parentElement.classList.contains('disabled')) return;
                const page = parseInt(e.target.dataset.page, 10);
                if (!isNaN(page) && page !== currentClientesPage) {
                    currentClientesPage = page;
                    applyClientesFiltersAndSort(false);
                }
            }
        });
    }

    // ===================================================================
    // LÓGICA PARA A PÁGINA DE USUÁRIOS
    // ===================================================================
    if (document.getElementById('usuariosTableBody')) {
        console.log("Página de Usuários detectada. Inicializando script...");

        const usuariosTableBody = document.getElementById('usuariosTableBody');
        const searchInput = document.getElementById('searchInput');
        const sortOrder = document.getElementById('sortOrder');
        const paginationContainer = document.getElementById('pagination');

        const mockUsuarios = [
            { id: 201, nome: 'Usuário 1', cpf: '111.222.333-44', email: 'usuario1@email.com' },
            { id: 202, nome: 'Usuário 2', cpf: '222.333.444-55', email: 'usuario2@email.com' },
            { id: 203, nome: 'Usuário 3', cpf: '333.444.555-66', email: 'usuario3@email.com' },
            { id: 204, nome: 'Usuário 4', cpf: '444.555.666-77', email: 'usuario4@email.com' },
            { id: 205, nome: 'Usuário 5', cpf: '555.666.777-88', email: 'usuario5@email.com' },
            { id: 206, nome: 'Usuário 6', cpf: '666.777.888-99', email: 'usuario6@email.com' },
            { id: 207, nome: 'Usuário 7', cpf: '777.888.999-00', email: 'usuario7@email.com' },
            { id: 208, nome: 'Usuário 8', cpf: '888.999.000-11', email: 'usuario8@email.com' },
            { id: 209, nome: 'Usuário 9', cpf: '999.000.111-22', email: 'usuario9@email.com' },
            { id: 210, nome: 'Usuário 10', cpf: '000.111.222-33', email: 'usuario10@email.com' },
            { id: 211, nome: 'Usuário 11', cpf: '121.232.343-45', email: 'usuario11@email.com' },
        ];

        let allUsuariosData = [];
        let currentUsuariosPage = 1;
        const usuariosRowsPerPage = 10;

        function renderUsuariosTable(data) {
            usuariosTableBody.innerHTML = '';
            if (data.length === 0) {
                usuariosTableBody.innerHTML = `<tr><td colspan="4" class="text-center">Nenhum usuário encontrado.</td></tr>`;
                return;
            }
            const startIndex = (currentUsuariosPage - 1) * usuariosRowsPerPage;
            const endIndex = startIndex + usuariosRowsPerPage;
            const pageData = data.slice(startIndex, endIndex);
            pageData.forEach(item => {
                const row = `
                    <tr>
                        <td>${item.nome}</td>
                        <td>${item.cpf}</td>
                        <td>${item.email}</td>
                        <td class="text-end">
                            <button class="btn btn-visualizar btn-sm" onclick="alert('Visualizando usuário ID: ${item.id}')">Visualizar</button>
                        </td>
                    </tr>`;
                usuariosTableBody.innerHTML += row;
            });
        }

        function renderUsuariosPagination(totalItems) {
            paginationContainer.innerHTML = '';
            const totalPages = Math.ceil(totalItems / usuariosRowsPerPage);
            if (totalPages <= 1) return;
            paginationContainer.innerHTML += `<li class="page-item ${currentUsuariosPage === 1 ? 'disabled' : ''}"><a class="page-link" href="#" data-page="${currentUsuariosPage - 1}">‹</a></li>`;
            for (let i = 1; i <= totalPages; i++) {
                paginationContainer.innerHTML += `<li class="page-item ${i === currentUsuariosPage ? 'active' : ''}"><a class="page-link" href="#" data-page="${i}">${i}</a></li>`;
            }
            paginationContainer.innerHTML += `<li class="page-item ${currentUsuariosPage === totalPages ? 'disabled' : ''}"><a class="page-link" href="#" data-page="${currentUsuariosPage + 1}">›</a></li>`;
        }

        function applyUsuariosFiltersAndSort(resetPage = true) {
            let filteredData = [...allUsuariosData];
            const searchTerm = searchInput.value.toLowerCase();
            if (searchTerm) {
                filteredData = filteredData.filter(item => 
                    item.nome.toLowerCase().includes(searchTerm) || 
                    item.cpf.toLowerCase().includes(searchTerm) || 
                    item.email.toLowerCase().includes(searchTerm)
                );
            }
            const sortValue = sortOrder.value;
            filteredData.sort((a, b) => {
                switch (sortValue) {
                    case 'nome-desc': return b.nome.localeCompare(a.nome);
                    case 'email-asc': return a.email.localeCompare(b.email);
                    default: return a.nome.localeCompare(b.nome);
                }
            });
            if (resetPage) currentUsuariosPage = 1;
            renderUsuariosTable(filteredData);
            renderUsuariosPagination(filteredData.length);
        }

        allUsuariosData = mockUsuarios;
        applyUsuariosFiltersAndSort();
        searchInput.addEventListener('input', () => applyUsuariosFiltersAndSort(true));
        sortOrder.addEventListener('change', () => applyUsuariosFiltersAndSort(true));
        paginationContainer.addEventListener('click', (e) => {
            if (e.target.tagName === 'A' && e.target.dataset.page) {
                e.preventDefault();
                if (e.target.parentElement.classList.contains('disabled')) return;
                const page = parseInt(e.target.dataset.page, 10);
                if (!isNaN(page) && page !== currentUsuariosPage) {
                    currentUsuariosPage = page;
                    applyUsuariosFiltersAndSort(false);
                }
            }
        });
    }
    
    // ===================================================================
    // LÓGICA PARA A PÁGINA DE PRODUTOS
    // ===================================================================
    if (document.getElementById('produtosTableBody')) {
        console.log("Página de Produtos detectada. Inicializando script...");

        const produtosTableBody = document.getElementById('produtosTableBody');
        const searchInput = document.getElementById('searchInput');
        const sortOrder = document.getElementById('sortOrder');
        const paginationContainer = document.getElementById('pagination');

        const mockProdutos = [
            { id: 301, nome: 'Tanque Aéreo Vertical 5.000L', tamanhoTanque: 5000, valorUnitario: 12500.00 },
            { id: 302, nome: 'Tanque Aéreo Horizontal 10.000L', tamanhoTanque: 10000, valorUnitario: 18900.00 },
            { id: 303, nome: 'Tanque Subterrâneo Jaquetado 15.000L', tamanhoTanque: 15000, valorUnitario: 25400.00 },
            { id: 304, nome: 'Tanque Aéreo Vertical 3.000L', tamanhoTanque: 3000, valorUnitario: 9800.00 },
            { id: 305, nome: 'Tanque Aéreo Horizontal 5.000L com Bacia', tamanhoTanque: 5000, valorUnitario: 14200.00 },
            { id: 306, nome: 'Tanque Subterrâneo Simples 10.000L', tamanhoTanque: 10000, valorUnitario: 19500.00 },
            { id: 307, nome: 'Kit Abastecimento Básico', tamanhoTanque: 1, valorUnitario: 3200.00 },
            { id: 308, nome: 'Bomba de Abastecimento 70L/min', tamanhoTanque: 1, valorUnitario: 4500.00 },
            { id: 309, nome: 'Filtro de Diesel para Bomba', tamanhoTanque: 1, valorUnitario: 350.00 },
            { id: 310, nome: 'Medidor de Nível para Tanque', tamanhoTanque: 1, valorUnitario: 890.00 },
            { id: 311, nome: 'Tanque Aéreo 1.000L para Gerador', tamanhoTanque: 1000, valorUnitario: 5500.00 },
            { id: 312, nome: 'Contentor IBC 1.000L para Diesel', tamanhoTanque: 1000, valorUnitario: 1200.00 },
            { id: 313, nome: 'Mangueira de Abastecimento 5m', tamanhoTanque: 1, valorUnitario: 450.00 },
        ];

        let allProdutosData = [];
        let currentProdutosPage = 1;
        const produtosRowsPerPage = 10;

        function renderProdutosTable(data) {
            produtosTableBody.innerHTML = '';
            if (data.length === 0) {
                produtosTableBody.innerHTML = `<tr><td colspan="3" class="text-center">Nenhum produto encontrado.</td></tr>`;
                return;
            }
            const startIndex = (currentProdutosPage - 1) * produtosRowsPerPage;
            const endIndex = startIndex + produtosRowsPerPage;
            const pageData = data.slice(startIndex, endIndex);
            pageData.forEach(item => {
                const row = `
                    <tr>
                        <td>${item.nome}</td>
                        <td>${item.tamanhoTanque} L</td>
                        <td class="text-end">
                            <button class="btn btn-visualizar btn-sm" onclick="alert('Visualizando produto ID: ${item.id}')">Visualizar</button>
                        </td>
                    </tr>`;
                produtosTableBody.innerHTML += row;
            });
        }

        function renderProdutosPagination(totalItems) {
            paginationContainer.innerHTML = '';
            const totalPages = Math.ceil(totalItems / produtosRowsPerPage);
            if (totalPages <= 1) return;
            paginationContainer.innerHTML += `<li class="page-item ${currentProdutosPage === 1 ? 'disabled' : ''}"><a class="page-link" href="#" data-page="${currentProdutosPage - 1}">‹</a></li>`;
            for (let i = 1; i <= totalPages; i++) {
                paginationContainer.innerHTML += `<li class="page-item ${i === currentProdutosPage ? 'active' : ''}"><a class="page-link" href="#" data-page="${i}">${i}</a></li>`;
            }
            paginationContainer.innerHTML += `<li class="page-item ${currentProdutosPage === totalPages ? 'disabled' : ''}"><a class="page-link" href="#" data-page="${currentProdutosPage + 1}">›</a></li>`;
        }

        function applyProdutosFiltersAndSort(resetPage = true) {
            let filteredData = [...allProdutosData];
            const searchTerm = searchInput.value.toLowerCase();
            if (searchTerm) {
                filteredData = filteredData.filter(item => 
                    item.nome.toLowerCase().includes(searchTerm)
                );
            }
            const sortValue = sortOrder.value;
            filteredData.sort((a, b) => {
                switch (sortValue) {
                    case 'nome-desc': return b.nome.localeCompare(a.nome);
                    default: return a.nome.localeCompare(b.nome);
                }
            });
            if (resetPage) currentProdutosPage = 1;
            renderProdutosTable(filteredData);
            renderProdutosPagination(filteredData.length);
        }

        allProdutosData = mockProdutos;
        applyProdutosFiltersAndSort();
        searchInput.addEventListener('input', () => applyProdutosFiltersAndSort(true));
        sortOrder.addEventListener('change', () => applyProdutosFiltersAndSort(true));
        paginationContainer.addEventListener('click', (e) => {
            if (e.target.tagName === 'A' && e.target.dataset.page) {
                e.preventDefault();
                if (e.target.parentElement.classList.contains('disabled')) return;
                const page = parseInt(e.target.dataset.page, 10);
                if (!isNaN(page) && page !== currentProdutosPage) {
                    currentProdutosPage = page;
                    applyProdutosFiltersAndSort(false);
                }
            }
        });
    }

    // ===================================================================
    // LÓGICA PARA A PÁGINA DE RELATÓRIOS
    // ===================================================================
    if (document.getElementById('relatoriosTableBody')) {
        console.log("Página de Relatórios detectada. Inicializando script...");

        const relatoriosTableBody = document.getElementById('relatoriosTableBody');
        const searchInput = document.getElementById('searchInput');
        const sortOrder = document.getElementById('sortOrder');
        const paginationContainer = document.getElementById('pagination');

        const mockRelatorios = [
            { id: 401, nome: 'Clientes a serem atendidos' },
            { id: 402, nome: 'Financeiro' },
        ];

        let allRelatoriosData = [];
        let currentRelatoriosPage = 1;
        const relatoriosRowsPerPage = 10;

        function renderRelatoriosTable(data) {
            relatoriosTableBody.innerHTML = '';
            if (data.length === 0) {
                relatoriosTableBody.innerHTML = `<tr><td colspan="2" class="text-center">Nenhum relatório encontrado.</td></tr>`;
                return;
            }
            const startIndex = (currentRelatoriosPage - 1) * relatoriosRowsPerPage;
            const endIndex = startIndex + relatoriosRowsPerPage;
            const pageData = data.slice(startIndex, endIndex);
            pageData.forEach(item => {
                const row = `
                    <tr>
                        <td>${item.nome}</td>
                        <td class="text-end">
                            <button class="btn btn-visualizar btn-sm" onclick="alert('Visualizando relatório: ${item.nome}')">Visualizar</button>
                        </td>
                    </tr>`;
                relatoriosTableBody.innerHTML += row;
            });
        }

        function renderRelatoriosPagination(totalItems) {
            paginationContainer.innerHTML = '';
            const totalPages = Math.ceil(totalItems / relatoriosRowsPerPage);
            if (totalPages <= 1) return;
            paginationContainer.innerHTML += `<li class="page-item ${currentRelatoriosPage === 1 ? 'disabled' : ''}"><a class="page-link" href="#" data-page="${currentRelatoriosPage - 1}">‹</a></li>`;
            for (let i = 1; i <= totalPages; i++) {
                paginationContainer.innerHTML += `<li class="page-item ${i === currentRelatoriosPage ? 'active' : ''}"><a class="page-link" href="#" data-page="${i}">${i}</a></li>`;
            }
            paginationContainer.innerHTML += `<li class="page-item ${currentRelatoriosPage === totalPages ? 'disabled' : ''}"><a class="page-link" href="#" data-page="${currentRelatoriosPage + 1}">›</a></li>`;
        }

        function applyRelatoriosFiltersAndSort(resetPage = true) {
            let filteredData = [...allRelatoriosData];
            const searchTerm = searchInput.value.toLowerCase();
            if (searchTerm) {
                filteredData = filteredData.filter(item => 
                    item.nome.toLowerCase().includes(searchTerm)
                );
            }
            const sortValue = sortOrder.value;
            filteredData.sort((a, b) => {
                switch (sortValue) {
                    case 'nome-desc': return b.nome.localeCompare(a.nome);
                    default: return a.nome.localeCompare(b.nome);
                }
            });
            if (resetPage) currentRelatoriosPage = 1;
            renderRelatoriosTable(filteredData);
            renderRelatoriosPagination(filteredData.length);
        }

        allRelatoriosData = mockRelatorios;
        applyRelatoriosFiltersAndSort();
        searchInput.addEventListener('input', () => applyRelatoriosFiltersAndSort(true));
        sortOrder.addEventListener('change', () => applyRelatoriosFiltersAndSort(true));
        paginationContainer.addEventListener('click', (e) => {
            if (e.target.tagName === 'A' && e.target.dataset.page) {
                e.preventDefault();
                if (e.target.parentElement.classList.contains('disabled')) return;
                const page = parseInt(e.target.dataset.page, 10);
                if (!isNaN(page) && page !== currentRelatoriosPage) {
                    currentRelatoriosPage = page;
                    applyRelatoriosFiltersAndSort(false);
                }
            }
        });
    }
});

// Adicione este código ao seu arquivo tabelas.js ou um novo script
document.addEventListener('DOMContentLoaded', async () => {
    // Verificamos qual página está ativa para rodar o código certo
    if (window.location.pathname.includes('tabela-user.html')) {
        console.log("Página de usuários. Buscando dados...");

        try {
            // Usamos nossa nova função em vez do fetch padrão
            const response = await authenticatedFetch('/usuario');

            if (response && response.ok) {
                const usuarios = await response.json();
                console.log('Usuários recebidos do backend:', usuarios);
                // Aqui você colocaria a lógica para preencher sua tabela com os dados
            } else {
                 console.error('Falha ao buscar usuários:', response ? response.statusText : 'Sem resposta');
            }
        } catch (error) {
            console.error('Erro ao conectar com a API:', error);
        }
    }
});

    // ===================================================================
    // Fim Tabelas com dados fictícios (hardcode)
    // ===================================================================

    // ===================================================================
    // Início Tabelas com dados puxados do banco de dados
    // ===================================================================


document.addEventListener('DOMContentLoaded', () => {

    // LÓGICA FUNCIONAL PARA A TABELA DE USUÁRIOS (BASEADA NO SEU CÓDIGO)
    if (window.location.pathname.includes('tabela-user.html')) {
        
        let allUsers = [];
        let filteredUsers = [];
        let currentPage = 1;
        const rowsPerPage = 10;

        const tableBody = document.getElementById('user-table-body');
        const searchInput = document.getElementById('search-input');
        const cargoFilter = document.getElementById('cargo-filter');
        const statusFilter = document.getElementById('status-filter');
        const sortSelect = document.getElementById('sort-select');
        const paginationControls = document.getElementById('pagination-controls');
        const resultsInfo = document.getElementById('results-info');
        const paginationList = document.getElementById('pagination-list');
        const loadingIndicator = document.getElementById('loading-indicator');
        const noResults = document.getElementById('no-results');

        const renderTablePage = () => {
            tableBody.innerHTML = '';
            if (noResults) noResults.style.display = 'none';
            
            if (filteredUsers.length === 0) {
                if (noResults) noResults.style.display = 'block';
                if (paginationControls) paginationControls.style.display = 'none';
                return;
            }

            const startIndex = (currentPage - 1) * rowsPerPage;
            const endIndex = Math.min(startIndex + rowsPerPage, filteredUsers.length);
            const pageUsers = filteredUsers.slice(startIndex, endIndex);

            pageUsers.forEach(user => {
                const statusClass = user.status === 'ativo' ? 'badge bg-success' : 'badge bg-danger';
                const cargoFormatted = user.cargo.charAt(0).toUpperCase() + user.cargo.slice(1);
                
                const row = `
                    <tr>
                        <td>${user.id}</td>
                        <td>${user.nome}</td>
                        <td>${user.email}</td>
                        <td>${cargoFormatted}</td>
                        <td><span class="${statusClass}">${user.status}</span></td>
                        <td class="text-center">
                            <a href="user-detalhes.html?id=${user.id}" class="btn btn-sm btn-info" title="Visualizar"><i class="fas fa-eye"></i></a>
                            <a href="user-form.html?id=${user.id}" class="btn btn-sm btn-warning" title="Editar"><i class="fas fa-pencil-alt"></i></a>
                        </td>
                    </tr>
                `;
                tableBody.innerHTML += row;
            });
            updatePagination(startIndex, endIndex);
        };

        const updatePagination = (startIndex, endIndex) => {
            const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);
            if (paginationList) paginationList.innerHTML = ''; 

            if (totalPages <= 1) {
                if (paginationControls) paginationControls.style.display = 'none';
                if (resultsInfo) resultsInfo.textContent = `Exibindo ${filteredUsers.length} de ${filteredUsers.length} resultados`;
                return;
            }
            
            if (paginationControls) paginationControls.style.display = 'flex';
            if (resultsInfo) resultsInfo.textContent = `Exibindo ${startIndex + 1} a ${endIndex} de ${filteredUsers.length} resultados`;

            // Botão "Anterior"
            const prevLi = document.createElement('li');
            prevLi.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
            prevLi.innerHTML = `<a class="page-link" href="#">Anterior</a>`;
            prevLi.addEventListener('click', (e) => {
                e.preventDefault();
                if (currentPage > 1) {
                    currentPage--;
                    renderTablePage();
                }
            });
            paginationList.appendChild(prevLi);

            // Botões de página
             for (let i = 1; i <= totalPages; i++) {
                const pageLi = document.createElement('li');
                pageLi.className = `page-item ${i === currentPage ? 'active' : ''}`;
                pageLi.innerHTML = `<a class="page-link" href="#">${i}</a>`;
                pageLi.addEventListener('click', (e) => {
                    e.preventDefault();
                    currentPage = i;
                    renderTablePage();
                });
                paginationList.appendChild(pageLi);
            }

            // Botão "Próxima"
            const nextLi = document.createElement('li');
            nextLi.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
            nextLi.innerHTML = `<a class="page-link" href="#">Próxima</a>`;
            nextLi.addEventListener('click', (e) => {
                e.preventDefault();
                if (currentPage < totalPages) {
                    currentPage++;
                    renderTablePage();
                }
            });
            paginationList.appendChild(nextLi);
        };
        
        const applyFiltersAndSort = () => {
            let tempUsers = [...allUsers];
            const searchTerm = searchInput.value.toLowerCase();
            const cargo = cargoFilter.value;
            const status = statusFilter.value;
            const [sortColumn, sortDirection] = sortSelect.value.split('-');

            if (searchTerm) {
                tempUsers = tempUsers.filter(user =>
                    user.nome.toLowerCase().includes(searchTerm) ||
                    user.email.toLowerCase().includes(searchTerm)
                );
            }
            if (cargo && cargo !== 'todos') { // 'todos' é o valor para "sem filtro"
                tempUsers = tempUsers.filter(user => user.cargo === cargo);
            }
            if (status && status !== 'todos') { // 'todos' é o valor para "sem filtro"
                tempUsers = tempUsers.filter(user => user.status === status);
            }

            tempUsers.sort((a, b) => {
                const aValue = a[sortColumn];
                const bValue = b[sortColumn];
                if (typeof aValue === 'string') {
                    return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
                }
                return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
            });
            
            filteredUsers = tempUsers;
            currentPage = 1;
            renderTablePage();
        };

        const fetchUsers = async () => {
            if(loadingIndicator) loadingIndicator.style.display = 'block';
            if(tableBody) tableBody.innerHTML = '';
            try {
                const response = await authenticatedFetch('/usuario');
                if (!response.ok) throw new Error('Falha ao carregar usuários.');
                allUsers = await response.json();
                applyFiltersAndSort();
            } catch (error) {
                console.error("Erro ao buscar usuários:", error);
                if(tableBody) tableBody.innerHTML = `<tr><td colspan="6" class="text-center text-danger">Erro ao carregar dados.</td></tr>`;
            } finally {
                if(loadingIndicator) loadingIndicator.style.display = 'none';
            }
        };
        
        searchInput.addEventListener('input', applyFiltersAndSort);
        cargoFilter.addEventListener('change', applyFiltersAndSort);
        statusFilter.addEventListener('change', applyFiltersAndSort);
        sortSelect.addEventListener('change', applyFiltersAndSort);

        fetchUsers();
    }

    // ========================================================================
    // LÓGICA PARA A TABELA DE PRODUTOS (SEGUINDO O PADRÃO DA DE USUÁRIOS)
    // ========================================================================
    if (window.location.pathname.includes('tabela-produto.html')) {
        let allProducts = [];
        let filteredProducts = [];
        let currentPage = 1;
        const rowsPerPage = 10;

        const tableBody = document.getElementById('product-table-body');
        const searchInput = document.getElementById('search-input');
        const sortSelect = document.getElementById('sort-select');
        const paginationControls = document.getElementById('pagination-controls');
        const resultsInfo = document.getElementById('results-info');
        const paginationList = document.getElementById('pagination-list');
        const loadingIndicator = document.getElementById('loading-indicator');
        const noResults = document.getElementById('no-results');
        
        const renderTablePage = () => {
            if (loadingIndicator) loadingIndicator.style.display = 'none';
            tableBody.innerHTML = '';
            
            if (filteredProducts.length === 0) {
                if (noResults) noResults.style.display = 'block';
                if (paginationControls) paginationControls.style.display = 'none';
                return;
            }
            if (noResults) noResults.style.display = 'none';

            const startIndex = (currentPage - 1) * rowsPerPage;
            const endIndex = Math.min(startIndex + rowsPerPage, filteredProducts.length);
            const pageProducts = filteredProducts.slice(startIndex, endIndex);

            pageProducts.forEach(product => {
                const row = `
                    <tr>
                        <td>${product.id}</td>
                        <td>${product.nome}</td>
                        <td>${product.descricao || '-'}</td>
                        <td>${product.tamanho_tanque ? `${product.tamanho_tanque} L` : '-'}</td>
                        <td class="text-center">
                            <a href="produto-detalhes.html?id=${product.id}" class="btn btn-sm btn-info" title="Visualizar"><i class="fas fa-eye"></i></a>
                            <a href="produto-form.html?id=${product.id}" class="btn btn-sm btn-warning" title="Editar"><i class="fas fa-pencil-alt"></i></a>
                        </td>
                    </tr>
                `;
                tableBody.innerHTML += row;
            });
            updatePagination(startIndex, endIndex);
        };

        const updatePagination = (startIndex, endIndex) => {
            const totalPages = Math.ceil(filteredProducts.length / rowsPerPage);
            if (paginationList) paginationList.innerHTML = ''; 

            if (totalPages <= 1) {
                if (paginationControls) paginationControls.style.display = 'none';
                if (resultsInfo) resultsInfo.textContent = `Exibindo ${filteredProducts.length} de ${filteredProducts.length} resultados`;
                return;
            }
            
            if (paginationControls) paginationControls.style.display = 'flex';
            if (resultsInfo) resultsInfo.textContent = `Exibindo ${startIndex + 1} a ${endIndex} de ${filteredProducts.length} resultados`;

            const prevLi = document.createElement('li');
            prevLi.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
            prevLi.innerHTML = `<a class="page-link" href="#">Anterior</a>`;
            prevLi.addEventListener('click', (e) => {
                e.preventDefault();
                if (currentPage > 1) {
                    currentPage--;
                    renderTablePage();
                }
            });
            paginationList.appendChild(prevLi);

             for (let i = 1; i <= totalPages; i++) {
                const pageLi = document.createElement('li');
                pageLi.className = `page-item ${i === currentPage ? 'active' : ''}`;
                pageLi.innerHTML = `<a class="page-link" href="#">${i}</a>`;
                pageLi.addEventListener('click', (e) => {
                    e.preventDefault();
                    currentPage = i;
                    renderTablePage();
                });
                paginationList.appendChild(pageLi);
            }

            const nextLi = document.createElement('li');
            nextLi.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
            nextLi.innerHTML = `<a class="page-link" href="#">Próxima</a>`;
            nextLi.addEventListener('click', (e) => {
                e.preventDefault();
                if (currentPage < totalPages) {
                    currentPage++;
                    renderTablePage();
                }
            });
            paginationList.appendChild(nextLi);
        };
        
        const applyFiltersAndSort = () => {
            let tempProducts = [...allProducts];
            const searchTerm = searchInput.value.toLowerCase();
            const [sortColumn, sortDirection] = sortSelect.value.split('-');

            if (searchTerm) {
                tempProducts = tempProducts.filter(product =>
                    product.nome.toLowerCase().includes(searchTerm)
                );
            }
            
            tempProducts.sort((a, b) => {
                const aValue = a[sortColumn];
                const bValue = b[sortColumn];
                 if (typeof aValue === 'string') {
                    return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
                }
                return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
            });
            
            filteredProducts = tempProducts;
            currentPage = 1;
            renderTablePage();
        };

        const fetchProducts = async () => {
            if(loadingIndicator) loadingIndicator.style.display = 'block';
            if(tableBody) tableBody.innerHTML = '';
            try {
                const response = await authenticatedFetch('/produto');
                if (!response.ok) throw new Error('Falha ao carregar produtos.');
                allProducts = await response.json();
                applyFiltersAndSort();
            } catch (error) {
                console.error("Erro ao buscar produtos:", error);
                if(tableBody) tableBody.innerHTML = `<tr><td colspan="5" class="text-center text-danger">Erro ao carregar dados.</td></tr>`;
            } finally {
                if(loadingIndicator) loadingIndicator.style.display = 'none';
            }
        };

        searchInput.addEventListener('input', applyFiltersAndSort);
        sortSelect.addEventListener('change', applyFiltersAndSort);

        fetchProducts();
    }
   // ==========================================================
    // LÓGICA PARA A TABELA DE CLIENTES
    // ==========================================================
    if (window.location.pathname.includes('tabela-cliente.html')) {
        let allClients = [];
        let filteredClients = [];
        let currentPage = 1;
        const rowsPerPage = 10;

        const tableBody = document.getElementById('client-table-body');
        const searchInput = document.getElementById('search-input');
        const sortSelect = document.getElementById('sort-select');
        const loadingIndicator = document.getElementById('loading-indicator');
        const noResults = document.getElementById('no-results');
        const paginationControls = document.getElementById('pagination-controls');
        const resultsInfo = document.getElementById('results-info');
        const paginationList = document.getElementById('pagination-list');
        
        const renderTablePage = () => {
            if(tableBody) tableBody.innerHTML = '';
            if(noResults) noResults.style.display = 'none';

            if(filteredClients.length === 0){
                if(noResults) noResults.style.display = 'block';
                if(paginationControls) paginationControls.style.display = 'none';
                return;
            }

            const startIndex = (currentPage - 1) * rowsPerPage;
            const endIndex = Math.min(startIndex + rowsPerPage, filteredClients.length);
            const pageClients = filteredClients.slice(startIndex, endIndex);

            pageClients.forEach(client => {
                const row = `
                    <tr>
                        <td>${client.id}</td>
                        <td>${client.nome}</td>
                        <td>${client.cpf_cnpj}</td>
                        <td class="text-center">
                            <a href="cliente-detalhes.html?id=${client.id}" class="btn btn-sm btn-info" title="Visualizar"><i class="fas fa-eye"></i></a>
                            <a href="cliente-form.html?id=${client.id}" class="btn btn-sm btn-warning" title="Editar"><i class="fas fa-pencil-alt"></i></a>
                        </td>
                    </tr>
                `;
                if(tableBody) tableBody.innerHTML += row;
            });
            updatePagination(startIndex, endIndex);
        };

        const updatePagination = (startIndex, endIndex) => {
            const totalPages = Math.ceil(filteredClients.length / rowsPerPage);
            if(paginationList) paginationList.innerHTML = '';

            if (totalPages <= 1) {
                if(paginationControls) paginationControls.style.display = 'none';
                if(resultsInfo) resultsInfo.textContent = `Exibindo ${filteredClients.length} de ${filteredClients.length} resultados`;
                return;
            }

            if(paginationControls) paginationControls.style.display = 'flex';
            if(resultsInfo) resultsInfo.textContent = `Exibindo ${startIndex + 1} a ${endIndex} de ${filteredClients.length} resultados`;

            // ... (lógica completa de criação dos botões de paginação, igual a dos usuários)
        };
        
        const applyFiltersAndSort = () => {
            let tempClients = [...allClients];
            if(searchInput){
                const searchTerm = searchInput.value.toLowerCase();
                 tempClients = tempClients.filter(client =>
                    client.nome.toLowerCase().includes(searchTerm) ||
                    (client.cpf_cnpj && client.cpf_cnpj.includes(searchTerm))
                );
            }

            if(sortSelect){
                const [sortColumn, sortDirection] = sortSelect.value.split('-');
                tempClients.sort((a,b) => {
                    const aValue = a[sortColumn];
                    const bValue = b[sortColumn];
                    const comparison = (aValue > bValue) ? 1 : ((bValue > aValue) ? -1 : 0);
                    return sortDirection === 'asc' ? comparison : comparison * -1;
                });
            }

            filteredClients = tempClients;
            currentPage = 1;
            renderTablePage();
        };

        const fetchClients = async () => {
            if(loadingIndicator) loadingIndicator.style.display = 'block';
            if(tableBody) tableBody.innerHTML = '';
            try {
                const response = await authenticatedFetch('/cliente');
                if (!response.ok) throw new Error('Falha ao carregar clientes.');
                allClients = await response.json();
                applyFiltersAndSort();
            } catch (error) {
                console.error("Erro ao buscar clientes:", error);
                 if(tableBody) tableBody.innerHTML = `<tr><td colspan="4" class="text-center text-danger">Erro ao carregar dados.</td></tr>`;
            } finally {
                if(loadingIndicator) loadingIndicator.style.display = 'none';
            }
        };

        if(searchInput) searchInput.addEventListener('input', applyFiltersAndSort);
        if(sortSelect) sortSelect.addEventListener('change', applyFiltersAndSort);

        fetchClients();
    }
 if (window.location.pathname.includes('tabela-cliente.html')) {
        let allClients = [];
        let filteredClients = [];
        let currentPage = 1;
        const rowsPerPage = 10;

        const tableBody = document.getElementById('client-table-body');
        const searchInput = document.getElementById('search-input');
        const sortSelect = document.getElementById('sort-select');
        const loadingIndicator = document.getElementById('loading-indicator');
        const noResults = document.getElementById('no-results');
        const paginationControls = document.getElementById('pagination-controls');
        const resultsInfo = document.getElementById('results-info');
        const paginationList = document.getElementById('pagination-list');
        
        const formatCpfCnpj = (value) => {
            const cleanValue = value.replace(/\D/g, '');
            if (cleanValue.length > 11) {
                return cleanValue.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2}).*/, '$1.$2.$3/$4-$5');
            }
            return cleanValue.replace(/^(\d{3})(\d{3})(\d{3})(\d{2}).*/, '$1.$2.$3-$4');
        };

        const formatTelefone = (value) => {
            const cleanValue = value.replace(/\D/g, '');
            if (cleanValue.length > 10) {
                return cleanValue.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
            }
            return cleanValue.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
        };

        const renderTablePage = () => {
            if(tableBody) tableBody.innerHTML = '';
            if(noResults) noResults.style.display = 'none';

            if(filteredClients.length === 0){
                if(noResults) noResults.style.display = 'block';
                if(paginationControls) paginationControls.style.display = 'none';
                return;
            }

            const startIndex = (currentPage - 1) * rowsPerPage;
            const endIndex = Math.min(startIndex + rowsPerPage, filteredClients.length);
            const pageClients = filteredClients.slice(startIndex, endIndex);

            pageClients.forEach(client => {
                const firstTelefone = client.telefones && client.telefones.length > 0 
                    ? formatTelefone(client.telefones[0].descricao) 
                    : '-';

                const row = `
                    <tr>
                        <td>${client.id}</td>
                        <td>${client.nome}</td>
                        <td>${formatCpfCnpj(client.cpf_cnpj)}</td>
                        <td>${firstTelefone}</td>
                        <td class="text-center">
                            <a href="cliente-detalhes.html?id=${client.id}" class="btn btn-sm btn-info" title="Visualizar"><i class="fas fa-eye"></i></a>
                            <a href="cliente-form.html?id=${client.id}" class="btn btn-sm btn-warning" title="Editar"><i class="fas fa-pencil-alt"></i></a>
                        </td>
                    </tr>
                `;
                if(tableBody) tableBody.innerHTML += row;
            });
            updatePagination(startIndex, endIndex);
        };

        const updatePagination = (startIndex, endIndex) => {
            const totalPages = Math.ceil(filteredClients.length / rowsPerPage);
            if(paginationList) paginationList.innerHTML = '';

            if (totalPages <= 1) {
                if(paginationControls) paginationControls.style.display = 'none';
                if(resultsInfo) resultsInfo.textContent = `Exibindo ${filteredClients.length} de ${filteredClients.length} resultados`;
                return;
            }

            if(paginationControls) paginationControls.style.display = 'flex';
            if(resultsInfo) resultsInfo.textContent = `Exibindo ${startIndex + 1} a ${endIndex} de ${filteredClients.length} resultados`;

            // Botão "Anterior"
            const prevLi = document.createElement('li');
            prevLi.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
            prevLi.innerHTML = `<a class="page-link" href="#">Anterior</a>`;
            prevLi.addEventListener('click', (e) => {
                e.preventDefault();
                if (currentPage > 1) {
                    currentPage--;
                    renderTablePage();
                }
            });
            paginationList.appendChild(prevLi);

            // Botões de página
            for (let i = 1; i <= totalPages; i++) {
                const pageLi = document.createElement('li');
                pageLi.className = `page-item ${i === currentPage ? 'active' : ''}`;
                pageLi.innerHTML = `<a class="page-link" href="#">${i}</a>`;
                pageLi.addEventListener('click', (e) => {
                    e.preventDefault();
                    currentPage = i;
                    renderTablePage();
                });
                paginationList.appendChild(pageLi);
            }

            // Botão "Próxima"
            const nextLi = document.createElement('li');
            nextLi.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
            nextLi.innerHTML = `<a class="page-link" href="#">Próxima</a>`;
            nextLi.addEventListener('click', (e) => {
                e.preventDefault();
                if (currentPage < totalPages) {
                    currentPage++;
                    renderTablePage();
                }
            });
            paginationList.appendChild(nextLi);
        };
        
        const applyFiltersAndSort = () => {
            let tempClients = [...allClients];
            if(searchInput){
                const searchTerm = searchInput.value.toLowerCase();
                 tempClients = tempClients.filter(client =>
                    client.nome.toLowerCase().includes(searchTerm) ||
                    (client.cpf_cnpj && client.cpf_cnpj.includes(searchTerm))
                );
            }

            if(sortSelect){
                const [sortColumn, sortDirection] = sortSelect.value.split('-');
                tempClients.sort((a,b) => {
                    const aValue = a[sortColumn];
                    const bValue = b[sortColumn];
                    const comparison = (aValue > bValue) ? 1 : ((bValue > aValue) ? -1 : 0);
                    return sortDirection === 'asc' ? comparison : comparison * -1;
                });
            }

            filteredClients = tempClients;
            currentPage = 1;
            renderTablePage();
        };

        const fetchClients = async () => {
            if(loadingIndicator) loadingIndicator.style.display = 'block';
            if(tableBody) tableBody.innerHTML = '';
            try {
                const response = await authenticatedFetch('/cliente');
                if (!response.ok) throw new Error('Falha ao carregar clientes.');
                allClients = await response.json();
                applyFiltersAndSort();
            } catch (error) {
                console.error("Erro ao buscar clientes:", error);
                 if(tableBody) tableBody.innerHTML = `<tr><td colspan="5" class="text-center text-danger">Erro ao carregar dados.</td></tr>`;
            } finally {
                if(loadingIndicator) loadingIndicator.style.display = 'none';
            }
        };

        if(searchInput) searchInput.addEventListener('input', applyFiltersAndSort);
        if(sortSelect) sortSelect.addEventListener('change', applyFiltersAndSort);

        fetchClients();
    }
});











