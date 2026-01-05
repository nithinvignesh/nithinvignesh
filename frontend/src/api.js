const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export async function register(data){
  const res = await fetch(`${API_URL}/api/auth/register`, {
    method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(data)
  })
  return res.json()
}

export async function login(data){
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(data)
  })
  return res.json()
}

export async function fetchTodos(token){
  const res = await fetch(`${API_URL}/api/todos`, { headers: { Authorization: `Bearer ${token}` } })
  return res.json()
}

export async function createTodo(token, data){
  const res = await fetch(`${API_URL}/api/todos`, { method: 'POST', headers: { 'Content-Type':'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(data) })
  return res.json()
}

export async function updateTodo(token, id, data){
  const res = await fetch(`${API_URL}/api/todos/${id}`, { method: 'PUT', headers: { 'Content-Type':'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(data) })
  return res.json()
}

export async function deleteTodo(token, id){
  const res = await fetch(`${API_URL}/api/todos/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
  return res.json()
}
