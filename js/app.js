const detailClientDisplay = document.getElementById('detail-client');
// Elementos DOM adicionales para el modal de información del cliente
const clientInfoModal = document.getElementById('client-info-modal');
const clientInfoForm = document.getElementById('client-info-form');
const clientNameInput = document.getElementById('client-name');
const clientNotesInput = document.getElementById('client-notes');
const closeClientModalBtn = clientInfoModal.querySelector('.close-modal');

// Datos de ejemplo (simulando una base de datos)
let users = [
    { id: 1, username: 'deliverista1', password: 'password123', role: 'deliverista', name: 'Juan Pérez' },
    { id: 2, username: 'deliverista2', password: 'password123', role: 'deliverista', name: 'María López' },
    { id: 3, username: 'supervisor1', password: 'password123', role: 'supervisor', name: 'Carlos Rodríguez' }
];

let deliveries = [
    // Los datos de entregas se cargarán dinámicamente
];

// Variables globales
let currentUser = null;
let activeDelivery = null;
let mediaStream = null;
let editingUserId = null;

// Elementos DOM
const loginSection = document.getElementById('login-section');
const deliveristaSection = document.getElementById('deliverista-section');
const supervisorSection = document.getElementById('supervisor-section');
const loginForm = document.getElementById('login-form');
const usernameInput = document.getElementById('username-input');
const passwordInput = document.getElementById('password-input');
const roleSelect = document.getElementById('role-select');
const usernameDisplay = document.getElementById('username');
const logoutBtn = document.getElementById('logout-btn');
const startDeliveryBtn = document.getElementById('start-delivery-btn');
const cameraContainer = document.getElementById('camera-container');
const cameraView = document.getElementById('camera-view');
const captureBtn = document.getElementById('capture-btn');
const cancelCaptureBtn = document.getElementById('cancel-capture-btn');
const photoCanvas = document.getElementById('photo-canvas');
const pendingDeliveriesContainer = document.getElementById('pending-deliveries');
const deliveriesTableBody = document.getElementById('deliveries-table-body');
const totalDeliveriesDisplay = document.getElementById('total-deliveries');
const avgTimeDisplay = document.getElementById('avg-time');
const fastestDeliveryDisplay = document.getElementById('fastest-delivery');
const slowestDeliveryDisplay = document.getElementById('slowest-delivery');
const deliveryDetailsModal = document.getElementById('delivery-details-modal');
const closeModalBtn = document.querySelector('.close-modal');
const startTicketImg = document.getElementById('start-ticket-img');
const deliveryLocationImg = document.getElementById('delivery-location-img');
const startTimeDisplay = document.getElementById('start-time');
const endTimeDisplay = document.getElementById('end-time');
const detailDeliveristaDisplay = document.getElementById('detail-deliverista');
const detailRestaurantDisplay = document.getElementById('detail-restaurant');
const detailDurationDisplay = document.getElementById('detail-duration');
const dateFilter = document.getElementById('date-filter');
const deliveristaFilter = document.getElementById('deliverista-filter');
const restaurantFilter = document.getElementById('restaurant-filter');
const applyFiltersBtn = document.getElementById('apply-filters-btn');

// Elementos DOM para gestión de usuarios
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const userForm = document.getElementById('user-form');
const newUsernameInput = document.getElementById('new-username');
const newPasswordInput = document.getElementById('new-password');
const newNameInput = document.getElementById('new-name');
const newRoleSelect = document.getElementById('new-role');
const usersTableBody = document.getElementById('users-table-body');
const editUserModal = document.getElementById('edit-user-modal');
const editUserForm = document.getElementById('edit-user-form');
const editUserIdInput = document.getElementById('edit-user-id');
const editUsernameInput = document.getElementById('edit-username');
const editPasswordInput = document.getElementById('edit-password');
const editNameInput = document.getElementById('edit-name');
const editRoleSelect = document.getElementById('edit-role');
const editModalCloseBtn = editUserModal.querySelector('.close-modal');

// Event listener para el formulario del modal
clientInfoForm.addEventListener('submit', handleClientInfoSubmit);

// Event listener para cerrar el modal sin guardar
closeClientModalBtn.addEventListener('click', () => {
    clientInfoModal.classList.add('hidden');
    clientInfoForm.reset();
    delete window.tempDeliveryData; // Limpiar datos temporales
});

