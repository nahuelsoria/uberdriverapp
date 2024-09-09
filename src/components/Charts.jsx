// Importación de módulos necesarios
import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../firebase';
import '../components/Charts.css';

// Registro de los componentes necesarios para Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function Charts() {
  // Estado para almacenar los datos del gráfico
  const [chartData, setChartData] = useState({ labels: [], incomeData: [], kmData: [] });

  useEffect(() => {
    // Verificar si el usuario está autenticado
    const user = auth.currentUser;
    if (!user) {
      console.error("Usuario no autenticado");
      return;
    }

    // Crear una consulta para obtener las transacciones del usuario actual
    const q = query(collection(db, "transactions"), where("userId", "==", user.uid));
    
    // Suscribirse a los cambios en tiempo real de la consulta
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      // Mapear los documentos a objetos de viaje
      const trips = querySnapshot.docs.map(doc => doc.data());
      // Ordenar los viajes por fecha
      const sortedTrips = trips.sort((a, b) => new Date(a.date) - new Date(b.date));

      // Extraer datos para los gráficos
      const labels = sortedTrips.map(trip => trip.date);
      const incomeData = sortedTrips.map(trip => trip.dailyIncome);
      const kmData = sortedTrips.map(trip => trip.endKm - trip.startKm);

      // Actualizar el estado con los nuevos datos
      setChartData({ labels, incomeData, kmData });
    });

    // Limpiar la suscripción cuando el componente se desmonte
    return () => unsubscribe();
  }, []);

  // Configuración de datos para el gráfico de ingresos
  const incomeChartData = {
    labels: chartData.labels,
    datasets: [
      {
        label: 'Ingresos Diarios',
        data: chartData.incomeData,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  // Configuración de datos para el gráfico de kilómetros
  const kmChartData = {
    labels: chartData.labels,
    datasets: [
      {
        label: 'Kilómetros Recorridos',
        data: chartData.kmData,
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1,
      },
    ],
  };

  // Opciones comunes para ambos gráficos
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Tendencias de Ingresos y Actividad',
      },
    },
  };

  // Renderizar los gráficos
  return (
    <div className="charts">
      <Line options={options} data={incomeChartData} />
      <Line options={options} data={kmChartData} />
    </div>
  );
}

export default Charts;