import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { FaCalendarAlt, FaRoad, FaClock, FaMoneyBillWave, FaDollarSign } from 'react-icons/fa';
import './MonthlyReport.css';

function MonthlyReport() {
  const [user] = useAuthState(auth);
  const [month, setMonth] = useState(getCurrentMonth());
  const [report, setReport] = useState(null);

  function getCurrentMonth() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  }

  useEffect(() => {
    let unsubscribe = () => {};

    if (user && month) {
      const [year, monthNum] = month.split('-');
      const startDate = new Date(year, monthNum - 1, 1);
      const endDate = new Date(year, monthNum, 0);

      const q = query(
        collection(db, "transactions"),
        where("userId", "==", user.uid),
        where("date", ">=", startDate.toISOString().split('T')[0]),
        where("date", "<=", endDate.toISOString().split('T')[0])
      );

      unsubscribe = onSnapshot(q, (querySnapshot) => {
        const trips = querySnapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id
        }));

        const totalIncome = Math.round(trips.reduce((sum, trip) => sum + (parseFloat(trip.dailyIncome) || 0), 0));
        const totalKm = Math.round(trips.reduce((sum, trip) => sum + (parseFloat(trip.endKm) - parseFloat(trip.startKm) || 0), 0));
        const totalHours = Math.round(trips.reduce((sum, trip) => sum + (parseFloat(trip.hoursWorked) || 0), 0));
        const incomePerHour = totalHours > 0 ? totalIncome / totalHours : 0;

        setReport({ totalIncome, totalKm, totalHours, incomePerHour });
      }, (error) => {
        console.error("Error al obtener el reporte mensual en tiempo real:", error);
      });
    }

    return () => unsubscribe();
  }, [user, month]);

  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

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

export default MonthlyReport;