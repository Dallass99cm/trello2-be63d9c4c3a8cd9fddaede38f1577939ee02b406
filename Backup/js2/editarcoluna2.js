import requests from './api.js';

window.handleEditColumn = async function(event) {
    event.preventDefault();
    event.stopPropagation();
    
    const button = event.target.closest('.edit-column-btn');
    if (!button) {
        console.error('Botão de editar não encontrado');
        return;
    }

    const columnId = button.getAttribute('data-id');
    const columnElement = button.closest('.column');
    const columnName = columnElement.querySelector('h3').textContent.trim().replace(/\d+/g, '').trim();
    const boardId = document.querySelector('.board-panel').dataset.boardId;

    try {
        const overlay = document.getElementById('editarColunaOverlay');
        const closeBtn = document.getElementById('closeEditarColunaBtn');
        const cancelBtn = document.getElementById('cancelEditColumnBtn');
        const saveBtn = document.getElementById('saveColumnBtn');
        const nameInput = document.getElementById('columnName');

        if (!overlay || !closeBtn || !saveBtn || !cancelBtn || !nameInput) {
            throw new Error('Elementos do formulário não encontrados');
        }

        nameInput.value = columnName;

        const closePopup = () => {
            overlay.style.display = 'none';
            overlay.classList.remove('active');
        };

        closeBtn.onclick = closePopup;
        cancelBtn.onclick = closePopup;
        
        saveBtn.onclick = async () => {
            try {
                const newName = nameInput.value.trim();
                if (!newName) {
                    alert('Por favor, insira um nome para a coluna');
                    return;
                }

                const columnData = {
                    Id: parseInt(columnId),
                    Name: newName,
                    BoardId: parseInt(boardId),
                    IsActive: true,
                    Position: parseInt(columnElement.dataset.position || '0')
                };

                console.log('Tentando atualizar coluna com dados:', columnData);
                
                try {
                    await requests.UpdateColumn(columnData);
                    console.log('Coluna atualizada com sucesso');
                    closePopup();

                    console.log('Recarregando quadro...');
                    const activeBoard = document.querySelector('.board-item.active');
                    if (activeBoard) {
                        activeBoard.click();
                    } else {
                        console.error('Quadro ativo não encontrado');
                    }
                } catch (updateError) {
                    console.error('Erro ao atualizar coluna:', updateError);
                    throw updateError;
                }
            } catch (error) {
                console.error('Erro ao salvar coluna:', error);
                alert('Erro ao salvar as alterações');
            }
        };

        overlay.style.display = 'flex';
        overlay.classList.add('active');
        nameInput.focus();

    } catch (error) {
        console.error('Erro ao editar coluna:', error);
        alert('Erro ao carregar o formulário de edição');
    }
} 