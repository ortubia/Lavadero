// Módulo de gestión de pedidos
class PedidosModule {
    constructor() {
        this.pedidos = [];
        this.servicios = [];
    }

    init() {
        this.cargarPedidos();
        this.cargarServicios();
    }

    cargarVista() {
        const section = document.getElementById('pedidos');
        section.innerHTML = this.generarVista();
        this.configurarEventos();
        this.cargarTablaPedidos();
    }

    generarVista() {
        return `
            <div class="container-fluid py-4">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h2>Gestión de Pedidos</h2>
                    <button class="btn btn-primary" id="btn-nuevo-pedido">
                        <i class="fas fa-plus me-1"></i> Nuevo Pedido
                    </button>
                </div>
                
                <div class="card">
                    <div class="card-header">
                        <i class="fas fa-clipboard-list me-2"></i> Lista de Pedidos
                    </div>
                    <div class="card-body">
                        <div class="table-responsive">
                            <table class="table table-hover" id="tabla-pedidos">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Cliente</th>
                                        <th>Vehículo</th>
                                        <th>Servicio</th>
                                        <th>Fecha</th>
                                        <th>Empleado</th>
                                        <th>Estado</th>
                                        <th>Total</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <!-- Los datos se cargarán dinámicamente -->
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    configurarEventos() {
        document.getElementById('btn-nuevo-pedido').addEventListener('click', () => {
            this.mostrarModalPedido();
        });
    }

    cargarPedidos() {
        this.pedidos = window.app.obtenerPedidos();
    }

    cargarServicios() {
        this.servicios = window.app.obtenerServicios();
    }

    guardarPedidos() {
        window.app.guardarPedidos(this.pedidos);
    }

    cargarTablaPedidos() {
        const tbody = document.querySelector('#tabla-pedidos tbody');
        tbody.innerHTML = '';

        const clientes = window.app.obtenerClientes();
        const vehiculos = window.app.obtenerVehiculos();
        const empleados = window.app.obtenerEmpleados();

        this.pedidos.forEach(pedido => {
            const cliente = clientes.find(c => c.id === pedido.clienteId);
            const vehiculo = vehiculos.find(v => v.id === pedido.vehiculoId);
            const empleado = empleados.find(e => e.id === pedido.empleadoId);
            
            let estadoBadge = 'bg-secondary';
            if (pedido.estado === 'Pendiente') estadoBadge = 'bg-info';
            else if (pedido.estado === 'En Proceso') estadoBadge = 'bg-warning';
            else if (pedido.estado === 'Completado') estadoBadge = 'bg-success';
            else if (pedido.estado === 'Cancelado') estadoBadge = 'bg-danger';
            
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>P-${pedido.id.toString().padStart(3, '0')}</td>
                <td>${cliente ? cliente.nombre : 'N/A'}</td>
                <td>${vehiculo ? `${vehiculo.marca} ${vehiculo.modelo}` : 'N/A'}</td>
                <td>${pedido.servicio}</td>
                <td>${Utils.formatearFecha(pedido.fecha)}</td>
                <td>${empleado ? empleado.nombre : 'N/A'}</td>
                <td><span class="badge ${estadoBadge}">${pedido.estado}</span></td>
                <td>${Utils.formatearMoneda(pedido.total)}</td>
                <td class="action-buttons">
                    <button class="btn btn-sm btn-outline-primary" onclick="app.modules.pedidos.editarPedido(${pedido.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="app.modules.pedidos.eliminarPedido(${pedido.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    mostrarModalPedido(pedido = null) {
        const esEdicion = pedido !== null;
        const clientes = window.app.obtenerClientes();
        const empleados = window.app.obtenerEmpleados();
        
        const optionsClientes = clientes.map(cliente => 
            `<option value="${cliente.id}" ${esEdicion && pedido.clienteId === cliente.id ? 'selected' : ''}>
                ${cliente.nombre}
            </option>`
        ).join('');

        const optionsEmpleados = empleados.map(empleado => 
            `<option value="${empleado.id}" ${esEdicion && pedido.empleadoId === empleado.id ? 'selected' : ''}>
                ${empleado.nombre}
            </option>`
        ).join('');

        const optionsServicios = this.servicios.map(servicio => 
            `<option value="${servicio.nombre} - ${Utils.formatearMoneda(servicio.precio)}" 
                     ${esEdicion && pedido.servicio.includes(servicio.nombre) ? 'selected' : ''}
                     data-precio="${servicio.precio}">
                ${servicio.nombre} - ${Utils.formatearMoneda(servicio.precio)}
            </option>`
        ).join('');

        const modalHtml = `
            <div class="modal fade" id="pedidoModal" tabindex="-1" aria-labelledby="pedidoModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="pedidoModalLabel">
                                ${esEdicion ? 'Editar Pedido' : 'Nuevo Pedido'}
                            </h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <form id="form-pedido">
                                <input type="hidden" id="pedido-id" value="${esEdicion ? pedido.id : ''}">
                                <div class="mb-3">
                                    <label for="clientePedido" class="form-label">Cliente *</label>
                                    <select class="form-select" id="clientePedido" required>
                                        <option value="">Seleccionar cliente...</option>
                                        ${optionsClientes}
                                    </select>
                                </div>
                                <div class="mb-3">
                                    <label for="vehiculoPedido" class="form-label">Vehículo *</label>
                                    <select class="form-select" id="vehiculoPedido" required>
                                        <option value="">Seleccionar vehículo...</option>
                                    </select>
                                </div>
                                <div class="mb-3">
                                    <label for="servicioPedido" class="form-label">Servicio *</label>
                                    <select class="form-select" id="servicioPedido" required>
                                        <option value="">Seleccionar servicio...</option>
                                        ${optionsServicios}
                                    </select>
                                </div>
                                <div class="mb-3">
                                    <label for="fechaPedido" class="form-label">Fecha *</label>
                                    <input type="date" class="form-control" id="fechaPedido" value="${esEdicion ? pedido.fecha : new Date().toISOString().split('T')[0]}" required>
                                </div>
                                <div class="mb-3">
                                    <label for="empleadoPedido" class="form-label">Empleado Asignado *</label>
                                    <select class="form-select" id="empleadoPedido" required>
                                        <option value="">Seleccionar empleado...</option>
                                        ${optionsEmpleados}
                                    </select>
                                </div>
                                <div class="mb-3">
                                    <label for="estadoPedido" class="form-label">Estado *</label>
                                    <select class="form-select" id="estadoPedido" required>
                                        <option value="Pendiente" ${esEdicion && pedido.estado === 'Pendiente' ? 'selected' : ''}>Pendiente</option>
                                        <option value="En Proceso" ${esEdicion && pedido.estado === 'En Proceso' ? 'selected' : ''}>En Proceso</option>
                                        <option value="Completado" ${esEdicion && pedido.estado === 'Completado' ? 'selected' : ''}>Completado</option>
                                        <option value="Cancelado" ${esEdicion && pedido.estado === 'Cancelado' ? 'selected' : ''}>Cancelado</option>
                                    </select>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                            <button type="button" class="btn btn-primary" id="btn-guardar-pedido">
                                ${esEdicion ? 'Actualizar' : 'Crear'} Pedido
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('modals-container').innerHTML = modalHtml;
        const modal = new bootstrap.Modal(document.getElementById('pedidoModal'));
        modal.show();

        // Cargar vehículos del cliente seleccionado
        if (esEdicion) {
            this.cargarVehiculosPorCliente(pedido.clienteId, pedido.vehiculoId);
        }

        // Evento para cambiar cliente
        document.getElementById('clientePedido').addEventListener('change', (e) => {
            this.cargarVehiculosPorCliente(e.target.value);
        });

        document.getElementById('btn-guardar-pedido').addEventListener('click', () => {
            this.guardarPedido(esEdicion);
        });
    }

