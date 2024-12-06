import requests from './api.js';

let selectedColor = '#6C63FF'; // Cor padrão
let initialized = false; // Flag para evitar inicialização dupla

function limparCampos() {
    document.getElementById('boardName').value = '';
    document.getElementById('boardDescription').value = '';
    const colorOptions = document.querySelectorAll('.color-option');
    const colorPicker = document.getElementById('colorPicker');
    
    colorOptions.forEach(opt => opt.classList.remove('selected'));
    colorPicker.classList.remove('selected');
    colorOptions[0].classList.add('selected');
    colorPicker.value = '#6C63FF';
    selectedColor = '#6C63FF';
}

// Troca o DOMContentLoaded pelo novo evento customizado
document.addEventListener('popupLoaded', () => {
    if (initialized) return; // Evita inicialização dupla
    initialized = true;

    const newBoardBtn = document.getElementById('newBoardBtn');
    const popupOverlay = document.getElementById('popupOverlay');
    const closePopupBtn = document.getElementById('closePopupBtn');
    const createBoardBtn = document.getElementById('createBoardBtn');
    const colorPicker = document.getElementById('colorPicker');
    const colorOptions = document.querySelectorAll('.color-option');

    if (!newBoardBtn || !popupOverlay || !closePopupBtn || !createBoardBtn) {
        console.log('Elementos não encontrados, tentando novamente em 100ms');
        setTimeout(() => document.dispatchEvent(new Event('DOMContentLoaded')), 100);
        return;
    }

    // Configurar seletor de cores predefinidas
    colorOptions.forEach(option => {
        option.addEventListener('click', () => {
            colorOptions.forEach(opt => opt.classList.remove('selected'));
            colorPicker.classList.remove('selected');
            option.classList.add('selected');
            selectedColor = option.dataset.color;
            colorPicker.value = selectedColor;
        });
    });

    // Configurar seletor de cor personalizada
    colorPicker.addEventListener('input', (event) => {
        colorOptions.forEach(opt => opt.classList.remove('selected'));
        colorPicker.classList.add('selected');
        selectedColor = event.target.value;
    });

    // Seleciona a primeira cor por padrão
    colorOptions[0].classList.add('selected');

    // Abrir popup
    newBoardBtn.addEventListener('click', (e) => {
        e.preventDefault();
        popupOverlay.style.display = 'flex';
        popupOverlay.classList.add('active');
    });

    // Fechar popup
    closePopupBtn.addEventListener('click', () => {
        popupOverlay.style.display = 'none';
        popupOverlay.classList.remove('active');
        limparCampos();
    });

    // Criar quadro
    createBoardBtn.addEventListener('click', async () => {
        const nome = document.getElementById('boardName').value;
        const descricao = document.getElementById('boardDescription').value;

        if (!nome.trim()) {
            alert('Por favor, insira um nome para o quadro');
            return;
        }

        try {
            const response = await requests.CreateBoard({
                Name: nome,
                Description: descricao,
                Color: selectedColor
            });

            if (response.ok) {
                alert('Quadro criado com sucesso!');
                popupOverlay.style.display = 'none';
                popupOverlay.classList.remove('active');
                limparCampos();
                window.location.reload();
            } else {
                alert('Erro ao criar o quadro: ' + (response.data?.Message || 'Erro desconhecido'));
            }
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao criar o quadro: ' + error.message);
        }
    });
});

// Escuta o evento de recarregar quadros
document.addEventListener('loadBoards', async () => {
    try {
        const boards = await requests.GetBoards();
        document.dispatchEvent(new CustomEvent('boardsUpdated', { detail: boards }));
    } catch (error) {
        console.error('Erro ao recarregar quadros:', error);
    }
}); 
