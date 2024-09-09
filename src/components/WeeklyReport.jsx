import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { FaCalendarAlt, FaRoad, FaClock, FaMoneyBillWave } from 'react-icons/fa';
import './WeeklyReport.css';

function WeeklyReport() {
  const [user] = useAuthState(auth);
  const [weekStart, setWeekStart] = useState(getWeekStart());
  const [report, setReport] = useState(null);

  function getWeekStart(date = new Date()) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    return new Date(d.setDate(diff)).toISOString().split('T')[0];
  }

  useEffect(() => {
    const fetchWeeklyReport = async () => {
      if (!user || !weekStart) return;

      const startDate = new Date(weekStart);
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);

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
        console.error("Error al obtener el reporte semanal:", error);
      }
    };

    fetchWeeklyReport();
  }, [user, weekStart]);

  const formatNumber = (num) => {
    return Math.round(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const formatDateRange = (start) => {
    const startDate = new Date(start);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
    return `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
  };

  const handleDateChange = (e) => {
    const selectedDate = new Date(e.target.value);
    setWeekStart(getWeekStart(selectedDate));
  };

  return (
    <div className="weekly-report">
      <h2 className="weekly-report__title">Reporte Semanal</h2>
      <div className="weekly-report__controls">
        <input
          type="date"
          value={weekStart}
          onChange={handleDateChange}
          className="weekly-report__input"
        />
        <span className="weekly-report__date-range">{formatDateRange(weekStart)}</span>
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
        </div>
      )}
    </div>
  );
}

export default WeeklyReport;