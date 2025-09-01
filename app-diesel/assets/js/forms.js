// Espera o documento carregar completamente usando jQuery
$(document).ready(function() {

    // ====================================================================
    // INICIALIZAÇÃO DE COMPONENTES (SELECT2)
    // ====================================================================

    // Select2 para Produtos (múltipla seleção)
    if ($('#produtos').length) {
        $('#produtos').select2({
            placeholder: 'Selecione um ou mais produtos',
            theme: 'bootstrap-5'
        });
    }

    // Select2 para Método de Pagamento (seleção única)
    if ($('#metodo_pagamento').length) {
        $('#metodo_pagamento').select2({
            placeholder: 'Selecione um método de pagamento',
            theme: 'bootstrap-5',
            minimumResultsForSearch: Infinity // Oculta a caixa de busca
        });
    }

    // ====================================================================
    // LÓGICA DO FORMULÁRIO DE ORDEM DE SERVIÇO
    // ====================================================================

    // FUNÇÃO PARA CALCULAR O TOTAL DO SERVIÇO
    function calcularTotal() {
        const maoDeObra = parseFloat($('#mao_obra').val()) || 0;
        const deslocamento = parseFloat($('#deslocamento').val()) || 0;
        const valorPorKm = parseFloat($('#valor_km').val()) || 0;
        const custoDeslocamento = deslocamento * valorPorKm;
        const total = maoDeObra + custoDeslocamento;
        $('#total_servico').val(total.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
    }

    // Listener para o cálculo do total
    $('#mao_obra, #deslocamento, #valor_km').on('input', calcularTotal);

    // ====================================================================
    // LÓGICA DE MÁSCARAS PARA CAMPOS
    // ====================================================================

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

    const handleRgInput = (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 9) value = value.substring(0, 9);
        value = value.replace(/^(\d{2})(\d{3})(\d{3})(\w{1}).*/, '$1.$2.$3-$4');
        e.target.value = value;
    };

    // Aplicação inteligente das máscaras a qualquer campo com o ID correspondente
    if ($('#cpf').length) $('#cpf').on('input', handleCpfCnpjInput);
    if ($('#cpf_cnpj').length) $('#cpf_cnpj').on('input', handleCpfCnpjInput);
    if ($('#telefone').length) $('#telefone').on('input', handleTelefoneInput);
    if ($('#rg').length) $('#rg').on('input', handleRgInput);
    
    // ====================================================================
    // LÓGICA DE BOTÕES GERAIS
    // ====================================================================

    // Lógica do botão de cancelar (agora usando jQuery e dentro do ready)
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
                } else {
                    window.location.href = 'index.html'; // Página padrão
                }
            }
        });
    }
});
