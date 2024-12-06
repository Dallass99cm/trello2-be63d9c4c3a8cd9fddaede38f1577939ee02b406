import requests from './api.js';
import { handleManageTask, handleTaskMenu, handleDeleteTask } from './gerenciartarefa.js';

// Captura elementos do DOM
const themeBtn = document.getElementById('themeBtn');
const logoutBtn = document.getElementById('logoutBtn');
const searchInput = document.getElementById('searchInput');
const boardsList = document.getElementById('boardsList');
const newBoardBtn = document.getElementById('newBoardBtn');

// Variável global para armazenar os quadros
let boards = [];

// Função para carregar os quadros
async function loadBoards() {
    try {
        const response = await requests.GetBoards();
        console.log('Quadros carregados:', response);
        boards = response;
        renderBoards(boards);
    } catch (error) {
        console.error('Erro ao carregar quadros:', error);
    }
}

// Função para renderizar os quadros com estrutura em árvore
async function renderBoards(boardsToShow) {
    boardsList.innerHTML = '';
    
    for (const board of boardsToShow) {
        const boardContainer = document.createElement('div');
        boardContainer.className = 'board-container';
        
        const boardElement = document.createElement('div');
        boardElement.className = 'board-item';
        boardElement.innerHTML = `
            <img src="images/folder-closed.png" alt="Pasta" class="folder-icon">
            <span>${board.Name}</span>
        `;
        
        boardElement.addEventListener('click', async () => {
            try {
                // Remove active de outros quadros
                document.querySelectorAll('.board-item').forEach(item => {
                    item.classList.remove('active');
                    item.querySelector('.folder-icon').src = 'images/folder-closed.png';
                });
                
                // Atualiza o estado do quadro atual
                boardElement.classList.add('active');
                boardElement.querySelector('.folder-icon').src = 'images/folder-open.png';
                
                // Carrega as colunas
                const columns = await requests.GetColumnsByBoardId(board.Id);
                const taskDetailsArea = document.getElementById('taskDetailsArea');
                
                const columnsHTML = await Promise.all(columns.map(async col => {
                    const tasks = await requests.GetTasksByColumnId(col.Id);
                    return `
                        <div class="column" data-position="${col.Position || 0}">
                            <div class="column-header">
                                <h3>
                                    ${col.Name}
                                    <span class="task-count">${tasks.length}</span>
                                </h3>
                                <div class="column-actions">
                                    <button class="edit-column-btn" data-id="${col.Id}" data-name="${col.Name}" data-board-id="${board.Id}">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                        </svg>
                                        Editar
                                    </button>
                                    <button class="delete-column-btn" data-column-id="${col.Id}">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <path d="M3 6h18"></path>
                                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
                                            <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                        </svg>
                                        Excluir
                                    </button>
                                </div>
                            </div>
                            <div class="column-tasks">
                                ${tasks.map(task => `
                                    <div class="task">
                                        <div class="task-header">
                                            <h4>${task.Title}</h4>
                                            <div style="position: relative;">
                                                <button class="edit-task-btn" type="button">
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                        <circle cx="12" cy="12" r="1" />
                                                        <circle cx="12" cy="5" r="1" />
                                                        <circle cx="12" cy="19" r="1" />
                                                    </svg>
                                                </button>
                                                <div class="task-menu">
                                                    <div class="task-menu-item edit-task" 
                                                        data-column-id="${col.Id}"
                                                        data-task-id="${task.Id}"
                                                        data-title="${task.Title}"
                                                        data-description="${task.Description || ''}"
                                                        data-priority="${task.Priority || 1}"
                                                        data-due-date="${task.DueDate || ''}"
                                                    >
                                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                                        </svg>
                                                        Editar
                                                    </div>
                                                    <div class="task-menu-item delete-task" 
                                                        data-column-id="${col.Id}"
                                                        data-task-id="${task.Id}"
                                                    >
                                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                            <path d="M3 6h18"></path>
                                                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
                                                            <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                        </svg>
                                                        Excluir
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        ${task.Description ? `<p class="task-description">${task.Description}</p>` : ''}
                                        <div class="task-footer">
                                            <span class="priority priority-${task.Priority || 1}"></span>
                                            ${task.DueDate ? `<span class="due-date">${new Date(task.DueDate).toLocaleDateString()}</span>` : ''}
                                        </div>
                                    </div>
                                `).join('')}
                                <button class="add-task-btn" onclick="handleManageTask(event, ${col.Id})">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M12 5v14"></path>
                                        <path d="M5 12h14"></path>
                                    </svg>
                                    Adicionar um Cartão
                                </button>
                            </div>
                        </div>
                    `;
                }));
                
                taskDetailsArea.innerHTML = `
                    <div class="board-panel" data-board-id="${board.Id}">
                        <div class="board-panel-header">
                            <h2>
                                <img src="images/folder-open.png" alt="Pasta" class="folder-icon">
                                ${board.Name}
                            </h2>
                            <div class="board-actions">
                                <button class="delete-board-btn" data-board-id="${board.Id}">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M3 6h18"></path>
                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
                                        <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                    </svg>
                                    Excluir Quadro
                                </button>
                                <button class="add-column-btn" data-board-id="${board.Id}">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M12 5v14"></path>
                                        <path d="M5 12h14"></path>
                                    </svg>
                                    Nova Coluna
                                </button>
                            </div>
                        </div>
                        <div class="columns-container">
                            ${columnsHTML.join('')}
                        </div>
                    </div>
                `;
                
                taskDetailsArea.classList.remove('hidden');
                
                // Adiciona event listeners para os botões
                document.querySelectorAll('.edit-column-btn').forEach(button => {
                    button.addEventListener('click', (event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        
                        const columnId = button.dataset.id;
                        const columnName = button.dataset.name;
                        const boardId = button.dataset.boardId;
                        
                        const overlay = document.getElementById('editarColunaOverlay');
                        const nameInput = document.getElementById('editColumnName');
                        const saveBtn = document.getElementById('saveColumnBtn');
                        const closeBtn = document.getElementById('closeEditarColunaBtn');
                        const cancelBtn = document.getElementById('cancelEditColumnBtn');
                        
                        const closePopup = () => {
                            overlay.style.display = 'none';
                            overlay.classList.remove('active');
                            nameInput.value = '';
                        };
                        
                        // Adiciona event listeners para fechar o popup
                        closeBtn.onclick = closePopup;
                        cancelBtn.onclick = closePopup;
                        
                        nameInput.value = columnName;
                        overlay.style.display = 'flex';
                        overlay.classList.add('active');
                        nameInput.focus();
                        
                        saveBtn.onclick = async () => {
                            const newName = nameInput.value.trim();
                            if (!newName) {
                                alert('Por favor, insira um nome para a coluna');
                                return;
                            }
                            
                            try {
                                await requests.UpdateColumn({
                                    Id: parseInt(columnId),
                                    Name: newName,
                                    BoardId: parseInt(boardId),
                                    IsActive: true,
                                    Position: 0
                                });
                                
                                overlay.style.display = 'none';
                                overlay.classList.remove('active');
                                
                                const activeBoard = document.querySelector('.board-item.active');
                                if (activeBoard) {
                                    activeBoard.click();
                                }
                            } catch (error) {
                                console.error('Erro ao salvar:', error);
                                alert('Erro ao salvar as alterações');
                            }
                        };
                    });
                });
                
                // Adiciona event listeners para os botões de excluir
                document.querySelectorAll('.delete-column-btn').forEach(button => {
                    button.addEventListener('click', handleDeleteColumn);
                });
                
                const addColumnBtn = taskDetailsArea.querySelector('.add-column-btn');
                if (addColumnBtn) {
                    addColumnBtn.addEventListener('click', () => {
                        const boardId = addColumnBtn.getAttribute('data-board-id');
                        handleCreateColumn(boardId);
                    });
                }
                
                // Após renderizar o conteúdo
                document.querySelectorAll('.edit-task-btn').forEach(button => {
                    button.onclick = (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        
                        // Fecha todos os outros menus
                        document.querySelectorAll('.task-menu.active').forEach(menu => {
                            if (menu !== button.nextElementSibling) {
                                menu.classList.remove('active');
                            }
                        });
                        
                        // Toggle do menu atual
                        const menu = button.nextElementSibling;
                        menu.classList.toggle('active');
                    };
                });
                
                document.querySelectorAll('.edit-task').forEach(item => {
                    item.onclick = (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        
                        const columnId = item.dataset.columnId;
                        const taskId = item.dataset.taskId;
                        handleManageTask(e, columnId, taskId);
                    };
                });
                
                // Fecha o menu quando clicar fora
                document.addEventListener('click', (e) => {
                    if (!e.target.closest('.edit-task-btn') && !e.target.closest('.task-menu')) {
                        document.querySelectorAll('.task-menu.active').forEach(menu => {
                            menu.classList.remove('active');
                        });
                    }
                });
                
                // Após renderizar o conteúdo do board
                const deleteBoardBtn = taskDetailsArea.querySelector('.delete-board-btn');
                if (deleteBoardBtn) {
                    deleteBoardBtn.addEventListener('click', async () => {
                        const boardId = deleteBoardBtn.getAttribute('data-board-id');
                        
                        if (confirm('Tem certeza que deseja excluir este quadro? Todas as colunas e tarefas serão excluídas permanentemente.')) {
                            try {
                                await requests.DeleteBoard(boardId);
                                
                                // Limpa a área de detalhes
                                taskDetailsArea.innerHTML = '';
                                taskDetailsArea.classList.add('hidden');
                                
                                // Remove o quadro da lista
                                const boardItem = document.querySelector(`.board-item[data-board-id="${boardId}"]`);
                                if (boardItem) {
                                    boardItem.closest('.board-container').remove();
                                }
                                
                                // Recarrega a lista de quadros
                                loadBoards();
                            } catch (error) {
                                console.error('Erro ao excluir quadro:', error);
                                alert('Erro ao excluir o quadro');
                            }
                        }
                    });
                }
                
                // Adicione este trecho após o código que adiciona os event listeners existentes
                document.querySelectorAll('.delete-task').forEach(item => {
                    item.onclick = async (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        
                        const taskId = item.dataset.taskId;
                        
                        if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
                            try {
                                await requests.DeleteTask(taskId);
                                
                                // Recarrega o quadro atual
                                const activeBoard = document.querySelector('.board-item.active');
                                if (activeBoard) {
                                    activeBoard.click();
                                }
                            } catch (error) {
                                console.error('Erro ao excluir tarefa:', error);
                                alert('Erro ao excluir a tarefa');
                            }
                        }
                    };
                });
                
            } catch (error) {
                console.error('Erro ao carregar conteúdo do quadro:', error);
            }
        });
        
        boardContainer.appendChild(boardElement);
        boardsList.appendChild(boardContainer);
    }
}

