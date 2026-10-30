import React, { useEffect, useMemo, useState } from 'react'
import api from '../api/axios.js'
import { useAuth } from '../context/AuthContext.jsx'
import TaskForm from '../components/TaskForm.jsx'
import { generateTaskSummary } from '../api/ai.js'
export default function Dashboard () {
  const { user, logout } = useAuth()
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [editing, setEditing] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [summarizing, setSummarizing] = useState('')
  const [summaries, setSummaries] = useState({})
  const [filter, setFilter] = useState('all')

  async function loadTasks () {
    setError('')
    try {
      const { data } = await api.get('/tasks')
      setTasks(data.tasks)
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load tasks.')
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    loadTasks()
  }, [])
  const visibleTasks = useMemo(
    () => (filter === 'all' ? tasks : tasks.filter(t => t.status === filter)),
    [tasks, filter]
  )
  const completed = tasks.filter(t => t.status === 'completed').length

  async function saveTask (form) {
    setSaving(true)
    setError('')
    setNotice('')
    try {
      if (editing) await api.put(`/tasks/${editing._id}`, form)
      else await api.post('/tasks', form)
      setNotice(
        editing ? 'Task updated successfully.' : 'Task created successfully.'
      )
      setShowForm(false)
      setEditing(null)
      await loadTasks()
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save task.')
    } finally {
      setSaving(false)
    }
  }
  async function deleteTask (task) {
    if (!window.confirm(`Delete "${task.title}"? This cannot be undone.`))
      return
    try {
      await api.delete(`/tasks/${task._id}`)
      setTasks(prev => prev.filter(t => t._id !== task._id))
      setNotice('Task deleted.')
    } catch (err) {
      setError(err.response?.data?.message || 'Could not delete task.')
    }
  }
  async function toggleComplete (task) {
    const status = task.status === 'completed' ? 'pending' : 'completed'
    try {
      const { data } = await api.put(`/tasks/${task._id}`, { status })
      setTasks(prev => prev.map(t => (t._id === task._id ? data.task : t)))
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update task.')
    }
  }

  async function generateSummary (task) {
    setSummarizing(task._id)
    setError('')

    try {
      const summary = await generateTaskSummary(task.description || task.title)

      setSummaries(prev => ({
        ...prev,
        [task._id]: summary
      }))
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'AI summary generation failed. Please try again.'
      )
    } finally {
      setSummarizing('')
    }
  }

  function startEdit (task) {
    setEditing(task)
    setShowForm(true)
    setNotice('')
  }
  function startCreate () {
    setEditing(null)
    setShowForm(true)
    setNotice('')
  }
  return (
    <div className='app-shell'>
      <header className='topbar'>
        <div className='brand'>
          <span className='brand-mark'>✓</span> TaskFlow
        </div>
        <div className='topbar-right'>
          <span className='avatar'>
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </span>
          <span className='user-name'>{user?.name}</span>
          <button className='button ghost' onClick={logout}>
            Log out
          </button>
        </div>
      </header>
      <main className='dashboard'>
        <section className='welcome-row'>
          <div>
            <p className='eyebrow'>YOUR WORKSPACE</p>
            <h1>Good to see you, {user?.name?.split(' ')[0]}.</h1>
            <p className='muted'>
              A clear plan makes a calmer day. What will you get done?
            </p>
          </div>
          <button className='button primary add-button' onClick={startCreate}>
            ＋ New task
          </button>
        </section>
        <section className='stats-grid'>
          <div className='stat-card'>
            <span className='stat-icon lavender'>▤</span>
            <div>
              <p>Total tasks</p>
              <strong>{tasks.length}</strong>
            </div>
          </div>
          <div className='stat-card'>
            <span className='stat-icon green'>✓</span>
            <div>
              <p>Completed</p>
              <strong>{completed}</strong>
            </div>
          </div>
          <div className='stat-card'>
            <span className='stat-icon amber'>◷</span>
            <div>
              <p>Still to do</p>
              <strong>{tasks.length - completed}</strong>
            </div>
          </div>
        </section>
        {error && (
          <div className='alert error-alert' role='alert'>
            {error}
            <button onClick={() => setError('')} aria-label='Dismiss'>
              ×
            </button>
          </div>
        )}
        {notice && (
          <div className='alert success-alert' role='status'>
            {notice}
            <button onClick={() => setNotice('')} aria-label='Dismiss'>
              ×
            </button>
          </div>
        )}
        {showForm && (
          <section className='panel form-panel'>
            <div className='panel-heading'>
              <div>
                <p className='eyebrow'>
                  {editing ? 'UPDATE DETAILS' : 'MAKE IT HAPPEN'}
                </p>
                <h2>{editing ? 'Edit task' : 'Create a task'}</h2>
              </div>
            </div>
            <TaskForm
              initialTask={editing}
              onSave={saveTask}
              saving={saving}
              onCancel={() => {
                setShowForm(false)
                setEditing(null)
              }}
            />
          </section>
        )}
        <section className='tasks-section'>
          <div className='tasks-heading'>
            <div>
              <p className='eyebrow'>YOUR TASK LIST</p>
              <h2>
                Tasks <span className='count-badge'>{tasks.length}</span>
              </h2>
            </div>
            <select
              className='filter-select'
              value={filter}
              onChange={e => setFilter(e.target.value)}
              aria-label='Filter tasks'
            >
              <option value='all'>All tasks</option>
              <option value='pending'>Pending</option>
              <option value='in-progress'>In progress</option>
              <option value='completed'>Completed</option>
            </select>
          </div>
          {loading ? (
            <div className='empty-state'>
              <div className='spinner' />
              <p>Loading your tasks…</p>
            </div>
          ) : visibleTasks.length === 0 ? (
            <div className='empty-state'>
              <div className='empty-icon'>✦</div>
              <h3>
                {tasks.length ? 'No tasks in this view' : 'A fresh start'}
              </h3>
              <p>
                {tasks.length
                  ? 'Try another filter to find your tasks.'
                  : 'Add your first task and turn your plans into progress.'}
              </p>
              {!tasks.length && (
                <button className='button primary' onClick={startCreate}>
                  Create your first task
                </button>
              )}
            </div>
          ) : (
            <div className='task-list'>
              {visibleTasks.map(task => (
                <article
                  className={`task-card ${
                    task.status === 'completed' ? 'task-done' : ''
                  }`}
                  key={task._id}
                >
                  <button
                    className={`check-button ${
                      task.status === 'completed' ? 'checked' : ''
                    }`}
                    onClick={() => toggleComplete(task)}
                    aria-label={
                      task.status === 'completed'
                        ? 'Mark as pending'
                        : 'Mark as completed'
                    }
                  >
                    {task.status === 'completed' ? '✓' : ''}
                  </button>
                  <div className='task-content'>
                    <div className='task-title-row'>
                      <h3>{task.title}</h3>
                      <span className={`priority priority-${task.priority}`}>
                        {task.priority}
                      </span>
                    </div>
                    <p className='task-description'>
                      {task.description || 'No description provided.'}
                    </p>
                    <div className='task-meta'>
                      <span className={`status status-${task.status}`}>
                        {task.status.replace('-', ' ')}
                      </span>
                      <span>
                        Added {new Date(task.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {summaries[task._id] && (
                      <div className='summary-box'>
                        <span>✦ AI summary</span>
                        <p>{summaries[task._id]}</p>
                      </div>
                    )}
                    <div className='task-actions'>
                      <button
                        className='text-button ai-button'
                        onClick={() => generateSummary(task)}
                        disabled={summarizing === task._id}
                      >
                        ✦{' '}
                        {summarizing === task._id
                          ? 'Generating summary…'
                          : 'Generate Task Summary'}
                      </button>
                      <button
                        className='text-button'
                        onClick={() => startEdit(task)}
                      >
                        Edit
                      </button>
                      <button
                        className='text-button danger-text'
                        onClick={() => deleteTask(task)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
        <footer className='dashboard-footer'>
          Built with React, Express, MongoDB & a little AI ✦
        </footer>
      </main>
    </div>
  )
}
