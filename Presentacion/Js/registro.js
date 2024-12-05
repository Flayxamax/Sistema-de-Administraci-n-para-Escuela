document.addEventListener('DOMContentLoaded', () => {
    // Manejo del formulario de estudiante
    const formEstudiante = document.getElementById('registroEstudiante');
    if (formEstudiante) {
        formEstudiante.addEventListener('submit', async (e) => {
            e.preventDefault();
            const datos = Object.fromEntries(new FormData(formEstudiante));
            try {
                const response = await fetch('http://localhost:3000/api/estudiantes', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(datos),
                });

                if (response.ok) {
                    const resultado = await response.json();
                    console.log('Estudiante registrado:', resultado);
                    Swal.fire({
                        title: '¡Éxito!',
                        text: 'Estudiante registrado con éxito',
                        icon: 'success',
                        confirmButtonText: 'Aceptar'
                    });
                    formEstudiante.reset();
                } else {
                    console.error('Error al registrar estudiante');
                    Swal.fire({
                        title: 'Error',
                        text: 'Hubo un problema al registrar el estudiante',
                        icon: 'error',
                        confirmButtonText: 'Intentar de nuevo'
                    });
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Error de conexión al servidor');
            }
        });
    }

    // Manejo del formulario de clase
    const formClase = document.getElementById('registroClase');
    if (formClase) {
        formClase.addEventListener('submit', async (e) => {
            e.preventDefault();
            const datos = Object.fromEntries(new FormData(formClase));
            try {
                const response = await fetch('http://localhost:3000/api/clases', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(datos),
                });

                if (response.ok) {
                    Swal.fire({
                        title: '¡Éxito!',
                        text: 'clase registrada con éxito',
                        icon: 'success',
                        confirmButtonText: 'Aceptar'
                    });
                    formClase.reset();
                } else {
                    Swal.fire({
                        title: 'Error',
                        text: 'Hubo un error al registrar la clase',
                        icon: 'error',
                        confirmButtonText: 'Intentar de nuevo'
                    });
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Error de conexión al servidor');
            }
        });
    }

    // Función para buscar alumnos
    async function buscarAlumno() {
        const nombre = document.getElementById('nombreAlumno').value;

        try {
            const response = await fetch(`http://localhost:3000/api/estudiantes/buscar?nombre=${nombre}`);

            const alumnos = await response.json();

            generarTablaAlumnos(alumnos);
        } catch (error) {
            console.error('Error al buscar alumnos:', error);
        }
    }

    // Función para buscar clases
    async function buscarClase() {
        const nombre = document.getElementById('nombreClase').value;

        try {
            const response = await fetch('http://localhost:3000/api/clases/buscar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nombre }),
            });

            const clases = await response.json();

            generarTablaClases(clases);
        } catch (error) {
            console.error('Error al buscar clases:', error);
        }
    }

    function generarTablaAlumnos(alumnos) {
        const tabla = document.getElementById('tablaAlumnos');
        tabla.innerHTML = '';
    
        const encabezado = `<tr>
            <th>Seleccionar</th>
            <th>ID</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Correo</th>
        </tr>`;
        tabla.innerHTML = encabezado;
    
        alumnos.forEach(alumno => {
            const fila = `<tr>
                <td><input type="checkbox" class="checkbox-alumno" value="${alumno.id}"></td>
                <td>${alumno.id}</td>
                <td>${alumno.nombre}</td>
                <td>${alumno.apellido}</td>
                <td>${alumno.correo}</td>
            </tr>`;
            tabla.innerHTML += fila;
        });

        const checkboxesAlumnos = document.querySelectorAll('.checkbox-alumno');
        checkboxesAlumnos.forEach(checkbox => {
            checkbox.addEventListener('click', () => {
                checkboxesAlumnos.forEach(cb => {
                    if (cb !== checkbox) {
                        cb.checked = false;
                    }
                });
            });
        });
    }

    function generarTablaClases(clases) {
        const tabla = document.getElementById('tablaClases');
        tabla.innerHTML = '';
    
        const encabezado = `<tr>
            <th>Seleccionar</th>
            <th>ID</th>
            <th>Nombre</th>
            <th>Fecha Inicio</th>
            <th>Hora Inicio</th>
            <th>Fecha Fin</th>
            <th>Hora Fin</th>
            <th>Aula</th>
        </tr>`;
        tabla.innerHTML = encabezado;
    
        clases.forEach(clase => {
            const fila = `<tr>
                <td><input type="checkbox" class="checkbox-clase" value="${clase.id}"></td>
                <td>${clase.id}</td>
                <td>${clase.nombre}</td>
                <td>${clase.fechaInicio}</td>
                <td>${clase.horaInicio}</td>
                <td>${clase.fechaFin}</td>
                <td>${clase.horaFin}</td>
                <td>${clase.aula}</td>
            </tr>`;
            tabla.innerHTML += fila;
        });

        const checkboxesClases = document.querySelectorAll('.checkbox-clase');
        checkboxesClases.forEach(checkbox => {
            checkbox.addEventListener('click', () => {
                checkboxesClases.forEach(cb => {
                    if (cb !== checkbox) {
                        cb.checked = false;
                    }
                });
            });
        });
    }

    // Función para manejar el registro de alumno a clase
    const formAsignarAlumnoClase = document.getElementById('registroClase2');
    if (formAsignarAlumnoClase) {
        formAsignarAlumnoClase.addEventListener('submit', async (e) => {
            e.preventDefault();
    
            const alumnoSeleccionado = document.querySelector('.checkbox-alumno:checked');
            const claseSeleccionada = document.querySelector('.checkbox-clase:checked');
    
            if (!alumnoSeleccionado || !claseSeleccionada) {
                alert('Debes seleccionar un alumno y una clase.');
                return;
            }
    
            const alumnoId = alumnoSeleccionado.value;
            const claseId = claseSeleccionada.value;
    
            const datos = { alumnoId, claseId };
    
            try {
                const response = await fetch('http://localhost:3000/api/clases/asignar-alumno-clase', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(datos),
                });
    
                if (response.ok) {
                    Swal.fire({
                        title: '¡Éxito!',
                        text: 'Alumno asignado a la clase con éxito',
                        icon: 'success',
                        confirmButtonText: 'Aceptar'
                    });
                    formAsignarAlumnoClase.reset();
                } else {
                    const errorData = await response.json();
                    Swal.fire({
                        title: 'Error',
                        text: 'Hubo un error al asignar el estudiante a la clase',
                        icon: 'error',
                        confirmButtonText: 'Intentar de nuevo'
                    });
                }
            } catch (error) {
                console.error('Error al registrar alumno en clase:', error);
                alert('Error de conexión al servidor');
            }
        });
    }

    // Asociar la función buscarAlumno al botón "Buscar Alumno"
    const botonBuscarAlumno = document.getElementById('botonBuscarAlumno');
    if (botonBuscarAlumno) {
        botonBuscarAlumno.addEventListener('click', buscarAlumno);
    }

    // Asociar la función buscarClase al botón "Buscar Clase"
    const botonBuscarClase = document.getElementById('botonBuscarClase');
    if (botonBuscarClase) {
        botonBuscarClase.addEventListener('click', buscarClase);
    }

    // Función para editar estudiante
    async function editarEstudiante(estudianteId, datosActualizados) {
        try {
            const response = await fetch(`http://localhost:3000/api/estudiantes/editar/${estudianteId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datosActualizados),
            });

            if (response.ok) {
                const resultado = await response.json();
                Swal.fire({
                    title: '¡Éxito!',
                    text: 'Estudiante actualizado con éxito',
                    icon: 'success',
                    confirmButtonText: 'Aceptar'
                });
                console.log('Estudiante actualizado:', resultado);
            } else {
                Swal.fire({
                    title: 'Error',
                    text: 'Hubo un error al actualizar el estudiante',
                    icon: 'error',
                    confirmButtonText: 'Intentar de nuevo'
                });
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error de conexión al servidor');
        }
    }

    // Manejo del formulario de edición de estudiante
    const formEditarEstudiante = document.getElementById('editarEstudiante');
    if (formEditarEstudiante) {
        formEditarEstudiante.addEventListener('submit', async (e) => {
            e.preventDefault();
            const estudianteId = document.getElementById('idEstudianteEditar').value; // Campo oculto o prellenado
            const datos = Object.fromEntries(new FormData(formEditarEstudiante));

            if (!estudianteId) {
                alert('No se encontró el ID del estudiante para editar.');
                return;
            }

            await editarEstudiante(estudianteId, datos);
            formEditarEstudiante.reset();
        });
    }

    const eliminarForm = document.getElementById('eliminarEstudiante');
    
    if (eliminarForm) {
        eliminarForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const idEstudiante = document.getElementById('idEstudianteEliminar').value;

            if (!idEstudiante) {
                alert('Por favor, ingresa el ID del estudiante que deseas eliminar.');
                return;
            }
            
            try {
                const response = await fetch(`http://localhost:3000/api/estudiantes/eliminar/${idEstudiante}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    Swal.fire({
                        title: '¡Éxito!',
                        text: 'Estudiante eliminado con éxito',
                        icon: 'success',
                        confirmButtonText: 'Aceptar'
                    });
                    eliminarForm.reset();
                } else if (response.status === 404) {
                    alert('Estudiante no encontrado.');
                } else {
                    Swal.fire({
                        title: 'Error',
                        text: 'Hubo un error al intentar eliminar al estudiante',
                        icon: 'error',
                        confirmButtonText: 'Intentar de nuevo'
                    });
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Error de conexión al servidor.');
            }
        });
    }
});

