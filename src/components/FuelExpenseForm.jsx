import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { FaGasPump } from 'react-icons/fa';
import { useAuthState } from 'react-firebase-hooks/auth';

function FuelExpenseForm() {
  const [user, loading] = useAuthState(auth);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [amount, setAmount] = useState('');
  const [liters, setLiters] = useState('');
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (parseFloat(amount) <= 0) {
      newErrors.amount = "El monto debe ser mayor que cero";
    }
    if (parseFloat(liters) <= 0) {
      newErrors.liters = "Los litros deben ser mayores que cero";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Debes estar autenticado para registrar un gasto");
      return;
    }
    if (validateForm()) {
      try {
        await addDoc(collection(db, "fuelExpenses"), {
          date,
          amount: parseFloat(amount),
          liters: parseFloat(liters),
          userId: user.uid,
          createdAt: new Date(),
        });
        setDate(new Date().toISOString().split('T')[0]);
        setAmount('');
        setLiters('');
        setErrors({});
        alert("Gasto de combustible registrado con éxito");
      } catch (error) {
        console.error("Error al agregar gasto de combustible: ", error);
        alert("Error al registrar el gasto de combustible");
      }
    }
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!user) {
    return <div>Debes iniciar sesión para registrar gastos de combustible.</div>;
  }

  return (
    <div className="fuel-expense-form">
      <h2>
        <FaGasPump /> Registrar Gasto de Combustible
      </h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Monto"
            min="0.01"
            step="0.01"
            required
          />
          {errors.amount && <span className="error">{errors.amount}</span>}
        </div>
        <div>
          <input
            type="number"
            value={liters}
            onChange={(e) => setLiters(e.target.value)}
            placeholder="Litros"
            min="0.01"
            step="0.01"
            required
          />
          {errors.liters && <span className="error">{errors.liters}</span>}
        </div>
        <button type="submit">Registrar Gasto</button>
      </form>
    </div>
  );
}

export default FuelExpenseForm;