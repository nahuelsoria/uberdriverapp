import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { FaGasPump } from 'react-icons/fa';
import { useAuthState } from 'react-firebase-hooks/auth';

function FuelExpenseList() {
  const [user] = useAuthState(auth);
  const [fuelExpenses, setFuelExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFuelExpenses = async () => {
      if (user) {
        try {
          setLoading(true);
          const q = query(
            collection(db, "fuelExpenses"),
            where("userId", "==", user.uid),
            orderBy("date", "desc")
          );
          const querySnapshot = await getDocs(q);
          const expenses = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setFuelExpenses(expenses);
        } catch (err) {
          console.error("Error al obtener los gastos de combustible:", err);
          setError(err.message);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchFuelExpenses();
  }, [user]);

  if (!user) {
    return <div>Debes iniciar sesión para ver los gastos de combustible.</div>;
  }

  if (loading) {
    return <div>Cargando gastos de combustible...</div>;
  }

  if (error) {
    return <div>Error al cargar los gastos de combustible: {error}</div>;
  }

  return (
    <div className="fuel-expense-list">
      <h2><FaGasPump /> Listado de Gastos de Combustible</h2>
      {fuelExpenses.length === 0 ? (
        <p>No hay gastos de combustible registrados.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Monto</th>
              <th>Litros</th>
            </tr>
          </thead>
          <tbody>
            {fuelExpenses.map(expense => (
              <tr key={expense.id}>
                <td>{expense.date}</td>
                <td>${expense.amount.toFixed(2)}</td>
                <td>{expense.liters.toFixed(2)} L</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default FuelExpenseList;