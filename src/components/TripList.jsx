import React from 'react';
import './TripList.css';

function TripList({ trips }) {
  return (
    <div className="trip-list">
      <h2 className="trip-list__title">Lista de Viajes</h2>
      <table className="trip-list__table">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Km iniciales</th>
            <th>Km finales</th>
            <th>Km recorridos</th>
            <th>Horas trabajadas</th>
            <th>Ingreso diario</th>
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