function handleClientInfoSubmit(e) {
    e.preventDefault();
    
    const clientName = clientNameInput.value.trim();
    const clientNotes = clientNotesInput.value.trim();
    const restaurantSelect = document.getElementById('restaurant-select');
    const selectedRestaurant = restaurantSelect.value;
    
    // Validar que se haya ingresado un nombre o referencia
    if (!clientName) {
        alert('Por favor, ingrese un nombre o referencia para el cliente');
        return;
    }
    
    // Crear la nueva entrega con la información del cliente
    const newDelivery = {
        id: generateId(),
        deliveristaId: currentUser.id,
        deliveristaName: currentUser.name,
        restaurant: selectedRestaurant === 'ricos' ? 'Rico\'s' : 'Pizzamía',
        startTime: new Date(),
        endTime: null,
        duration: null,
        startImage: window.tempDeliveryData.startImage,
        endImage: null,
        status: 'pending',
        clientInfo: {
            name: clientName,
            notes: clientNotes
        }
    };
    
    // Agregar a la lista de entregas
    deliveries.push(newDelivery);
    
    // Limpiar datos temporales
    delete window.tempDeliveryData;
    
    // Cerrar el modal
    clientInfoModal.classList.add('hidden');
    
    // Limpiar el formulario
    clientInfoForm.reset();
    
    // Actualizar la interfaz
    loadPendingDeliveries();
    
    // Notificar al usuario
    alert('¡Entrega iniciada correctamente!');
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    // Ocultar secciones excepto login
    showSection('login');
    
    // Event listeners
    loginForm.addEventListener('submit', handleLogin);
    logoutBtn.addEventListener('click', handleLogout);
    startDeliveryBtn.addEventListener('click', startNewDelivery);
    captureBtn.addEventListener('click', capturePhoto);
    cancelCaptureBtn.addEventListener('click', cancelCapture);
    closeModalBtn.addEventListener('click', closeModal);
    applyFiltersBtn.addEventListener('click', applyFilters);
    
    // Event listeners para pestañas
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            switchTab(tabId);
        });
    });
    
    // Event listeners para gestión de usuarios
    userForm.addEventListener('submit', handleCreateUser);
    editUserForm.addEventListener('submit', handleUpdateUser);
    editModalCloseBtn.addEventListener('click', () => {
        editUserModal.classList.add('hidden');
    });
    
    // Establecer fecha actual en el filtro de fecha
    const today = new Date().toISOString().split('T')[0];
    dateFilter.value = today;
    
    // Cargar opciones de deliveristas en el filtro
    loadDeliveristaOptions();
});

// Funciones de navegación
function showSection(section) {
    loginSection.classList.add('hidden-section');
    loginSection.classList.remove('active-section');
    
    deliveristaSection.classList.add('hidden-section');
    deliveristaSection.classList.remove('active-section');
    
    supervisorSection.classList.add('hidden-section');
    supervisorSection.classList.remove('active-section');
    
    switch(section) {
        case 'login':
            loginSection.classList.remove('hidden-section');
            loginSection.classList.add('active-section');
            break;
        case 'deliverista':
            deliveristaSection.classList.remove('hidden-section');
            deliveristaSection.classList.add('active-section');
            loadPendingDeliveries();
            break;
        case 'supervisor':
            supervisorSection.classList.remove('hidden-section');
            supervisorSection.classList.add('active-section');
            loadDeliveriesTable();
            updateDashboardStats();
            loadUsersTable();
            break;
    }
}

