import React, { useState, useRef, useEffect } from 'react'

export default function Chatbot({ todos, onAddTodo, onToggleTodo, onDeleteTodo }) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { id: 1, text: "👋 Hi! I'm your Todo Assistant. Try:\n• 'add buy groceries'\n• 'list'\n• 'done 1'\n• 'delete 1'", sender: 'bot' }
  ])
  const [input, setInput] = useState('')
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return

    const userMsg = { id: Date.now(), text: input, sender: 'user' }
    setMessages(prev => [...prev, userMsg])
    setInput('')

    const response = await processCommand(input)
    setMessages(prev => [...prev, { id: Date.now() + 1, text: response, sender: 'bot' }])
  }

  const processCommand = async (cmd) => {
    const text = cmd.toLowerCase().trim()

    if (text === 'list' || text === 'show todos') {
      if (todos.length === 0) return '📋 No todos yet. Add one with "add your task"'
      const list = todos.map((t, i) => `${i + 1}. ${t.completed ? '✅' : '⭕'} ${t.title}`).join('\n')
      return `📋 Your Todos:\n${list}`
    }

    if (text.startsWith('add ')) {
      const title = text.slice(4).trim()
      if (!title) return '❌ Please provide a task. Example: "add buy groceries"'
      try {
        await onAddTodo(title)
        return `✅ Added: "${title}"`
      } catch {
        return '❌ Failed to add todo'
      }
    }

    if (text.startsWith('done ') || text.startsWith('complete ')) {
      const idx = parseInt(text.split(' ')[1]) - 1
      if (isNaN(idx) || !todos[idx]) return '❌ Invalid todo number'
      try {
        await onToggleTodo(todos[idx])
        return `✅ Marked as ${todos[idx].completed ? 'incomplete' : 'complete'}: "${todos[idx].title}"`
      } catch {
        return '❌ Failed to update'
      }
    }

    if (text.startsWith('delete ')) {
      const idx = parseInt(text.split(' ')[1]) - 1
      if (isNaN(idx) || !todos[idx]) return '❌ Invalid todo number'
      try {
        await onDeleteTodo(todos[idx]._id)
        return `🗑️ Deleted: "${todos[idx].title}"`
      } catch {
        return '❌ Failed to delete'
      }
    }

    if (text === 'help' || text === '?') {
      return `📚 Available commands:\n• list - Show all todos\n• add [task] - Add new todo\n• done [#] - Mark as complete\n• delete [#] - Delete todo\n• help - Show this menu`
    }

    return `❓ I didn't understand. Type "help" for commands.`
  }

  return (
    <>
      {/* Chat Bubble Button */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="position-fixed"
        style={{
          bottom: '20px',
          right: '20px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #ff8a65, #4fc3f7)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          zIndex: 999
        }}
        title="Open chatbot"
      >
        💬
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div
          className="position-fixed bg-white rounded shadow"
          style={{
            bottom: '90px',
            right: '20px',
            width: '350px',
            height: '500px',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1000,
            boxShadow: '0 5px 40px rgba(0,0,0,0.16)'
          }}
        >
          {/* Header */}
          <div
            style={{
              background: 'linear-gradient(135deg, #ff8a65, #4fc3f7)',
              color: 'white',
              padding: '15px',
              borderRadius: '8px 8px 0 0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <span className="fw-bold">🤖 Todo Assistant</span>
            <button
              onClick={() => setIsOpen(false)}
              className="btn btn-sm btn-light"
              style={{ padding: '2px 8px' }}
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '15px',
              backgroundColor: '#f9f9f9'
            }}
          >
            {messages.map(msg => (
              <div
                key={msg.id}
                style={{
                  marginBottom: '12px',
                  display: 'flex',
                  justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start'
                }}
              >
                <div
                  style={{
                    maxWidth: '80%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    backgroundColor: msg.sender === 'user' ? '#4fc3f7' : '#e9ecef',
                    color: msg.sender === 'user' ? 'white' : '#333',
                    fontSize: '14px',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word'
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={{ borderTop: '1px solid #e0e0e0', padding: '10px', display: 'flex', gap: '8px' }}>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleSend()}
              placeholder="Type a command..."
              className="form-control form-control-sm"
              style={{ fontSize: '13px' }}
            />
            <button onClick={handleSend} className="btn btn-sm btn-primary">
              Send
            </button>
          </div>
        </div>
      )}
    </>
  )
}
