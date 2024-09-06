import React, { useState } from 'react'
import './App.css'
import TripForm from './components/TripForm'
import TripList from './components/TripList'
import MonthlyReport from './components/MonthlyReport'

function App() {
  const [trips, setTrips] = useState([]);

  const addTrip = (trip) => {
    setTrips((prevTrips) => [...prevTrips, trip]);
  };

  return (
    <div className="App">
      <header>
        <h1>Control de Viajes Uber</h1>
      </header>
      <main>
        <section className="trip-form-section">
          <TripForm onAddTrip={addTrip} />
        </section>
        <section className="trip-list-section">
          <TripList trips={trips} />
        </section>
        <section className="monthly-report-section">
          <MonthlyReport trips={trips} />
        </section>
      </main>
    </div>
  )
}

export default App