function switchTab(tabId) {
    // Desactivar todas las pestañas
    tabButtons.forEach(btn => btn.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active-tab'));
    
    // Activar la pestaña seleccionada
    document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
    document.getElementById(tabId).classList.add('active-tab');
    
    // Cargar datos específicos de la pestaña
    if (tabId === 'users-tab') {
        loadUsersTable();
    } else if (tabId === 'dashboard-tab') {
        loadDeliveriesTable();
        updateDashboardStats();
    }
}

// Autenticación
function handleLogin(e) {
    e.preventDefault();
    
    const username = usernameInput.value;
    const password = passwordInput.value;
    const role = roleSelect.value;
    
    // Validación simple
    if (!username || !password) {
        alert('Por favor, ingrese usuario y contraseña');
        return;
    }
    
    // Buscar usuario
    const user = users.find(u => u.username === username && u.password === password && u.role === role);
    
    if (user) {
        currentUser = user;
        usernameDisplay.textContent = user.name;
        
        // Redirigir según el rol
        if (user.role === 'deliverista') {
            showSection('deliverista');
        } else if (user.role === 'supervisor') {
            showSection('supervisor');
        }
        
        // Limpiar formulario
        loginForm.reset();
    } else {
        alert('Credenciales incorrectas o perfil no autorizado');
    }
}

function handleLogout() {
    currentUser = null;
    usernameDisplay.textContent = 'Usuario no identificado';
    showSection('login');
    
    // Detener la cámara si está activa
    stopCamera();
}

// Funciones del Deliverista
function startNewDelivery() {
    // Mostrar la cámara
    cameraContainer.classList.remove('hidden');
    startCamera();
}

async function startCamera() {
    try {
        mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
        cameraView.srcObject = mediaStream;
    } catch (error) {
        console.error('Error al acceder a la cámara:', error);
        alert('No se pudo acceder a la cámara. Por favor, verifica los permisos.');
    }
}

function stopCamera() {
    if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
        mediaStream = null;
    }
    
    if (cameraView.srcObject) {
        cameraView.srcObject = null;
    }
    
    cameraContainer.classList.add('hidden');
}

function capturePhoto() {
    // Configurar el canvas para capturar la foto
    const context = photoCanvas.getContext('2d');
    photoCanvas.width = cameraView.videoWidth;
    photoCanvas.height = cameraView.videoHeight;
    context.drawImage(cameraView, 0, 0, photoCanvas.width, photoCanvas.height);
    
    // Obtener la imagen como URL de datos
    const photoDataUrl = photoCanvas.toDataURL('image/png');
    
    // Guardar la foto temporalmente en una variable global
    window.tempDeliveryData = {
        startImage: photoDataUrl
    };
    
    // Detener la cámara
    stopCamera();
    
    // Mostrar el modal para ingresar información del cliente
    clientInfoModal.classList.remove('hidden');
}

function cancelCapture() {
    stopCamera();
}

function loadPendingDeliveries() {
    if (!currentUser) return;
    
    const pendingDeliveries = deliveries.filter(d => 
        d.deliveristaId === currentUser.id && d.status === 'pending'
    );
    
    pendingDeliveriesContainer.innerHTML = '';
    
    if (pendingDeliveries.length === 0) {
        pendingDeliveriesContainer.innerHTML = '<p class="empty-message">No hay entregas pendientes</p>';
        return;
    }
    
    pendingDeliveries.forEach(delivery => {
        const deliveryItem = document.createElement('div');
        deliveryItem.className = 'delivery-item';
        
        const startTime = new Date(delivery.startTime);
        const elapsedTime = getElapsedTime(startTime);
        
        deliveryItem.innerHTML = `
            <div class="delivery-info">
                <h4>${delivery.restaurant}</h4>
                <p>Cliente: ${delivery.clientInfo.name}</p>
                <p>Iniciado: ${formatDateTime(startTime)}</p>
                <p>Tiempo transcurrido: ${elapsedTime}</p>
            </div>
            <div class="delivery-actions">
                <button class="btn btn-success finish-delivery-btn" data-id="${delivery.id}">
                    <i class="fas fa-check"></i> Finalizar
                </button>
            </div>
        `;
        
        pendingDeliveriesContainer.appendChild(deliveryItem);
        
        const finishBtn = deliveryItem.querySelector('.finish-delivery-btn');
        finishBtn.addEventListener('click', () => finishDelivery(delivery.id));
    });
}

function finishDelivery(deliveryId) {
    // Buscar la entrega
    const deliveryIndex = deliveries.findIndex(d => d.id === deliveryId);
    
    if (deliveryIndex === -1) {
        alert('Entrega no encontrada');
        return;
    }
    
    activeDelivery = deliveries[deliveryIndex];
    
    // Mostrar la cámara para capturar la foto de finalización
    cameraContainer.classList.remove('hidden');
    startCamera();
    
    // Cambiar el comportamiento del botón de captura
    captureBtn.removeEventListener('click', capturePhoto);
    captureBtn.addEventListener('click', captureEndPhoto);
}

