// Módulo de gestión de vehículos
class VehiculosModule {
    constructor() {
        this.vehiculos = [];
    }

    init() {
        this.cargarVehiculos();
    }

    cargarVista() {
        const section = document.getElementById('vehiculos');
        section.innerHTML = this.generarVista();
        this.configurarEventos();
        this.cargarTablaVehiculos();
    }

    generarVista() {
        return `
            <div class="container-fluid py-4">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h2>Gestión de Vehículos</h2>
                    <button class="btn btn-primary" id="btn-nuevo-vehiculo">
                        <i class="fas fa-plus me-1"></i> Nuevo Vehículo
                    </button>
                </div>
                
                <div class="card">
                    <div class="card-header">
                        <i class="fas fa-car me-2"></i> Lista de Vehículos
                    </div>
                    <div class="card-body">
                        <div class="table-responsive">
                            <table class="table table-hover" id="tabla-vehiculos">
                                <thead>
                                    <tr>
                                        <th>Placa</th>
                                        <th>Marca</th>
                                        <th>Modelo</th>
                                        <th>Año</th>
                                        <th>Color</th>
                                        <th>Cliente</th>
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
        document.getElementById('btn-nuevo-vehiculo').addEventListener('click', () => {
            this.mostrarModalVehiculo();
        });
    }

    cargarVehiculos() {
        this.vehiculos = window.app.obtenerVehiculos();
    }

    guardarVehiculos() {
        window.app.guardarVehiculos(this.vehiculos);
    }

    cargarTablaVehiculos() {
        const tbody = document.querySelector('#tabla-vehiculos tbody');
        tbody.innerHTML = '';

        const clientes = window.app.obtenerClientes();

        this.vehiculos.forEach(vehiculo => {
            const cliente = clientes.find(c => c.id === vehiculo.clienteId);
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${vehiculo.placa}</td>
                <td>${vehiculo.marca}</td>
                <td>${vehiculo.modelo}</td>
                <td>${vehiculo.año}</td>
                <td>${vehiculo.color}</td>
                <td>${cliente ? cliente.nombre : 'N/A'}</td>
                <td>${Utils.formatearFecha(vehiculo.fechaRegistro)}</td>
                <td class="action-buttons">
                    <button class="btn btn-sm btn-outline-primary" onclick="app.modules.vehiculos.editarVehiculo(${vehiculo.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="app.modules.vehiculos.eliminarVehiculo(${vehiculo.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    mostrarModalVehiculo(vehiculo = null) {
        const esEdicion = vehiculo !== null;
        const clientes = window.app.obtenerClientes();
        
        const optionsClientes = clientes.map(cliente => 
            `<option value="${cliente.id}" ${esEdicion && vehiculo.clienteId === cliente.id ? 'selected' : ''}>
                ${cliente.nombre}
            </option>`
        ).join('');

        const modalHtml = `
            <div class="modal fade" id="vehiculoModal" tabindex="-1" aria-labelledby="vehiculoModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="vehiculoModalLabel">
                                ${esEdicion ? 'Editar Vehículo' : 'Nuevo Vehículo'}
                            </h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <form id="form-vehiculo">
                                <input type="hidden" id="vehiculo-id" value="${esEdicion ? vehiculo.id : ''}">
                                <div class="mb-3">
                                    <label for="placaVehiculo" class="form-label">Placa *</label>
                                    <input type="text" class="form-control" id="placaVehiculo" value="${esEdicion ? vehiculo.placa : ''}" required>
                                </div>
                                <div class="mb-3">
                                    <label for="marcaVehiculo" class="form-label">Marca *</label>
                                    <input type="text" class="form-control" id="marcaVehiculo" value="${esEdicion ? vehiculo.marca : ''}" required>
                                </div>
                                <div class="mb-3">
                                    <label for="modeloVehiculo" class="form-label">Modelo *</label>
                                    <input type="text" class="form-control" id="modeloVehiculo" value="${esEdicion ? vehiculo.modelo : ''}" required>
                                </div>
                                <div class="mb-3">
                                    <label for="anioVehiculo" class="form-label">Año *</label>
                                    <input type="number" class="form-control" id="anioVehiculo" value="${esEdicion ? vehiculo.año : ''}" required>
                                </div>
                                <div class="mb-3">
                                    <label for="colorVehiculo" class="form-label">Color *</label>
                                    <input type="text" class="form-control" id="colorVehiculo" value="${esEdicion ? vehiculo.color : ''}" required>
                                </div>
                                <div class="mb-3">
                                    <label for="clienteVehiculo" class="form-label">Cliente *</label>
                                    <select class="form-select" id="clienteVehiculo" required>
                                        <option value="">Seleccionar cliente...</option>
                                        ${optionsClientes}
                                    </select>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                            <button type="button" class="btn btn-primary" id="btn-guardar-vehiculo">
                                ${esEdicion ? 'Actualizar' : 'Guardar'} Vehículo
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('modals-container').innerHTML = modalHtml;
        const modal = new bootstrap.Modal(document.getElementById('vehiculoModal'));
        modal.show();

        document.getElementById('btn-guardar-vehiculo').addEventListener('click', () => {
            this.guardarVehiculo(esEdicion);
        });
    }

    guardarVehiculo(esEdicion) {
        const form = document.getElementById('form-vehiculo');
        if (!Utils.validarFormulario(form)) {
