document.addEventListener("DOMContentLoaded", function () {
    const claseList = document.getElementById('clases-list');
    const estudiantesList = document.getElementById('estudiantes-list');

    // Función para obtener las clases
    function getClases() {
        fetch(`http://localhost:3000/api/clases/consulta`)
            .then(response => response.json())
            .then(data => {
                claseList.innerHTML = ""; // Limpiar la tabla antes de rellenarla

                data.forEach(clase => {
                    const claseRow = document.createElement('tr');

                    claseRow.innerHTML = `
                        <td>${clase.id}</td>
                        <td>${clase.nombre}</td>
                        <td>${clase.fechaInicio}</td>
                        <td>${clase.fechaFin}</td>
                        <td>${clase.horaInicio}</td>
                        <td>${clase.horaFin}</td>
                        <td>${clase.aula}</td>
                        <td><button data-id="${clase.id}" class='consult-class'>Consultar</button></td>
                    `;

                    console.log(clase.id);
                    claseList.appendChild(claseRow);
                });

                // Añadir event listeners a los botones "Consultar"
                document.querySelectorAll('.consult-class').forEach(button => {
                    button.addEventListener('click', function () {
                        const claseId = this.getAttribute('data-id');
                        consultarEstudiantes(claseId);
                    });
                });
            });
    }

    // Función para consultar los estudiantes de una clase
    function consultarEstudiantes(claseId) {
        // Obtener IDs de estudiantes de la clase
        fetch(`http://localhost:3000/api/clases/${claseId}/estudiantes`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error en la red: ' + response.status);
                }
                return response.json();
            })
            .then(estudiantesIds => {
                console.log(`IDs de estudiantes de la clase ${claseId}:`, estudiantesIds);
    
                // Limpiar lista de estudiantes anteriores
                estudiantesList.innerHTML = "";

                if (!estudiantesIds || estudiantesIds.length === 0) {
                    estudiantesList.innerHTML = "<tr><td colspan='7'>No hay estudiantes registrados en esta clase.</td></tr>";
                    return;
                }
    
                const estudiantesPromises = estudiantesIds.map(registro => {
                    const estudianteId = registro.estudianteId; 
                    return fetch(`http://localhost:3000/api/estudiantes/${estudianteId}`)
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Error al obtener estudiante: ' + response.status);
                            }
                            return response.json();
                        })
                        .then(estudiante => {
                            return fetch(`http://localhost:3000/api/calificaciones/${claseId}/estudiantes/${estudianteId}`)
                                .then(response => {
                                    if (!response.ok) {
                                        throw new Error('Error al obtener calificación: ' + response.status);
                                    }
                                    return response.json()
                                    .then(calificacion => {
                                        return {
                                            estudiante,
                                            calificacion: {
                                                parcial1: calificacion.parcial1 !== null ? calificacion.parcial1 : '',
                                                parcial2: calificacion.parcial2 !== null ? calificacion.parcial2 : '',
                                                parcial3: calificacion.parcial3 !== null ? calificacion.parcial3 : ''
                                            }
                                        };
                                    });
                                });
                        });
                });
    
                Promise.all(estudiantesPromises)
                    .then(estudiantes => {
                        estudiantes.forEach(({estudiante, calificacion })=> {
                            const estudianteRow = document.createElement('tr');
    
                            estudianteRow.innerHTML = `
                                <td>${estudiante.id}</td>
                                <td>${estudiante.nombre}</td>
                                <td>${estudiante.apellido}</td>
                                <td>
                                    <input type="number" min="0" max="10" id="parcial1-${estudiante.id}" placeholder="Parcial 1" value="${calificacion.parcial1 !== null ? calificacion.parcial1 : ''}"/>
                                </td>
                                <td>
                                    <input type="number" min="0" max="10" id="parcial2-${estudiante.id}" placeholder="Parcial 2" value="${calificacion.parcial2 !== null ? calificacion.parcial2 : ''}"/>
                                </td>
                                <td>
                                    <input type="number" min="0" max="10" id="parcial3-${estudiante.id}" placeholder="Parcial 3" value="${calificacion.parcial3 !== null ? calificacion.parcial3 : ''}"/>
                                </td>
                                <td>
                                    <button data-id="${estudiante.id}" class="guardar-calificacion">Guardar Calificación</button>
                                </td>
                            `;
    
                            estudiantesList.appendChild(estudianteRow);
                        });
    
                        // Añadir event listeners a los botones "Guardar Calificación"
                        document.querySelectorAll('.guardar-calificacion').forEach(button => {
                            button.addEventListener('click', function () {
                                const estudianteId = this.getAttribute('data-id');
                                const parcial1 = document.getElementById(`parcial1-${estudianteId}`).value;
                                const parcial2 = document.getElementById(`parcial2-${estudianteId}`).value;
                                const parcial3 = document.getElementById(`parcial3-${estudianteId}`).value;
    
                                if ((parcial1 < 0 || parcial1 > 10) || (parcial2 < 0 || parcial2 > 10) || (parcial3 < 0 || parcial3 > 10)) {
                                    alert("Cada calificación debe estar entre 0 y 10.");
                                    return;
                                }
                                if (!parcial1 && !parcial2 && !parcial3) {
                                    alert("Debes ingresar al menos una calificación.");
                                    return;
                                }
                                if (parcial2 && !parcial1) {
                                    alert("Debes ingresar la calificación de Parcial 1 antes de guardar Parcial 2.");
                                    return;
                                }
                                if (parcial3 && !parcial2) {
                                    alert("Debes ingresar la calificación de Parcial 2 antes de guardar Parcial 3.");
                                    return;
                                }
                                const parciales = {};
                                if (parcial1) parciales.parcial1 = parcial1;
                                if (parcial2) parciales.parcial2 = parcial2;
                                if (parcial3) parciales.parcial3 = parcial3;
                                
                                guardarCalificacion(estudianteId, claseId, { parcial1, parcial2, parcial3 });
                            });
                        });
                    })
                    .catch(error => console.error('Error al obtener la información de los estudiantes:', error));
            })
            .catch(error => console.error('Error al obtener los IDs de los estudiantes:', error));
    }
    
    
    

    // Función para guardar la calificación del estudiante
    function guardarCalificacion(estudianteId, claseId, parciales) {
        fetch(`http://localhost:3000/api/calificaciones/${claseId}/estudiantes/${estudianteId}/calificacion`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                parcial1: parciales.parcial1,
                parcial2: parciales.parcial2,
                parcial3: parciales.parcial3
            })
        })
        .then(response => {
            if (response.ok) {
                Swal.fire({
                    title: '¡Éxito!',
                    text: 'Calificaciones guardadas con éxito',
                    icon: 'success',
                    confirmButtonText: 'Aceptar'
                });
            } else {
                Swal.fire({
                    title: 'Error',
                    text: 'Error al guardar las calificaciones',
                    icon: 'error',
                    confirmButtonText: 'Intentar de nuevo'
                });
            }
        })
        .catch(error => console.error('Error al guardar las calificaciones:', error));
    }

    getClases();
});
