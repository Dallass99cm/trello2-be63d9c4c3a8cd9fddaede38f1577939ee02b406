const BASE_URL = 'https://personal-ga2xwx9j.outsystemscloud.com/TaskBoard_CS/rest/TaskBoard';

const requests = {
    GetColumnsByBoardId: async (boardId) => {
        const response = await fetch(`${BASE_URL}/ColumnByBoardId?BoardId=${boardId}`);
        return await response.json();
    },
    GetBoards: async () => {
        const response = await fetch(`${BASE_URL}/Boards`);
        return await response.json();
    },
    CreateBoard: async (boardData) => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const userId = user?.id;

            if (!userId) {
                throw new Error('Usuário não encontrado. Por favor, faça login novamente.');
            }

            const formattedData = {
                Id: 0,
                Name: boardData.Name,
                Description: boardData.Description || "",
                Color: boardData.Color,
                IsActive: true,
                Position: boardData.Position || 0,
                PersonId: userId,
                CreatedBy: userId
            };

            console.log('Dados formatados:', formattedData);

            const response = await fetch(`${BASE_URL}/Board`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formattedData)
            });

            const responseData = await response.json();

            if (!response.ok) {
                console.error('Erro detalhado:', {
                    status: response.status,
                    statusText: response.statusText,
                    errorData: responseData
                });
                return { ok: false, data: responseData };
            }

            return { ok: true, data: responseData };
        } catch (error) {
            console.error('Erro ao criar quadro:', error);
            throw error;
        }
    },
    UpdateBoard: async (boardData) => {
        const response = await fetch(`${BASE_URL}/Board`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(boardData)
        });
        return response;
    },
    DeleteBoard: async (boardId) => {
        const response = await fetch(`${BASE_URL}/Board?BoardId=${boardId}`, {
            method: 'DELETE'
        });
        return response;
    },
    GetBoardById: async (boardId) => {
        const response = await fetch(`${BASE_URL}/Board?BoardId=${boardId}`);
        return await response.json();
    },
    GetTasksByColumnId: async (columnId) => {
        const response = await fetch(`${BASE_URL}/TasksByColumnId?ColumnId=${columnId}`);
        return await response.json();
    },
    UpdateColumn: async (columnData) => {
        try {
            console.log('Enviando requisição PUT para atualizar coluna:', columnData);
            
            const response = await fetch(`${BASE_URL}/Column`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(columnData)
            });

            console.log('Status da resposta:', response.status);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Erro ao atualizar coluna:', {
                    status: response.status,
                    text: errorText
                });
                throw new Error(`Falha ao atualizar coluna: ${errorText}`);
            }

            // Tenta ler o corpo da resposta
            const responseText = await response.text();
            console.log('Resposta da API:', responseText);

            return true;
        } catch (error) {
            console.error('Erro ao atualizar coluna:', error);
            throw error;
        }
    },
    DeleteColumn: async (columnId) => {
        try {
            console.log('API: Tentando excluir coluna:', columnId);
            const response = await fetch(`${BASE_URL}/Column?ColumnId=${columnId}`, {
                method: 'DELETE'
            });
            
            if (!response.ok) {
                throw new Error('Falha ao excluir coluna');
            }
            
            return true;
        } catch (error) {
            console.error('Erro ao excluir coluna:', error);
            throw error;
        }
    },
    CreateColumn: async (columnData) => {
        try {
            const response = await fetch(`${BASE_URL}/Column`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(columnData)
            });
            
            if (!response.ok) {
                throw new Error('Falha ao criar coluna');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Erro ao criar coluna:', error);
            throw error;
        }
    }
};

export default requests;