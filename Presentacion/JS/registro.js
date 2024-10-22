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
                    alert('Estudiante registrado con éxito');
                    formEstudiante.reset();
                } else {
                    console.error('Error al registrar estudiante');
                    alert('Hubo un error al registrar el estudiante');
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
                    const resultado = await response.json();
                    console.log('Clase registrada:', resultado);
                    alert('Clase registrada con éxito');
                    formClase.reset();
                } else {
                    console.error('Error al registrar la Clase');
                    alert('Hubo un error al registrar la Clase');
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
            const response = await fetch('http://localhost:3000/api/estudiantes/buscar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nombre }),
            });

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

        // Crear cabecera de tabla
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
    }

    // Función para generar tabla de clases con checkbox
    function generarTablaClases(clases) {
        const tabla = document.getElementById('tablaClases');
        tabla.innerHTML = '';

        const encabezado = `<tr>
            <th>Seleccionar</th>
            <th>ID</th>
            <th>Nombre</th>
            <th>Descripción</th>
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
                <td>${clase.descripcion}</td>
                <td>${clase.fechaInicio}</td>
                <td>${clase.horaInicio}</td>
                <td>${clase.fechaFin}</td>
                <td>${clase.horaFin}</td>
                <td>${clase.aula}</td>
            </tr>`;
            tabla.innerHTML += fila;
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
            console.log(alumnoId)
            const claseId = claseSeleccionada.value;

            const datos = { alumnoId, claseId };

            try {
                const response = await fetch('http://localhost:3000/api/clases/asignar-alumno-clase', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(datos),
                });

                if (response.ok) {
                    alert('Alumno asignado a la clase con éxito');
                    formAsignarAlumnoClase.reset();
                } else {
                    alert('Hubo un error al asignar el alumno a la clase');
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
});
