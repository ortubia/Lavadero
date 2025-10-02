// Datos iniciales para la aplicación
const clientesIniciales = [
    { 
        id: 1, 
        nombre: "Juan Pérez", 
        telefono: "555-1234", 
        email: "juan@email.com", 
        direccion: "Calle 123", 
        vehiculos: 2,
        fechaRegistro: "2023-01-15"
    },
    { 
        id: 2, 
        nombre: "María García", 
        telefono: "555-5678", 
        email: "maria@email.com", 
        direccion: "Avenida 456", 
        vehiculos: 1,
        fechaRegistro: "2023-02-20"
    },
    { 
        id: 3, 
        nombre: "Carlos López", 
        telefono: "555-9012", 
        email: "carlos@email.com", 
        direccion: "Boulevard 789", 
        vehiculos: 3,
        fechaRegistro: "2023-03-10"
    }
];

const vehiculosIniciales = [
    { 
        id: 1, 
        placa: "ABC-123", 
        marca: "Toyota", 
        modelo: "Corolla", 
        año: 2020, 
        color: "Rojo", 
        clienteId: 1,
        fechaRegistro: "2023-01-15"
    },
    { 
        id: 2, 
        placa: "XYZ-789", 
        marca: "Honda", 
        modelo: "Civic", 
        año: 2019, 
        color: "Azul", 
        clienteId: 2,
        fechaRegistro: "2023-02-20"
    },
    { 
        id: 3, 
        placa: "DEF-456", 
        marca: "Ford", 
        modelo: "F-150", 
        año: 2021, 
        color: "Negro", 
        clienteId: 3,
        fechaRegistro: "2023-03-10"
    }
];

const empleadosIniciales = [
    { 
        id: 1, 
        nombre: "Roberto Silva", 
        posicion: "Lavador", 
        telefono: "555-1122", 
        salario: 1200, 
        fechaContratacion: "2022-01-15", 
        estado: "Activo"
    },
    { 
        id: 2, 
        nombre: "Ana Martínez", 
        posicion: "Cajera", 
        telefono: "555-3344", 
        salario: 1000, 
        fechaContratacion: "2022-03-10", 
        estado: "Activo"
    },
    { 
        id: 3, 
        nombre: "Luis Rodríguez", 
        posicion: "Supervisor", 
        telefono: "555-5566", 
        salario: 1500, 
        fechaContratacion: "2021-11-20", 
        estado: "Activo"
    }
];

const pedidosIniciales = [
    { 
        id: 1, 
        clienteId: 1, 
        vehiculoId: 1, 
        servicio: "Lavado Completo - $45.00", 
        fecha: "2023-06-15", 
        estado: "Completado", 
        total: 45, 
        empleadoId: 1,
        fechaCreacion: "2023-06-15"
    },
    { 
        id: 2, 
        clienteId: 2, 
        vehiculoId: 2, 
        servicio: "Lavado Básico - $25.00", 
        fecha: "2023-06-16", 
        estado: "En Proceso", 
        total: 25, 
        empleadoId: 2,
        fechaCreacion: "2023-06-16"
    },
    { 
        id: 3, 
        clienteId: 3, 
        vehiculoId: 3, 
        servicio: "Lavado Premium - $65.00", 
        fecha: "2023-06-17", 
        estado: "Pendiente", 
        total: 65, 
        empleadoId: 3,
        fechaCreacion: "2023-06-17"
    }
];

const serviciosIniciales = [
    { nombre: "Lavado Básico", precio: 25, duracion: 30 },
    { nombre: "Lavado Completo", precio: 45, duracion: 60 },
    { nombre: "Lavado Premium", precio: 65, duracion: 90 },
    { nombre: "Encerado", precio: 30, duracion: 45 },
    { nombre: "Limpieza Interior", precio: 40, duracion: 60 }
];

