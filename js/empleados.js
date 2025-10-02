// Módulo de gestión de empleados
class EmpleadosModule {
    constructor() {
        this.empleados = [];
    }

    init() {
        this.cargarEmpleados();
    }

    cargarVista() {
        const section = document.getElementById('empleados');
        section.innerHTML = this.generarVista();
        this.configurarEventos();
        this.cargarTablaEmpleados();
    }

    generarVista() {
        return `
            <div class="container-fluid py-4">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h2>Gestión de Empleados</h2>
                    <button class="btn btn-primary" id="btn-nuevo-empleado">
                        <i class="fas fa-plus me-1"></i> Nuevo Empleado
                    </button>
                </div>
                
                <div class="card">
                    <div class="card-header">
                        <i class="fas fa-user-tie me-2"></i> Lista de Empleados
                    </div>
                    <div class="card-body">
                        <div class="table-responsive">
                            <table class="table table-hover" id="tabla-empleados">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Nombre</th>
                                        <th>Posición</th>
                                        <th>Teléfono</th>
                                        <th>Salario</th>
                                        <th>Fecha Contratación</th>
                                        <th>Estado</th>
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
        document.getElementById('btn-nuevo-empleado').addEventListener('click', () => {
            this.mostrarModalEmpleado();
        });
    }

    cargarEmpleados() {
        this.empleados = window.app.obtenerEmpleados();
    }

    guardarEmpleados() {
        window.app.guardarEmpleados(this.empleados);
    }

    cargarTablaEmpleados() {
        const tbody = document.querySelector('#tabla-empleados tbody');
        tbody.innerHTML = '';

        this.empleados.forEach(empleado => {
            const estadoBadge = empleado.estado === 'Activo' ? 'bg-success' : 'bg-secondary';
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>E-${empleado.id.toString().padStart(3, '0')}</td>
                <td>${empleado.nombre}</td>
                <td>${empleado.posicion}</td>
                <td>${empleado.telefono}</td>
                <td>${Utils.formatearMoneda(empleado.salario)}</td>
                <td>${Utils.formatearFecha(empleado.fechaContratacion)}</td>
                <td><span class="badge ${estadoBadge}">${empleado.estado}</span></td>
                <td class="action-buttons">
                    <button class="btn btn-sm btn-outline-primary" onclick="app.modules.empleados.editarEmpleado(${empleado.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="app.modules.empleados.eliminarEmpleado(${empleado.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    mostrarModalEmpleado(empleado = null) {
        const esEdicion = empleado !== null;
        const modalHtml = `
            <div class="modal fade" id="empleadoModal" tabindex="-1" aria-labelledby="empleadoModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="empleadoModalLabel">
                                ${esEdicion ? 'Editar Empleado' : 'Nuevo Empleado'}
                            </h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <form id="form-empleado">
                                <input type="hidden" id="empleado-id" value="${esEdicion ? empleado.id : ''}">
                                <div class="mb-3">
                                    <label for="nombreEmpleado" class="form-label">Nombre Completo *</label>
                                    <input type="text" class="form-control" id="nombreEmpleado" value="${esEdicion ? empleado.nombre : ''}" required>
                                </div>
                                <div class="mb-3">
                                    <label for="posicionEmpleado" class="form-label">Posición *</label>
                                    <select class="form-select" id="posicionEmpleado" required>
                                        <option value="">Seleccionar posición...</option>
                                        <option value="Lavador" ${esEdicion && empleado.posicion === 'Lavador' ? 'selected' : ''}>Lavador</option>
                                        <option value="Cajero" ${esEdicion && empleado.posicion === 'Cajero' ? 'selected' : ''}>Cajero</option>
                                        <option value="Supervisor" ${esEdicion && empleado.posicion === 'Supervisor' ? 'selected' : ''}>Supervisor</option>
                                        <option value="Administrativo" ${esEdicion && empleado.posicion === 'Administrativo' ? 'selected' : ''}>Administrativo</option>
                                    </select>
                                </div>
                                <div class="mb-3">
                                    <label for="telefonoEmpleado" class="form-label">Teléfono *</label>
                                    <input type="text" class="form-control" id="telefonoEmpleado" value="${esEdicion ? empleado.telefono : ''}" required>
                                </div>
                                <div class="mb-3">
                                    <label for="salarioEmpleado" class="form-label">Salario *</label>
                                    <input type="number" class="form-control" id="salarioEmpleado" value="${esEdicion ? empleado.salario : ''}" required>
                                </div>
                                <div class="mb-3">
                                    <label for="fechaContratacion" class="form-label">Fecha de Contratación *</label>
                                    <input type="date" class="form-control" id="fechaContratacion" value="${esEdicion ? empleado.fechaContratacion : ''}" required>
                                </div>
                                <div class="mb-3">
                                    <label for="estadoEmpleado" class="form-label">Estado *</label>
                                    <select class="form-select" id="estadoEmpleado" required>
                                        <option value="Activo" ${esEdicion && empleado.estado === 'Activo' ? 'selected' : ''}>Activo</option>
                                        <option value="Inactivo" ${esEdicion && empleado.estado === 'Inactivo' ? 'selected' : ''}>Inactivo</option>
                                    </select>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                            <button type="button" class="btn btn-primary" id="btn-guardar-empleado">
                                ${esEdicion ? 'Actualizar' : 'Guardar'} Empleado
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('modals-container').innerHTML = modalHtml;
        const modal = new bootstrap.Modal(document.getElementById('empleadoModal'));
        modal.show();

        document.getElementById('btn-guardar-empleado').addEventListener('click', () => {
            this.guardarEmpleado(esEdicion);
        });
    }