    cargarVehiculosPorCliente(clienteId, vehiculoSeleccionadoId = null) {
        const selectVehiculo = document.getElementById('vehiculoPedido');
        selectVehiculo.innerHTML = '<option value="">Seleccionar vehículo...</option>';

        if (!clienteId) return;

        const vehiculos = window.app.obtenerVehiculos();
        const vehiculosCliente = vehiculos.filter(v => v.clienteId == clienteId);
        
        vehiculosCliente.forEach(vehiculo => {
            const option = document.createElement('option');
            option.value = vehiculo.id;
            option.textContent = `${vehiculo.marca} ${vehiculo.modelo} - ${vehiculo.placa}`;
            if (vehiculoSeleccionadoId && vehiculo.id === vehiculoSeleccionadoId) {
                option.selected = true;
            }
            selectVehiculo.appendChild(option);
        });
    }

    guardarPedido(esEdicion) {
        const form = document.getElementById('form-pedido');
        if (!Utils.validarFormulario(form)) {
            form.reportValidity();
            return;
        }

        // Extraer precio del servicio seleccionado
        const servicioSelect = document.getElementById('servicioPedido');
        const servicioTexto = servicioSelect.value;
        const precio = parseFloat(servicioSelect.selectedOptions[0].getAttribute('data-precio'));

        const pedidoData = {
            id: esEdicion ? parseInt(document.getElementById('pedido-id').value) : pedidoIdCounter++,
            clienteId: parseInt(document.getElementById('clientePedido').value),
            vehiculoId: parseInt(document.getElementById('vehiculoPedido').value),
            servicio: servicioTexto,
            fecha: document.getElementById('fechaPedido').value,
            empleadoId: parseInt(document.getElementById('empleadoPedido').value),
            estado: document.getElementById('estadoPedido').value,
            total: precio,
            fechaCreacion: esEdicion ? this.pedidos.find(p => p.id === parseInt(document.getElementById('pedido-id').value)).fechaCreacion : new Date().toISOString().split('T')[0]
        };

        if (esEdicion) {
            const index = this.pedidos.findIndex(p => p.id === pedidoData.id);
            if (index !== -1) {
                this.pedidos[index] = pedidoData;
            }
        } else {
            this.pedidos.push(pedidoData);
        }

        this.guardarPedidos();
        this.cargarTablaPedidos();
        
        bootstrap.Modal.getInstance(document.getElementById('pedidoModal')).hide();
        Utils.mostrarAlerta(`Pedido ${esEdicion ? 'actualizado' : 'creado'} exitosamente`, 'success');
    }

    editarPedido(id) {
        const pedido = this.pedidos.find(p => p.id === id);
        if (pedido) {
            this.mostrarModalPedido(pedido);
        }
    }

    eliminarPedido(id) {
        if (confirm('¿Está seguro de que desea eliminar este pedido?')) {
            const index = this.pedidos.findIndex(p => p.id === id);
            if (index !== -1) {
                this.pedidos.splice(index, 1);
                this.guardarPedidos();
                this.cargarTablaPedidos();
                Utils.mostrarAlerta('Pedido eliminado exitosamente', 'success');
            }
        }
    }
}
