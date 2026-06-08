import React, { useEffect, useState } from 'react'
import { auth } from '../servicios/api'

export default function Login(){
  const [captchaCode, setCaptchaCode] = useState('');
  const [form, setForm] = useState({ username:'', password:'', captcha:'' });
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(()=>{ loadCaptcha() },[]);
  
  const loadCaptcha = async ()=>{
    try {
      const res = await auth.captcha();
      console.log('Captcha response:', res.data);
      setCaptchaCode(res.data.code || '0000');
      setForm(f => ({...f, captcha:''}));
      setErr('');
    } catch(e) {
      console.error('Captcha load error:', e);
      setErr('Error cargando captcha. Recarga la página.');
    }
  }

  const submit = async (e)=>{
    e.preventDefault(); 
    setErr('');
    if (!form.username || !form.password || !form.captcha) {
      setErr('Todos los campos son requeridos');
      return;
    }
    
    setLoading(true);
    console.log('Attempting login with captcha:', form.captcha);
    
    try{
      const res = await auth.login(form);
      console.log('Login successful:', res.data);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      window.location.reload();
    }catch(err){ 
      console.error('Login error:', err);
      setErr(err.response?.data?.message || 'Error login'); 
      loadCaptcha();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{display:'grid',placeItems:'center',height:'100vh',background:'linear-gradient(135deg, #0a0e14 0%, #1a1f2e 100%)'}}>
      <div className="card" style={{width:420,borderTop:'3px solid #9d4edd'}}>
        <div style={{textAlign:'center',marginBottom:24}}>
          <h1 style={{
            fontSize:'32px',
            fontWeight:'800',
            color:'#9d4edd',
            margin:'0 0 4px 0',
            letterSpacing:'1px'
          }}>RadioTaxi</h1>
          <h2 style={{
            fontSize:'18px',
            fontWeight:'600',
            color:'#c77dff',
            margin:'0',
            letterSpacing:'0.5px',
            textTransform:'uppercase'
          }}>Osadía</h2>
        </div>
        
        <form onSubmit={submit} className="form-row" style={{flexDirection:'column',gap:14}}>
          <div>
            <label style={{fontSize:'12px',color:'#999',marginBottom:'6px',display:'block',fontWeight:'500'}}>USUARIO</label>
            <input 
              className="input" 
              placeholder="Ingrese su usuario" 
              value={form.username} 
              onChange={e=>setForm({...form,username:e.target.value})}
              disabled={loading}
              autoFocus
            />
          </div>
          
          <div>
            <label style={{fontSize:'12px',color:'#999',marginBottom:'6px',display:'block',fontWeight:'500'}}>CONTRASEÑA</label>
            <input 
              className="input" 
              type="password" 
              placeholder="Ingrese su contraseña" 
              value={form.password} 
              onChange={e=>setForm({...form,password:e.target.value})}
              disabled={loading}
            />
          </div>
          
          <div>
            <label style={{fontSize:'12px',color:'#999',marginBottom:'8px',display:'block',fontWeight:'500'}}>VERIFICACIÓN - INGRESA LOS DÍGITOS</label>
            
            <div style={{
              display:'flex',
              gap:8,
              marginBottom:10,
              alignItems:'center'
            }}>
              <div style={{
                background:'linear-gradient(45deg, #9d4edd22, #c77dff11)',
                border:'3px solid #9d4edd',
                borderRadius:'8px',
                padding:'16px 20px',
                flex:1,
                textAlign:'center',
                fontSize:'36px',
                fontWeight:'900',
                color:'#9d4edd',
                letterSpacing:'8px',
                fontFamily:'Georgia, serif',
                minHeight:'60px',
                display:'flex',
                alignItems:'center',
                justifyContent:'center',
                boxShadow:'0 0 20px #9d4edd33'
              }}>
                {captchaCode}
              </div>
              <button 
                type="button"
                onClick={loadCaptcha}
                disabled={loading}
                style={{
                  background:'#9d4edd',
                  border:'none',
                  color:'white',
                  cursor:loading ? 'not-allowed' : 'pointer',
                  fontSize:'20px',
                  padding:'16px 14px',
                  borderRadius:'8px',
                  opacity: loading ? 0.5 : 1,
                  fontWeight:'bold'
                }}
                title="Generar nuevo código"
              >
                ↻
              </button>
            </div>
            
            <input 
              className="input" 
              placeholder="Ingresa los 4 dígitos" 
              value={form.captcha} 
              onChange={e=>setForm({...form,captcha:e.target.value})}
              disabled={loading}
              maxLength={4}
              type="text"
              pattern="[0-9]*"
              style={{letterSpacing:'2px',fontSize:'16px'}}
            />
          </div>

          <button 
            className="btn" 
            type="submit"
            disabled={loading}
            style={{
              marginTop:'12px',
              background:'#9d4edd',
              fontWeight:'600',
              letterSpacing:'0.5px',
              textTransform:'uppercase'
            }}
          >
            {loading ? 'Autenticando...' : 'Ingresar'}
          </button>
          
          {err && <div style={{color:'#ff6b6b',fontSize:'13px',padding:'10px',background:'#3c2323',borderRadius:'4px',border:'1px solid #9d4edd33'}}>{err}</div>}
        </form>
      </div>
    </div>
  )
}
