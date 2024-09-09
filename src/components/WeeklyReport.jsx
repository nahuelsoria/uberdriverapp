// Importación de módulos necesarios
import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { FaCalendarAlt, FaRoad, FaClock, FaMoneyBillWave, FaDollarSign } from 'react-icons/fa';
import './WeeklyReport.css';

// Definición del componente WeeklyReport
function WeeklyReport() {
  // Estado para el usuario autenticado
  const [user] = useAuthState(auth);
  // Estado para la semana seleccionada, inicializada con la semana actual
  const [selectedWeek, setSelectedWeek] = useState(getCurrentWeek());
  // Estado para almacenar el reporte
  const [report, setReport] = useState(null);

  // Función para obtener la semana actual en formato 'YYYY-WXX'
  function getCurrentWeek() {
    const now = new Date();
    const yearStart = new Date(now.getFullYear(), 0, 1);
    const weekNumber = Math.ceil((((now - yearStart) / 86400000) + yearStart.getDay() + 1) / 7);
    return `${now.getFullYear()}-W${weekNumber.toString().padStart(2, '0')}`;
  }

  // Función para obtener las fechas de inicio y fin de una semana dada
  function getWeekDates(weekString) {
    const [year, week] = weekString.split('-W');
    const firstDayOfYear = new Date(parseInt(year), 0, 1);
    const daysToFirstMonday = (8 - firstDayOfYear.getDay()) % 7;
    const firstMonday = new Date(firstDayOfYear.getTime() + daysToFirstMonday * 86400000);
    const weekStart = new Date(firstMonday.getTime() + (parseInt(week) - 1) * 7 * 86400000);
    const weekEnd = new Date(weekStart.getTime() + 6 * 86400000);
    return { weekStart, weekEnd };
  }

  // Efecto para cargar y actualizar el reporte cuando cambia el usuario o la semana seleccionada
  useEffect(() => {
    let unsubscribe = () => {};

    if (user && selectedWeek) {
      const { weekStart, weekEnd } = getWeekDates(selectedWeek);

      // Consulta a Firestore para obtener las transacciones de la semana seleccionada
      const q = query(
        collection(db, "transactions"),
        where("userId", "==", user.uid),
        where("date", ">=", weekStart.toISOString().split('T')[0]),
        where("date", "<=", weekEnd.toISOString().split('T')[0])
      );

      // Suscripción a los cambios en tiempo real de la consulta
      unsubscribe = onSnapshot(q, (querySnapshot) => {
        const trips = querySnapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id
        }));

        // Cálculo de totales
        const totalIncome = Math.round(trips.reduce((sum, trip) => sum + (parseFloat(trip.dailyIncome) || 0), 0));
        const totalKm = Math.round(trips.reduce((sum, trip) => sum + (parseFloat(trip.endKm) - parseFloat(trip.startKm) || 0), 0));
        const totalHours = Math.round(trips.reduce((sum, trip) => sum + (parseFloat(trip.hoursWorked) || 0), 0));
        const incomePerHour = totalHours > 0 ? totalIncome / totalHours : 0;

        // Actualización del estado del reporte
        setReport({ totalIncome, totalKm, totalHours, incomePerHour });
      }, (error) => {
        console.error("Error al obtener el reporte semanal en tiempo real:", error);
      });
    }

    // Limpieza de la suscripción al desmontar el componente
    return () => unsubscribe();
  }, [user, selectedWeek]);

  // Función para formatear números con separadores de miles
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  // Función para formatear el rango de fechas de la semana seleccionada
  const formatDateRange = (weekString) => {
    const { weekStart, weekEnd } = getWeekDates(weekString);
    return `${weekStart.toLocaleDateString()} - ${weekEnd.toLocaleDateString()}`;
  };

  // Renderizado del componente
  return (
    <div className="weekly-report">
      <h2 className="weekly-report__title">Reporte Semanal</h2>
      <div className="weekly-report__controls">
        <input
          type="week"
          value={selectedWeek}
          onChange={(e) => setSelectedWeek(e.target.value)}
          max={getCurrentWeek()}
          className="weekly-report__input"
        />
        <span className="weekly-report__date-range">{formatDateRange(selectedWeek)}</span>
      </div>
      {report && (
        <div className="weekly-report__results">
          <div className="weekly-report__result income">
            <FaMoneyBillWave className="weekly-report__icon" />
            <div className="weekly-report__data">
              <h3>Ingreso total</h3>
              <p>${formatNumber(report.totalIncome)}</p>
            </div>
          </div>
          <div className="weekly-report__result km">
            <FaRoad className="weekly-report__icon" />
            <div className="weekly-report__data">
              <h3>Km totales</h3>
              <p>{formatNumber(report.totalKm)} km</p>
            </div>
          </div>
          <div className="weekly-report__result hours">
            <FaClock className="weekly-report__icon" />
            <div className="weekly-report__data">
              <h3>Horas totales</h3>
              <p>{formatNumber(report.totalHours)} hrs</p>
            </div>
          </div>
          <div className="weekly-report__result income-per-hour">
            <FaDollarSign className="weekly-report__icon" />
            <div className="weekly-report__data">
              <h3>Ingreso por hora</h3>
              <p>${formatNumber(Math.round(report.incomePerHour))}/hr</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default WeeklyReport;