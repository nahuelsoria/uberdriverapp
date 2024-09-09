// Importación de módulos necesarios
import React, { useState, useEffect } from 'react';
import './TripForm.css';
import { FaCalendarAlt, FaRoad, FaClock, FaMoneyBillWave } from 'react-icons/fa';
import { db, auth } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

// Definición del componente TripForm
function TripForm() {
  // Declaración de estados utilizando useState
  const [date, setDate] = useState('');
  const [startKm, setStartKm] = useState('');
  const [endKm, setEndKm] = useState('');
  const [hoursWorked, setHoursWorked] = useState('');
  const [dailyIncome, setDailyIncome] = useState('');

  // Efecto que se ejecuta al montar el componente
  useEffect(() => {
    // Establece la fecha actual como valor inicial
    const today = new Date().toISOString().split('T')[0];
    setDate(today);
  }, []);

  // Manejador para el cambio de fecha
  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    const today = new Date().toISOString().split('T')[0];
    
    // Asegura que la fecha seleccionada no sea futura
    if (selectedDate <= today) {
      setDate(selectedDate);
    } else {
      setDate(today);
    }
  };

  // Manejador para el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) {
      console.error("Usuario no autenticado");
      return;
    }

    // Creación del objeto trip con los datos del formulario
    const trip = {
      userId: user.uid,
      date,
      startKm: parseFloat(startKm),
      endKm: parseFloat(endKm),
      hoursWorked: parseFloat(hoursWorked),
      dailyIncome: parseFloat(dailyIncome),
      createdAt: new Date()
    };

    try {
      // Intenta agregar el documento a Firestore
      await addDoc(collection(db, "transactions"), trip);
      console.log("Viaje guardado exitosamente");
      // Limpia el formulario después de guardar
      setStartKm('');
      setEndKm('');
      setHoursWorked('');
      setDailyIncome('');
    } catch (error) {
      console.error("Error al guardar el viaje:", error);
    }
  };

  // Renderizado del componente
  return (
    <form onSubmit={handleSubmit} className="trip-form">
      {/* Campo de fecha */}
      <div className="trip-form__input-group">
        <label htmlFor="date" className="trip-form__label"><FaCalendarAlt /> Fecha:</label>
        <input
          id="date"
          type="date"
          value={date}
          onChange={handleDateChange}
          max={new Date().toISOString().split('T')[0]}
          required
          className="trip-form__input"
        />
      </div>
      {/* Campo de kilómetros iniciales */}
      <div className="trip-form__input-group">
        <label htmlFor="startKm" className="trip-form__label"><FaRoad /> Km al inicio del turno:</label>
        <input
          id="startKm"
          type="number"
          value={startKm}
          onChange={(e) => setStartKm(e.target.value)}
          placeholder="Km iniciales"
          required
          className="trip-form__input"
        />
      </div>
      {/* Campo de kilómetros finales */}
      <div className="trip-form__input-group">
        <label htmlFor="endKm" className="trip-form__label"><FaRoad /> Km al final del turno:</label>
        <input
          id="endKm"
          type="number"
          value={endKm}
          onChange={(e) => setEndKm(e.target.value)}
          placeholder="Km finales"
          required
          className="trip-form__input"
        />
      </div>
      {/* Campo de horas trabajadas */}
      <div className="trip-form__input-group">
        <label htmlFor="hoursWorked" className="trip-form__label"><FaClock /> Horas trabajadas:</label>
        <input
          id="hoursWorked"
          type="number"
          value={hoursWorked}
          onChange={(e) => setHoursWorked(e.target.value)}
          placeholder="Horas trabajadas"
          required
          className="trip-form__input"
        />
      </div>
      {/* Campo de ingreso diario */}
      <div className="trip-form__input-group">
        <label htmlFor="dailyIncome" className="trip-form__label"><FaMoneyBillWave /> Ingreso diario:</label>
        <input
          id="dailyIncome"
          type="number"
          value={dailyIncome}
          onChange={(e) => setDailyIncome(e.target.value)}
          placeholder="Ingreso diario"
          required
          className="trip-form__input"
        />
      </div>
      {/* Botón de envío del formulario */}
      <button type="submit" className="trip-form__submit-btn">Agregar registro</button>
    </form>
  );
}

// Exportación del componente
export default TripForm;