// Função para alternar o tema
function toggleTheme() {
    const body = document.body;
    const isDark = body.classList.toggle('dark');
    themeBtn.textContent = isDark ? '☀️' : '🌙';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// Função para fazer logout
function logout() {
    localStorage.clear();
    window.location.href = 'index.html';
}

// Função para pesquisar quadros
function handleSearch(event) {
    const searchTerm = event.target.value.toLowerCase();
    const filteredBoards = boards.filter(board => 
        board.Name.toLowerCase().includes(searchTerm)
    );
    renderBoards(filteredBoards);
}

// Adiciona os event listeners
themeBtn.addEventListener('click', toggleTheme);
logoutBtn.addEventListener('click', logout);
searchInput.addEventListener('input', handleSearch);

// Carrega o tema inicial
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark');
    themeBtn.textContent = '☀️';
}

// Carrega os quadros ao iniciar
loadBoards();

// Verifica autenticação
if (!localStorage.getItem('user')) {
    window.location.href = 'index.html';
}

// Adicione isso junto com os outros event listeners
document.addEventListener('boardsUpdated', () => {
    loadBoards();
});

// E torne a função loadBoards acessível para outros módulos
export { loadBoards };

// Tornar as funções disponíveis globalmente
window.handleManageTask = handleManageTask;
window.handleTaskMenu = handleTaskMenu;
window.handleDeleteTask = handleDeleteTask;
