import React, { useEffect, useState } from 'react'
import { clients } from '../servicios/api'

export default function Clients(){
  const [list,setList] = useState([]);
  const [form,setForm] = useState({ nombre:'', celular:'', addresses:[] });
  const [origen, setOrigen] = useState({ calle:'', numero:'', ciudad:'' });
  const [destino, setDestino] = useState({ calle:'', numero:'', ciudad:'' });
  const [editId,setEditId] = useState(null);

  useEffect(()=>{ load() },[]);
  const load = async ()=>{ const res = await clients.list(); setList(res.data); }

  const addDestination = ()=>{
    if (!origen.calle) { alert('Completa la dirección de origen'); return; }
    if (!destino.calle) { alert('Completa la dirección de destino'); return; }

    const existingDestinos = form.addresses.slice(1);
    const newAddresses = [origen, ...existingDestinos, destino];
    setForm({...form, addresses: newAddresses});
    setDestino({calle:'',numero:'',ciudad:''});
  }
  
  const removeAddress = (i)=>{
    if (i === 0) return;
    setForm({...form, addresses: form.addresses.filter((_,idx)=>idx!==i)});
  }
  
  const save = async ()=>{ 
    try {
      const addresses = [origen, ...form.addresses.slice(1)].filter(a => a && a.calle);
      if (!origen.calle) return alert('La dirección de origen es obligatoria');
      if (addresses.length < 2) return alert('Debes registrar al menos una dirección de destino');

      const payload = { nombre:form.nombre, celular:form.celular, addresses };
      if(editId){
        await clients.update(editId, payload);
        setEditId(null);
      } else {
        await clients.create(payload);
      }
      setForm({ nombre:'', celular:'', addresses:[] });
      setOrigen({calle:'',numero:'',ciudad:''});
      setDestino({calle:'',numero:'',ciudad:''});
      load(); 
    } catch(e) { alert('Error: '+e.response?.data?.message); }
  }
  
  const edit = (c)=>{ 
    const addresses = c.addresses || [];
    setForm({nombre:c.nombre, celular:c.celular, addresses});
    setOrigen(addresses[0] || {calle:'',numero:'',ciudad:''});
    setDestino({calle:'',numero:'',ciudad:''});
    setEditId(c.id); 
  }
  
  const cancel = ()=>{ setEditId(null); setForm({nombre:'',celular:'',addresses:[]}); setOrigen({calle:'',numero:'',ciudad:''}); setDestino({calle:'',numero:'',ciudad:''}); }
  const remove = async (id)=>{ if(!confirm('Eliminar?')) return; await clients.del(id); load(); }

  return (
    <div>
      <h3>Clientes</h3>
      <div style={{display:'flex',gap:12}}>
        <div style={{flex:1}} className="card">
          <h4>{editId ? 'Editar cliente' : 'Registrar cliente'}</h4>
          <input className="input" placeholder="Nombre" value={form.nombre} onChange={e=>setForm({...form,nombre:e.target.value})} />
          <input className="input" placeholder="Celular" value={form.celular} onChange={e=>setForm({...form,celular:e.target.value})} />
          
          <p style={{margin:'12px 0 8px',fontSize:'13px',color:'#aaa'}}>Indique la direccion del cliente y luego añada direcciones de destino</p>
          <div style={{marginTop:8,display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
            <div style={{background:'rgba(52, 211, 153, 0.08)',padding:14,borderRadius:8,border:'1px solid rgba(52, 211, 153, 0.3)'}}>
              <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:10}}>
                <span style={{fontSize:14,fontWeight:'600',color:'#34d399'}}>ORIGEN</span>
              </div>
              <input className="input" placeholder="Calle" value={origen.calle} onChange={e=>setOrigen({...origen,calle:e.target.value})} style={{marginBottom:6}} />
              <input className="input" placeholder="Número" value={origen.numero} onChange={e=>setOrigen({...origen,numero:e.target.value})} style={{marginBottom:6}} />
              <input className="input" placeholder="Ciudad" value={origen.ciudad} onChange={e=>setOrigen({...origen,ciudad:e.target.value})} />
            </div>
            
            <div style={{background:'rgba(96, 165, 250, 0.08)',padding:14,borderRadius:8,border:'1px solid rgba(96, 165, 250, 0.3)'}}>
              <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:10}}>
                <span style={{fontSize:14,fontWeight:'600',color:'#60a5fa'}}>DESTINO</span>
              </div>
              <input className="input" placeholder="Calle" value={destino.calle} onChange={e=>setDestino({...destino,calle:e.target.value})} style={{marginBottom:6}} />
              <input className="input" placeholder="Número" value={destino.numero} onChange={e=>setDestino({...destino,numero:e.target.value})} style={{marginBottom:6}} />
              <input className="input" placeholder="Ciudad" value={destino.ciudad} onChange={e=>setDestino({...destino,ciudad:e.target.value})} />
            </div>
          </div>
          
          {form.addresses.length > 0 && (
            <div style={{marginTop:12}}>
              <h5 style={{color:'#9aa4b2',marginBottom:8}}>Direcciones registradas</h5>
              {form.addresses.map((a,i)=> (
                <div key={i} style={{padding:8,background:'rgba(255,255,255,0.02)',marginBottom:6,borderRadius:6,display:'flex',justifyContent:'space-between',alignItems:'center',border:'1px solid rgba(255,255,255,0.05)'}}>
                  <span style={{fontSize:'13px'}}><strong>{i === 0 ? 'Origen' : `Destino ${i}`}</strong> {a.calle} {a.numero || ''} {a.ciudad ? `- ${a.ciudad}` : ''}</span>
                  {i > 0 ? <button className="btn" style={{padding:'2px 6px',fontSize:'12px'}} onClick={()=>removeAddress(i)}>Quitar</button> : <span style={{fontSize:'12px',color:'#999'}}>Solo lectura</span>}
                </div>
              ))}
            </div>
          )}
          
          <div style={{marginTop:12,display:'flex',gap:6,flexWrap:'wrap'}}>
            <button className="btn" onClick={addDestination} style={{flex:1,minWidth:180,background:'#34d399'}}>Agregar destino</button>
            <button className="btn" onClick={save} style={{flex:1,minWidth:180}}>{editId?'Actualizar':'Guardar'} cliente</button>
            {editId && <button className="btn" onClick={cancel} style={{background:'#666',minWidth:180}}>Cancelar</button>}
          </div>
        </div>

        <div style={{flex:2}} className="card">
          <h4>Clientes registrados</h4>
          <table className="table">
            <thead><tr><th>Nombre</th><th>Celular</th><th>Direcciones</th><th></th></tr></thead>
            <tbody>
              {list.map(c => (
                <tr key={c.id}>
                  <td>{c.nombre}</td>
                  <td>{c.celular}</td>
                  <td>{(c.addresses||[]).map(a=>a.calle+' '+(a.numero||'')).join(' | ')}</td>
                  <td>
                            <>
                      <button className="btn" onClick={()=>edit(c)}>Editar</button>
                      <button className="btn" onClick={()=>remove(c.id)} style={{background:'#c33'}}>Eliminar</button>
                    </>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
