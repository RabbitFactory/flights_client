import { useState } from 'react';
import axios from 'axios';
import './App.css';
import './card.css';
import './info.css';
import './loader.css';

function App() {
  const airportCodes = [
  { code: "JFK", name: "John F. Kennedy International Airport, New York" },
  { code: "LAX", name: "Los Angeles International Airport, California" },
  { code: "ORD", name: "O'Hare International Airport, Chicago" },
  { code: "ATL", name: "Hartsfield–Jackson Atlanta International Airport, Georgia" },
  { code: "DFW", name: "Dallas/Fort Worth International Airport, Texas" },
  { code: "SFO", name: "San Francisco International Airport, California" },
  { code: "MIA", name: "Miami International Airport, Florida" },
  { code: "SEA", name: "Seattle-Tacoma International Airport, Washington" },
  { code: "BOS", name: "Logan International Airport, Boston" },
  { code: "DEN", name: "Denver International Airport, Colorado" },
  { code: "PHX", name: "Phoenix Sky Harbor International Airport, Arizona" },
  { code: "LAS", name: "McCarran International Airport, Las Vegas" },
  { code: "IAH", name: "George Bush Intercontinental Airport, Houston" },
  { code: "EWR", name: "Newark Liberty International Airport, New Jersey" },
  { code: "MSP", name: "Minneapolis-Saint Paul International Airport, Minnesota" },
  { code: "DTW", name: "Detroit Metropolitan Airport, Michigan" },
  { code: "CLT", name: "Charlotte Douglas International Airport, North Carolina" },
  { code: "PHL", name: "Philadelphia International Airport, Pennsylvania" },
  { code: "MCO", name: "Orlando International Airport, Florida" },
  { code: "SAN", name: "San Diego International Airport, California" },
  { code: "TPA", name: "Tampa International Airport, Florida" },
  { code: "MDW", name: "Chicago Midway International Airport, Illinois" },
  { code: "BWI", name: "Baltimore/Washington International Thurgood Marshall Airport, Maryland" },
  { code: "IAD", name: "Washington Dulles International Airport, Virginia" },
  { code: "HNL", name: "Daniel K. Inouye International Airport, Honolulu" }
];



  const [form, setForm] = useState({ origin: '', destination: '', date: '', passengers: 1 });
  const [flights, setFlights] = useState([]);
  const [dictionaries, setDictionaries] = useState({});
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
      const res = await axios.post('https://flights-server-e6aq.onrender.com/search', form);
      setFlights(res.data.data || []);
      setDictionaries(res.data.dictionaries || {});
    } catch (err) {
      alert('Error fetching flights',err);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="App">
      <h1>Flight Search</h1>
      

      <form onSubmit={handleSubmit} className="search-form">
        <input name="origin" placeholder="Origin (e.g. JFK)" onChange={handleChange} required />
        <input name="destination" placeholder="Destination (e.g. LAX)" onChange={handleChange} required />
        <input name="date" type="date" onChange={handleChange} required />
        <input name="passengers" type="number" min="1" onChange={handleChange} required placeholder="Passengers" />
        <button type="submit">Search Flights</button>
      </form>

    {loading && <p style={{textAlign: "center"}}><span className="loader"></span></p>}


      <div className="results">
        {flights.map((flight, i) => {
          const firstSegment = flight.itineraries[0].segments[0];
          const lastSegment = flight.itineraries[0].segments.at(-1);

          const airlineCode = flight.validatingAirlineCodes[0];
          const airlineName = dictionaries.carriers?.[airlineCode] || airlineCode;

          const aircraftCode = firstSegment.aircraft?.code;
          const aircraftName = dictionaries.aircraft?.[aircraftCode] || aircraftCode;

          const originCity = dictionaries.locations?.[firstSegment.departure.iataCode]?.cityCode || firstSegment.departure.iataCode;
          const destinationCity = dictionaries.locations?.[lastSegment.arrival.iataCode]?.cityCode || lastSegment.arrival.iataCode;

          const stops = flight.itineraries[0].segments.length - 1;

          return (
            <div key={i} className="flight-card">
              <div className="flight-header">
                <span className="airline">{airlineName}</span>
                <span className="price">{flight.price.total} {flight.price.currency}</span>
              </div>

              <div className="flight-route">
                <div className="location">
                  <div className="code">{firstSegment.departure.iataCode}</div>
                  <div className="time">{formatTime(firstSegment.departure.at)}</div>
                </div>
                <div className="route-line">
                  <span className="dot"></span>
                  <span className="line"></span>
                  <span className="dot"></span>
                  <div className="stops">{stops === 0 ? 'Direct' : `${stops} stop${stops > 1 ? 's' : ''}`}</div>
                </div>
                <div className="location">
                  <div className="code">{lastSegment.arrival.iataCode}</div>
                  <div className="time">{formatTime(lastSegment.arrival.at)}</div>
                </div>
              </div>

              <div className="flight-footer">
                <span>Aircraft: {aircraftName}</span>
                <span>{originCity} → {destinationCity}</span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="airport-reference">
        <h3>Popular Airport Codes</h3>
        <ul>
          {airportCodes.map((airport, i) => (
            <li key={i}>
              <strong>{airport.code}</strong> – {airport.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
