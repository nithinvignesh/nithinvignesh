import React, { useState } from 'react'
import { login, register } from '../api'

export default function AuthForm({ onAuth }){
  const [isLogin, setIsLogin] = useState(true)
  const [form, setForm] = useState({ name:'', email:'', password:'' })
  const [err, setErr] = useState('')

  const submit = async (e) => {
    e.preventDefault(); setErr('')
    try{
      const res = isLogin ? await login({ email: form.email, password: form.password }) : await register(form)
      if(res.token){ onAuth(res.token) }
      else setErr(res.message || 'Auth failed')
    }catch(e){ setErr('Network error') }
  }

  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <div className="card shadow-sm">
          <div className="card-body">
            <h3 className="card-title text-center mb-3">{isLogin ? 'Login' : 'Register'}</h3>
            {err && <div className="alert alert-danger">{err}</div>}
            <form onSubmit={submit}>
              {!isLogin && (
                <div className="mb-2">
                  <input className="form-control" placeholder="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required />
                </div>
              )}
              <div className="mb-2">
                <input className="form-control" placeholder="Email" type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required />
              </div>
              <div className="mb-3">
                <input className="form-control" placeholder="Password" type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required />
              </div>
              <div className="d-grid gap-2">
                <button className="btn btn-primary" type="submit">{isLogin ? 'Login' : 'Create account'}</button>
                <button type="button" className="btn btn-outline-secondary" onClick={()=>setIsLogin(!isLogin)}>{isLogin ? 'Switch to Register' : 'Switch to Login'}</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
