import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { FaCalendarAlt, FaRoad, FaClock, FaMoneyBillWave } from 'react-icons/fa';
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
    const fetchMonthlyReport = async () => {
      if (!user || !month) return;

      const [year, monthNum] = month.split('-');
      const startDate = new Date(year, monthNum - 1, 1);
      const endDate = new Date(year, monthNum, 0);

      try {
        const q = query(
          collection(db, "transactions"),
          where("userId", "==", user.uid),
          where("date", ">=", startDate.toISOString().split('T')[0]),
          where("date", "<=", endDate.toISOString().split('T')[0])
        );

        const querySnapshot = await getDocs(q);
        const trips = querySnapshot.docs.map(doc => doc.data());

        const totalIncome = trips.reduce((sum, trip) => sum + trip.dailyIncome, 0);
        const totalKm = trips.reduce((sum, trip) => sum + (trip.endKm - trip.startKm), 0);
        const totalHours = trips.reduce((sum, trip) => sum + trip.hoursWorked, 0);

        setReport({ totalIncome, totalKm, totalHours });
      } catch (error) {
        console.error("Error al obtener el reporte mensual:", error);
      }
    };

    fetchMonthlyReport();
  }, [user, month]);

  return (
    <div className="monthly-report">
      <h2 className="monthly-report__title">Cierre Mensual</h2>
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
              <p>${report.totalIncome.toFixed(2)}</p>
            </div>
          </div>
          <div className="monthly-report__result km">
            <FaRoad className="monthly-report__icon" />
            <div className="monthly-report__data">
              <h3>Km totales</h3>
              <p>{report.totalKm.toFixed(2)} km</p>
            </div>
          </div>
          <div className="monthly-report__result hours">
            <FaClock className="monthly-report__icon" />
            <div className="monthly-report__data">
              <h3>Horas totales</h3>
              <p>{report.totalHours.toFixed(2)} hrs</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MonthlyReport;