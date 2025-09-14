$(document).ready(function() {

    // ====================================================================
    // INICIALIZAÇÃO DE COMPONENTES (SELECT2)
    // ====================================================================

    if ($('#produtos').length) {
        $('#produtos').select2({
            placeholder: 'Selecione um ou mais produtos',
            theme: 'bootstrap-5'
        });
    }

    if ($('#metodo_pagamento').length) {
        $('#metodo_pagamento').select2({
            placeholder: 'Selecione um método de pagamento',
            theme: 'bootstrap-5',
            minimumResultsForSearch: Infinity 
        });
    }

    // ====================================================================
    // LÓGICA DE MÁSCARAS PARA CAMPOS (COM DELEGAÇÃO DE EVENTOS)
    // ====================================================================

    // Função para máscara de CPF/CNPJ
    const handleCpfCnpjInput = (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 14) value = value.substring(0, 14);
        if (value.length > 11) {
            value = value.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2}).*/, '$1.$2.$3/$4-$5');
        } else {
            value = value.replace(/^(\d{3})(\d{3})(\d{3})(\d{2}).*/, '$1.$2.$3-$4');
        }
        e.target.value = value;
    };

    // Função para máscara de Telefone
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

    // Função para máscara de CEP
    const handleCepInput = (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 8) value = value.substring(0, 8);
        value = value.replace(/^(\d{5})(\d{3}).*/, '$1-$2');
        e.target.value = value;
    };

    // Aplicação das máscaras usando delegação de eventos no body.
    // Isso garante que campos adicionados dinamicamente também recebam a máscara.
    $(document.body).on('input', '#cpf_cnpj', handleCpfCnpjInput);
    $(document.body).on('input', '.telefone-input', handleTelefoneInput);
    $(document.body).on('input', '.cep-input', handleCepInput);
    
    // ====================================================================
    // LÓGICA DE BOTÕES GERAIS
    // ====================================================================

    if ($('#btn-cancelar').length) {
        $('#btn-cancelar').on('click', function() {
            if (confirm('Ao cancelar, você perderá todo o progresso do formulário. Deseja realmente sair?')) {
                if (window.location.href.includes('ordem-servico-form.html')) {
                    window.location.href = 'tabela-os.html';
                } else if (window.location.href.includes('cliente-form.html')) {
                    window.location.href = 'tabela-cliente.html';
                } else if (window.location.href.includes('user-form.html')) {
                    window.location.href = 'tabela-user.html';
                } else if (window.location.href.includes('produto-form.html')) {
                    window.location.href = 'tabela-produto.html';
                } else if (window.location.href.includes('servico-form.html')) {
                    window.location.href = 'tabela-servico.html';
                } else {
                    window.location.href = 'index.html'; // Página padrão
                }
            }
        });
    }
});

