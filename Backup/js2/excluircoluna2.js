import requests from './api.js';

window.handleDeleteColumn = async function(event) {
    event.stopPropagation();
    
    // Encontra o botão mesmo se o clique for no SVG ou path
    const button = event.target.closest('.delete-column-btn');
    console.log('Botão encontrado:', button); // Debug
    
    // Verifica se o botão foi encontrado
    if (!button) {
        console.error('Botão de excluir não encontrado');
        return;
    }

    const columnId = button.getAttribute('data-column-id');
    console.log('Tentando excluir coluna com ID:', columnId); // Debug

    try {
        const overlay = document.getElementById('excluirColunaOverlay');
        const closeBtn = document.getElementById('closeExcluirColunaBtn');
        const cancelBtn = document.getElementById('cancelExcluirColunaBtn');
        const confirmBtn = document.getElementById('confirmExcluirColunaBtn');

        if (!overlay || !closeBtn || !cancelBtn || !confirmBtn) {
            throw new Error('Elementos do popup não encontrados');
        }

        const closePopup = () => {
            overlay.style.display = 'none';
            overlay.classList.remove('active');
        };

        closeBtn.addEventListener('click', closePopup);
        cancelBtn.addEventListener('click', closePopup);

        confirmBtn.addEventListener('click', async () => {
            try {
                if (!columnId) {
                    throw new Error('ID da coluna não encontrado');
                }
                await requests.DeleteColumn(columnId);
                closePopup();

                // Recarrega o quadro atual
                const activeBoard = document.querySelector('.board-item.active');
                if (activeBoard) {
                    activeBoard.click();
                }
            } catch (error) {
                console.error('Erro ao excluir coluna:', error);
                alert('Erro ao excluir a coluna. Por favor, tente novamente.');
            }
        });

        // Mostra o popup
        overlay.style.display = 'flex';
        overlay.classList.add('active');

    } catch (error) {
        console.error('Erro ao abrir popup de exclusão:', error);
    }
} 