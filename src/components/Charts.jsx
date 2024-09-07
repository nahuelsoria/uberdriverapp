import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../firebase';
import '../components/Charts.css';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function Charts() {
  const [chartData, setChartData] = useState({ labels: [], incomeData: [], kmData: [] });

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      console.error("Usuario no autenticado");
      return;
    }

    const q = query(collection(db, "transactions"), where("userId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const trips = querySnapshot.docs.map(doc => doc.data());
      const sortedTrips = trips.sort((a, b) => new Date(a.date) - new Date(b.date));

      const labels = sortedTrips.map(trip => trip.date);
      const incomeData = sortedTrips.map(trip => trip.dailyIncome);
      const kmData = sortedTrips.map(trip => trip.endKm - trip.startKm);

      setChartData({ labels, incomeData, kmData });
    });

    return () => unsubscribe();
  }, []);

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

  return (
    <div className="charts">
      <Line options={options} data={incomeChartData} />
      <Line options={options} data={kmChartData} />
    </div>
  );
}

export default Charts;