function captureEndPhoto() {
    if (!activeDelivery) return;
    
    // Configurar el canvas para capturar la foto
    const context = photoCanvas.getContext('2d');
    photoCanvas.width = cameraView.videoWidth;
    photoCanvas.height = cameraView.videoHeight;
    context.drawImage(cameraView, 0, 0, photoCanvas.width, photoCanvas.height);
    
    // Obtener la imagen como URL de datos
    const photoDataUrl = photoCanvas.toDataURL('image/png');
    
    // Actualizar la entrega
    const deliveryIndex = deliveries.findIndex(d => d.id === activeDelivery.id);
    
    if (deliveryIndex !== -1) {
        const endTime = new Date();
        const startTime = new Date(deliveries[deliveryIndex].startTime);
        const durationMs = endTime - startTime;
        const durationMinutes = Math.round(durationMs / 60000);
        
        deliveries[deliveryIndex].endTime = endTime;
        deliveries[deliveryIndex].endImage = photoDataUrl;
        deliveries[deliveryIndex].duration = durationMinutes;
        deliveries[deliveryIndex].status = 'completed';
        
        // Actualizar la interfaz
        stopCamera();
        loadPendingDeliveries();
        
        // Restaurar el comportamiento del botón de captura
        captureBtn.removeEventListener('click', captureEndPhoto);
        captureBtn.addEventListener('click', capturePhoto);
        
        // Limpiar la entrega activa
        activeDelivery = null;
        
        // Notificar al usuario
        alert(`¡Entrega finalizada correctamente! Duración: ${durationMinutes} minutos`);
    }
}

// Funciones del Supervisor
function loadDeliveriesTable(filters = {}) {
    if (!currentUser || currentUser.role !== 'supervisor') return;
    
    let filteredDeliveries = [...deliveries];
    
    if (filters.date) {
        const filterDate = new Date(filters.date);
        filterDate.setHours(0, 0, 0, 0); // Establecer a inicio del día
        
        filteredDeliveries = filteredDeliveries.filter(d => {
            const deliveryDate = new Date(d.startTime);
            deliveryDate.setHours(0, 0, 0, 0); // Establecer a inicio del día
            return (
                deliveryDate.getFullYear() === filterDate.getFullYear() &&
                deliveryDate.getMonth() === filterDate.getMonth() &&
                deliveryDate.getDate() === filterDate.getDate()
            );
        });
    }
    
    if (filters.deliverista && filters.deliverista !== 'all') {
        filteredDeliveries = filteredDeliveries.filter(d => d.deliveristaId === parseInt(filters.deliverista));
    }
    
    if (filters.restaurant && filters.restaurant !== 'all') {
        filteredDeliveries = filteredDeliveries.filter(d => {
            const deliveryRestaurant = d.restaurant.toLowerCase();
            // Comparación más flexible para restaurantes
            return deliveryRestaurant.includes(filters.restaurant.toLowerCase()) || 
                   filters.restaurant.toLowerCase().includes(deliveryRestaurant);
        });
    }
    
    deliveriesTableBody.innerHTML = '';
    
    if (filteredDeliveries.length === 0) {
        const emptyRow = document.createElement('tr');
        emptyRow.innerHTML = '<td colspan="8" class="empty-message">No hay entregas para mostrar</td>';
        deliveriesTableBody.appendChild(emptyRow);
        return;
    }
    
    filteredDeliveries.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
    
    filteredDeliveries.forEach(delivery => {
        const row = document.createElement('tr');
        
        const startTime = new Date(delivery.startTime);
        const endTime = delivery.endTime ? new Date(delivery.endTime) : null;
        
        row.innerHTML = `
            <td>${delivery.id}</td>
            <td>${delivery.deliveristaName}</td>
            <td>${delivery.clientInfo.name}</td>
            <td>${delivery.restaurant}</td>
            <td>${formatDateTime(startTime)}</td>
            <td>${endTime ? formatDateTime(endTime) : 'En progreso'}</td>
            <td>${delivery.duration ? `${delivery.duration} min` : 'En progreso'}</td>
            <td>
                <button class="btn btn-primary view-details-btn" data-id="${delivery.id}">
                    <i class="fas fa-eye"></i> Ver
                </button>
            </td>
        `;
        
        deliveriesTableBody.appendChild(row);
        
        const viewBtn = row.querySelector('.view-details-btn');
        viewBtn.addEventListener('click', () => showDeliveryDetails(delivery.id));
    });
    
    updateDashboardStats(filteredDeliveries);
}

