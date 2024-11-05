document.addEventListener("DOMContentLoaded", function () {
    const claseList = document.getElementById('clases-list');
    const estudiantesList = document.getElementById('estudiantes-list');
    const estudianteInfoMap = new Map();

    // Función para obtener las clases
    function getClases() {
        fetch(`http://localhost:3000/api/clases/consulta`)
            .then(response => response.json())
            .then(data => {
                claseList.innerHTML = "";

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

                    claseList.appendChild(claseRow);
                });

                // Añadir event listeners a los botones "Consultar"
                document.querySelectorAll('.consult-class').forEach(button => {
                    button.addEventListener('click', function () {
                        const claseId = this.getAttribute('data-id');
                        const claseNombre = this.closest('tr').querySelector('td:nth-child(2)').innerText;
                        consultarEstudiantes(claseId, claseNombre);
                    });
                });
            });
    }

    // Función para consultar los estudiantes de una clase
    function consultarEstudiantes(claseId, claseNombre) {
        fetch(`http://localhost:3000/api/clases/${claseId}/estudiantes`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error en la red: ' + response.status);
                }
                return response.json();
            })
            .then(estudiantesIds => {
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
                        estudiantes.forEach(({ estudiante, calificacion }) => {
                            const estudianteRow = document.createElement('tr');

                            estudianteRow.innerHTML = `
                                <td>${estudiante.id}</td>
                                <td>${estudiante.nombre}</td>
                                <td>${estudiante.apellido}</td>
                                <td>${calificacion.parcial1}</td>
                                <td>${calificacion.parcial2}</td>
                                <td>${calificacion.parcial3}</td>
                                <td><button data-id="${estudiante.id}" class="generar-reporte">Generar reporte de calificaciones</button></td>
                            `;

                            estudiantesList.appendChild(estudianteRow);
                        });

                        // Añadir event listeners a los botones "Generar reporte"
                        document.querySelectorAll('.generar-reporte').forEach(button => {
                            button.addEventListener('click', function () {
                                const estudianteId = this.getAttribute('data-id');
                                const estudianteData = estudiantes.find(({ estudiante }) => estudiante.id == estudianteId);
                                estudianteInfoMap.clear();
                                estudianteInfoMap.set(estudianteId, {
                                    claseNombre,
                                    estudianteNombre: `${estudianteData.estudiante.nombre} ${estudianteData.estudiante.apellido}`,
                                    calificaciones: estudianteData.calificacion
                                });

                                generarReportePDF(estudianteId);
                            });
                        });
                    })
                    .catch(error => console.error('Error al obtener la información de los estudiantes:', error));
            })
            .catch(error => console.error('Error al obtener los IDs de los estudiantes:', error));
    }

    // Función para generar el PDF
    function generarReportePDF(estudianteId) {
        const { claseNombre, estudianteNombre, calificaciones } = estudianteInfoMap.get(estudianteId);
        let promedio = ((+calificaciones.parcial1 + +calificaciones.parcial2 + +calificaciones.parcial3) / 3);
        promedio = Math.round(promedio);

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Título del reporte
        doc.setFontSize(30);
        doc.text("Reporte de Calificaciones", doc.internal.pageSize.width / 2, 20, { align: "center" });

        // Información del estudiante
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text(`Nombre:`, 20, 40);
        doc.setFont("helvetica", "normal");
        doc.text(estudianteNombre, 50, 40);

        doc.setFont("helvetica", "bold");
        doc.text(`Clase:`, 20, 50);
        doc.setFont("helvetica", "normal");
        doc.text(claseNombre, 50, 50);

        // Tabla de calificaciones
        doc.setFont("helvetica", "bold");
        doc.text("Calificaciones:", 20, 70);
        doc.autoTable({
            startY: 80,
            head: [['Parcial 1', 'Parcial 2', 'Parcial 3', 'Calificación final']],
            body: [[calificaciones.parcial1, calificaciones.parcial2, calificaciones.parcial3, promedio]],
            headStyles: {
                fillColor: [41, 82, 85],
                textColor: [255, 255, 255] 
            },
            bodyStyles: {
                fillColor: [245, 245, 245],
                textColor: [0, 0, 0]
            }
        });

        doc.save(`ReporteCalificacion_${estudianteNombre.replace(/ /g, "_")}_${claseNombre.replace(/ /g, "_")}.pdf`);
    }

    getClases();
});
