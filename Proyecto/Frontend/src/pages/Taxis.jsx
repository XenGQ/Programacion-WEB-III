import React, { useEffect, useState } from 'react'
import { taxis } from '../servicios/api'

export default function Taxis(){
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user.role === 'admin';
  const [list,setList] = useState([]);
  const [form,setForm] = useState({ numero_admin:'', matricula:'', modelo:'', chofer_nombre:'', chofer_ci:'' });
  const [editId,setEditId] = useState(null);
  
  useEffect(()=>{ load() },[]);
  const load = async ()=>{ 
    const res = await taxis.list();
    const data = isAdmin ? res.data : res.data.filter(t => t.disponible === true);
    setList(data);
  }
  
  const save = async ()=>{ 
    try {
      if(editId){
        await taxis.update(editId, form);
        setEditId(null);
      } else {
        await taxis.create(form);
      }
      setForm({ numero_admin:'', matricula:'', modelo:'', chofer_nombre:'', chofer_ci:'' }); 
      load(); 
    } catch(e) { alert('Error: '+e.response?.data?.message); }
  }
  
  const edit = (t)=>{ 
    setForm({numero_admin:t.numero_admin||'', matricula:t.matricula, modelo:t.modelo, chofer_nombre:t.chofer_nombre||'', chofer_ci:t.chofer_ci||''}); 
    setEditId(t.id); 
  }
  
  const cancel = ()=>{ setEditId(null); setForm({numero_admin:'',matricula:'',modelo:'',chofer_nombre:'',chofer_ci:''}); }
  const toggle = async (id)=>{ await taxis.toggle(id); load(); }
  const remove = async (id)=>{ if(!confirm('Eliminar?')) return; await taxis.del(id); load(); }

  return (
    <div>
      <h3>Taxis</h3>
      <div style={{display:'flex',gap:12}}>
        <div style={{width:360}} className="card">
          <h4>{isAdmin ? (editId ? 'Editar Taxi' : 'Registrar Taxi') : 'Taxis disponibles'}</h4>
          {isAdmin ? (
            <>
              <input className="input" placeholder="Móvil" value={form.numero_admin} onChange={e=>setForm({...form,numero_admin:e.target.value})} />
              <input className="input" placeholder="Matrícula" value={form.matricula} onChange={e=>setForm({...form,matricula:e.target.value})} />
              <input className="input" placeholder="Modelo" value={form.modelo} onChange={e=>setForm({...form,modelo:e.target.value})} />
              <input className="input" placeholder="Nombre del Chofer" value={form.chofer_nombre} onChange={e=>setForm({...form,chofer_nombre:e.target.value})} />
              <input className="input" placeholder="CI del Chofer" value={form.chofer_ci} onChange={e=>setForm({...form,chofer_ci:e.target.value})} />
              <div style={{marginTop:8,display:'flex',gap:6}}>
                <button className="btn" onClick={save}>{editId ? 'Actualizar' : 'Registrar'} taxi</button>
                {editId && <button className="btn" onClick={cancel} style={{background:'#666'}}>Cancelar</button>}
              </div>
            </>
          ) : (
            <p>Los operadores solo pueden ver los vehículos disponibles para asignar viajes.</p>
          )}
        </div>

        <div style={{flex:1}} className="card">
          <h4>FLOTA {isAdmin ? '' : '(TODOS LOS DISPONIBLES)'}</h4>
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Móvil</th>
                <th>Chofer</th>
                <th>Disp</th>
                {isAdmin && <th></th>}
              </tr>
            </thead>
            <tbody>
              {list.map(t=> (
                <tr key={t.id}>
                  <td>{t.numero_admin||t.id}</td>
                  <td>{t.matricula}</td>
                  <td>{t.chofer_nombre}</td>
                  <td>{t.disponible? 'SÍ':'NO'}</td>
                  {isAdmin ? (
                    <td>
                      <button className="btn" onClick={()=>edit(t)}>Editar</button>
                      <button className="btn" onClick={()=>toggle(t.id)}>{t.disponible? 'Ocupado':'Libre'}</button>
                      <button className="btn" onClick={()=>remove(t.id)} style={{background:'#c33'}}>Eliminar</button>
                    </td>
                  ) : null}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
