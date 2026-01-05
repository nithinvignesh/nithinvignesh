import React, { useEffect, useState } from 'react'
import { fetchTodos, createTodo, updateTodo, deleteTodo } from '../api'

export default function TodoApp({ token, onLogout }){
  const [todos, setTodos] = useState([])
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')

  const load = async ()=>{
    const data = await fetchTodos(token)
    setTodos(Array.isArray(data)?data:[])
  }

  useEffect(()=>{ load() },[])

  const add = async (e) => {
    e.preventDefault()
    await createTodo(token, { title, description: desc })
    setTitle('')
    setDesc('')
    load()
  }

  const toggle = async (t)=>{
    await updateTodo(token, t._id, { completed: !t.completed })
    load()
  }

  const remove = async (id)=>{ await deleteTodo(token,id); load() }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Your Todos</h3>
        <div>
          <button className="btn btn-sm btn-outline-danger me-2" onClick={()=>{ localStorage.removeItem('token'); onLogout(); }}>Logout</button>
        </div>
      </div>

      <form onSubmit={add} className="row g-2 mb-3">
        <div className="col-sm-5">
          <input value={title} onChange={e=>setTitle(e.target.value)} className="form-control" placeholder="New todo title" required />
        </div>
        <div className="col-sm-5">
          <input value={desc} onChange={e=>setDesc(e.target.value)} className="form-control" placeholder="Description (optional)" />
        </div>
        <div className="col-sm-2 d-grid">
          <button className="btn btn-success">Add</button>
        </div>
      </form>

      <div className="row">
        {todos.length === 0 && <div className="text-muted">No todos yet.</div>}
        {todos.map(t=> (
          <div className="col-md-6 mb-3" key={t._id}>
            <div className={`card ${t.completed ? 'border-success' : 'border-primary'}`}>
              <div className="card-body d-flex justify-content-between align-items-start">
                <div>
                  <h5 className="card-title mb-1">{t.title}</h5>
                  <p className="card-text text-muted small">{t.description}</p>
                  <small className="text-muted">{new Date(t.createdAt).toLocaleString()}</small>
                </div>
                <div className="text-end">
                  <button className={`btn btn-sm mb-2 ${t.completed ? 'btn-outline-warning' : 'btn-outline-success'}`} onClick={()=>toggle(t)}>{t.completed ? 'Undo' : 'Done'}</button>
                  <br />
                  <button className="btn btn-sm btn-danger" onClick={()=>remove(t._id)}>Delete</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