function updateDashboardStats(filteredDeliveries = deliveries) {
    // Filtrar solo entregas completadas
    const completedDeliveries = filteredDeliveries.filter(d => d.status === 'completed');
    
    // Total de entregas
    totalDeliveriesDisplay.textContent = completedDeliveries.length;
    
    if (completedDeliveries.length === 0) {
        avgTimeDisplay.textContent = '0 min';
        fastestDeliveryDisplay.textContent = '0 min';
        slowestDeliveryDisplay.textContent = '0 min';
        return;
    }
    
    // Tiempo promedio
    const totalDuration = completedDeliveries.reduce((sum, d) => sum + d.duration, 0);
    const avgDuration = Math.round(totalDuration / completedDeliveries.length);
    avgTimeDisplay.textContent = `${avgDuration} min`;
    
    // Entrega más rápida
    const fastestDelivery = Math.min(...completedDeliveries.map(d => d.duration));
    fastestDeliveryDisplay.textContent = `${fastestDelivery} min`;
    
    // Entrega más lenta
    const slowestDelivery = Math.max(...completedDeliveries.map(d => d.duration));
    slowestDeliveryDisplay.textContent = `${slowestDelivery} min`;
}

function applyFilters() {
    const filters = {
        date: dateFilter.value,
        deliverista: deliveristaFilter.value,
        restaurant: restaurantFilter.value
    };
    
    loadDeliveriesTable(filters);
}

function showDeliveryDetails(deliveryId) {
    const delivery = deliveries.find(d => d.id === deliveryId);
    
    if (!delivery) {
        alert('Entrega no encontrada');
        return;
    }
    
    startTicketImg.src = delivery.startImage;
    deliveryLocationImg.src = delivery.endImage || '';
    startTimeDisplay.textContent = formatDateTime(new Date(delivery.startTime));
    endTimeDisplay.textContent = delivery.endTime ? formatDateTime(new Date(delivery.endTime)) : 'En progreso';
    detailDeliveristaDisplay.textContent = delivery.deliveristaName;
    detailClientDisplay.textContent = delivery.clientInfo.name;
    detailRestaurantDisplay.textContent = delivery.restaurant;
    detailDurationDisplay.textContent = delivery.duration ? `${delivery.duration} minutos` : 'En progreso';
    
    deliveryDetailsModal.classList.remove('hidden');
}

function closeModal() {
    deliveryDetailsModal.classList.add('hidden');
}

