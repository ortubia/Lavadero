// Módulo del dashboard principal
class DashboardModule {
    constructor() {
        this.charts = {
            income: null,
            services: null
        };
    }

    init() {
        // Inicialización del módulo
    }

    cargarVista() {
        const section = document.getElementById('dashboard');
        section.innerHTML = this.generarVista();
        this.actualizarEstadisticas();
        this.cargarPedidosRecientes();
        this.cargarAlertas();
        this.inicializarGraficos();
    }

    generarVista() {
        return `
            <div class="container-fluid py-4">
                <h2 class="mb-4">Dashboard</h2>
                
                <div class="row">
                    <div class="col-md-3">
                        <div class="card stat-card text-primary">
                            <i class="fas fa-dollar-sign"></i>
                            <div class="number" id="ingresos-mes">$0</div>
                            <div class="label">Ingresos del Mes</div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="card stat-card text-success">
                            <i class="fas fa-clipboard-check"></i>
                            <div class="number" id="pedidos-activos">0</div>
                            <div class="label">Pedidos Activos</div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="card stat-card text-info">
                            <i class="fas fa-users"></i>
                            <div class="number" id="clientes-registrados">0</div>
                            <div class="label">Clientes Registrados</div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="card stat-card text-warning">
                            <i class="fas fa-user-tie"></i>
                            <div class="number" id="total-empleados">0</div>
                            <div class="label">Empleados</div>
                        </div>
                    </div>
                </div>
                
                <div class="row mt-4">
                    <div class="col-md-8">
                        <div class="card">
                            <div class="card-header">
                                <i class="fas fa-chart-bar me-2"></i> Ingresos Mensuales
                            </div>
                            <div class="card-body">
                                <canvas id="incomeChart" height="250"></canvas>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="card">
                            <div class="card-header">
                                <i class="fas fa-chart-pie me-2"></i> Servicios Más Populares
                            </div>
                            <div class="card-body">
                                <canvas id="servicesChart" height="250"></canvas>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="row mt-4">
                    <div class="col-md-6">
                        <div class="card">
                            <div class="card-header">
                                <i class="fas fa-list me-2"></i> Pedidos Recientes
                            </div>
                            <div class="card-body">
                                <div class="table-responsive">
                                    <table class="table table-hover" id="tabla-pedidos-recientes">
                                        <thead>
                                            <tr>
                                                <th>Cliente</th>
                                                <th>Vehículo</th>
                                                <th>Servicio</th>
                                                <th>Estado</th>
                                                <th>Total</th>
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
                    <div class="col-md-6">
                        <div class="card">
                            <div class="card-header">
                                <i class="fas fa-exclamation-circle me-2"></i> Alertas y Recordatorios
                            </div>
                            <div class="card-body" id="alertas-container">
                                <!-- Las alertas se cargarán dinámicamente -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    actualizarEstadisticas() {
        const clientes = window.app.obtenerClientes();
        const empleados = window.app.obtenerEmpleados();
        const pedidos = window.app.obtenerPedidos();
        
        const mesActual = Utils.obtenerMesActual();
        const añoActual = Utils.obtenerAnioActual();

        // Ingresos del mes
        const ingresosMes = pedidos
            .filter(p => {
                const fechaPedido = new Date(p.fecha);
                return fechaPedido.getMonth() === mesActual && 
                       fechaPedido.getFullYear() === añoActual &&
                       p.estado !== 'Cancelado';
            })
            .reduce((total, pedido) => total + pedido.total, 0);

        // Pedidos activos
        const pedidosActivos = pedidos.filter(p => 
            p.estado === 'Pendiente' || p.estado === 'En Proceso'
        ).length;

        // Actualizar estadísticas en el DOM
        document.getElementById('ingresos-mes').textContent = Utils.formatearMoneda(ingresosMes);
        document.getElementById('pedidos-activos').textContent = pedidosActivos;
        document.getElementById('clientes-registrados').textContent = clientes.length;
        document.getElementById('total-empleados').textContent = empleados.filter(e => e.estado === 'Activo').length;
    }

    cargarPedidosRecientes() {
        const tbody = document.querySelector('#tabla-pedidos-recientes tbody');
        tbody.innerHTML = '';

        const pedidos = window.app.obtenerPedidos();
        const clientes = window.app.obtenerClientes();
        const vehiculos = window.app.obtenerVehiculos();

        const pedidosRecientes = [...pedidos]
            .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
            .slice(0, 5);

        pedidosRecientes.forEach(pedido => {
            const cliente = clientes.find(c => c.id === pedido.clienteId);
            const vehiculo = vehiculos.find(v => v.id === pedido.vehiculoId);
            
            let estadoBadge = 'bg-secondary';
            if (pedido.estado === 'Pendiente') estadoBadge = 'bg-info';
            else if (pedido.estado === 'En Proceso') estadoBadge = 'bg-warning';
            else if (pedido.estado === 'Completado') estadoBadge = 'bg-success';
            else if (pedido.estado === 'Cancelado') estadoBadge = 'bg-danger';
            
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${cliente ? cliente.nombre : 'N/A'}</td>
                <td>${vehiculo ? `${vehiculo.marca} ${vehiculo.modelo}` : 'N/A'}</td>
                <td>${pedido.servicio.split(' - ')[0]}</td>
                <td><span class="badge ${estadoBadge}">${pedido.estado}</span></td>
                <td>${Utils.formatearMoneda(pedido.total)}</td>
            `;
            tbody.appendChild(tr);
        });
    }

    cargarAlertas() {
        const alertasContainer = document.getElementById('alertas-container');
        alertasContainer.innerHTML = '';

        const pedidos = window.app.obtenerPedidos();
        const hoy = new Date().toISOString().split('T')[0];

        // Alerta por pedidos pendientes
        const pedidosPendientes = pedidos.filter(p => p.estado === 'Pendiente').length;
        if (pedidosPendientes > 0) {
            this.agregarAlerta(
                `${pedidosPendientes} pedido(s) pendiente(s) de confirmación`,
                'warning',
                'exclamation-triangle'
            );
        }

        // Alerta por nómina
        const proximoViernes = this.obtenerProximoViernes();
        this.agregarAlerta(
            `Recordatorio: Pago de nómina el ${Utils.formatearFecha(proximoViernes)}`,
            'info',
            'info-circle'
        );

        // Alerta por pedidos completados hoy
        const pedidosHoy = pedidos.filter(p => p.fecha === hoy && p.estado === 'Completado').length;
        if (pedidosHoy > 0) {
            this.agregarAlerta(
                `${pedidosHoy} pedido(s) completado(s) hoy`,
                'success',
                'check-circle'
            );
        }

        // Alerta por empleados inactivos
        const empleados = window.app.obtenerEmpleados();
        const empleadosInactivos = empleados.filter(e => e.estado === 'Inactivo').length;
        if (empleadosInactivos > 0) {
            this.agregarAlerta(
                `${empleadosInactivos} empleado(s) inactivo(s)`,
                'secondary',
                'user-slash'
            );
        }
    }

    agregarAlerta(mensaje, tipo, icono) {
        const alertasContainer = document.getElementById('alertas-container');
        const alerta = document.createElement('div');
        alerta.className = `alert alert-${tipo} d-flex align-items-center mb-2`;
        alerta.innerHTML = `
            <i class="fas fa-${icono} me-2"></i>
            <div>${mensaje}</div>
        `;
        alertasContainer.appendChild(alerta);
    }

    obtenerProximoViernes() {
        const hoy = new Date();
        const diasHastaViernes = (5 - hoy.getDay() + 7) % 7;
        const proximoViernes = new Date(hoy);
        proximoViernes.setDate(hoy.getDate() + (diasHastaViernes === 0 ? 7 : diasHastaViernes));
        return proximoViernes.toISOString().split('T')[0];
    }

    inicializarGraficos() {
        this.inicializarGraficoIngresos();
        this.inicializarGraficoServicios();
    }

    inicializarGraficoIngresos() {
        const ctx = document.getElementById('incomeChart').getContext('2d');
        
        this.charts.income = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
                datasets: [{
                    label: 'Ingresos ($)',
                    data: [3200, 2800, 3500, 4200, 3800, 4250, 0, 0, 0, 0, 0, 0],
                    backgroundColor: 'rgba(52, 152, 219, 0.7)',
                    borderColor: 'rgba(52, 152, 219, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Ingresos Mensuales'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '$' + value;
                            }
                        }
                    }
                }
            }
        });
    }

    inicializarGraficoServicios() {
        const ctx = document.getElementById('servicesChart').getContext('2d');
        const pedidos = window.app.obtenerPedidos();

        // Contar servicios más populares
        const servicioCounts = {};
        pedidos.forEach(pedido => {
            const servicioNombre = pedido.servicio.split(' - ')[0];
            servicioCounts[servicioNombre] = (servicioCounts[servicioNombre] || 0) + 1;
        });

        const servicios = Object.keys(servicioCounts);
        const counts = Object.values(servicioCounts);

        this.charts.services = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: servicios,
                datasets: [{
                    data: counts,
                    backgroundColor: [
                        'rgba(52, 152, 219, 0.7)',
                        'rgba(46, 204, 113, 0.7)',
                        'rgba(155, 89, 182, 0.7)',
                        'rgba(241, 196, 15, 0.7)',
                        'rgba(230, 126, 34, 0.7)'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    },
                    title: {
                        display: true,
                        text: 'Servicios Más Populares'
                    }
                }
            }
        });
    }
}