function validarInput(input) {
    const errorSpan = document.getElementById(`error-${input.id}`);
    if (!input.validity.valid) {
        errorSpan.textContent = input.title;
        errorSpan.style.color = 'red';
    } else {
        errorSpan.textContent = '';
    }
}

// Asociar la función a todos los inputs con validaciones
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', () => validarInput(input));
});

function mostrarSeccion(id) {
    // Ocultar todas las secciones
    const secciones = document.querySelectorAll('.seccion');
    secciones.forEach(seccion => {
        seccion.style.display = 'none';
    });

    // Mostrar solo la sección seleccionada
    const seccionSeleccionada = document.getElementById(id);
    if (seccionSeleccionada) {
        seccionSeleccionada.style.display = 'block';
    }
}

// Función para precargar datos de estudiante en el formulario de edición
async function precargarDatosEstudiante() {

    // Obtener el valor del campo de entrada
    const idEstudiante = document.getElementById("idEstudianteEditar").value;

    // Verificar si el campo no está vacío
    if (idEstudiante.trim() === "") {
        alert("Por favor, ingresa un ID o nombre.");
        return;
    }
    try {
        const response = await fetch(`http://localhost:3000/api/estudiantes/${idEstudiante}`);
        if (response.ok) {
            const estudiante = await response.json();
            document.getElementById('idEstudianteEditar').value = estudiante.id;
            document.getElementById('nombreEditar').value = estudiante.nombre;
            document.getElementById('apellidoEditar').value = estudiante.apellido;
            document.getElementById('correoEditar').value = estudiante.correo;
        } else {
            Swal.fire({
                title: 'Error',
                text: 'No se pudo cargar la información del estudiante.',
                icon: 'error',
                confirmButtonText: 'Intentar de nuevo'
            });
        }
    } catch (error) {
        console.error('Error al precargar datos del estudiante:', error);
    }
}

// Exponer la función al ámbito global
window.mostrarSeccion = mostrarSeccion;
window.precargarDatosEstudiante = precargarDatosEstudiante;
