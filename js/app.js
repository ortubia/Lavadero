// Aplicación principal - Coordina todos los módulos
class LavaderoApp {
    constructor() {
        this.modules = {
            clientes: new ClientesModule(),
            vehiculos: new VehiculosModule(),
            empleados: new EmpleadosModule(),
            pedidos: new PedidosModule(),
            finanzas: new FinanzasModule(),
            dashboard: new DashboardModule()
        };
        
        this.init();
    }

    init() {
        // Cargar datos iniciales
        this.cargarDatosIniciales();
        
        // Configurar navegación
        this.setupNavigation();
        
        // Inicializar módulos
        this.inicializarModulos();
        
        // Cargar vista inicial
        this.cargarSeccion('dashboard');
    }

    cargarDatosIniciales() {
        // Verificar si ya existen datos en localStorage
        if (!localStorage.getItem('lavadero_datos_inicializados')) {
            // Cargar datos iniciales
            localStorage.setItem('clientes', JSON.stringify(clientesIniciales));
            localStorage.setItem('vehiculos', JSON.stringify(vehiculosIniciales));
            localStorage.setItem('empleados', JSON.stringify(empleadosIniciales));
            localStorage.setItem('pedidos', JSON.stringify(pedidosIniciales));
            localStorage.setItem('servicios', JSON.stringify(serviciosIniciales));
            localStorage.setItem('lavadero_datos_inicializados', 'true');
        }
    }

    setupNavigation() {
        const navLinks = document.querySelectorAll('.sidebar .nav-link');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Remover clase active de todos los enlaces
                navLinks.forEach(l => l.classList.remove('active'));
                
                // Agregar clase active al enlace clickeado
                link.classList.add('active');
                
                // Cargar sección correspondiente
                const sectionId = link.getAttribute('data-section');
                this.cargarSeccion(sectionId);
            });
        });
    }

    inicializarModulos() {
        Object.values(this.modules).forEach(module => {
            if (typeof module.init === 'function') {
                module.init();
            }
        });
    }

    cargarSeccion(sectionId) {
        // Ocultar todas las secciones
        document.querySelectorAll('.dashboard-section').forEach(section => {
            section.classList.remove('active');
        });
        
        // Mostrar sección seleccionada
        const section = document.getElementById(sectionId);
        section.classList.add('active');
        
        // Cargar contenido de la sección
        if (this.modules[sectionId] && typeof this.modules[sectionId].cargarVista === 'function') {
            this.modules[sectionId].cargarVista();
        }
    }

    // Métodos utilitarios para compartir entre módulos
    obtenerClientes() {
        return JSON.parse(localStorage.getItem('clientes') || '[]');
    }

    guardarClientes(clientes) {
        localStorage.setItem('clientes', JSON.stringify(clientes));
    }

    obtenerVehiculos() {
        return JSON.parse(localStorage.getItem('vehiculos') || '[]');
    }

    guardarVehiculos(vehiculos) {
        localStorage.setItem('vehiculos', JSON.stringify(vehiculos));
    }

    obtenerEmpleados() {
        return JSON.parse(localStorage.getItem('empleados') || '[]');
    }

    guardarEmpleados(empleados) {
        localStorage.setItem('empleados', JSON.stringify(empleados));
    }

    obtenerPedidos() {
        return JSON.parse(localStorage.getItem('pedidos') || '[]');
    }

    guardarPedidos(pedidos) {
        localStorage.setItem('pedidos', JSON.stringify(pedidos));
    }

    obtenerServicios() {
        return JSON.parse(localStorage.getItem('servicios') || '[]');
    }
}

// Inicializar aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.app = new LavaderoApp();
});
