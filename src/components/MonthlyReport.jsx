import React, { useState } from 'react';
import './MonthlyReport.css';

function MonthlyReport({ trips }) {
  const [month, setMonth] = useState('');

  const calculateMonthlyReport = () => {
    const selectedMonth = month.split('-')[1];
    const selectedYear = month.split('-')[0];
    
    const monthlyTrips = trips.filter(trip => {
      const tripDate = new Date(trip.date);
      return tripDate.getMonth() + 1 === parseInt(selectedMonth) && 
             tripDate.getFullYear() === parseInt(selectedYear);
    });

    const totalIncome = monthlyTrips.reduce((sum, trip) => sum + trip.dailyIncome, 0);
    const totalKm = monthlyTrips.reduce((sum, trip) => sum + (trip.endKm - trip.startKm), 0);
    const totalHours = monthlyTrips.reduce((sum, trip) => sum + trip.hoursWorked, 0);

    return { totalIncome, totalKm, totalHours };
  };

  const report = month ? calculateMonthlyReport() : null;

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
          <p className="monthly-report__result">Ingreso total: <span>{report.totalIncome.toFixed(2)}</span></p>
          <p className="monthly-report__result">Km totales: <span>{report.totalKm.toFixed(2)}</span></p>
          <p className="monthly-report__result">Horas totales: <span>{report.totalHours.toFixed(2)}</span></p>
        </div>
      )}
    </div>
  );
}

export default MonthlyReport;