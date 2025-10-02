// Módulo de gestión de clientes
class ClientesModule {
    constructor() {
        this.clientes = [];
    }

    init() {
        this.cargarClientes();
    }

    cargarVista() {
        const section = document.getElementById('clientes');
        section.innerHTML = this.generarVista();
        this.configurarEventos();
        this.cargarTablaClientes();
    }

    generarVista() {
        return `
            <div class="container-fluid py-4">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h2>Gestión de Clientes</h2>
                    <button class="btn btn-primary" id="btn-nuevo-cliente">
                        <i class="fas fa-plus me-1"></i> Nuevo Cliente
                    </button>
                </div>
                
                <div class="card">
                    <div class="card-header">
                        <i class="fas fa-users me-2"></i> Lista de Clientes
                    </div>
                    <div class="card-body">
                        <div class="table-responsive">
                            <table class="table table-hover" id="tabla-clientes">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Nombre</th>
                                        <th>Teléfono</th>
                                        <th>Email</th>
                                        <th>Vehículos</th>
                                        <th>Fecha Registro</th>
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
        document.getElementById('btn-nuevo-cliente').addEventListener('click', () => {
            this.mostrarModalCliente();
        });
    }

    cargarClientes() {
        this.clientes = window.app.obtenerClientes();
    }

    guardarClientes() {
        window.app.guardarClientes(this.clientes);
    }

    cargarTablaClientes() {
        const tbody = document.querySelector('#tabla-clientes tbody');
        tbody.innerHTML = '';

        this.clientes.forEach(cliente => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${cliente.id}</td>
                <td>${cliente.nombre}</td>
                <td>${cliente.telefono}</td>
                <td>${cliente.email}</td>
                <td>${cliente.vehiculos}</td>
                <td>${Utils.formatearFecha(cliente.fechaRegistro)}</td>
                <td class="action-buttons">
                    <button class="btn btn-sm btn-outline-primary" onclick="app.modules.clientes.editarCliente(${cliente.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="app.modules.clientes.eliminarCliente(${cliente.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    mostrarModalCliente(cliente = null) {
        const esEdicion = cliente !== null;
        const modalHtml = `
            <div class="modal fade" id="clienteModal" tabindex="-1" aria-labelledby="clienteModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="clienteModalLabel">
                                ${esEdicion ? 'Editar Cliente' : 'Nuevo Cliente'}
                            </h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <form id="form-cliente">
                                <input type="hidden" id="cliente-id" value="${esEdicion ? cliente.id : ''}">
                                <div class="mb-3">
                                    <label for="nombreCliente" class="form-label">Nombre Completo *</label>
                                    <input type="text" class="form-control" id="nombreCliente" value="${esEdicion ? cliente.nombre : ''}" required>
                                </div>
                                <div class="mb-3">
                                    <label for="telefonoCliente" class="form-label">Teléfono *</label>
                                    <input type="text" class="form-control" id="telefonoCliente" value="${esEdicion ? cliente.telefono : ''}" required>
                                </div>
                                <div class="mb-3">
                                    <label for="emailCliente" class="form-label">Email</label>
                                    <input type="email" class="form-control" id="emailCliente" value="${esEdicion ? cliente.email : ''}">
                                </div>
                                <div class="mb-3">
                                    <label for="direccionCliente" class="form-label">Dirección</label>
                                    <textarea class="form-control" id="direccionCliente" rows="2">${esEdicion ? cliente.direccion : ''}</textarea>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                            <button type="button" class="btn btn-primary" id="btn-guardar-cliente">
                                ${esEdicion ? 'Actualizar' : 'Guardar'} Cliente
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Agregar modal al contenedor
        document.getElementById('modals-container').innerHTML = modalHtml;

        // Mostrar modal
        const modal = new bootstrap.Modal(document.getElementById('clienteModal'));
        modal.show();

        // Configurar evento del botón guardar
        document.getElementById('btn-guardar-cliente').addEventListener('click', () => {
            this.guardarCliente(esEdicion);
        });
    }

    guardarCliente(esEdicion) {
        const form = document.getElementById('form-cliente');
        if (!Utils.validarFormulario(form)) {
            form.reportValidity();
            return;
        }

        const clienteData = {
            id: esEdicion ? parseInt(document.getElementById('cliente-id').value) : clienteIdCounter++,
            nombre: document.getElementById('nombreCliente').value,
            telefono: document.getElementById('telefonoCliente').value,
            email: document.getElementById('emailCliente').value,
            direccion: document.getElementById('direccionCliente').value,
            vehiculos: esEdicion ? this.clientes.find(c => c.id === parseInt(document.getElementById('cliente-id').value)).vehiculos : 0,
            fechaRegistro: esEdicion ? this.clientes.find(c => c.id === parseInt(document.getElementById('cliente-id').value)).fechaRegistro : new Date().toISOString().split('T')[0]
        };

        if (esEdicion) {
            const index = this.clientes.findIndex(c => c.id === clienteData.id);
            if (index !== -1) {
                this.clientes[index] = clienteData;
            }
        } else {
            this.clientes.push(clienteData);
        }

        this.guardarClientes();
        this.cargarTablaClientes();
        
        // Cerrar modal
        bootstrap.Modal.getInstance(document.getElementById('clienteModal')).hide();
        
        Utils.mostrarAlerta(`Cliente ${esEdicion ? 'actualizado' : 'guardado'} exitosamente`, 'success');
    }

    editarCliente(id) {
        const cliente = this.clientes.find(c => c.id === id);
        if (cliente) {
            this.mostrarModalCliente(cliente);
        }
    }

    eliminarCliente(id) {
        if (confirm('¿Está seguro de que desea eliminar este cliente?')) {
            const vehiculos = window.app.obtenerVehiculos();
            const tieneVehiculos = vehiculos.some(v => v.clienteId === id);
            
            if (tieneVehiculos) {
                Utils.mostrarAlerta('No se puede eliminar el cliente porque tiene vehículos asociados.', 'danger');
                return;
            }

            const index = this.clientes.findIndex(c => c.id === id);
            if (index !== -1) {
                this.clientes.splice(index, 1);
                this.guardarClientes();
                this.cargarTablaClientes();
                Utils.mostrarAlerta('Cliente eliminado exitosamente', 'success');
            }
        }
    }
}
