import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { audits } from '../servicios/api'

export default function Audit(){
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [events, setEvents] = useState([]);

  useEffect(()=>{ load() },[]);
  const load = async ()=>{ const res = await audits.list(); setEvents(res.data); }

  const getRowStyle = (action) => {
    if (/cancelado|eliminación|eliminado/i.test(action)) {
      return { borderLeft: '6px solid #f87171', background: '#1f2937', color: '#fca5a5' };
    }
    if (/registro|registrado/i.test(action)) {
      return { borderLeft: '6px solid #27ae60', background: '#1f2937', color: '#86efac' };
    }
    if (/creación de viaje|actualización de viaje|viaje/i.test(action)) {
      return { borderLeft: '6px solid #60a5fa', background: '#1f2937', color: '#93c5fd' };
    }
    return { borderLeft: '6px solid #95a5a6', background: '#1f2937', color: '#cbd5e1' };
  };

  const extractValue = (text, label) => {
    if (!text) return '-';
    const regex = new RegExp(`${label} ([^-]+?)(?: -| marcado| registrado| actualizado|$)`, 'i');
    const match = text.match(regex);
    return match?.[1]?.trim() || '-';
  };

  if (user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div>
      <h3 style={{color:'#1f2937'}}>Historial</h3>
      <div className="card" style={{marginBottom:20, padding:20, background:'#15202b', color:'#e2e8f0'}}>
        <p style={{margin:0, color:'#e2e8f0'}}>Eventos visibles: <strong style={{color:'#27ae60'}}>Clientes registrados</strong>, <strong style={{color:'#60a5fa'}}>Viajes realizados/actualizados</strong>, <strong style={{color:'#f87171'}}>Cancelados/elim.</strong></p>
      </div>
      <div className="card" style={{padding:'20px 16px', background:'#0f172a', color:'#e2e8f0'}}>
        <h4 style={{margin:'0 0 16px', color:'#f8fafc'}}>Últimos eventos</h4>
        <div style={{background:'#0f172a', overflowX:'auto'}}>
        <table className="table" style={{width:'100%', borderCollapse:'collapse', color:'#e2e8f0', background:'#0f172a !important'}}>
          <thead style={{background:'#0f172a'}}>
            <tr style={{color:'#cbd5e1', background:'#0f172a'}}>
              <th style={{padding:'12px 10px', textAlign:'left', borderBottom:'1px solid #334155'}}>Fecha</th>
              <th style={{padding:'12px 10px', textAlign:'left', borderBottom:'1px solid #334155'}}>Acción</th>
              <th style={{padding:'12px 10px', textAlign:'left', borderBottom:'1px solid #334155'}}>Entidad</th>
              <th style={{padding:'12px 10px', textAlign:'left', borderBottom:'1px solid #334155'}}>ID</th>
              <th style={{padding:'12px 10px', textAlign:'left', borderBottom:'1px solid #334155'}}>Cliente</th>
              <th style={{padding:'12px 10px', textAlign:'left', borderBottom:'1px solid #334155'}}>Taxi</th>
              <th style={{padding:'12px 10px', textAlign:'left', borderBottom:'1px solid #334155'}}>Detalle</th>
            </tr>
          </thead>
          <tbody style={{background:'#0f172a'}}>
            {events.map(event => {
              const clientName = extractValue(event.details, 'Cliente');
              const taxiNumber = extractValue(event.details, 'Taxi');
              return (
                <tr key={event.id} style={{...getRowStyle(event.action), transition:'background .2s ease'}}>
                  <td style={{padding:'12px 10px', borderBottom:'1px solid #1e293b'}}>{new Date(event.createdAt).toLocaleString()}</td>
                  <td style={{padding:'12px 10px', borderBottom:'1px solid #1e293b'}}><strong>{event.action}</strong></td>
                  <td style={{padding:'12px 10px', borderBottom:'1px solid #1e293b'}}>{event.entity}</td>
                  <td style={{padding:'12px 10px', borderBottom:'1px solid #1e293b'}}>{event.entityId || '-'}</td>
                  <td style={{padding:'12px 10px', borderBottom:'1px solid #1e293b'}}>{clientName}</td>
                  <td style={{padding:'12px 10px', borderBottom:'1px solid #1e293b'}}>{taxiNumber}</td>
                  <td style={{padding:'12px 10px', borderBottom:'1px solid #1e293b', maxWidth:320, whiteSpace:'normal', wordBreak:'break-word'}}>{event.details || '-'}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  )
}
