document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const osId = params.get('id');

    const loadingIndicator = document.getElementById('loading-indicator');
    const detailsContainer = document.getElementById('details-container');

    if (!osId) {
        detailsContainer.innerHTML = '<div class="alert alert-danger">ID da Ordem de Serviço não fornecido.</div>';
        loadingIndicator.classList.add('d-none');
        detailsContainer.classList.remove('d-none');
        return;
    }

    const formatCurrency = (value) => {
        const numberValue = parseFloat(value);
        if (isNaN(numberValue)) return 'R$ 0,00';
        return numberValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', { timeZone: 'UTC' }); // UTC para evitar problemas de fuso
    };

    try {
        const response = await authenticatedFetch(`/ordem-servico/${osId}`);
        if (!response.ok) {
            throw new Error('Ordem de Serviço não encontrada.');
        }
        const os = await response.json();
        
        // --- Preencher Informações ---
        document.getElementById('os-id').textContent = os.id;
        document.title = `Detalhes da OS #${os.id}`;

        // Cliente e Propriedade
        const cliente = os.propriedade?.cliente || {};
        const propriedade = os.propriedade || {};
        document.getElementById('cliente-nome').textContent = cliente.nome || 'Não informado';
        document.getElementById('cliente-cpfcnpj').textContent = cliente.cpf_cnpj || 'Não informado';
        document.getElementById('propriedade-descricao').textContent = propriedade.descricao || 'Não informada';
        document.getElementById('propriedade-cadpro').textContent = propriedade.cadpro || 'N/A';
        
        // Detalhes da OS
        const statusEl = document.getElementById('os-status');
        statusEl.textContent = os.status || 'Não informado';
        statusEl.classList.add(os.status === 'Concluído' ? 'bg-success' : 'bg-warning');
        document.getElementById('os-responsavel').textContent = os.responsavel?.nome || 'Não informado';
        document.getElementById('os-data').textContent = formatDate(os.data_abertura);

        // Listas
        const servicosList = document.getElementById('servicos-list');
        servicosList.innerHTML = '';
        if (os.servicos && os.servicos.length > 0) {
            os.servicos.forEach(servico => {
                const li = document.createElement('li');
                li.className = 'list-group-item';
                li.textContent = servico.nome;
                servicosList.appendChild(li);
            });
        } else {
            servicosList.innerHTML = '<li class="list-group-item text-muted">Nenhum serviço prestado.</li>';
        }

        const produtosList = document.getElementById('produtos-list');
        produtosList.innerHTML = '';
        let totalProdutos = 0;
        if (os.ordem_servico_produtos && os.ordem_servico_produtos.length > 0) {
            os.ordem_servico_produtos.forEach(item => {
                const subtotal = item.quantidade * item.valor;
                totalProdutos += subtotal;
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${item.produto.nome}</td>
                    <td class="text-center">${item.quantidade}</td>
                    <td class="text-end">${formatCurrency(item.valor)}</td>
                    <td class="text-end">${formatCurrency(subtotal)}</td>
                `;
                produtosList.appendChild(tr);
            });
        } else {
            produtosList.innerHTML = '<tr><td colspan="4" class="text-center text-muted">Nenhum produto utilizado.</td></tr>';
        }

        // Financeiro
        const valorMO = os.valor_mo || 0;
        const valorDeslocamento = os.valor_deslocamento || 0;
        const valorTotalOS = totalProdutos + valorMO + valorDeslocamento;

        document.getElementById('valor-mo').textContent = formatCurrency(valorMO);
        document.getElementById('valor-deslocamento').textContent = formatCurrency(valorDeslocamento);
        document.getElementById('valor-produtos').textContent = formatCurrency(totalProdutos);
        document.getElementById('valor-total').textContent = formatCurrency(valorTotalOS);
        
        // Botões
        document.getElementById('edit-btn').href = `ordem-servico-form.html?id=${os.id}`;
        document.getElementById('print-btn').addEventListener('click', () => {
            alert('Funcionalidade de impressão a ser implementada.');
            window.print();
        });

    } catch (error) {
        detailsContainer.innerHTML = `<div class="alert alert-danger">${error.message}</div>`;
    } finally {
        loadingIndicator.classList.add('d-none');
        detailsContainer.classList.remove('d-none');
    }
});
