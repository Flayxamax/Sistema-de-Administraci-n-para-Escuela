// Mostrar formulario al hacer clic
function mostrarFormulario() {
    const formulario = document.getElementById('formularioRegistro');
    formulario.style.display = 'block';
}

// Manejo del envío del formulario
const form = document.getElementById('registroEstudiante');
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const datos = Object.fromEntries(new FormData(form));
    const response = await fetch('http://localhost:3000/api/estudiantes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos),
    });

    if (response.ok) {
        const resultado = await response.json();
        console.log('Estudiante registrado:', resultado);
        alert('Estudiante registrado con éxito');
        form.reset(); // Limpiar el formulario
    } else {
        console.error('Error al registrar estudiante');
        alert('Hubo un error al registrar el estudiante');
    }
});
