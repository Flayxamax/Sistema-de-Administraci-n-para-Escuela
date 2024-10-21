function mostrarFormulario() {
    const formulario = document.getElementById('formularioRegistro');
    formulario.style.display = 'block';
}

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
});