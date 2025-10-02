// Utilidades generales para la aplicación
class Utils {
    static formatearFecha(fechaStr) {
        const fecha = new Date(fechaStr);
        return fecha.toLocaleDateString('es-ES');
    }

    static formatearMoneda(monto) {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN'
        }).format(monto);
    }

    static generarId(prefix = '') {
        return prefix + Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    static mostrarAlerta(mensaje, tipo = 'success') {
        // Eliminar alertas existentes
        document.querySelectorAll('.alert-fixed').forEach(alert => alert.remove());

        const alerta = document.createElement('div');
        alerta.className = `alert alert-${tipo} alert-dismissible fade show alert-fixed`;
        alerta.innerHTML = `
            ${mensaje}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;

        document.body.appendChild(alerta);

        // Auto-eliminar después de 5 segundos
        setTimeout(() => {
            if (alerta.parentNode) {
                alerta.remove();
            }
        }, 5000);
    }

    static validarFormulario(formElement) {
        return formElement.checkValidity();
    }

    static obtenerMesActual() {
        return new Date().getMonth();
    }

    static obtenerAnioActual() {
        return new Date().getFullYear();
    }

    static esFechaHoy(fechaStr) {
        const hoy = new Date().toISOString().split('T')[0];
        return fechaStr === hoy;
    }

    static crearElemento(html) {
        const template = document.createElement('template');
        template.innerHTML = html.trim();
        return template.content.firstElementChild;
    }
}
