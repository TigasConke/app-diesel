document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('ordem-servico-form.html')) {
        // --- Elementos do Formulário Principal ---
        const form = document.getElementById('os-form');
        const propriedadeSelect = document.getElementById('cliente-propriedade');
        const responsavelSelect = document.getElementById('responsavel');
        const servicosSelect = document.getElementById('servicos-select');
        const produtosContainer = document.getElementById('produtos-container');
        const addProductBtn = document.getElementById('add-product-btn');
        const totalValueEl = document.getElementById('total-value');
        const noProductMessage = document.getElementById('no-product-message');

        // --- Modais e Formulários de Criação Rápida ---
        const createUserModal = new bootstrap.Modal(document.getElementById('create-user-modal'));
        const newUserForm = document.getElementById('new-user-form');
        const saveNewUserBtn = document.getElementById('save-new-user-btn');

        const createServiceModal = new bootstrap.Modal(document.getElementById('create-service-modal'));
        const newServiceForm = document.getElementById('new-service-form');
        const saveNewServiceBtn = document.getElementById('save-new-service-btn');

        const createProductModal = new bootstrap.Modal(document.getElementById('create-product-modal'));
        const newProductForm = document.getElementById('new-product-form');
        const saveNewProductBtn = document.getElementById('save-new-product-btn');

        let allProducts = [];
        let allServices = [];
        let allClients = [];
        let allUsers = [];

        // --- Funções Utilitárias ---
        $('.money').mask('000.000.000.000.000,00', { reverse: true });
        $('.cpf').mask('000.000.000-00', { reverse: true });


        const getNumericValue = (formattedValue) => {
            if (!formattedValue) return 0;
            return parseFloat(formattedValue.replace(/\./g, '').replace(',', '.'));
        };

        const formatCurrency = (value) => {
            const numberValue = parseFloat(value);
            return isNaN(numberValue) ? (0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : numberValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        };

        const calculateTotal = () => {
            let total = 0;
            document.querySelectorAll('.produto-row').forEach(row => {
                const quantidade = parseFloat(row.querySelector('.produto-quantidade').value) || 0;
                const valor = getNumericValue(row.querySelector('.produto-valor').value);
                total += quantidade * valor;
            });
            total += getNumericValue(document.getElementById('valor-mo').value);
            total += getNumericValue(document.getElementById('valor-deslocamento').value);
            totalValueEl.textContent = formatCurrency(total);
        };
        
        // --- Funções de Renderização e Atualização ---

        const updatePropriedadeSelect = () => {
            const currentVal = $(propriedadeSelect).val();
            propriedadeSelect.innerHTML = '<option value="">Selecione...</option>';
            allClients.forEach(cliente => {
                if (cliente.propriedades && cliente.propriedades.length > 0) {
                    const optgroup = document.createElement('optgroup');
                    optgroup.label = cliente.nome;
                    cliente.propriedades.forEach(prop => {
                        const option = document.createElement('option');
                        option.value = prop.id;
                        option.textContent = prop.descricao || `Propriedade de ${cliente.nome}`;
                        optgroup.appendChild(option);
                    });
                    propriedadeSelect.appendChild(optgroup);
                }
            });
            $(propriedadeSelect).val(currentVal).trigger('change');
        };
        
        const updateResponsavelSelect = () => {
             const currentVal = $(responsavelSelect).val();
             responsavelSelect.innerHTML = '<option value="">Selecione...</option>';
             allUsers
                .filter(usuario => usuario.status === 'ativo')
                .forEach(usuario => {
                    const option = document.createElement('option');
                    option.value = usuario.id;
                    option.textContent = usuario.nome;
                    responsavelSelect.appendChild(option);
                });
            $(responsavelSelect).val(currentVal).trigger('change');
        };

        const updateServicoSelect = () => {
            const currentVals = $(servicosSelect).val();
            servicosSelect.innerHTML = '';
            allServices.forEach(servico => {
                const option = document.createElement('option');
                option.value = servico.id;
                option.textContent = servico.nome;
                servicosSelect.appendChild(option);
            });
            $(servicosSelect).val(currentVals).trigger('change');
        };
        
        const updateAllProductSelects = () => {
            document.querySelectorAll('.produto-select').forEach(select => {
                const currentVal = select.value;
                select.innerHTML = '<option value="">Selecione um produto...</option>';
                allProducts.forEach(p => {
                    const option = document.createElement('option');
                    option.value = p.id;
                    option.textContent = p.nome;
                    option.dataset.valor = p.valor;
                    select.appendChild(option);
                });
                select.value = currentVal;
            });
        };

        // --- Carregamento Inicial ---
        const fetchInitialData = async () => {
            try {
                const [clientesRes, usuariosRes, servicosRes, produtosRes] = await Promise.all([
                    authenticatedFetch('/cliente'),
                    authenticatedFetch('/usuario'),
                    authenticatedFetch('/servico'),
                    authenticatedFetch('/produto')
                ]);

                allClients = await clientesRes.json();
                allUsers = await usuariosRes.json();
                allServices = await servicosRes.json();
                allProducts = await produtosRes.json();
                
                updatePropriedadeSelect();
                updateResponsavelSelect();
                updateServicoSelect();

                $(propriedadeSelect).select2({
                    theme: "bootstrap-5",
                    placeholder: 'Pesquise por cliente ou propriedade',
                });
                
                $(responsavelSelect).select2({
                    theme: "bootstrap-5",
                    placeholder: 'Pesquise pelo nome do responsável',
                });

                $(servicosSelect).select2({
                    theme: "bootstrap-5",
                    placeholder: 'Pesquise e selecione os serviços',
                    closeOnSelect: false,
                });

            } catch (error) {
                console.error('Erro ao carregar dados iniciais:', error);
                alert('Erro ao carregar dados da página. Verifique o console.');
            }
        };
        
        // --- Lógica de Produtos ---
        const createProductRow = () => {
            if (noProductMessage) noProductMessage.style.display = 'none';

            const rowId = `produto-row-${Date.now()}`;
            const div = document.createElement('div');
            div.className = 'row g-2 mb-2 align-items-center produto-row';
            div.id = rowId;

            div.innerHTML = `
                <div class="col-md-4">
                    <select class="form-select produto-select">
                        <option value="">Selecione um produto...</option>
                        ${allProducts.map(p => `<option value="${p.id}" data-valor="${p.valor}">${p.nome}</option>`).join('')}
                    </select>
                </div>
                <div class="col-md-2">
                    <input type="number" class="form-control produto-quantidade" placeholder="Qtd." min="0" step="0.001">
                </div>
                <div class="col-md-3">
                    <input type="text" class="form-control produto-valor money" placeholder="Valor Unit. (R$)">
                </div>
                <div class="col-md-2">
                     <input type="text" class="form-control produto-subtotal" placeholder="Subtotal" disabled>
                </div>
                <div class="col-md-1 text-end">
                    <button type="button" class="btn btn-sm btn-danger remove-product-btn"><i class="fas fa-trash"></i></button>
                </div>
            `;

            produtosContainer.appendChild(div);
            $('#' + rowId + ' .money').mask('000.000.000.000.000,00', { reverse: true });

            const select = div.querySelector('.produto-select');
            const quantidadeInput = div.querySelector('.produto-quantidade');
            const valorInput = div.querySelector('.produto-valor');
            const subtotalInput = div.querySelector('.produto-subtotal');

            const updateSubtotal = () => {
                const qtd = parseFloat(quantidadeInput.value) || 0;
                const val = getNumericValue(valorInput.value);
                subtotalInput.value = formatCurrency(qtd * val);
                calculateTotal();
            };
            
            select.addEventListener('change', (e) => {
                const selectedOption = e.target.options[e.target.selectedIndex];
                const valor = selectedOption.dataset.valor || 0;
                valorInput.value = parseFloat(valor).toFixed(2).replace('.',',');
                $(valorInput).trigger('input');
                updateSubtotal();
            });

            quantidadeInput.addEventListener('input', updateSubtotal);
            valorInput.addEventListener('input', updateSubtotal);
        };
        
        addProductBtn.addEventListener('click', () => createProductRow());
        
        produtosContainer.addEventListener('click', (e) => {
            if (e.target.closest('.remove-product-btn')) {
                e.target.closest('.produto-row').remove();
                if (produtosContainer.querySelectorAll('.produto-row').length === 0) {
                     if (noProductMessage) noProductMessage.style.display = 'block';
                }
                calculateTotal();
            }
        });

        // --- Listeners dos Modais ---
        
        saveNewUserBtn.addEventListener('click', async () => {
            const dataNascimentoValue = document.getElementById('new-user-nascimento').value;
            
            let dataNascimentoISO = null;
            if (dataNascimentoValue) {
                const localDate = new Date(`${dataNascimentoValue}T00:00:00`);
                dataNascimentoISO = localDate.toISOString();
            }

            const payload = {
                nome: document.getElementById('new-user-nome').value,
                cpf: document.getElementById('new-user-cpf').value.replace(/\D/g, ''),
                rg: document.getElementById('new-user-rg').value,
                email: document.getElementById('new-user-email').value,
                senha: 'senha123',
                cargo: document.getElementById('new-user-cargo').value,
                status: document.getElementById('new-user-status').value,
                data_nascimento: dataNascimentoISO
            };
            
            try {
                const response = await authenticatedFetch('/usuario', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
                
                if (!response.ok) {
                    const errorData = await response.json();
                    const errorMessage = Array.isArray(errorData.message) ? errorData.message.join('\n') : (errorData.message || 'Falha ao criar usuário.');
                    throw new Error(errorMessage);
                }

                const newUser = await response.json();
                allUsers.push(newUser);
                updateResponsavelSelect();
                $(responsavelSelect).val(newUser.id).trigger('change');
                newUserForm.reset();
                createUserModal.hide();
                alert('Responsável criado com sucesso!');
            } catch (error) {
                alert(`Erro:\n${error.message}`);
            }
        });
        
        saveNewServiceBtn.addEventListener('click', async () => {
            const descricaoValue = document.getElementById('new-service-descricao').value;
            const payload = {
                nome: document.getElementById('new-service-nome').value,
                descricao: descricaoValue.trim() ? descricaoValue : null
            };
            if (!payload.nome) { alert('O nome do serviço é obrigatório.'); return; }
            try {
                const response = await authenticatedFetch('/servico', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });

                if (!response.ok) {
                    const errorData = await response.json();
                    const errorMessage = Array.isArray(errorData.message) ? errorData.message.join('\n') : (errorData.message || 'Falha ao criar serviço.');
                    throw new Error(errorMessage);
                }

                const newService = await response.json();
                allServices.push(newService);
                updateServicoSelect();
                const currentSelection = $(servicosSelect).val();
                $(servicosSelect).val([...currentSelection, newService.id.toString()]).trigger('change');
                newServiceForm.reset();
                createServiceModal.hide();
                alert('Serviço criado com sucesso!');
            } catch (error) {
                alert(`Erro:\n${error.message}`);
            }
        });

        saveNewProductBtn.addEventListener('click', async () => {
            const descricaoValue = document.getElementById('new-product-descricao').value;
            const payload = {
                nome: document.getElementById('new-product-nome').value,
                // **CORREÇÃO APLICADA AQUI**
                descricao: descricaoValue.trim() ? descricaoValue : null,
                tamanho_tanque: parseFloat(document.getElementById('new-product-tamanho').value) || null,
                valor: getNumericValue(document.getElementById('new-product-valor').value),
            };
             if (!payload.nome || !payload.valor) {
                alert('Nome e Valor Unitário são obrigatórios.');
                return;
            }
            try {
                const response = await authenticatedFetch('/produto', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });

                if (!response.ok) {
                    const errorData = await response.json();
                    const errorMessage = Array.isArray(errorData.message) ? errorData.message.join('\n') : (errorData.message || 'Falha ao criar produto.');
                    throw new Error(errorMessage);
                }

                const newProduct = await response.json();
                allProducts.push(newProduct);
                updateAllProductSelects();
                newProductForm.reset();
                createProductModal.hide();
                alert('Produto criado com sucesso!');
            } catch(error) {
                console.error("Erro ao salvar produto:", error);
                alert(`Erro:\n${error.message}`);
            }
        });

        // --- Listeners de Interação com o Formulário ---
        form.addEventListener('input', (e) => {
             if (e.target.id === 'valor-mo' || e.target.id === 'valor-deslocamento') {
                calculateTotal();
            }
        });
        
        // --- Lógica de Atualização Automática da Lista de Clientes ---
        window.addEventListener('focus', async () => {
            if (localStorage.getItem('clienteAtualizado') === 'true') {
                localStorage.removeItem('clienteAtualizado'); // Limpa a bandeira
                try {
                    console.log('Detectada atualização de cliente. Recarregando lista...');
                    const response = await authenticatedFetch('/cliente');
                    if(response.ok) {
                        allClients = await response.json();
                        updatePropriedadeSelect();
                        console.log('Lista de clientes atualizada automaticamente.');
                    }
                } catch (error) {
                    console.error('Falha ao recarregar lista de clientes:', error);
                }
            }
        });
        
        // --- Listener de Submit do Formulário Principal ---
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const produtosPayload = [];
            document.querySelectorAll('.produto-row').forEach(row => {
                const produto_id = row.querySelector('.produto-select').value;
                const quantidade = parseFloat(row.querySelector('.produto-quantidade').value);
                const valor = getNumericValue(row.querySelector('.produto-valor').value);
                if (produto_id && quantidade > 0) {
                    produtosPayload.push({ produto_id: parseInt(produto_id), quantidade, valor });
                }
            });

            const servicosPayload = $(servicosSelect).val().map(id => parseInt(id));

            const payload = {
                status: document.getElementById('status').value,
                propriedade_id: parseInt(propriedadeSelect.value),
                responsavel_id: parseInt(responsavelSelect.value),
                valor_mo: getNumericValue(document.getElementById('valor-mo').value),
                valor_deslocamento: getNumericValue(document.getElementById('valor-deslocamento').value),
                ordem_servico_produtos: produtosPayload,
                servicos: servicosPayload
            };
            
            if(!payload.propriedade_id || !payload.responsavel_id){
                alert('Por favor, selecione o Cliente/Propriedade e o Responsável.');
                return;
            }
            try {
                 const response = await authenticatedFetch('/ordem-servico', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
                 if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Erro ao salvar Ordem de Serviço.');
                }
                alert('Ordem de Serviço salva com sucesso!');
                window.location.href = 'tabela-os.html';
            } catch(error) {
                console.error('Erro no submit:', error);
                alert(`Erro: ${error.message}`);
            }
        });

        fetchInitialData();
    }
});