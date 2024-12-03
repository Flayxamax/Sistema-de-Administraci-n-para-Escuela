const paymentTable = document.getElementById('paymentTable');

      // Función para obtener los pagos desde el backend
    async function listarPagos() {
        try {
            const response = await fetch('http://localhost:3000/api/pagos/listar');
            const pagos = await response.json();

            if (response.ok) {
                pagos.forEach(pago => {
                    agregarFilaATabla(pago.nombreEstudiante, pago.mes, pago.monto);
                });
            } else {
                console.error('Error al obtener pagos:', pagos.message);
            }
        } catch (error) {
            console.error('Error al listar pagos:', error);
        }
    }

      // Función para registrar un pago
      async function addPayment() {
          const studentName = document.getElementById('studentName').value;
          const month = document.getElementById('month').value;
          const amount = document.getElementById('amount').value;
      
          if (!studentName || !month || !amount) {
              alert('Por favor, complete todos los campos.');
              return;
          }
      
          try {
              const response = await fetch('http://localhost:3000/api/pagos/registrar', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                      nombreEstudiante: studentName,
                      mes: month,
                      monto: parseFloat(amount),
                  }),
              });
      
              const result = await response.json();
              if (response.ok) {
                  alert('Pago registrado exitosamente');
                  agregarFilaATabla(result.pago);
              } else {
                  alert(`Error: ${result.message}`);
              }
          } catch (error) {
              console.error('Error registrando pago:', error);
          }
      }
      
      // Función para agregar la fila a la tabla
    function agregarFilaATabla(nombreEstudiante, mes, monto) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${nombreEstudiante}</td>
            <td>${mes}</td>
            <td>${monto}</td>
        `;
        paymentTable.appendChild(row);
    }

const studentNameInput = document.getElementById('studentName');
const suggestionsContainer = document.createElement('div'); 
suggestionsContainer.setAttribute('id', 'suggestions');
studentNameInput.parentNode.appendChild(suggestionsContainer);


function validarInput(input) {
    const errorSpan = document.getElementById(`error-${input.id}`);
    if (!input.validity.valid) {
        errorSpan.textContent = input.title;
        errorSpan.style.color = 'red';
    } else {
        errorSpan.textContent = '';
    }
}

// Asociar validación dinámica
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', () => validarInput(input));
});

// Función para buscar estudiantes mientras se escribe
async function buscarEstudiantes(query) {
    if (query.length < 2) {
        limpiarSugerencias();
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/api/estudiantes/buscar?nombre=${query}`);
        const estudiantes = await response.json();

        if (response.ok) {
            mostrarSugerencias(estudiantes);
        } else {
            console.error('Error al buscar estudiantes:', estudiantes.message);
        }
    } catch (error) {
        console.error('Error en la búsqueda:', error);
    }
}

// Función para mostrar las sugerencias
function mostrarSugerencias(estudiantes) {
    limpiarSugerencias();
    estudiantes.forEach(estudiante => {
        const suggestion = document.createElement('div');
        suggestion.classList.add('suggestion');
        suggestion.textContent = `${estudiante.nombre} ${estudiante.apellido}`;
        suggestion.onclick = () => seleccionarEstudiante(`${estudiante.nombre} ${estudiante.apellido}`);
        suggestionsContainer.appendChild(suggestion);
    });
}


function seleccionarEstudiante(nombreCompleto) {
    studentNameInput.value = nombreCompleto;
    limpiarSugerencias();
}

function limpiarSugerencias() {
    suggestionsContainer.innerHTML = '';
}

studentNameInput.addEventListener('input', (e) => {
    buscarEstudiantes(e.target.value);
});

// Llamar a la función listarPagos al cargar la página
window.onload = listarPagos;
      