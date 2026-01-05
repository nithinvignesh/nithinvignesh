import React, { useState, useEffect } from 'react'
import AuthForm from './components/AuthForm'
import TodoApp from './components/TodoApp'

export default function App(){
  const [token, setToken] = useState(localStorage.getItem('token'))

  useEffect(()=>{
    if(token) localStorage.setItem('token', token)
    else localStorage.removeItem('token')
  },[token])

  return (
    <div className="container py-4">
      <header className="mb-4 text-center">
        <h1 className="display-6 text-gradient"> Todos</h1>
        <p className="text-muted">to remember daily activites</p>
      </header>
      {!token ? <AuthForm onAuth={(t)=>setToken(t)} /> : <TodoApp token={token} onLogout={()=>setToken(null)} />}
    </div>
  )
}
