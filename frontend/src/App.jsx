import React, { useState, useEffect } from 'react'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://ardortrip-backend.onrender.com';

export default function App() {
  const [airports, setAirports] = useState([]);
  const [flights, setFlights] = useState([]);
  const [selectedOrigin, setSelectedOrigin] = useState('DEL');
  const [selectedDest, setSelectedDest] = useState('BLR');
  const [loading, setLoading] = useState(false);
  const [backendHealth, setBackendHealth] = useState('CHECKING');
  
  // Booking modal state
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [seatNumber, setSeatNumber] = useState('14B');
  const [passengerName, setPassengerName] = useState('Akira Tanaka');
  const [passengerEmail, setPassengerEmail] = useState('tanaka@example.jp');
  const [passengerPassport, setPassengerPassport] = useState('JP12345678');
  const [bookingInProgress, setBookingInProgress] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // PNR lookup state
  const [pnrInput, setPnrInput] = useState('');
  const [pnrResult, setPnrResult] = useState(null);
  const [pnrError, setPnrError] = useState('');
  const [activeTab, setActiveTab] = useState('search');

  // Load airports and health
  useEffect(() => {
    checkHealth();
    loadAirports();
    loadFlights('DEL', 'BLR');
  }, []);

  const checkHealth = async () => {
    try {
      const res = await fetch(`${API_BASE}/actuator/health`);
      if (res.ok) {
        const data = await res.json();
        setBackendHealth(data.status === 'UP' ? 'UP' : 'DOWN');
      } else {
        setBackendHealth('DOWN');
      }
    } catch {
      setBackendHealth('DOWN');
    }
  };

  const loadAirports = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/airports`);
      if (res.ok) {
        const data = await res.json();
        setAirports(data);
      }
    } catch (err) {
      console.error("Failed to load airports", err);
    }
  };

  const loadFlights = async (origin, dest) => {
    setLoading(true);
    try {
      const url = origin && dest 
        ? `${API_BASE}/api/flights/search?origin=${origin}&destination=${dest}`
        : `${API_BASE}/api/flights`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setFlights(data);
      }
    } catch (err) {
      console.error("Failed to load flights", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadFlights(selectedOrigin, selectedDest);
  };

  const handleCreateBooking = async (e) => {
    e.preventDefault();
    if (!selectedFlight) return;

    setBookingInProgress(true);
    try {
      const res = await fetch(`${API_BASE}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          flightId: selectedFlight.id,
          seatNumber,
          passengerName,
          passengerEmail,
          passengerPassport,
          paymentMethod: 'CREDIT_CARD',
          cardNumber: '4111-XXXX-XXXX-9999'
        })
      });
      if (res.ok) {
        const data = await res.json();
        setConfirmedBooking(data);
        setSelectedFlight(null);
        loadFlights(selectedOrigin, selectedDest);
      } else {
        alert("Booking failed. Seats may no longer be available.");
      }
    } catch (err) {
      alert("Error processing booking: " + err);
    } finally {
      setBookingInProgress(false);
    }
  };

  const handleLookupPnr = async (e) => {
    e.preventDefault();
    if (!pnrInput.trim()) return;
    setPnrError('');
    setPnrResult(null);

    try {
      const res = await fetch(`${API_BASE}/api/bookings/${pnrInput.trim().toUpperCase()}`);
      if (res.ok) {
        const data = await res.json();
        setPnrResult(data);
      } else {
        setPnrError('Booking not found for PNR: ' + pnrInput);
      }
    } catch {
      setPnrError('Failed to communicate with booking service.');
    }
  };

  const handleCancelBooking = async (pnr) => {
    if (!confirm(`Are you sure you want to cancel booking ${pnr}?`)) return;
    try {
      const res = await fetch(`${API_BASE}/api/bookings/${pnr}/cancel`, { method: 'PUT' });
      if (res.ok) {
        const data = await res.json();
        if (pnrResult && pnrResult.pnr === pnr) {
          setPnrResult(data);
        }
        if (confirmedBooking && confirmedBooking.pnr === pnr) {
          setConfirmedBooking(data);
        }
        alert(`Booking ${pnr} has been cancelled.`);
        loadFlights(selectedOrigin, selectedDest);
      } else {
        alert("Unable to cancel booking.");
      }
    } catch (err) {
      alert("Error: " + err);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navbar matching ArdorTrip Screenshot 8.1 / 8.2 */}
      <header style={{
        background: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        padding: '1rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
            width: '38px',
            height: '38px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '1.25rem'
          }}>✈</div>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e3a8a', letterSpacing: '-0.5px' }}>ARDOR<span style={{ color: '#2563eb' }}>TRIP</span></div>
            <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Global Airline DevOps Platform</div>
          </div>
        </div>

        <nav style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button 
            onClick={() => setActiveTab('search')}
            style={{
              background: activeTab === 'search' ? '#eff6ff' : 'transparent',
              color: activeTab === 'search' ? '#2563eb' : '#475569',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              fontWeight: 600,
              fontSize: '0.9rem'
            }}>
            Search Flights
          </button>
          <button 
            onClick={() => setActiveTab('pnr')}
            style={{
              background: activeTab === 'pnr' ? '#eff6ff' : 'transparent',
              color: activeTab === 'pnr' ? '#2563eb' : '#475569',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              fontWeight: 600,
              fontSize: '0.9rem'
            }}>
            Manage Booking (PNR)
          </button>
          <button 
            onClick={() => setActiveTab('admin')}
            style={{
              background: activeTab === 'admin' ? '#eff6ff' : 'transparent',
              color: activeTab === 'admin' ? '#2563eb' : '#475569',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              fontWeight: 600,
              fontSize: '0.9rem'
            }}>
            DevOps & Telemetry
          </button>
        </nav>

        {/* Live Service Health Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f1f5f9', padding: '0.4rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem' }}>
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: backendHealth === 'UP' ? '#10b981' : '#ef4444',
            boxShadow: backendHealth === 'UP' ? '0 0 8px #10b981' : 'none'
          }}></span>
          <span style={{ fontWeight: 600, color: backendHealth === 'UP' ? '#065f46' : '#991b1b' }}>
            Backend API: {backendHealth}
          </span>
        </div>
      </header>

      {/* Hero Banner matching Screen 8.2 */}
      <section style={{
        background: 'linear-gradient(rgba(15, 23, 42, 0.75), rgba(30, 58, 138, 0.8)), url("https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1600&q=80") center/cover',
        color: 'white',
        padding: '3.5rem 2rem',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.75rem' }}>Travel That Works for Your Entire Business</h1>
        <p style={{ fontSize: '1.1rem', color: '#cbd5e1', maxWidth: '650px', margin: '0 auto 2rem' }}>
          Next-generation airline booking platform with enterprise reliability, microservice architecture, and real-time observability.
        </p>

        {/* Flight Search Card */}
        {activeTab === 'search' && (
          <form onSubmit={handleSearch} style={{
            background: 'white',
            color: '#1e293b',
            padding: '1.75rem',
            borderRadius: '12px',
            maxWidth: '900px',
            margin: '0 auto',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr auto',
            gap: '1rem',
            alignItems: 'end'
          }}>
            <div style={{ textAlign: 'left' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#64748b', marginBottom: '0.4rem' }}>Departure</label>
              <select 
                value={selectedOrigin} 
                onChange={e => setSelectedOrigin(e.target.value)}
                style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}>
                {airports.map(a => (
                  <option key={a.code} value={a.code}>{a.city} ({a.code}) - {a.country}</option>
                ))}
              </select>
            </div>

            <div style={{ textAlign: 'left' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#64748b', marginBottom: '0.4rem' }}>Destination</label>
              <select 
                value={selectedDest} 
                onChange={e => setSelectedDest(e.target.value)}
                style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}>
                {airports.map(a => (
                  <option key={a.code} value={a.code}>{a.city} ({a.code}) - {a.country}</option>
                ))}
              </select>
            </div>

            <div style={{ textAlign: 'left' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#64748b', marginBottom: '0.4rem' }}>Date</label>
              <input 
                type="date" 
                defaultValue="2026-10-20"
                style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }} 
              />
            </div>

            <button type="submit" style={{
              background: '#2563eb',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.75rem',
              borderRadius: '6px',
              fontWeight: 700,
              fontSize: '1rem',
              boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.4)'
            }}>
              Find Flights
            </button>
          </form>
        )}
      </section>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '2rem', maxWidth: '1100px', margin: '0 auto', width: '100%' }}>
        {/* TAB 1: FLIGHT SEARCH & RESULTS */}
        {activeTab === 'search' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a' }}>
                Available Flights ({flights.length})
              </h2>
              <button 
                onClick={() => loadFlights()} 
                style={{ background: 'transparent', border: '1px solid #cbd5e1', padding: '0.4rem 0.8rem', borderRadius: '6px', fontSize: '0.85rem' }}>
                Show All Routes
              </button>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>Searching flights...</div>
            ) : flights.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <p style={{ color: '#64748b', marginBottom: '1rem' }}>No direct flights found for the selected route.</p>
                <button onClick={() => loadFlights()} style={{ background: '#2563eb', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px' }}>View All Available Flights</button>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '1rem' }}>
                {flights.map(f => (
                  <div key={f.id} style={{
                    background: 'white',
                    borderRadius: '10px',
                    border: '1px solid #e2e8f0',
                    padding: '1.5rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                  }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                        <span style={{ fontWeight: 800, color: '#1e40af', fontSize: '1.1rem' }}>{f.airline}</span>
                        <span style={{ background: '#e0e7ff', color: '#3730a3', fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 600 }}>{f.flightNumber}</span>
                        <span style={{ background: '#f1f5f9', color: '#475569', fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>{f.flightClass}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', color: '#334155' }}>
                        <div>
                          <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{f.departureTime.substring(11, 16)}</div>
                          <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{f.departureCity} ({f.departureAirportCode})</div>
                        </div>
                        <div style={{ color: '#94a3b8', fontSize: '1.2rem' }}>✈ ────────►</div>
                        <div>
                          <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{f.arrivalTime.substring(11, 16)}</div>
                          <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{f.arrivalCity} ({f.arrivalAirportCode})</div>
                        </div>
                      </div>
                      <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#10b981', fontWeight: 600 }}>
                        ● {f.availableSeats} seats available (of {f.totalSeats})
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.25rem' }}>${f.price}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.75rem' }}>Includes taxes & fees</div>
                      <button 
                        onClick={() => setSelectedFlight(f)}
                        disabled={f.availableSeats === 0}
                        style={{
                          background: f.availableSeats === 0 ? '#94a3b8' : '#2563eb',
                          color: 'white',
                          border: 'none',
                          padding: '0.6rem 1.25rem',
                          borderRadius: '6px',
                          fontWeight: 700,
                          fontSize: '0.9rem'
                        }}>
                        {f.availableSeats === 0 ? 'Sold Out' : 'Select & Book'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PNR MANAGEMENT */}
        {activeTab === 'pnr' && (
          <div style={{ maxWidth: '650px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', color: '#0f172a' }}>Manage Reservation</h2>
            <form onSubmit={handleLookupPnr} style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <input 
                type="text" 
                placeholder="Enter 6-character PNR (e.g. AT31EF)"
                value={pnrInput}
                onChange={e => setPnrInput(e.target.value)}
                style={{ flex: 1, padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '1rem' }}
              />
              <button type="submit" style={{ background: '#2563eb', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '6px', fontWeight: 700 }}>
                Lookup
              </button>
            </form>

            {pnrError && (
              <div style={{ padding: '1rem', background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', borderRadius: '6px', marginBottom: '1rem' }}>
                {pnrError}
              </div>
            )}

            {pnrResult && (
              <div style={{ background: 'white', borderRadius: '10px', border: '1px solid #e2e8f0', padding: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Booking Reference</span>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e40af' }}>{pnrResult.pnr}</div>
                  </div>
                  <span style={{
                    padding: '0.35rem 0.75rem',
                    borderRadius: '20px',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    background: pnrResult.status === 'CONFIRMED' ? '#dcfce7' : '#fee2e2',
                    color: pnrResult.status === 'CONFIRMED' ? '#15803d' : '#b91c1c'
                  }}>
                    {pnrResult.status}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
                  <div><strong>Flight:</strong> {pnrResult.flightNumber} ({pnrResult.airline})</div>
                  <div><strong>Route:</strong> {pnrResult.route}</div>
                  <div><strong>Seat:</strong> {pnrResult.seatNumber}</div>
                  <div><strong>Passenger:</strong> {pnrResult.passengerName}</div>
                  <div><strong>Amount Paid:</strong> ${pnrResult.totalAmount}</div>
                  <div><strong>Mock Txn ID:</strong> {pnrResult.transactionId}</div>
                </div>

                {pnrResult.status === 'CONFIRMED' && (
                  <button 
                    onClick={() => handleCancelBooking(pnrResult.pnr)}
                    style={{ background: '#ef4444', color: 'white', border: 'none', padding: '0.6rem 1.25rem', borderRadius: '6px', fontWeight: 600 }}>
                    Cancel Reservation & Refund Seat
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: DEVOPS & OBSERVABILITY (Telemetry Info for ) */}
        {activeTab === 'admin' && (
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', color: '#0f172a' }}>DevOps Telemetry & Architecture</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
              <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e3a8a', marginBottom: '0.75rem' }}>Spring Boot Actuator</h3>
                <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1rem' }}>Real-time health probes and metric exposition.</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
                  <a href="/actuator/health" target="_blank" style={{ color: '#2563eb' }}>→ /actuator/health</a>
                  <a href="/actuator/health/readiness" target="_blank" style={{ color: '#2563eb' }}>→ /actuator/health/readiness (K8s Probe)</a>
                  <a href="/actuator/health/liveness" target="_blank" style={{ color: '#2563eb' }}>→ /actuator/health/liveness (K8s Probe)</a>
                  <a href="/actuator/prometheus" target="_blank" style={{ color: '#2563eb' }}>→ /actuator/prometheus (Prometheus Scrape)</a>
                </div>
              </div>

              <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e3a8a', marginBottom: '0.75rem' }}>Observability Stack</h3>
                <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1rem' }}>Integrated Prometheus and Grafana APM monitoring.</p>
                <div style={{ fontSize: '0.85rem', color: '#334155' }}>
                  <div>● <strong>Prometheus:</strong> Port 9090 (Scrapes every 15s)</div>
                  <div>● <strong>Grafana:</strong> Port 3001 (APM Dashboard)</div>
                  <div>● <strong>Key Metrics:</strong> JVM Heap, CPU Usage, HTTP Latency, HikariCP Pool</div>
                </div>
              </div>

              <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e3a8a', marginBottom: '0.75rem' }}>Default Test Accounts</h3>
                <div style={{ fontSize: '0.85rem', color: '#334155', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div><strong>Admin:</strong> admin / admin123 (ROLE_ADMIN)</div>
                  <div><strong>User:</strong> demo_user / user123 (ROLE_USER)</div>
                  <div><strong>Security:</strong> Stateless JWT Bearer Authentication</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* BOOKING MODAL (Flight Selected) */}
        {selectedFlight && (
          <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(15, 23, 42, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '2rem',
              maxWidth: '550px',
              width: '90%',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 700 }}>Confirm Reservation & Mock Checkout</h3>
                <button onClick={() => setSelectedFlight(null)} style={{ background: 'transparent', border: 'none', fontSize: '1.25rem' }}>✕</button>
              </div>

              <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', marginBottom: '1.25rem', fontSize: '0.9rem' }}>
                <div><strong>Flight:</strong> {selectedFlight.flightNumber} - {selectedFlight.airline}</div>
                <div><strong>Route:</strong> {selectedFlight.departureCity} ({selectedFlight.departureAirportCode}) ➔ {selectedFlight.arrivalCity} ({selectedFlight.arrivalAirportCode})</div>
                <div><strong>Fare:</strong> ${selectedFlight.price}</div>
              </div>

              <form onSubmit={handleCreateBooking} style={{ display: 'grid', gap: '0.85rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>Passenger Full Name</label>
                  <input 
                    type="text" 
                    value={passengerName} 
                    onChange={e => setPassengerName(e.target.value)} 
                    required 
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1' }} 
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>Email</label>
                    <input 
                      type="email" 
                      value={passengerEmail} 
                      onChange={e => setPassengerEmail(e.target.value)} 
                      required 
                      style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1' }} 
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>Seat Selection</label>
                    <select 
                      value={seatNumber} 
                      onChange={e => setSeatNumber(e.target.value)}
                      style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                      <option value="12A">12A (Window)</option>
                      <option value="12B">12B (Middle)</option>
                      <option value="12C">12C (Aisle)</option>
                      <option value="14A">14A (Window)</option>
                      <option value="14B">14B (Middle)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>Passport Number</label>
                  <input 
                    type="text" 
                    value={passengerPassport} 
                    onChange={e => setPassengerPassport(e.target.value)} 
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1' }} 
                  />
                </div>

                <div style={{ background: '#f1f5f9', padding: '0.75rem', borderRadius: '6px', fontSize: '0.8rem', color: '#475569' }}>
                  💳 <strong>Mock Payment:</strong> Instant simulation. Card number <code>4111-XXXX-XXXX-9999</code> will be authorized automatically.
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <button type="button" onClick={() => setSelectedFlight(null)} style={{ background: '#e2e8f0', border: 'none', padding: '0.6rem 1.25rem', borderRadius: '6px' }}>Cancel</button>
                  <button 
                    type="submit" 
                    disabled={bookingInProgress}
                    style={{ background: '#2563eb', color: 'white', border: 'none', padding: '0.6rem 1.5rem', borderRadius: '6px', fontWeight: 700 }}>
                    {bookingInProgress ? 'Processing...' : `Authorize & Pay $${selectedFlight.price}`}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* CONFIRMED BOOKING BANNER */}
        {confirmedBooking && (
          <div style={{
            marginTop: '2rem',
            background: '#ecfdf5',
            border: '1px solid #a7f3d0',
            borderRadius: '10px',
            padding: '1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#065f46' }}>🎉 Booking Confirmed! PNR: {confirmedBooking.pnr}</div>
              <div style={{ fontSize: '0.9rem', color: '#047857', marginTop: '0.25rem' }}>
                Passenger: {confirmedBooking.passengerName} | Flight: {confirmedBooking.flightNumber} | Seat: {confirmedBooking.seatNumber} | Txn: {confirmedBooking.transactionId}
              </div>
            </div>
            <button 
              onClick={() => { setPnrInput(confirmedBooking.pnr); setActiveTab('pnr'); }}
              style={{ background: '#059669', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', fontWeight: 600 }}>
              View in Manage Booking
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{ background: '#0f172a', color: '#94a3b8', padding: '2rem', textAlign: 'center', fontSize: '0.85rem' }}>
        <p>© 2026 ArdorTrip Systems | Social Infrastructure & DevOps Engineering Portfolio</p>
        <p style={{ marginTop: '0.35rem', color: '#64748b' }}>Airline Reservation Platform & Continuous Delivery Pipeline</p>
      </footer>
    </div>
  )
}
