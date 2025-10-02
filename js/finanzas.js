// Módulo de gestión financiera
class FinanzasModule {
    constructor() {
        this.chart = null;
    }

    init() {
        // Inicialización del módulo
    }

    cargarVista() {
        const section = document.getElementById('finanzas');
        section.innerHTML = this.generarVista();
        this.cargarDatosFinancieros();
        this.inicializarGrafico();
    }

    generarVista() {
        return `
            <div class="container-fluid py-4">
                <h2 class="mb-4">Gestión Financiera</h2>
                
                <div class="row">
                    <div class="col-md-8">
                        <div class="card">
                            <div class="card-header">
                                <i class="fas fa-chart-line me-2"></i> Resumen Financiero
                            </div>
                            <div class="card-body">
                                <canvas id="financeChart" height="250"></canvas>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="card">
                            <div class="card-header">
                                <i class="fas fa-money-bill-wave me-2"></i> Balance Mensual
                            </div>
                            <div class="card-body" id="balance-mensual">
                                <!-- Los datos se cargarán dinámicamente -->
                            </div>
                        </div>
                        
                        <div class="card mt-4">
                            <div class="card-header">
                                <i class="fas fa-list me-2"></i> Costos del Mes
                            </div>
                            <div class="card-body" id="costos-mensuales">
                                <!-- Los datos se cargarán dinámicamente -->
                            </div>
                        </div>
                    </div>
                </div>

                <div class="row mt-4">
                    <div class="col-md-6">
                        <div class="card">
                            <div class="card-header">
                                <i class="fas fa-chart-pie me-2"></i> Distribución de Gastos
                            </div>
                            <div class="card-body">
                                <canvas id="gastosChart" height="250"></canvas>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="card">
                            <div class="card-header">
                                <i class="fas fa-trending-up me-2"></i> Métricas Clave
                            </div>
                            <div class="card-body" id="metricas-clave">
                                <!-- Las métricas se cargarán dinámicamente -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    cargarDatosFinancieros() {
        this.actualizarBalanceMensual();
        this.actualizarCostosMensuales();
        this.actualizarMetricasClave();
    }

    actualizarBalanceMensual() {
        const mesActual = Utils.obtenerMesActual();
        const añoActual = Utils.obtenerAnioActual();
        const pedidos = window.app.obtenerPedidos();
        const empleados = window.app.obtenerEmpleados();

        const ingresos = pedidos
            .filter(p => {
                const fechaPedido = new Date(p.fecha);
                return fechaPedido.getMonth() === mesActual && fechaPedido.getFullYear() === añoActual && p.estado !== 'Cancelado';
            })
            .reduce((total, pedido) => total + pedido.total, 0);

        const costosFijos = 350 + 180 + 120 + 200; // Productos, servicios, mantenimiento, otros
        const nomina = empleados
            .filter(e => e.estado === 'Activo')
            .reduce((total, empleado) => total + empleado.salario, 0);
        
        const gananciaNeta = ingresos - costosFijos - nomina;

        const balanceHtml = `
            <div class="d-flex justify-content-between mb-3">
                <span>Ingresos:</span>
                <span class="text-success">${Utils.formatearMoneda(ingresos)}</span>
            </div>
            <div class="d-flex justify-content-between mb-3">
                <span>Costos Fijos:</span>
                <span class="text-danger">${Utils.formatearMoneda(costosFijos)}</span>
            </div>
            <div class="d-flex justify-content-between mb-3">
                <span>Nómina:</span>
                <span class="text-danger">${Utils.formatearMoneda(nomina)}</span>
            </div>
            <hr>
            <div class="d-flex justify-content-between">
                <strong>Ganancia Neta:</strong>
                <strong class="${gananciaNeta >= 0 ? 'text-primary' : 'text-danger'}">
                    ${Utils.formatearMoneda(gananciaNeta)}
                </strong>
            </div>
        `;

        document.getElementById('balance-mensual').innerHTML = balanceHtml;
    }

    actualizarCostosMensuales() {
        const costosHtml = `
            <div class="d-flex justify-content-between mb-2">
                <span>Productos de limpieza:</span>
                <span>${Utils.formatearMoneda(350)}</span>
            </div>
            <div class="d-flex justify-content-between mb-2">
                <span>Servicios públicos:</span>
                <span>${Utils.formatearMoneda(180)}</span>
            </div>
            <div class="d-flex justify-content-between mb-2">
                <span>Mantenimiento:</span>
                <span>${Utils.formatearMoneda(120)}</span>
            </div>
            <div class="d-flex justify-content-between mb-2">
                <span>Otros gastos:</span>
                <span>${Utils.formatearMoneda(200)}</span>
            </div>
            <hr>
            <div class="d-flex justify-content-between">
                <strong>Total Costos:</strong>
                <strong>${Utils.formatearMoneda(850)}</strong>
            </div>
        `;

        document.getElementById('costos-mensuales').innerHTML = costosHtml;
    }

    actualizarMetricasClave() {
        const pedidos = window.app.obtenerPedidos();
        const mesActual = Utils.obtenerMesActual();
        const añoActual = Utils.obtenerAnioActual();

        const pedidosMes = pedidos.filter(p => {
            const fechaPedido = new Date(p.fecha);
            return fechaPedido.getMonth() === mesActual && fechaPedido.getFullYear() === añoActual;
        });

        const ingresosMes = pedidosMes.reduce((total, pedido) => total + pedido.total, 0);
        const pedidosCompletados = pedidosMes.filter(p => p.estado === 'Completado').length;
        const promedioPedido = pedidosMes.length > 0 ? ingresosMes / pedidosMes.length : 0;

        const metricasHtml = `
            <div class="mb-3">
                <div class="d-flex justify-content-between">
                    <span>Ticket Promedio:</span>
                    <strong>${Utils.formatearMoneda(promedioPedido)}</strong>
                </div>
                <small class="text-muted">Valor promedio por pedido</small>
            </div>
            <div class="mb-3">
                <div class="d-flex justify-content-between">
                    <span>Eficiencia:</span>
                    <strong>${pedidosMes.length > 0 ? Math.round((pedidosCompletados / pedidosMes.length) * 100) : 0}%</strong>
                </div>
                <small class="text-muted">Pedidos completados vs total</small>
            </div>
            <div class="mb-3">
                <div class="d-flex justify-content-between">
                    <span>Pedidos/Día:</span>
                    <strong>${(pedidosMes.length / 30).toFixed(1)}</strong>
                </div>
                <small class="text-muted">Promedio diario de pedidos</small>
            </div>
            <div>
                <div class="d-flex justify-content-between">
                    <span>Margen Neto:</span>
                    <strong>${pedidosMes.length > 0 ? '25%' : '0%'}</strong>
                </div>
                <small class="text-muted">Margen de ganancia promedio</small>
            </div>
        `;

        document.getElementById('metricas-clave').innerHTML = metricasHtml;
    }

    inicializarGrafico() {
        const ctx = document.getElementById('financeChart').getContext('2d');
        
        // Datos de ejemplo para los últimos 6 meses
        const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'];
        const ingresos = [3200, 2800, 3500, 4200, 3800, 4250];
        const gastos = [2200, 2000, 2500, 2800, 2600, 2850];

        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: meses,
                datasets: [
                    {
                        label: 'Ingresos',
                        data: ingresos,
                        borderColor: 'rgba(46, 204, 113, 1)',
                        backgroundColor: 'rgba(46, 204, 113, 0.1)',
                        tension: 0.3,
                        fill: true
                    },
                    {
                        label: 'Gastos',
                        data: gastos,
                        borderColor: 'rgba(231, 76, 60, 1)',
                        backgroundColor: 'rgba(231, 76, 60, 0.1)',
                        tension: 0.3,
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Evolución Mensual de Ingresos y Gastos'
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

        // Gráfico de gastos
        this.inicializarGraficoGastos();
    }

    inicializarGraficoGastos() {
        const ctx = document.getElementById('gastosChart').getContext('2d');
        
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Nómina', 'Productos', 'Servicios', 'Mantenimiento', 'Otros'],
                datasets: [{
                    data: [1200, 350, 180, 120, 200],
                    backgroundColor: [
                        'rgba(52, 152, 219, 0.7)',
                        'rgba(46, 204, 113, 0.7)',
                        'rgba(155, 89, 182, 0.7)',
                        'rgba(241, 196, 15, 0.7)',
                        'rgba(230, 126, 34
