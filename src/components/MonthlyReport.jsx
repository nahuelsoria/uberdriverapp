// Importamos las dependencias necesarias
import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { FaCalendarAlt, FaRoad, FaClock, FaMoneyBillWave, FaDollarSign } from 'react-icons/fa';
import './MonthlyReport.css';

// Definimos el componente MonthlyReport
function MonthlyReport() {
  // Utilizamos el hook useAuthState para obtener el usuario actual
  const [user] = useAuthState(auth);
  // Estado para almacenar el mes seleccionado
  const [month, setMonth] = useState(getCurrentMonth());
  // Estado para almacenar el reporte mensual
  const [report, setReport] = useState(null);

  // Función para obtener el mes actual en formato YYYY-MM
  function getCurrentMonth() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  }

  // Efecto que se ejecuta cuando cambia el usuario o el mes seleccionado
  useEffect(() => {
    let unsubscribe = () => {};

    if (user && month) {
      // Obtenemos el año y mes del mes seleccionado
      const [year, monthNum] = month.split('-');
      // Calculamos las fechas de inicio y fin del mes
      const startDate = new Date(year, monthNum - 1, 1);
      const endDate = new Date(year, monthNum, 0);

      // Creamos una consulta para obtener las transacciones del usuario en el mes seleccionado
      const q = query(
        collection(db, "transactions"),
        where("userId", "==", user.uid),
        where("date", ">=", startDate.toISOString().split('T')[0]),
        where("date", "<=", endDate.toISOString().split('T')[0])
      );

      // Nos suscribimos a los cambios en tiempo real de la consulta
      unsubscribe = onSnapshot(q, (querySnapshot) => {
        // Mapeamos los documentos a objetos de viaje
        const trips = querySnapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id
        }));

        // Calculamos los totales del reporte
        const totalIncome = Math.round(trips.reduce((sum, trip) => sum + (parseFloat(trip.dailyIncome) || 0), 0));
        const totalKm = Math.round(trips.reduce((sum, trip) => sum + (parseFloat(trip.endKm) - parseFloat(trip.startKm) || 0), 0));
        const totalHours = Math.round(trips.reduce((sum, trip) => sum + (parseFloat(trip.hoursWorked) || 0), 0));
        const incomePerHour = totalHours > 0 ? totalIncome / totalHours : 0;

        // Actualizamos el estado del reporte
        setReport({ totalIncome, totalKm, totalHours, incomePerHour });
      }, (error) => {
        console.error("Error al obtener el reporte mensual en tiempo real:", error);
      });
    }

    // Limpiamos la suscripción cuando el componente se desmonta
    return () => unsubscribe();
  }, [user, month]);

  // Función para formatear números con separadores de miles
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  // Renderizamos el componente
  return (
    <div className="monthly-report">
      <h2 className="monthly-report__title">Reporte Mensual</h2>
      <div className="monthly-report__inputs">
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          required
          className="monthly-report__input"
        />
      </div>
      {report && (
        <div className="monthly-report__results">
          {/* Mostramos los resultados del reporte */}
          <div className="monthly-report__result income">
            <FaMoneyBillWave className="monthly-report__icon" />
            <div className="monthly-report__data">
              <h3>Ingreso total</h3>
              <p>${formatNumber(report.totalIncome)}</p>
            </div>
          </div>
          <div className="monthly-report__result km">
            <FaRoad className="monthly-report__icon" />
            <div className="monthly-report__data">
              <h3>Km totales</h3>
              <p>{formatNumber(report.totalKm)} km</p>
            </div>
          </div>
          <div className="monthly-report__result hours">
            <FaClock className="monthly-report__icon" />
            <div className="monthly-report__data">
              <h3>Horas totales</h3>
              <p>{formatNumber(report.totalHours)} hrs</p>
            </div>
          </div>
          <div className="monthly-report__result income-per-hour">
            <FaDollarSign className="monthly-report__icon" />
            <div className="monthly-report__data">
              <h3>Ingreso por hora</h3>
              <p>${formatNumber(Math.round(report.incomePerHour))}/hr</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Exportamos el componente MonthlyReport
export default MonthlyReport;