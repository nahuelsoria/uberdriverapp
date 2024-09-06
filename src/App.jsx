import React, { useState } from 'react'
import './App.css'
import TripForm from './components/TripForm'
import TripList from './components/TripList'
import MonthlyReport from './components/MonthlyReport'
import { FaCar, FaList, FaChartBar } from 'react-icons/fa'

function App() {
  const [trips, setTrips] = useState([]);

  const addTrip = (trip) => {
    setTrips((prevTrips) => [...prevTrips, trip]);
  };

  return (
    <div className="App">
      <header>
        <h1><FaCar /> Control de Viajes Uber</h1>
      </header>
      <main>
        <section className="trip-form-section">
          <h2><FaCar /> Agregar Viaje</h2>
          <TripForm onAddTrip={addTrip} />
        </section>
        <section className="trip-list-section">
          <h2><FaList /> Lista de Viajes</h2>
          <TripList trips={trips} />
        </section>
        <section className="monthly-report-section">
          <h2><FaChartBar /> Reporte Mensual</h2>
          <MonthlyReport trips={trips} />
        </section>
      </main>
    </div>
  )
}

export default App