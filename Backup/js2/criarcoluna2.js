import requests from './api.js';

window.handleCreateColumn = async function(boardId) {
    try {
        const overlay = document.getElementById('criarColunaOverlay');
        const closeBtn = document.getElementById('closeCriarColunaBtn');
        const cancelBtn = document.getElementById('cancelCriarColunaBtn');
        const saveBtn = document.getElementById('saveCriarColunaBtn');
        const nameInput = document.getElementById('newColumnName');
        
        if (!overlay || !closeBtn || !saveBtn || !cancelBtn || !nameInput) {
            throw new Error('Elementos do formulário não encontrados');
        }

        // Remove event listeners antigos clonando os botões
        const newCloseBtn = closeBtn.cloneNode(true);
        const newCancelBtn = cancelBtn.cloneNode(true);
        const newSaveBtn = saveBtn.cloneNode(true);
        
        closeBtn.parentNode.replaceChild(newCloseBtn, closeBtn);
        cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);
        saveBtn.parentNode.replaceChild(newSaveBtn, saveBtn);
        
        const closePopup = () => {
            overlay.style.display = 'none';
            overlay.classList.remove('active');
            nameInput.value = '';  // Limpa o input
        };
        
        // Adiciona novos event listeners
        newCloseBtn.addEventListener('click', closePopup);
        newCancelBtn.addEventListener('click', closePopup);
        
        newSaveBtn.addEventListener('click', async () => {
            try {
                const columnName = nameInput.value.trim();
                if (!columnName) {
                    alert('Por favor, insira um nome para a coluna');
                    return;
                }
                
                const columnData = {
                    Id: 0,
                    Name: columnName,
                    BoardId: parseInt(boardId),
                    IsActive: true,
                    Position: 0
                };
                
                await requests.CreateColumn(columnData);
                closePopup();
                
                // Recarrega o quadro atual
                const activeBoard = document.querySelector('.board-item.active');
                if (activeBoard) {
                    activeBoard.click();
                }
            } catch (error) {
                console.error('Erro ao criar coluna:', error);
                alert('Erro ao criar a coluna. Por favor, tente novamente.');
            }
        });
        
        // Mostra o popup
        overlay.style.display = 'flex';
        overlay.classList.add('active');
        
        // Foca no input
        nameInput.focus();
        
    } catch (error) {
        console.error('Erro ao abrir popup de criação:', error);
    }
} 