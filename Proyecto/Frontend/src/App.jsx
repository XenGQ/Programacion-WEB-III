import React from 'react'
import { Routes, Route, Link, Navigate } from 'react-router-dom'
import { auth } from './servicios/api'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Clients from './pages/Clients'
import Taxis from './pages/Taxis'
import Trips from './pages/Trips'
import Audit from './pages/Audit'

function App() {
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  if (!user) {
    return <Routes><Route path="/*" element={<Login />} /></Routes>
  }

  const handleLogout = async () => {
    try {
      await auth.logout();
      localStorage.removeItem('user');
      window.location.href = '/';
    } catch (e) {
      console.error('Logout error:', e);
    }
  };

  return (
    <div className="app">
      <aside className="sidebar">
        <h2>RadioTaxi</h2>
        <nav>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/clients">Clientes</Link>
          <Link to="/taxis">Taxis</Link>
          <Link to="/trips">Viajes</Link>
          {user.role === 'admin' && <Link to="/history">Historial</Link>}
        </nav>
        <div className="user" style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <span>{user.username} · {user.role}</span>
          <button onClick={handleLogout} style={{background:'#c33',border:'none',color:'white',padding:'4px 8px',borderRadius:'4px',cursor:'pointer',fontSize:'11px'}}>Salir</button>
        </div>
      </aside>
      <main className="main">
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/taxis" element={<Taxis />} />
          <Route path="/trips" element={<Trips />} />
          <Route path="/history" element={<Audit />} />
          <Route path="/audit" element={<Navigate to="/history" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
