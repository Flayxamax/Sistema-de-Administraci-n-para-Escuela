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

// Llamar a la función listarPagos al cargar la página
window.onload = listarPagos;
      