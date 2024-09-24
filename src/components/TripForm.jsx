import React, { useState } from 'react';
import { db, auth } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import './TripForm.css';
import { FaCalendarAlt, FaRoad, FaClock, FaMoneyBillWave } from 'react-icons/fa';

function TripForm() {
  const [date, setDate] = useState(getCurrentDate());
  const [startKm, setStartKm] = useState('');
  const [endKm, setEndKm] = useState('');
  const [hoursWorked, setHoursWorked] = useState('');
  const [dailyIncome, setDailyIncome] = useState('');
  const [errors, setErrors] = useState({});

  function getCurrentDate() {
    const now = new Date();
    return now.toISOString().split('T')[0];
  }

  const validateForm = () => {
    let newErrors = {};
    let isValid = true;

    // Validar fecha
    if (!date) {
      newErrors.date = "La fecha es requerida";
      isValid = false;
    } else if (new Date(date) > new Date()) {
      newErrors.date = "La fecha no puede ser futura";
      isValid = false;
    }

    // Validar kilómetros iniciales
    if (!startKm) {
      newErrors.startKm = "Los kilómetros iniciales son requeridos";
      isValid = false;
    } else if (isNaN(startKm) || parseFloat(startKm) < 0) {
      newErrors.startKm = "Los kilómetros iniciales deben ser un número positivo";
      isValid = false;
    }

    // Validar kilómetros finales
    if (!endKm) {
      newErrors.endKm = "Los kilómetros finales son requeridos";
      isValid = false;
    } else if (isNaN(endKm) || parseFloat(endKm) < 0) {
      newErrors.endKm = "Los kilómetros finales deben ser un número positivo";
      isValid = false;
    } else if (parseFloat(endKm) <= parseFloat(startKm)) {
      newErrors.endKm = "Los kilómetros finales deben ser mayores que los iniciales";
      isValid = false;
    }

    // Validar horas trabajadas
    if (!hoursWorked) {
      newErrors.hoursWorked = "Las horas trabajadas son requeridas";
      isValid = false;
    } else if (isNaN(hoursWorked) || parseFloat(hoursWorked) <= 0 || parseFloat(hoursWorked) > 24) {
      newErrors.hoursWorked = "Las horas trabajadas deben ser un número entre 0 y 24";
      isValid = false;
    }

    // Validar ingreso diario
    if (!dailyIncome) {
      newErrors.dailyIncome = "El ingreso diario es requerido";
      isValid = false;
    } else if (isNaN(dailyIncome) || parseFloat(dailyIncome) < 0) {
      newErrors.dailyIncome = "El ingreso diario debe ser un número positivo";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const user = auth.currentUser;
        if (user) {
          await addDoc(collection(db, "transactions"), {
            userId: user.uid,
            date,
            startKm: parseFloat(startKm),
            endKm: parseFloat(endKm),
            hoursWorked: parseFloat(hoursWorked),
            dailyIncome: parseFloat(dailyIncome),
          });
          // Limpiar el formulario después de enviar
          setDate(getCurrentDate());
          setStartKm('');
          setEndKm('');
          setHoursWorked('');
          setDailyIncome('');
          setErrors({});
          alert('Viaje registrado con éxito');
        }
      } catch (error) {
        console.error("Error al agregar el viaje:", error);
        alert('Error al registrar el viaje. Por favor, intenta de nuevo.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="trip-form">
      <h2 className="trip-form__title">Registrar nuevo viaje</h2>
      <div className="trip-form__field">
        <label htmlFor="date"><FaCalendarAlt /> Fecha:</label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          max={getCurrentDate()}
        />
        {errors.date && <span className="trip-form__error">{errors.date}</span>}
      </div>
      <div className="trip-form__field">
        <label htmlFor="startKm"><FaRoad /> Km iniciales:</label>
        <input
          type="number"
          id="startKm"
          value={startKm}
          onChange={(e) => setStartKm(e.target.value)}
          step="0.1"
          min="0"
        />
        {errors.startKm && <span className="trip-form__error">{errors.startKm}</span>}
      </div>
      <div className="trip-form__field">
        <label htmlFor="endKm"><FaRoad /> Km finales:</label>
        <input
          type="number"
          id="endKm"
          value={endKm}
          onChange={(e) => setEndKm(e.target.value)}
          step="0.1"
          min="0"
        />
        {errors.endKm && <span className="trip-form__error">{errors.endKm}</span>}
      </div>
      <div className="trip-form__field">
        <label htmlFor="hoursWorked"><FaClock /> Horas trabajadas:</label>
        <input
          type="number"
          id="hoursWorked"
          value={hoursWorked}
          onChange={(e) => setHoursWorked(e.target.value)}
          step="0.5"
          min="0"
          max="24"
        />
        {errors.hoursWorked && <span className="trip-form__error">{errors.hoursWorked}</span>}
      </div>
      <div className="trip-form__field">
        <label htmlFor="dailyIncome"><FaMoneyBillWave /> Ingreso diario:</label>
        <input
          type="number"
          id="dailyIncome"
          value={dailyIncome}
          onChange={(e) => setDailyIncome(e.target.value)}
          step="0.01"
          min="0"
        />
        {errors.dailyIncome && <span className="trip-form__error">{errors.dailyIncome}</span>}
      </div>
      <button type="submit" className="trip-form__submit">Registrar viaje</button>
    </form>
  );
}

export default TripForm;