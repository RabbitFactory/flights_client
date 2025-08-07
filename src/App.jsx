import { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [form, setForm] = useState({ origin: '', destination: '', date: '', passengers: 1 });
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const uppercaseValue = (name === "origin" || name === "destination")
      ? value.toUpperCase()
      : value;
    setForm({ ...form, [name]: uppercaseValue });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('https://flights-server-7dq6.onrender.com/search', form);
      setFlights(res.data.data);
    } catch (err) {
      alert('Error fetching flights', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>Flight Search</h1>
      <form onSubmit={handleSubmit}>
        <input name="origin" placeholder="Origin (e.g. JFK)" onChange={handleChange} required />
        <input name="destination" placeholder="Destination (e.g. LAX)" onChange={handleChange} required />
        <input name="date" type="date" onChange={handleChange} required />
        <input name="passengers" type="number" min="1" onChange={handleChange} required />
        <button type="submit">Search Flights</button>
      </form>

      {loading && <p>Loading...</p>}

      <div className="results">
        {flights.map((flight, i) => (
          <div key={i} className="flight-card">
            <p>Airline: {flight.validatingAirlineCodes.join(', ')}</p>
            <p>Stops: {flight.itineraries[0].segments.length - 1}</p>
            <p>Price: {flight.price.total} {flight.price.currency}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
