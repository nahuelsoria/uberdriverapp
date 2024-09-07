import React, { useState, useEffect } from 'react';
import './TripForm.css';
import { FaCalendarAlt, FaRoad, FaClock, FaMoneyBillWave } from 'react-icons/fa';
import { db, auth } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

function TripForm() {
  const [date, setDate] = useState('');
  const [startKm, setStartKm] = useState('');
  const [endKm, setEndKm] = useState('');
  const [hoursWorked, setHoursWorked] = useState('');
  const [dailyIncome, setDailyIncome] = useState('');

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setDate(today);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) {
      console.error("Usuario no autenticado");
      return;
    }

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
      await addDoc(collection(db, "transactions"), trip);
      console.log("Viaje guardado exitosamente");
      // Limpiar el formulario
      setStartKm('');
      setEndKm('');
      setHoursWorked('');
      setDailyIncome('');
    } catch (error) {
      console.error("Error al guardar el viaje:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="trip-form">
      <div className="trip-form__input-group">
        <label htmlFor="date" className="trip-form__label"><FaCalendarAlt /> Fecha:</label>
        <input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="trip-form__input"
        />
      </div>
      <div className="trip-form__input-group">
        <label htmlFor="startKm" className="trip-form__label"><FaRoad /> Km iniciales:</label>
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
      <div className="trip-form__input-group">
        <label htmlFor="endKm" className="trip-form__label"><FaRoad /> Km finales:</label>
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
      <button type="submit" className="trip-form__submit-btn">Agregar registro</button>
    </form>
  );
}

export default TripForm;