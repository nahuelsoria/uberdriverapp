import React from 'react';
import './TripList.css';
import { FaCalendarAlt, FaRoad, FaClock, FaMoneyBillWave } from 'react-icons/fa';

function TripList({ trips }) {
  return (
    <div className="trip-list">
      <table className="trip-list__table">
        <thead>
          <tr>
            <th><FaCalendarAlt /> Fecha</th>
            <th><FaRoad /> Km iniciales</th>
            <th><FaRoad /> Km finales</th>
            <th><FaRoad /> Km recorridos</th>
            <th><FaClock /> Horas trabajadas</th>
            <th><FaMoneyBillWave /> Ingreso diario</th>
          </tr>
        </thead>
        <tbody>
          {trips.map((trip, index) => (
            <tr key={index}>
              <td>{trip.date}</td>
              <td>{trip.startKm.toFixed(2)}</td>
              <td>{trip.endKm.toFixed(2)}</td>
              <td>{(trip.endKm - trip.startKm).toFixed(2)}</td>
              <td>{trip.hoursWorked.toFixed(2)}</td>
              <td>${trip.dailyIncome.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TripList;