    guardarEmpleado(esEdicion) {
        const form = document.getElementById('form-empleado');
        if (!Utils.validarFormulario(form)) {
            form.reportValidity();
            return;
        }

        const empleadoData = {
            id: esEdicion ? parseInt(document.getElementById('empleado-id').value) : empleadoIdCounter++,
            nombre: document.getElementById('nombreEmpleado').value,
            posicion: document.getElementById('posicionEmpleado').value,
            telefono: document.getElementById('telefonoEmpleado').value,
            salario: parseFloat(document.getElementById('salarioEmpleado').value),
            fechaContratacion: document.getElementById('fechaContratacion').value,
            estado: document.getElementById('estadoEmpleado').value
        };

        if (esEdicion) {
            const index = this.empleados.findIndex(e => e.id === empleadoData.id);
            if (index !== -1) {
                this.empleados[index] = empleadoData;
            }
        } else {
            this.empleados.push(empleadoData);
        }

        this.guardarEmpleados();
        this.cargarTablaEmpleados();
        
        bootstrap.Modal.getInstance(document.getElementById('empleadoModal')).hide();
        Utils.mostrarAlerta(`Empleado ${esEdicion ? 'actualizado' : 'guardado'} exitosamente`, 'success');
    }

    editarEmpleado(id) {
        const empleado = this.empleados.find(e => e.id === id);
        if (empleado) {
            this.mostrarModalEmpleado(empleado);
        }
    }

    eliminarEmpleado(id) {
        if (confirm('¿Está seguro de que desea eliminar este empleado?')) {
            const pedidos = window.app.obtenerPedidos();
            const tienePedidos = pedidos.some(p => p.empleadoId === id);
            
            if (tienePedidos) {
                Utils.mostrarAlerta('No se puede eliminar el empleado porque tiene pedidos asignados.', 'danger');
                return;
            }

            const index = this.empleados.findIndex(e => e.id === id);
            if (index !== -1) {
                this.empleados.splice(index, 1);
                this.guardarEmpleados();
                this.cargarTablaEmpleados();
                Utils.mostrarAlerta('Empleado eliminado exitosamente', 'success');
            }
        }
    }
}
