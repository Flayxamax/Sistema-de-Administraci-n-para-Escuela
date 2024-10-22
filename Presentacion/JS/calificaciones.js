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
    
                // Asegúrate de que hay IDs
                if (!estudiantesIds || estudiantesIds.length === 0) {
                    estudiantesList.innerHTML = "<tr><td colspan='5'>No hay estudiantes registrados en esta clase.</td></tr>";
                    return;
                }
    
                // Paso 2: Hacer una llamada para obtener la información de cada estudiante
                const estudiantesPromises = estudiantesIds.map(registro => {
                    const estudianteId = registro.estudianteId; // Extraer el ID del estudiante
                    return fetch(`http://localhost:3000/api/estudiantes/${estudianteId}`)
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Error al obtener estudiante: ' + response.status);
                            }
                            return response.json(); // Devuelve el objeto estudiante
                        });
                });
    
                // Esperar a que se resuelvan todas las promesas
                Promise.all(estudiantesPromises)
                    .then(estudiantes => {
                        // Paso 3: Mostrar la información de los estudiantes
                        estudiantes.forEach(estudiante => {
                            const estudianteRow = document.createElement('tr');
    
                            estudianteRow.innerHTML = `
                                <td>${estudiante.id}</td>
                                <td>${estudiante.nombre}</td>
                                <td>${estudiante.apellido}</td>
                                <td>
                                    <input type="number" min="0" max="10" id="calificacion-${estudiante.id}" placeholder="Calificación" />
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
                                const calificacionInput = document.getElementById(`calificacion-${estudianteId}`);
                                const calificacion = calificacionInput.value;
    
                                // Asegúrate de que la calificación es válida
                                if (calificacion < 0 || calificacion > 10) {
                                    alert("La calificación debe estar entre 0 y 10.");
                                    return;
                                }
    
                                guardarCalificacion(estudianteId, claseId, calificacion);
                            });
                        });
                    })
                    .catch(error => console.error('Error al obtener la información de los estudiantes:', error));
            })
            .catch(error => console.error('Error al obtener los IDs de los estudiantes:', error));
    }
    
    
    

    // Función para guardar la calificación del estudiante
    function guardarCalificacion(estudianteId, claseId, calificacion) {
        fetch(`http://localhost:3000/api/calificaciones/${claseId}/estudiantes/${estudianteId}/calificacion`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ calificacion: calificacion })
        })
        .then(response => {
            if (response.ok) {
                alert('Calificación guardada con éxito');
            } else {
                alert('Error al guardar la calificación');
            }
        })
        .catch(error => console.error('Error al guardar la calificación:', error));
    }

    getClases();
});
