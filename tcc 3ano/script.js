document.addEventListener('DOMContentLoaded', function() {
    // Variáveis globais
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    let currentPage = 1;
    const ordersPerPage = 10;
    
    // Elementos do DOM
    const ordersTable = document.getElementById('ordersTable').getElementsByTagName('tbody')[0];
    const newOrderBtn = document.getElementById('newOrderBtn');
    const orderModal = document.getElementById('orderModal');
    const closeModal = document.querySelector('.close');
    const cancelBtn = document.getElementById('cancelBtn');
    const orderForm = document.getElementById('orderForm');
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const statusFilter = document.getElementById('statusFilter');
    const dateFilter = document.getElementById('dateFilter');
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    const pageInfo = document.getElementById('pageInfo');
    const openCount = document.getElementById('openCount');
    const progressCount = document.getElementById('progressCount');
    const completedCount = document.getElementById('completedCount');
    
    // Inicialização
    renderOrders();
    updateStats();
    updatePagination();
    
    // Event Listeners
    newOrderBtn.addEventListener('click', () => openModal());
    closeModal.addEventListener('click', () => closeModalFunc());
    cancelBtn.addEventListener('click', () => closeModalFunc());
    orderForm.addEventListener('submit', handleFormSubmit);
    searchBtn.addEventListener('click', applyFilters);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') applyFilters();
    });
    statusFilter.addEventListener('change', applyFilters);
    dateFilter.addEventListener('change', applyFilters);
    prevPageBtn.addEventListener('click', goToPrevPage);
    nextPageBtn.addEventListener('click', goToNextPage);
    
    // Funções
    function renderOrders(filteredOrders = orders) {
        ordersTable.innerHTML = '';
        
        const startIndex = (currentPage - 1) * ordersPerPage;
        const endIndex = startIndex + ordersPerPage;
        const paginatedOrders = filteredOrders.slice(startIndex, endIndex);
        
        if (paginatedOrders.length === 0) {
            const row = ordersTable.insertRow();
            const cell = row.insertCell();
            cell.colSpan = 6;
            cell.textContent = 'Nenhuma ordem de serviço encontrada';
            cell.style.textAlign = 'center';
            return;
        }
        
        paginatedOrders.forEach(order => {
            const row = ordersTable.insertRow();
            
            row.insertCell().textContent = order.id;
            row.insertCell().textContent = order.clientName;
            row.insertCell().textContent = formatDate(order.date);
            
            const statusCell = row.insertCell();
            const statusSpan = document.createElement('span');
            statusSpan.className = `status ${order.status}`;
            statusSpan.textContent = getStatusText(order.status);
            statusCell.appendChild(statusSpan);
            
            row.insertCell().textContent = order.technician;
            
            const actionsCell = row.insertCell();
            const actionsDiv = document.createElement('div');
            actionsDiv.className = 'action-buttons';
            
            const editBtn = document.createElement('button');
            editBtn.className = 'btn-primary btn-sm';
            editBtn.innerHTML = '<i class="fas fa-edit"></i>';
            editBtn.title = 'Editar';
            editBtn.addEventListener('click', () => openModal(order.id));
            
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'btn-danger btn-sm';
            deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
            deleteBtn.title = 'Excluir';
            deleteBtn.addEventListener('click', () => deleteOrder(order.id));
            
            actionsDiv.appendChild(editBtn);
            actionsDiv.appendChild(deleteBtn);
            actionsCell.appendChild(actionsDiv);
        });
    }
    
    function openModal(orderId = null) {
        const modalTitle = document.getElementById('modalTitle');
        const orderIdInput = document.getElementById('orderId');
        
        if (orderId) {
            // Modo edição
            modalTitle.textContent = 'Editar Ordem de Serviço';
            const order = orders.find(o => o.id === orderId);
            
            if (order) {
                orderIdInput.value = order.id;
                document.getElementById('clientName').value = order.clientName;
                document.getElementById('clientPhone').value = order.clientPhone || '';
                document.getElementById('clientEmail').value = order.clientEmail || '';
                document.getElementById('equipment').value = order.equipment;
                document.getElementById('problem').value = order.problem;
                document.getElementById('diagnosis').value = order.diagnosis || '';
                document.getElementById('solution').value = order.solution || '';
                document.getElementById('technician').value = order.technician;
                document.getElementById('status').value = order.status;
                document.getElementById('price').value = order.price || '';
            }
        } else {
            // Modo criação
            modalTitle.textContent = 'Nova Ordem de Serviço';
            orderForm.reset();
            orderIdInput.value = '';
            document.getElementById('status').value = 'aberto';
            
            // Definir data atual como padrão
            const today = new Date().toISOString().split('T')[0];
            document.getElementById('date').value = today;
        }
        
        orderModal.style.display = 'block';
    }
    
    function closeModalFunc() {
        orderModal.style.display = 'none';
    }
    
    function handleFormSubmit(e) {
        e.preventDefault();
        
        const orderId = document.getElementById('orderId').value;
        const clientName = document.getElementById('clientName').value;
        const clientPhone = document.getElementById('clientPhone').value;
        const clientEmail = document.getElementById('clientEmail').value;
        const equipment = document.getElementById('equipment').value;
        const problem = document.getElementById('problem').value;
        const diagnosis = document.getElementById('diagnosis').value;
        const solution = document.getElementById('solution').value;
        const technician = document.getElementById('technician').value;
        const status = document.getElementById('status').value;
        const price = document.getElementById('price').value;
        
        const orderData = {
            clientName,
            clientPhone,
            clientEmail,
            equipment,
            problem,
            diagnosis,
            solution,
            technician,
            status,
            price: parseFloat(price) || 0,
            date: new Date().toISOString()
        };
        
        if (orderId) {
            // Atualizar ordem existente
            const index = orders.findIndex(o => o.id === orderId);
            if (index !== -1) {
                orderData.id = orderId;
                orders[index] = orderData;
            }
        } else {
            // Criar nova ordem
            orderData.id = generateOrderId();
            orders.unshift(orderData); // Adiciona no início do array
        }
        
        saveOrders();
        renderOrders();
        updateStats();
        closeModalFunc();
    }
    
    function generateOrderId() {
        const now = new Date();
        const year = now.getFullYear().toString().slice(-2);
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');
        const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        
        return `${year}${month}${day}-${randomNum}`;
    }
    
    function deleteOrder(orderId) {
        if (confirm('Tem certeza que deseja excluir esta ordem de serviço?')) {
            orders = orders.filter(order => order.id !== orderId);
            saveOrders();
            renderOrders();
            updateStats();
            
            // Ajustar a página atual se necessário
            const totalPages = Math.ceil(orders.length / ordersPerPage);
            if (currentPage > totalPages && totalPages > 0) {
                currentPage = totalPages;
                updatePagination();
            }
        }
    }
    
    function saveOrders() {
        localStorage.setItem('orders', JSON.stringify(orders));
    }
    
    function applyFilters() {
        const searchTerm = searchInput.value.toLowerCase();
        const statusFilterValue = statusFilter.value;
        const dateFilterValue = dateFilter.value;
        
        let filtered = orders;
        
        if (searchTerm) {
            filtered = filtered.filter(order => 
                order.clientName.toLowerCase().includes(searchTerm) ||
                order.equipment.toLowerCase().includes(searchTerm) ||
                order.id.toLowerCase().includes(searchTerm)
            )
        }
        
        if (statusFilterValue !== 'all') {
            filtered = filtered.filter(order => order.status === statusFilterValue);
        }
        
        if (dateFilterValue) {
            filtered = filtered.filter(order => {
                const orderDate = new Date(order.date).toISOString().split('T')[0];
                return orderDate === dateFilterValue;
            });
        }
        
        currentPage = 1;
        updatePagination(filtered);
        renderOrders(filtered);
    }
    
    function updateStats() {
        const openOrders = orders.filter(o => o.status === 'aberto').length;
        const progressOrders = orders.filter(o => o.status === 'andamento').length;
        const completedOrders = orders.filter(o => o.status === 'concluido').length;
        
        openCount.textContent = openOrders;
        progressCount.textContent = progressOrders;
        completedCount.textContent = completedOrders;
    }
    
    function updatePagination(filteredOrders = orders) {
        const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
        pageInfo.textContent = `${currentPage}/${totalPages || 1}`;
        
        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = currentPage === totalPages || totalPages === 0;
    }
    
    function goToPrevPage() {
        if (currentPage > 1) {
            currentPage--;
            updatePagination();
            renderOrders();
        }
    }
    
    function goToNextPage() {
        const totalPages = Math.ceil(orders.length / ordersPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            updatePagination();
            renderOrders();
        }
    }
    
    function formatDate(dateString) {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('pt-BR', options);
    }
    
    function getStatusText(status) {
        const statusTexts = {
            'aberto': 'Aberto',
            'andamento': 'Em andamento',
            'concluido': 'Concluído',
            'cancelado': 'Cancelado'
        };
        return statusTexts[status] || status;
    }
    
    // Fechar modal ao clicar fora dele
    window.addEventListener('click', (e) => {
        if (e.target === orderModal) {
            closeModalFunc();
        }
    });
});