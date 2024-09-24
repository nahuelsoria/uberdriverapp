import React, { useState, useEffect } from 'react'
import './App.css'
import TripForm from './components/TripForm'
import TripList from './components/TripList'
import MonthlyReport from './components/MonthlyReport'
import WeeklyReport from './components/WeeklyReport';
import Charts from './components/Charts'
import Auth from './components/Auth'
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from './firebase'
import { collection, query, where, getDocs } from 'firebase/firestore';
import { FaCar, FaList, FaChartBar, FaChartLine, FaGasPump } from 'react-icons/fa'
import FuelExpenseForm from './components/FuelExpenseForm.jsx';
import FuelExpenseList from './components/FuelExpenseList.jsx';

function App() {
  const [user, loading] = useAuthState(auth);
  const [trips, setTrips] = useState([]);
  const [activeTab, setActiveTab] = useState('trips');


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
      <header className="App-header">
        <h1>Registro de Viajes y Gastos</h1>
        {user && (
          <nav>
            <button onClick={() => setActiveTab('trips')}><FaCar /> Viajes</button>
            <button onClick={() => setActiveTab('fuel')}><FaGasPump /> Combustible</button>
            <button onClick={() => setActiveTab('reports')}><FaChartBar /> Reportes</button>
            <button onClick={() => auth.signOut()}>Cerrar sesión</button>
          </nav>
        )}
      </header>
      {user ? (
        <main>
          {activeTab === 'trips' && (
            <>
              <TripForm />
              <TripList trips={trips} setTrips={setTrips} />
            </>
          )}
          {activeTab === 'fuel' && (
            <>
              <FuelExpenseForm />
              <FuelExpenseList />
            </>
          )}
          {activeTab === 'reports' && (
            <>
              <WeeklyReport trips={trips} />
              <MonthlyReport trips={trips} />
              <Charts trips={trips} />
            </>
          )}
        </main>
      ) : (
        <Auth />
      )}
    </div>
  )
}

export default App