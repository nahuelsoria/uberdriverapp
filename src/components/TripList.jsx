// Importamos las dependencias necesarias
import React, { useState } from 'react';
import './TripList.css';
import { FaCalendarAlt, FaRoad, FaClock, FaMoneyBillWave, FaEllipsisV, FaEdit, FaTrash, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { db } from '../firebase';
import { doc, deleteDoc, updateDoc } from 'firebase/firestore';

// Definimos el componente TripList que recibe trips y setTrips como props
function TripList({ trips, setTrips }) {
  // Estados locales para manejar el menú activo, la edición de viajes y la paginación
  const [activeMenu, setActiveMenu] = useState(null);
  const [editingTrip, setEditingTrip] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const tripsPerPage = 5;

  // Función para alternar la visibilidad del menú de opciones
  const toggleMenu = (tripId) => {
    setActiveMenu(activeMenu === tripId ? null : tripId);
  };

  // Función para iniciar la edición de un viaje
  const handleEdit = (trip) => {
    setEditingTrip(trip);
    setActiveMenu(null);
  };

  // Función asíncrona para eliminar un viaje
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

  // Función asíncrona para guardar los cambios de un viaje editado
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

  // Función para formatear números con separadores de miles
  const formatNumber = (num) => {
    return Math.round(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  // Cálculos para la paginación
  const indexOfLastTrip = currentPage * tripsPerPage;
  const indexOfFirstTrip = indexOfLastTrip - tripsPerPage;
  const currentTrips = trips.slice(indexOfFirstTrip, indexOfLastTrip);

  // Función para cambiar de página
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Renderizado del componente
  return (
    <div className="trip-list">
      <h2 className="trip-list__title">Listado de días trabajados</h2>
      <div className="trip-list__container">
        {currentTrips.map((trip) => (
          <div key={trip.id} className="trip-list__item">
            {/* Renderizado de los detalles de cada viaje */}
            <div className="trip-list__item-header">
              <span className="trip-list__item-date"><FaCalendarAlt /> {trip.date}</span>
            </div>
            <div className="trip-list__item-body">
              {/* Detalles del viaje como kilómetros, horas trabajadas e ingresos */}
              {/* ... */}
            </div>
            <div className="trip-list__item-footer">
              {/* Botón para mostrar opciones y menú de edición/eliminación */}
              {/* ... */}
            </div>
          </div>
        ))}
      </div>
      {/* Controles de paginación */}
      <div className="trip-list__pagination">
        {/* ... */}
      </div>
      {/* Modal de edición de viaje */}
      {editingTrip && (
        <div className="trip-list__edit-modal">
          <form onSubmit={handleSaveEdit} className="trip-list__edit-form">
            {/* Formulario para editar los detalles del viaje */}
            {/* ... */}
          </form>
        </div>
      )}
    </div>
  );
}

export default TripList;