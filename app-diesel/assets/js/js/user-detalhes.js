document.addEventListener('DOMContentLoaded', () => {
    // Seleciona todos os elementos que vamos usar no início
    const editButton = document.getElementById('btn-editar');
    const deleteButton = document.getElementById('btn-excluir');
    
    // Pega o ID do usuário da URL (ex: user-detalhes.html?id=123)
    const params = new URLSearchParams(window.location.search);
    const userId = params.get('id');

    // Se não houver ID, exibe um erro e interrompe a execução
    if (!userId) {
        alert('ID do usuário não fornecido!');
        window.location.href = 'tabela-user.html';
        return;
    }

    // Função assíncrona para carregar e exibir os detalhes do usuário
    const loadUserDetails = async () => {
        try {
            const response = await authenticatedFetch(`/usuario?id=${userId}`);
            if (!response.ok) {
                throw new Error('Falha ao buscar dados do usuário.');
            }

            const users = await response.json();
            if (users.length === 0) {
                throw new Error('Usuário não encontrado.');
            }
            const user = users[0]; // O backend retorna um array, pegamos o primeiro

            // Formata os dados para exibição
            const formattedDate = new Date(user.data_nascimento).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
            const formattedCPF = user.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
            const formattedRG = user.rg.replace(/(\d{2})(\d{3})(\d{3})(\d{1})/, "$1.$2.$3-$4");
            const statusClass = user.status === 'ativo' ? 'badge bg-success' : 'badge bg-danger';
            const cargoFormatted = user.cargo.charAt(0).toUpperCase() + user.cargo.slice(1);

            // Preenche os campos na página com os dados formatados
            document.getElementById('detail-nome').textContent = user.nome;
            document.getElementById('detail-email').textContent = user.email;
            document.getElementById('detail-cpf').textContent = formattedCPF;
            document.getElementById('detail-rg').textContent = formattedRG;
            document.getElementById('detail-dataNascimento').textContent = formattedDate;
            document.getElementById('detail-cargo').textContent = cargoFormatted;
            document.getElementById('detail-status').innerHTML = `<span class="${statusClass}">${user.status}</span>`;

        } catch (error) {
            console.error('Erro:', error);
            alert(error.message);
            window.location.href = 'tabela-user.html';
        }
    };

    // Adiciona o listener para o botão de editar
    if (editButton) {
        editButton.addEventListener('click', () => {
            window.location.href = `user-form.html?id=${userId}`;
        });
    }

    // Adiciona o listener para o botão de deletar
    if (deleteButton) {
        deleteButton.addEventListener('click', async () => {
            const userName = document.getElementById('detail-nome').textContent || `ID ${userId}`;
            if (confirm(`Tem certeza que deseja excluir o usuário ${userName}? Esta ação não pode ser desfeita.`)) {
                try {
                    const response = await authenticatedFetch('/usuario', {
                        method: 'DELETE',
                        body: JSON.stringify({ id: parseInt(userId) })
                    });

                    if (response.ok) {
                        alert('Usuário excluído com sucesso!');
                        window.location.href = 'tabela-user.html'; // Redireciona para a lista
                    } else {
                        const errorData = await response.json();
                        throw new Error(errorData.message || 'Falha ao excluir usuário.');
                    }
                } catch (error) {
                    alert(`Erro ao excluir: ${error.message}`);
                    console.error('Erro ao excluir usuário:', error);
                }
            }
        });
    }

    // Chama a função para carregar os detalhes do usuário
    loadUserDetails();
});

