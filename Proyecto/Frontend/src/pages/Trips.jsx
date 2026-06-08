import React, { useEffect, useState } from 'react'
import { clients, taxis, trips } from '../servicios/api'

export default function Trips(){
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user.role === 'admin';
  const [clientsList,setClients] = useState([]);
  const [clientAddresses, setClientAddresses] = useState([]);
  const [taxisList,setTaxis] = useState([]);
  const [list,setList] = useState([]);
  const [form,setForm] = useState({ clientId:'', taxiId:'', origen:'', destino:'' });
  const [editId,setEditId] = useState(null);

  const formatAddress = (addr) => addr ? `${addr.calle}${addr.numero ? ' ' + addr.numero : ''}${addr.ciudad ? ' - ' + addr.ciudad : ''}` : '';

  useEffect(()=>{ load() },[]);
  const load = async ()=>{ 
    const [cRes,tRes,tripRes]=await Promise.all([clients.list(), taxis.list(), trips.list()]); 
    setClients(cRes.data); 
    setTaxis(isAdmin ? tRes.data : tRes.data.filter(t => t.disponible === true)); 
    setList(tripRes.data); 
  }

  const handleClientChange = (e) => {
    const clientId = e.target.value;
    const selected = clientsList.find(c => String(c.id) === clientId);
    const addresses = selected?.addresses || [];
    const origen = formatAddress(addresses[0]) || '';
    const destino = formatAddress(addresses[1]) || '';

    setClientAddresses(addresses);
    setForm({...form, clientId, origen, destino});
  };

  const handleOrigenChange = (e) => {
    setForm({...form, origen: e.target.value});
  };

  const handleDestinoChange = (e) => {
    setForm({...form, destino: e.target.value});
  };

  const create = async ()=>{ 
    try {
      if(editId){
        await trips.update(editId, form);
        setEditId(null);
      } else {
        await trips.create(form);
      }
      setForm({ clientId:'', taxiId:'', origen:'', destino:'' }); 
      setClientAddresses([]);
      load(); 
    } catch(e) { alert('Error: '+e.response?.data?.message); }
  }
  
  const edit = (v)=>{ 
    const selected = clientsList.find(c => c.id === v.clientId);
    const addresses = selected?.addresses || [];
    setClientAddresses(addresses);
    setForm({clientId:v.clientId, taxiId:v.taxiId, origen:v.origen, destino:v.destino||''}); 
    setEditId(v.id); 
  }
  
  const cancel = ()=>{ setEditId(null); setForm({clientId:'',taxiId:'',origen:'',destino:''}); setClientAddresses([]); }
  const setEstado = async (id,estado)=>{ await trips.update(id,{estado}); load(); }
  const remove = async (id)=>{ if(!confirm('Eliminar?')) return; await trips.del(id); load(); }

  return (
    <div>
      <h3>Viajes</h3>
      <div style={{display:'flex',gap:12}}>
        <div style={{width:480}} className="card">
          <h4>{editId ? 'Editar viaje' : 'Nuevo viaje'}</h4>
          <select className="input" value={form.clientId} onChange={handleClientChange}>
            <option value="">Seleccionar cliente</option>
            {clientsList.map(c=> <option key={c.id} value={c.id}>{c.nombre} · {c.celular}</option>)}
          </select>
          <select className="input" value={form.taxiId} onChange={e=>setForm({...form,taxiId:e.target.value})}>
            <option value="">Seleccionar móvil (número admin)</option>
            {taxisList.map(t=> <option key={t.id} value={t.id}>{t.numero_admin||t.id} · {t.matricula}</option>)}
          </select>
          
          <div style={{marginTop:12,display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
            <div style={{background:'rgba(52, 211, 153, 0.08)',padding:12,borderRadius:8,border:'1px solid rgba(52, 211, 153, 0.3)'}}>
              <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:10}}>
                <label style={{margin:0,color:'#34d399',fontWeight:'600',fontSize:'13px'}}>ORIGEN</label>
              </div>
              {clientAddresses.length > 0 ? (
                <select className="input" value={form.origen} onChange={handleOrigenChange} style={{width:'100%'}}>
                  <option value="">Seleccionar origen</option>
                  {clientAddresses.map((addr, i) => <option key={`origen-${i}`} value={formatAddress(addr)}>{formatAddress(addr)}</option>)}
                </select>
              ) : (
                <input className="input" placeholder="Dirección origen" value={form.origen} onChange={e=>setForm({...form,origen:e.target.value})} />
              )}
            </div>
            
            <div style={{background:'rgba(96, 165, 250, 0.08)',padding:12,borderRadius:8,border:'1px solid rgba(96, 165, 250, 0.3)'}}>
              <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:10}}>
                <label style={{margin:0,color:'#60a5fa',fontWeight:'600',fontSize:'13px'}}>DESTINO</label>
              </div>
              {clientAddresses.length > 0 ? (
                <select className="input" value={form.destino} onChange={handleDestinoChange} style={{width:'100%'}}>
                  <option value="">Seleccionar destino</option>
                  {clientAddresses.map((addr, i) => <option key={`destino-${i}`} value={formatAddress(addr)}>{formatAddress(addr)}</option>)}
                </select>
              ) : (
                <input className="input" placeholder="Dirección destino" value={form.destino} onChange={e=>setForm({...form,destino:e.target.value})} />
              )}
            </div>
          </div>
          
          <div style={{marginTop:12,display:'flex',gap:6}}>
            <button className="btn" onClick={create} style={{flex:1}}>{editId ? 'Actualizar' : 'Crear'} viaje</button>
            {editId && <button className="btn" onClick={cancel} style={{background:'#666',flex:1}}>Cancelar</button>}
          </div>
        </div>

        <div style={{flex:1}} className="card">
          <h4>Historial</h4>
          <table className="table">
            <thead><tr><th>ID</th><th>Fecha</th><th>Cliente</th><th>Móvil</th><th>Origen</th><th>Destino</th><th>Estado</th><th></th></tr></thead>
            <tbody>
              {list.map(v => (
                <tr key={v.id}>
                  <td>{v.id}</td>
                  <td>{new Date(v.createdAt).toLocaleString()}</td>
                  <td>{v.client?.nombre} · {v.client?.celular}</td>
                  <td>{v.taxi?.numero_admin||v.taxi?.id}</td>
                  <td>{v.origen}</td>
                  <td>{v.destino}</td>
                  <td>{v.estado}</td>
                  <td style={{fontSize:'12px'}}><button className="btn" onClick={()=>edit(v)}>Editar</button> {v.estado==='En Curso'?<button className="btn" onClick={()=>setEstado(v.id,'Completado')}>Finalizar</button>:''} <button className="btn" onClick={()=>remove(v.id)} style={{background:'#c33'}}>Del</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