// Funciones de gestión de usuarios
function loadUsersTable() {
    if (!currentUser || currentUser.role !== 'supervisor') return;
    
    // Limpiar tabla
    usersTableBody.innerHTML = '';
    
    // Ordenar por ID
    const sortedUsers = [...users].sort((a, b) => a.id - b.id);
    
    // Crear filas para cada usuario
    sortedUsers.forEach(user => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.username}</td>
            <td>${user.name}</td>
            <td>${user.role === 'deliverista' ? 'Deliverista' : 'Supervisor'}</td>
            <td class="user-actions">
                <button class="btn btn-primary edit-user-btn" data-id="${user.id}">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button class="btn btn-danger delete-user-btn" data-id="${user.id}">
                    <i class="fas fa-trash"></i> Eliminar
                </button>
            </td>
        `;
        
        usersTableBody.appendChild(row);
        
        // Agregar event listeners a los botones
        const editBtn = row.querySelector('.edit-user-btn');
        const deleteBtn = row.querySelector('.delete-user-btn');
        
        editBtn.addEventListener('click', () => showEditUserModal(user.id));
        deleteBtn.addEventListener('click', () => handleDeleteUser(user.id));
    });
    
    // Actualizar opciones de deliveristas en el filtro
    loadDeliveristaOptions();
}

function loadDeliveristaOptions() {
    // Obtener deliveristas
    const deliveristas = users.filter(u => u.role === 'deliverista');
    
    // Limpiar opciones actuales (excepto "Todos")
    while (deliveristaFilter.options.length > 1) {
        deliveristaFilter.remove(1);
    }
    
    // Agregar opciones
    deliveristas.forEach(deliverista => {
        const option = document.createElement('option');
        option.value = deliverista.id;
        option.textContent = deliverista.name;
        deliveristaFilter.appendChild(option);
    });
}

function handleCreateUser(e) {
    e.preventDefault();
    
    const username = newUsernameInput.value;
    const password = newPasswordInput.value;
    const name = newNameInput.value;
    const role = newRoleSelect.value;
    
    // Validación simple
    if (!username || !password || !name) {
        alert('Por favor, complete todos los campos');
        return;
    }
    
    // Verificar si el nombre de usuario ya existe
    if (users.some(u => u.username === username)) {
        alert('El nombre de usuario ya existe. Por favor, elija otro.');
        return;
    }
    
    // Crear nuevo usuario
    const newUser = {
        id: getNextUserId(),
        username,
        password,
        name,
        role
    };
    
    // Agregar a la lista de usuarios
    users.push(newUser);
    
    // Actualizar la interfaz
    loadUsersTable();
    
    // Limpiar formulario
    userForm.reset();
    
    // Notificar al usuario
    alert('Usuario creado correctamente');
}

function showEditUserModal(userId) {
    const user = users.find(u => u.id === userId);
    
    if (!user) {
        alert('Usuario no encontrado');
        return;
    }
    
    // Guardar el ID del usuario que se está editando
    editingUserId = userId;
    
    // Llenar el formulario con los datos del usuario
    editUserIdInput.value = user.id;
    editUsernameInput.value = user.username;
    editPasswordInput.value = ''; // No mostrar la contraseña actual
    editNameInput.value = user.name;
    editRoleSelect.value = user.role;
    
    // Mostrar el modal
    editUserModal.classList.remove('hidden');
}

function handleUpdateUser(e) {
    e.preventDefault();
    
    const userId = parseInt(editUserIdInput.value);
    const username = editUsernameInput.value;
    const password = editPasswordInput.value;
    const name = editNameInput.value;
    const role = editRoleSelect.value;
    
    // Validación simple
    if (!username || !name) {
        alert('Por favor, complete los campos obligatorios');
        return;
    }
    
    // Verificar si el nombre de usuario ya existe (excepto para el usuario actual)
    if (users.some(u => u.username === username && u.id !== userId)) {
        alert('El nombre de usuario ya existe. Por favor, elija otro.');
        return;
    }
    
    // Buscar el usuario
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
        alert('Usuario no encontrado');
        return;
    }
    
    // Actualizar usuario
    users[userIndex].username = username;
    users[userIndex].name = name;
    users[userIndex].role = role;
    
    // Actualizar contraseña solo si se proporcionó una nueva
    if (password) {
        users[userIndex].password = password;
    }
    
    // Actualizar la interfaz
    loadUsersTable();
    
    // Cerrar el modal
    editUserModal.classList.add('hidden');
    
    // Limpiar el ID del usuario que se está editando
    editingUserId = null;
    
    // Notificar al usuario
    alert('Usuario actualizado correctamente');
}

function handleDeleteUser(userId) {
    // No permitir eliminar al usuario actual
    if (currentUser && currentUser.id === userId) {
        alert('No puedes eliminar tu propio usuario');
        return;
    }
    
    // Confirmar eliminación
    if (!confirm('¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.')) {
        return;
    }
    
    // Buscar el usuario
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
        alert('Usuario no encontrado');
        return;
    }
    
    // Eliminar usuario
    users.splice(userIndex, 1);
    
    // Actualizar la interfaz
    loadUsersTable();
    
    // Notificar al usuario
    alert('Usuario eliminado correctamente');
}

// Funciones de utilidad
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function getNextUserId() {
    const maxId = users.reduce((max, user) => Math.max(max, user.id), 0);
    return maxId + 1;
}

function formatDateTime(date) {
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
}

function getElapsedTime(startTime) {
    const now = new Date();
    const elapsedMs = now - startTime;
    const minutes = Math.floor(elapsedMs / 60000);
    const seconds = Math.floor((elapsedMs % 60000) / 1000);
    
    return `${minutes}m ${seconds}s`;
}

// Actualizar la lista de entregas pendientes cada 30 segundos
setInterval(() => {
    if (currentUser && currentUser.role === 'deliverista') {
        loadPendingDeliveries();
    }
}, 30000); 