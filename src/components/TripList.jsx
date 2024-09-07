import React, { useState } from 'react';
import './TripList.css';
import { FaCalendarAlt, FaRoad, FaClock, FaMoneyBillWave, FaEllipsisV, FaEdit, FaTrash } from 'react-icons/fa';
import { db } from '../firebase';
import { doc, deleteDoc, updateDoc } from 'firebase/firestore';

function TripList({ trips, setTrips }) {
  const [activeMenu, setActiveMenu] = useState(null);
  const [editingTrip, setEditingTrip] = useState(null);

  const toggleMenu = (tripId) => {
    setActiveMenu(activeMenu === tripId ? null : tripId);
  };

  const handleEdit = (trip) => {
    setEditingTrip(trip);
    setActiveMenu(null);
  };

  const handleDelete = async (tripId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este viaje?')) {
      try {
        await deleteDoc(doc(db, "transactions", tripId));
        setTrips(trips.filter(trip => trip.id !== tripId));
      } catch (error) {
        console.error("Error al eliminar el viaje:", error);
      }
    }
    setActiveMenu(null);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      const tripRef = doc(db, "transactions", editingTrip.id);
      await updateDoc(tripRef, {
        date: editingTrip.date,
        startKm: parseFloat(editingTrip.startKm),
        endKm: parseFloat(editingTrip.endKm),
        hoursWorked: parseFloat(editingTrip.hoursWorked),
        dailyIncome: parseFloat(editingTrip.dailyIncome)
      });
      setTrips(trips.map(trip => trip.id === editingTrip.id ? editingTrip : trip));
      setEditingTrip(null);
    } catch (error) {
      console.error("Error al actualizar el viaje:", error);
    }
  };

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
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {trips.map((trip) => (
            <tr key={trip.id}>
              <td>{editingTrip?.id === trip.id ? 
                <input type="date" value={editingTrip.date} onChange={(e) => setEditingTrip({...editingTrip, date: e.target.value})} /> : 
                trip.date}
              </td>
              <td>{editingTrip?.id === trip.id ? 
                <input type="number" value={editingTrip.startKm} onChange={(e) => setEditingTrip({...editingTrip, startKm: e.target.value})} /> : 
                trip.startKm.toFixed(2)}
              </td>
              <td>{editingTrip?.id === trip.id ? 
                <input type="number" value={editingTrip.endKm} onChange={(e) => setEditingTrip({...editingTrip, endKm: e.target.value})} /> : 
                trip.endKm.toFixed(2)}
              </td>
              <td>{(trip.endKm - trip.startKm).toFixed(2)}</td>
              <td>{editingTrip?.id === trip.id ? 
                <input type="number" value={editingTrip.hoursWorked} onChange={(e) => setEditingTrip({...editingTrip, hoursWorked: e.target.value})} /> : 
                trip.hoursWorked.toFixed(2)}
              </td>
              <td>{editingTrip?.id === trip.id ? 
                <input type="number" value={editingTrip.dailyIncome} onChange={(e) => setEditingTrip({...editingTrip, dailyIncome: e.target.value})} /> : 
                `$${trip.dailyIncome.toFixed(2)}`}
              </td>
              <td>
                {editingTrip?.id === trip.id ? (
                  <button onClick={handleSaveEdit}>Guardar</button>
                ) : (
                  <div className="trip-list__menu">
                    <button onClick={() => toggleMenu(trip.id)}><FaEllipsisV /></button>
                    {activeMenu === trip.id && (
                      <div className="trip-list__menu-options">
                        <button onClick={() => handleEdit(trip)}><FaEdit /> Editar</button>
                        <button onClick={() => handleDelete(trip.id)}><FaTrash /> Eliminar</button>
                      </div>
                    )}
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TripList;