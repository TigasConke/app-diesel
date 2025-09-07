document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const clientId = params.get('id');
    const isEditMode = clientId !== null;

    const form = document.getElementById('client-form');
    const formTitle = document.getElementById('form-title');
    const saveButton = document.getElementById('save-button');
    const formMessage = document.getElementById('form-message');

    // Botões de adicionar
    const addEmailBtn = document.getElementById('add-email');
    const addTelefoneBtn = document.getElementById('add-telefone');
    const addPropertyBtn = document.getElementById('add-property');

    // Containers
    const emailsContainer = document.getElementById('emails-container');
    const telefonesContainer = document.getElementById('telefones-container');
    const propertiesContainer = document.getElementById('properties-container');

    // Templates
    const emailTemplate = document.getElementById('email-template');
    const telefoneTemplate = document.getElementById('telefone-template');
    const propertyTemplate = document.getElementById('property-template');

    // Função de máscara de telefone
    const handleTelefoneInput = (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 11) value = value.substring(0, 11);
        if (value.length > 10) {
            value = value.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
        } else {
            value = value.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
        }
        e.target.value = value;
    };

    // Funções para adicionar campos dinâmicos
    const addField = (template, container) => {
        const clone = template.content.cloneNode(true);
        const newField = clone.querySelector('.dynamic-field');
        container.appendChild(newField);
        return newField;
    };

    const addProperty = (prop = {}) => {
        const clone = propertyTemplate.content.cloneNode(true);
        const newItem = clone.querySelector('.property-item');
        const endereco = prop.endereco || {};

        if (prop.id) {
            newItem.dataset.propertyId = prop.id;
        }
        if (endereco.id) {
            newItem.dataset.addressId = endereco.id;
        }

        newItem.querySelector('[data-field="cadpro"]').value = prop.cadpro || '';
        newItem.querySelector('[data-field="cep"]').value = endereco.cep || '';
        newItem.querySelector('[data-field="logradouro"]').value = endereco.logradouro || '';
        newItem.querySelector('[data-field="numero"]').value = endereco.numero || '';
        newItem.querySelector('[data-field="complemento"]').value = endereco.complemento || '';
        newItem.querySelector('[data-field="bairro"]').value = endereco.bairro || '';
        newItem.querySelector('[data-field="cidade"]').value = endereco.cidade?.descricao || '';
        newItem.querySelector('[data-field="uf"]').value = endereco.uf?.descricao || '';
        newItem.querySelector('[data-field="lat"]').value = endereco.lat || '';
        newItem.querySelector('[data-field="long"]').value = endereco.long || '';
        
        propertiesContainer.appendChild(newItem);
        return newItem;
    };

    // Event Listeners para adicionar campos
    addEmailBtn.addEventListener('click', () => addField(emailTemplate, emailsContainer));
    addTelefoneBtn.addEventListener('click', () => {
        const newField = addField(telefoneTemplate, telefonesContainer);
        const input = newField.querySelector('input');
        input.addEventListener('input', handleTelefoneInput);
    });
    addPropertyBtn.addEventListener('click', () => addProperty());

    // Event listener para remover campos
    document.addEventListener('click', (e) => {
        if (e.target.closest('.remove-field-btn')) {
            e.target.closest('.dynamic-field').remove();
        }
        if (e.target.closest('.remove-property-btn')) {
            e.target.closest('.property-item').remove();
        }
    });
    
    // Lógica ViaCEP
    document.addEventListener('input', async (e) => {
        if (e.target.classList.contains('cep-input')) {
            const cep = e.target.value.replace(/\D/g, '');
            if (cep.length === 8) {
                const propertyItem = e.target.closest('.property-item');
                try {
                    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
                    const data = await response.json();
                    if (!data.erro) {
                        propertyItem.querySelector('[data-field="logradouro"]').value = data.logradouro;
                        propertyItem.querySelector('[data-field="bairro"]').value = data.bairro;
                        propertyItem.querySelector('[data-field="cidade"]').value = data.localidade;
                        propertyItem.querySelector('[data-field="uf"]').value = data.uf;
                    }
                } catch (error) {
                    console.error("Erro ao buscar CEP:", error);
                }
            }
        }
    });

    const loadClientData = async () => {
        if (!isEditMode) {
             // ---- INÍCIO DA ALTERAÇÃO ----
            // Se não for edição, adiciona um campo de cada por padrão
            addField(emailTemplate, emailsContainer);
            const newPhoneField = addField(telefoneTemplate, telefonesContainer);
            newPhoneField.querySelector('input').addEventListener('input', handleTelefoneInput);
            addProperty();
            // ---- FIM DA ALTERAÇÃO ----
            return;
        }

        formTitle.textContent = 'Editar Cliente';
        saveButton.textContent = 'Salvar Alterações';
        document.title = 'Editar Cliente';

        try {
            const response = await authenticatedFetch(`/cliente?id=${clientId}`);
            if (!response.ok) throw new Error('Cliente não encontrado.');
            const clients = await response.json();
            if (clients.length === 0) throw new Error('Cliente não encontrado.');
            const client = clients[0];

            document.getElementById('nome').value = client.nome;
            document.getElementById('cpf_cnpj').value = client.cpf_cnpj;

            emailsContainer.innerHTML = '';
            telefonesContainer.innerHTML = '';
            propertiesContainer.innerHTML = '';
            
            client.emails?.forEach(email => {
                const newField = addField(emailTemplate, emailsContainer);
                newField.querySelector('input').value = email.descricao;
            });

            client.telefones?.forEach(telefone => {
                const newField = addField(telefoneTemplate, telefonesContainer);
                const input = newField.querySelector('input');
                input.value = telefone.descricao;
                input.addEventListener('input', handleTelefoneInput);
                input.dispatchEvent(new Event('input'));
            });

            for (const prop of client.propriedades) {
                try {
                    const viaCepResponse = await fetch(`https://viacep.com.br/ws/${prop.endereco.cep}/json/`);
                    const viaCepData = await viaCepResponse.json();
                    if (!viaCepData.erro) {
                        prop.endereco.logradouro = viaCepData.logradouro;
                        prop.endereco.bairro = viaCepData.bairro;
                    }
                } catch (e) { console.error("Falha ao buscar CEP para edição", e) }
                addProperty(prop);
            }

        } catch (error) {
            formMessage.innerHTML = `<div class="alert alert-danger">${error.message}</div>`;
        }
    };

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const getNumericValue = (element) => {
            const value = element.value;
            return value ? parseFloat(value) : null;
        }

        const clientData = {
            nome: document.getElementById('nome').value,
            cpf_cnpj: document.getElementById('cpf_cnpj').value.replace(/\D/g, ''),
            emails: Array.from(emailsContainer.querySelectorAll('input')).map(input => ({ descricao: input.value })),
            telefones: Array.from(telefonesContainer.querySelectorAll('input')).map(input => ({ descricao: input.value.replace(/\D/g, '') })),
            propriedades: Array.from(propertiesContainer.querySelectorAll('.property-item')).map(item => {
                const property = {
                    cadpro: item.querySelector('[data-field="cadpro"]').value,
                    endereco: {
                        cep: item.querySelector('[data-field="cep"]').value.replace(/\D/g, ''),
                        logradouro: item.querySelector('[data-field="logradouro"]').value,
                        numero: getNumericValue(item.querySelector('[data-field="numero"]')),
                        complemento: item.querySelector('[data-field="complemento"]').value,
                        bairro: item.querySelector('[data-field="bairro"]').value,
                        cidade: { descricao: item.querySelector('[data-field="cidade"]').value },
                        uf: { descricao: item.querySelector('[data-field="uf"]').value },
                        lat: getNumericValue(item.querySelector('[data-field="lat"]')),
                        long: getNumericValue(item.querySelector('[data-field="long"]'))
                    }
                };

                if (item.dataset.propertyId) {
                    property.id = parseInt(item.dataset.propertyId, 10);
                }
                if (item.dataset.addressId) {
                    property.endereco.id = parseInt(item.dataset.addressId, 10);
                }
                return property;
            })
        };

        const method = isEditMode ? 'PUT' : 'POST';
        const url = '/cliente';
        if (isEditMode) {
            clientData.id = parseInt(clientId);
        }

        try {
            const response = await authenticatedFetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(clientData)
            });
            const result = await response.json();
            if (response.ok) {
                formMessage.innerHTML = `<div class="alert alert-success">Cliente salvo com sucesso! Redirecionando...</div>`;
                setTimeout(() => {
                    window.location.href = `cliente-detalhes.html?id=${result.id}`;
                }, 1500);
            } else {
                const errorMessage = Array.isArray(result.message) ? result.message.join('<br>') : (result.message || 'Erro desconhecido.');
                formMessage.innerHTML = `<div class="alert alert-danger">${errorMessage}</div>`;
            }
        } catch (error) {
            console.error('Erro ao salvar cliente:', error);
            formMessage.innerHTML = `<div class="alert alert-danger">Erro de conexão ao salvar cliente.</div>`;
        }
    });

    loadClientData();
});

