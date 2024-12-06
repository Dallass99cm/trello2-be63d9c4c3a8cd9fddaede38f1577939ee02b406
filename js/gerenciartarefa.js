import requests from './api.js';

export async function handleManageTask(event, columnId, taskId = null) {
    event.preventDefault();
    event.stopPropagation();

    // Captura todos os elementos necessários
    const elements = {
        overlay: document.getElementById('gerenciarTarefaOverlay'),
        titleElement: document.getElementById('gerenciarTarefaTitle'),
        closeBtn: document.getElementById('closeGerenciarTarefaBtn'),
        cancelBtn: document.getElementById('cancelGerenciarTarefaBtn'),
        saveBtn: document.getElementById('saveTaskBtn'),
        titleInput: document.getElementById('taskTitle'),
        descriptionInput: document.getElementById('taskDescription'),
        prioritySelect: document.getElementById('taskPriority'),
        dueDateInput: document.getElementById('taskDueDate')
    };

    // Verifica se todos os elementos foram encontrados
    for (const [key, element] of Object.entries(elements)) {
        if (!element) {
            console.error(`Elemento ${key} não encontrado`);
            return;
        }
    }

    const closePopup = () => {
        elements.overlay.style.display = 'none';
        elements.overlay.classList.remove('active');
        elements.titleInput.value = '';
        elements.descriptionInput.value = '';
        elements.prioritySelect.value = '1';
        elements.dueDateInput.value = '';
    };

    elements.closeBtn.onclick = closePopup;
    elements.cancelBtn.onclick = closePopup;

    // Se tiver taskId, é edição
    if (taskId && taskId > 0) {
        elements.titleElement.textContent = 'Editar Tarefa';
        
        try {
            const taskElement = event.target.closest('.task-menu-item');
            const taskData = {
                Title: taskElement.dataset.title,
                Description: taskElement.dataset.description,
                Priority: taskElement.dataset.priority,
                DueDate: taskElement.dataset.dueDate
            };

            elements.titleInput.value = taskData.Title;
            elements.descriptionInput.value = taskData.Description;
            elements.prioritySelect.value = taskData.Priority;
            elements.dueDateInput.value = taskData.DueDate ? taskData.DueDate.split('T')[0] : '';
        } catch (error) {
            console.error('Erro ao carregar dados da tarefa:', error);
            closePopup();
            return;
        }
    } else {
        elements.titleElement.textContent = 'Nova Tarefa';
    }

    elements.saveBtn.onclick = async () => {
        const title = elements.titleInput.value.trim();
        if (!title) {
            alert('Por favor, insira um título para a tarefa');
            return;
        }

        const taskData = {
            Id: taskId || 0,
            Title: title,
            Description: elements.descriptionInput.value.trim(),
            Priority: parseInt(elements.prioritySelect.value),
            DueDate: elements.dueDateInput.value,
            ColumnId: parseInt(columnId),
            IsActive: true
        };

        try {
            if (taskId) {
                await requests.UpdateTask(taskData);
            } else {
                await requests.CreateTask(taskData);
            }
            
            closePopup();
            
            const activeBoard = document.querySelector('.board-item.active');
            if (activeBoard) {
                activeBoard.click();
            }
        } catch (error) {
            console.error('Erro ao salvar tarefa:', error);
            alert('Erro ao salvar a tarefa');
        }
    };

    // Exibe o popup apenas se todos os elementos foram encontrados
    elements.overlay.style.display = 'flex';
    elements.overlay.classList.add('active');
    elements.titleInput.focus();
}

export function handleTaskMenu(event, button) {
    event.preventDefault();
    event.stopPropagation();

    // Fecha todos os outros menus abertos
    document.querySelectorAll('.task-menu.active').forEach(menu => {
        if (menu !== button.nextElementSibling) {
            menu.classList.remove('active');
        }
    });

    // Toggle do menu atual
    const menu = button.nextElementSibling;
    menu.classList.toggle('active');

    // Fecha o menu quando clicar fora dele
    const closeMenu = (e) => {
        if (!menu.contains(e.target) && !button.contains(e.target)) {
            menu.classList.remove('active');
            document.removeEventListener('click', closeMenu);
        }
    };

    document.addEventListener('click', closeMenu);
}

export async function handleDeleteTask(event, taskId) {
    event.preventDefault();
    event.stopPropagation();

    if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
        try {
            await requests.DeleteTask(taskId);
            
            const activeBoard = document.querySelector('.board-item.active');
            if (activeBoard) {
                activeBoard.click();
            }
        } catch (error) {
            console.error('Erro ao excluir tarefa:', error);
            alert('Erro ao excluir a tarefa');
        }
    }
}