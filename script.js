const apiUrl = "https://apisensor-392870845260.us-central1.run.app/getdata"; // URL de tu API

// Crear gráficos con Chart.js
const createChart = (ctx) =>
  new Chart(ctx, {
    type: "line",
    data: {
      labels: [], // Etiquetas de tiempo
      datasets: [
        {
          label: "Temperatura (°C)",
          data: [], // Datos de temperatura
          borderColor: "rgba(255, 99, 132, 1)",
          borderWidth: 2,
          fill: false,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        x: { display: true },
        y: { display: true },
      },
    },
  });

// Inicializar gráficos para cada sensor
const chartSensor1 = createChart(
  document.getElementById("chartSensor1").getContext("2d")
);
const chartSensor2 = createChart(
  document.getElementById("chartSensor2").getContext("2d")
);
const chartSensor3 = createChart(
  document.getElementById("chartSensor3").getContext("2d")
);

// Función para obtener datos de la API
async function fetchData() {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.statusText}`);
    }

    const json = await response.json();
    console.log("Datos recibidos desde la API:", json);

    // Validar que los datos existen
    if (!json.data || json.data.length === 0) {
      console.warn("No se encontraron datos en la API.");
      return;
    }

    // Filtrar datos por sensores
    const dataSensor1 = json.data.filter((item) => item.sensor_id === "sensor_1");
    const dataSensor2 = json.data.filter((item) => item.sensor_id === "sensor_2");
    const dataSensor3 = json.data.filter((item) => item.sensor_id === "sensor_3");

    // Actualizar gráficos y tablas
    updateChart(chartSensor1, dataSensor1);
    updateTable("historyTableSensor1", dataSensor1);

    updateChart(chartSensor2, dataSensor2);
    updateTable("historyTableSensor2", dataSensor2);

    updateChart(chartSensor3, dataSensor3);
    updateTable("historyTableSensor3", dataSensor3);
  } catch (error) {
    console.error("Error al obtener los datos:", error);
  }
}

// Función para actualizar gráficos
function updateChart(chart, data) {
  if (data.length === 0) {
    console.warn("No hay datos para actualizar el gráfico.");
    return;
  }

  const timestamps = data.map((item) => item.timestamp);
  const temperatures = data.map((item) => item.temperatura);

  console.log("Etiquetas (timestamps):", timestamps);
  console.log("Datos de temperatura:", temperatures);

  chart.data.labels = timestamps; // Actualizar etiquetas
  chart.data.datasets[0].data = temperatures; // Actualizar datos
  chart.update();
}

// Función para actualizar tablas
function updateTable(tableId, data) {
  const tableBody = document.querySelector(`#${tableId} tbody`);
  if (!tableBody) {
    console.error(`No se encontró la tabla con el ID: ${tableId}`);
    return;
  }

  console.log(`Actualizando tabla ${tableId} con datos:`, data);

  tableBody.innerHTML = ""; // Limpiar contenido previo

  data.forEach((item) => {
    const row = `
      <tr>
        <td>${item.timestamp}</td>
        <td>${item.temperatura.toFixed(1)} °C</td>
        <td>${item.calidad_aire_analog}</td>
        <td>${item.calidad_aire_digital}</td>
        <td>${capitalize(item.estado)}</td>
      </tr>
    `;
    tableBody.innerHTML += row;
  });
}

// Función para capitalizar cadenas
function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

// Llamar a la función para obtener datos al cargar la página
fetchData();
