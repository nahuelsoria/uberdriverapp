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
      <header className="app-header">
        <div className="app-header__content">
          <h1 className="app-header__title"><FaCar /> Control de Viajes Uber</h1>
          <Auth />
        </div>
      </header>
      {user ? (
        <main>
          <TripForm />
          <MonthlyReport trips={trips} />
          <TripList trips={trips} setTrips={setTrips} />
          <Charts trips={trips} />
        </main>
      ) : (
        <div className="app-welcome">
          <h2>Bienvenido a Control de Viajes Uber</h2>
          <p>Por favor, inicia sesión para acceder a la aplicación.</p>
        </div>
      )}
    </div>
  )
}

export default App