// Contadores para nuevos IDs
let clienteIdCounter = 4;
let vehiculoIdCounter = 4;
let empleadoIdCounter = 4;
let pedidoIdCounter = 4;// Datos iniciales para la aplicación
const clientesIniciales = [
    { 
        id: 1, 
        nombre: "Juan Pérez", 
        telefono: "555-1234", 
        email: "juan@email.com", 
        direccion: "Calle 123", 
        vehiculos: 2,
        fechaRegistro: "2023-01-15"
    },
    { 
        id: 2, 
        nombre: "María García", 
        telefono: "555-5678", 
        email: "maria@email.com", 
        direccion: "Avenida 456", 
        vehiculos: 1,
        fechaRegistro: "2023-02-20"
    },
    { 
        id: 3, 
        nombre: "Carlos López", 
        telefono: "555-9012", 
        email: "carlos@email.com", 
        direccion: "Boulevard 789", 
        vehiculos: 3,
        fechaRegistro: "2023-03-10"
    }
];

const vehiculosIniciales = [
    { 
        id: 1, 
        placa: "ABC-123", 
        marca: "Toyota", 
        modelo: "Corolla", 
        año: 2020, 
        color: "Rojo", 
        clienteId: 1,
        fechaRegistro: "2023-01-15"
    },
    { 
        id: 2, 
        placa: "XYZ-789", 
        marca: "Honda", 
        modelo: "Civic", 
        año: 2019, 
        color: "Azul", 
        clienteId: 2,
        fechaRegistro: "2023-02-20"
    },
    { 
        id: 3, 
        placa: "DEF-456", 
        marca: "Ford", 
        modelo: "F-150", 
        año: 2021, 
        color: "Negro", 
        clienteId: 3,
        fechaRegistro: "2023-03-10"
    }
];

const empleadosIniciales = [
    { 
        id: 1, 
        nombre: "Roberto Silva", 
        posicion: "Lavador", 
        telefono: "555-1122", 
        salario: 1200, 
        fechaContratacion: "2022-01-15", 
        estado: "Activo"
    },
    { 
        id: 2, 
        nombre: "Ana Martínez", 
        posicion: "Cajera", 
        telefono: "555-3344", 
        salario: 1000, 
        fechaContratacion: "2022-03-10", 
        estado: "Activo"
    },
    { 
        id: 3, 
        nombre: "Luis Rodríguez", 
        posicion: "Supervisor", 
        telefono: "555-5566", 
        salario: 1500, 
        fechaContratacion: "2021-11-20", 
        estado: "Activo"
    }
];

const pedidosIniciales = [
    { 
        id: 1, 
        clienteId: 1, 
        vehiculoId: 1, 
        servicio: "Lavado Completo - $45.00", 
        fecha: "2023-06-15", 
        estado: "Completado", 
        total: 45, 
        empleadoId: 1,
        fechaCreacion: "2023-06-15"
    },
    { 
        id: 2, 
        clienteId: 2, 
        vehiculoId: 2, 
        servicio: "Lavado Básico - $25.00", 
        fecha: "2023-06-16", 
        estado: "En Proceso", 
        total: 25, 
        empleadoId: 2,
        fechaCreacion: "2023-06-16"
    },
    { 
        id: 3, 
        clienteId: 3, 
        vehiculoId: 3, 
        servicio: "Lavado Premium - $65.00", 
        fecha: "2023-06-17", 
        estado: "Pendiente", 
        total: 65, 
        empleadoId: 3,
        fechaCreacion: "2023-06-17"
    }
];

const serviciosIniciales = [
    { nombre: "Lavado Básico", precio: 25, duracion: 30 },
    { nombre: "Lavado Completo", precio: 45, duracion: 60 },
    { nombre: "Lavado Premium", precio: 65, duracion: 90 },
    { nombre: "Encerado", precio: 30, duracion: 45 },
    { nombre: "Limpieza Interior", precio: 40, duracion: 60 }
];

// Contadores para nuevos IDs
let clienteIdCounter = 4;
let vehiculoIdCounter = 4;
let empleadoIdCounter = 4;
let pedidoIdCounter = 4;
