import React, { useEffect, useState } from 'react'
import { clients, taxis, trips, audits } from '../servicios/api'

export default function Dashboard(){
  const [stats,setStats] = useState({});
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user.role === 'admin';
  useEffect(()=>{ load() },[]);
  const load = async ()=>{
    try {
      const [cRes,tRes,tripRes,auditRes] = await Promise.all([
        clients.list(),
        taxis.list(),
        trips.list(),
        isAdmin ? audits.list() : Promise.resolve({ data: [] })
      ]);
      const availableTaxis = tRes.data.filter(t=>t.disponible).length;
      const completedTrips = tripRes.data.filter(t=>t.estado==='Completado').length;
      const canceledTrips = tripRes.data.filter(t=>t.estado==='Cancelado').length;
      setStats({ 
        clientes: cRes.data.length, 
        taxis: tRes.data.length,
        taxisDisponibles: availableTaxis,
        taxisOcupados: tRes.data.filter(t=>!t.disponible).length,
        viajes: tripRes.data.length,
        viajesCompletados: completedTrips,
        viajesEnCurso: tripRes.data.filter(t=>t.estado==='En Curso').length,
        viajesCancelados: canceledTrips,
        historial: isAdmin ? auditRes.data.length : null
      });
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
    }
  }
  
  const roleColor = isAdmin ? '#e74c3c' : '#3498db';
  const roleLabel = isAdmin ? 'ADMINISTRADOR' : 'OPERADOR';
  const maxBar = Math.max(stats.viajesCompletados || 1, stats.viajesEnCurso || 1, stats.viajesCancelados || 1, stats.taxisDisponibles || 1, stats.taxisOcupados || 1);
  const barWidth = (value) => `${Math.round((value / maxBar) * 100)}%`;
  
  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20,flexWrap:'wrap',gap:10}}>
        <h3 style={{margin:0}}>Estadísticas</h3>
        <button style={{
          background: roleColor,
          color: 'white',
          border: 'none',
          padding: '12px 20px',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: 'bold',
          cursor: 'default',
          boxShadow: `0 4px 8px ${roleColor}33`,
          letterSpacing: '0.5px'
        }}>
          {roleLabel}
        </button>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))',gap:16}}>
        <div className="card" style={{borderLeft:'4px solid #3498db',padding:20}}>
          <div style={{fontSize:12,color:'#999'}}>CLIENTES</div>
          <div style={{fontSize:36,fontWeight:'bold',color:'#3498db',marginTop:8}}>{stats.clientes||0}</div>
          <div style={{fontSize:12,color:'#666',marginTop:8}}>Clientes registrados</div>
        </div>
        
        <div className="card" style={{borderLeft:'4px solid #2ecc71',padding:20}}>
          <div style={{fontSize:12,color:'#999'}}>TAXIS DISPONIBLES</div>
          <div style={{fontSize:36,fontWeight:'bold',color:'#2ecc71',marginTop:8}}>{stats.taxisDisponibles||0}/{stats.taxis||0}</div>
          <div style={{fontSize:12,color:'#666',marginTop:8}}>De la flota total</div>
        </div>
        
        <div className="card" style={{borderLeft:'4px solid #f39c12',padding:20}}>
          <div style={{fontSize:12,color:'#999'}}>EN CURSO</div>
          <div style={{fontSize:36,fontWeight:'bold',color:'#f39c12',marginTop:8}}>{stats.viajesEnCurso||0}</div>
          <div style={{fontSize:12,color:'#666',marginTop:8}}>Viajes activos</div>
        </div>
        
        <div className="card" style={{borderLeft:'4px solid #27ae60',padding:20}}>
          <div style={{fontSize:12,color:'#999'}}>COMPLETADOS</div>
          <div style={{fontSize:36,fontWeight:'bold',color:'#27ae60',marginTop:8}}>{stats.viajesCompletados||0}</div>
          <div style={{fontSize:12,color:'#666',marginTop:8}}>Viajes finalizados</div>
        </div>
        
        <div className="card" style={{borderLeft:'4px solid #9b59b6',padding:20}}>
          <div style={{fontSize:12,color:'#999'}}>TOTAL VIAJES</div>
          <div style={{fontSize:36,fontWeight:'bold',color:'#9b59b6',marginTop:8}}>{stats.viajes||0}</div>
          <div style={{fontSize:12,color:'#666',marginTop:8}}>Histórico completo</div>
        </div>
        <div className="card" style={{borderLeft:'4px solid #34495e',padding:20}}>
          <div style={{fontSize:12,color:'#999'}}>HISTORIAL</div>
          <div style={{fontSize:36,fontWeight:'bold',color:'#34495e',marginTop:8}}>{stats.historial !== null ? stats.historial : 'N/A'}</div>
          <div style={{fontSize:12,color:'#666',marginTop:8}}>{isAdmin ? 'Eventos registrados' : 'Historial restringido'}</div>
        </div>
      </div>
      <div className="card" style={{marginTop:20,padding:20}}>
        <h4 style={{margin:0,marginBottom:14}}>Gráfico de rendimiento</h4>
        <div style={{display:'grid',gap:16}}>
          {[
            {label:'Viajes completados', value: stats.viajesCompletados || 0, color:'#27ae60'},
            {label:'Viajes en curso', value: stats.viajesEnCurso || 0, color:'#f39c12'},
            {label:'Viajes cancelados', value: stats.viajesCancelados || 0, color:'#e74c3c'},
            {label:'Taxis disponibles', value: stats.taxisDisponibles || 0, color:'#2ecc71'},
            {label:'Taxis ocupados', value: stats.taxisOcupados || 0, color:'#34495e'}
          ].map(item => (
            <div key={item.label} style={{display:'grid',gap:6}}>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:13,color:'#444'}}>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </div>
              <div style={{background:'#ecf0f1',height:12,borderRadius:6,overflow:'hidden'}}>
                <div style={{width: barWidth(item.value), height:'100%', background:item.color, transition:'width .3s ease'}} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
