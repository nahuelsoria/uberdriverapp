import React, { useState } from 'react';
import './TripList.css';
import { FaCalendarAlt, FaRoad, FaClock, FaMoneyBillWave, FaEllipsisV, FaEdit, FaTrash, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { db } from '../firebase';
import { doc, deleteDoc, updateDoc } from 'firebase/firestore';

function TripList({ trips, setTrips }) {
  const [activeMenu, setActiveMenu] = useState(null);
  const [editingTrip, setEditingTrip] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const tripsPerPage = 5;

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

  const formatNumber = (num) => {
    return Math.round(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const indexOfLastTrip = currentPage * tripsPerPage;
  const indexOfFirstTrip = indexOfLastTrip - tripsPerPage;
  const currentTrips = trips.slice(indexOfFirstTrip, indexOfLastTrip);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="trip-list">
      <h2 className="trip-list__title">Listado de Viajes</h2>
      <div className="trip-list__container">
        {currentTrips.map((trip) => (
          <div key={trip.id} className="trip-list__item">
            <div className="trip-list__item-header">
              <span className="trip-list__item-date"><FaCalendarAlt /> {trip.date}</span>
            </div>
            <div className="trip-list__item-body">
              <div className="trip-list__item-row">
                <span><FaRoad /> Km iniciales:</span>
                <span>{formatNumber(trip.startKm)}</span>
              </div>
              <div className="trip-list__item-row">
                <span><FaRoad /> Km finales:</span>
                <span>{formatNumber(trip.endKm)}</span>
              </div>
              <div className="trip-list__item-row">
                <span><FaRoad /> Km recorridos:</span>
                <span>{formatNumber(trip.endKm - trip.startKm)}</span>
              </div>
              <div className="trip-list__item-row">
                <span><FaClock /> Horas trabajadas:</span>
                <span>{formatNumber(trip.hoursWorked)}</span>
              </div>
              <div className="trip-list__item-row">
                <span><FaMoneyBillWave /> Ingreso diario:</span>
                <span>${formatNumber(trip.dailyIncome)}</span>
              </div>
            </div>
            <div className="trip-list__item-footer">
              <button 
                className="trip-list__options-button" 
                onClick={() => toggleMenu(trip.id)}
              >
                <FaEllipsisV /> Modificar
              </button>
              {activeMenu === trip.id && (
                <div className="trip-list__menu">
                  <button onClick={() => handleEdit(trip)}><FaEdit /> Editar</button>
                  <button className="delete-button" onClick={() => handleDelete(trip.id)}><FaTrash /> Eliminar</button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="trip-list__pagination">
        <button 
          onClick={() => paginate(currentPage - 1)} 
          disabled={currentPage === 1}
          className="trip-list__pagination-button"
        >
          <FaChevronLeft />
        </button>
        <span>{currentPage} de {Math.ceil(trips.length / tripsPerPage)}</span>
        <button 
          onClick={() => paginate(currentPage + 1)} 
          disabled={currentPage === Math.ceil(trips.length / tripsPerPage)}
          className="trip-list__pagination-button"
        >
          <FaChevronRight />
        </button>
      </div>
      {editingTrip && (
        <div className="trip-list__edit-modal">
          <form onSubmit={handleSaveEdit} className="trip-list__edit-form">
            <h3>Editar Viaje</h3>
            <input 
              type="date" 
              value={editingTrip.date} 
              onChange={(e) => setEditingTrip({...editingTrip, date: e.target.value})} 
            />
            <input 
              type="number" 
              value={editingTrip.startKm} 
              onChange={(e) => setEditingTrip({...editingTrip, startKm: e.target.value})} 
              placeholder="Km iniciales" 
            />
            <input 
              type="number" 
              value={editingTrip.endKm} 
              onChange={(e) => setEditingTrip({...editingTrip, endKm: e.target.value})} 
              placeholder="Km finales" 
            />
            <input 
              type="number" 
              value={editingTrip.hoursWorked} 
              onChange={(e) => setEditingTrip({...editingTrip, hoursWorked: e.target.value})} 
              placeholder="Horas trabajadas" 
            />
            <input 
              type="number" 
              value={editingTrip.dailyIncome} 
              onChange={(e) => setEditingTrip({...editingTrip, dailyIncome: e.target.value})} 
              placeholder="Ingreso diario" 
            />
            <div className="trip-list__edit-form-actions">
              <button type="submit">Guardar</button>
              <button type="button" onClick={() => setEditingTrip(null)}>Cancelar</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default TripList;