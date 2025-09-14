document.addEventListener('DOMContentLoaded', () => {
    // Pega o elemento do menu que vamos alterar
    const userNameDisplay = document.getElementById('user-name-display');

    if (userNameDisplay) {
        // Pega os dados do usuário do nosso auth.js
        const userData = getUserData();

        if (userData && userData.name) {
            // Pega o nome completo (ex: "Tiago Silva") e divide em partes
            const fullName = userData.name;
            const firstName = fullName.split(' ')[0]; // Pega apenas a primeira parte ("Tiago")

            // Atualiza o texto no menu
            userNameDisplay.textContent = firstName;
        }
    }
});