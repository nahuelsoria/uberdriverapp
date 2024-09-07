import React, { useState, useEffect } from 'react'
import './App.css'
import TripForm from './components/TripForm'
import TripList from './components/TripList'
import MonthlyReport from './components/MonthlyReport'
import Charts from './components/Charts'
import Auth from './components/Auth'
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from './firebase'
import { collection, query, where, getDocs } from 'firebase/firestore';
import { FaCar, FaList, FaChartBar, FaChartLine } from 'react-icons/fa'

function App() {
  const [user, loading] = useAuthState(auth);
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    const fetchTrips = async () => {
      if (user) {
        const q = query(collection(db, "transactions"), where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        const fetchedTrips = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setTrips(fetchedTrips);
      }
    };

    fetchTrips();
  }, [user]);

  return (
    <div className="App">
      <header>
        <h1><FaCar /> Control de Viajes Uber</h1>
      </header>
      <Auth />
      {user ? (
        <main>
          <section className="trip-form-section">
            <h2><FaCar /> Agregar Viaje</h2>
            <TripForm />
          </section>
          <section className="trip-list-section">
        <h2><FaList /> Lista de Viajes</h2>
            <TripList trips={trips} setTrips={setTrips} />
          </section>
          <section className="monthly-report-section">
            <h2><FaChartBar /> Reporte Mensual</h2>
            <MonthlyReport trips={trips} />
          </section>
          <section className="charts-section">
            <h2><FaChartLine /> Gráficos de Tendencias</h2>
            <Charts trips={trips} />
          </section>
        </main>
      ) : (
        <p>Por favor, inicia sesión para acceder a la aplicación.</p>
      )}
    </div>
  )
}

export default App