import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

// API Configuration
const API_URL = 'http://localhost:5000/api/alarms';
const USER_ID = 'user123';

function App() {
  // State management
  const [alarms, setAlarms] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    time: '',
    repeatType: 'once',
    repeatDays: [],
    snoozeMinutes: 5,
    vibrate: true,
    gradualVolume: false
  });

  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Fetch alarms on component mount
  useEffect(() => {
    fetchAlarms();
  }, []);

  // Fetch all alarms
  const fetchAlarms = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_URL}?userId=${USER_ID}`);
      setAlarms(response.data);
    } catch (err) {
      setError('Failed to fetch alarms. Make sure backend is running!');
      console.error('Error fetching alarms:', err);
    } finally {
      setLoading(false);
    }
  };

  // Create new alarm
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API_URL, {
        ...formData,
        userId: USER_ID
      });
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        time: '',
        repeatType: 'once',
        repeatDays: [],
        snoozeMinutes: 5,
        vibrate: true,
        gradualVolume: false
      });
      
      setShowForm(false);
      fetchAlarms(); // Refresh list
    } catch (err) {
      alert('Failed to create alarm: ' + err.message);
      console.error('Error creating alarm:', err);
    }
  };

  // Toggle alarm on/off
  const toggleAlarm = async (id) => {
    try {
      await axios.patch(`${API_URL}/${id}/toggle`);
      fetchAlarms();
    } catch (err) {
      alert('Failed to toggle alarm');
      console.error('Error toggling alarm:', err);
    }
  };

  // Delete alarm
  const deleteAlarm = async (id) => {
    if (window.confirm('Are you sure you want to delete this alarm?')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchAlarms();
      } catch (err) {
        alert('Failed to delete alarm');
        console.error('Error deleting alarm:', err);
      }
    }
  };

  // Handle day selection for custom repeat
  const handleDayToggle = (day) => {
    const days = formData.repeatDays.includes(day)
      ? formData.repeatDays.filter(d => d !== day)
      : [...formData.repeatDays, day];
    setFormData({ ...formData, repeatDays: days });
  };

  // Loading state
  if (loading) {
    return (
      <div className="App">
        <div className="loading">Loading alarms...</div>
      </div>
    );
  }

  return (
    <div className="App">
      {/* Header */}
      <header className="app-header">
        <h1>⏰ Smart Alarm</h1>
        <button 
          className="btn-primary" 
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? '✕ Cancel' : '+ New Alarm'}
        </button>
      </header>

      {/* Error message */}
      {error && (
        <div className="error-message">
          ⚠️ {error}
        </div>
      )}

      {/* Create Alarm Form */}
      {showForm && (
        <div className="alarm-form">
          <h2>Create New Alarm</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Alarm Title *</label>
              <input
                type="text"
                placeholder="e.g., Morning Workout"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                placeholder="Optional description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Time *</label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Repeat</label>
              <select
                value={formData.repeatType}
                onChange={(e) => setFormData({ ...formData, repeatType: e.target.value })}
              >
                <option value="once">Once</option>
                <option value="daily">Daily</option>
                <option value="weekdays">Weekdays (Mon-Fri)</option>
                <option value="weekends">Weekends (Sat-Sun)</option>
                <option value="custom">Custom Days</option>
              </select>
            </div>

            {/* Custom Days Selector */}
            {formData.repeatType === 'custom' && (
              <div className="form-group">
                <label>Select Days</label>
                <div className="day-selector">
                  {weekDays.map(day => (
                    <button
                      key={day}
                      type="button"
                      className={formData.repeatDays.includes(day) ? 'day-btn active' : 'day-btn'}
                      onClick={() => handleDayToggle(day)}
                    >
                      {day.slice(0, 3)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="form-group">
              <label>Snooze Duration (minutes)</label>
              <input
                type="number"
                min="1"
                max="60"
                value={formData.snoozeMinutes}
                onChange={(e) => setFormData({ ...formData, snoozeMinutes: parseInt(e.target.value) })}
              />
            </div>

            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  checked={formData.vibrate}
                  onChange={(e) => setFormData({ ...formData, vibrate: e.target.checked })}
                />
                Vibrate
              </label>

              <label>
                <input
                  type="checkbox"
                  checked={formData.gradualVolume}
                  onChange={(e) => setFormData({ ...formData, gradualVolume: e.target.checked })}
                />
                Gradual Volume Increase
              </label>
            </div>

            <button type="submit" className="btn-primary btn-submit">
              Create Alarm
            </button>
          </form>
        </div>
      )}

      {/* Alarms List */}
      <div className="alarms-list">
        {alarms.length === 0 ? (
          <div className="no-alarms">
            <p>📭 No alarms yet</p>
            <p>Click "+ New Alarm" to create your first alarm!</p>
          </div>
        ) : (
          alarms.map(alarm => (
            <div 
              key={alarm._id} 
              className={`alarm-card ${!alarm.enabled ? 'disabled' : ''}`}
            >
              <div className="alarm-time">{alarm.time}</div>
              
              <div className="alarm-details">
                <h3>{alarm.title}</h3>
                {alarm.description && <p className="description">{alarm.description}</p>}
                
                <div className="alarm-meta">
                  <span className="badge">🔁 {alarm.repeatType}</span>
                  <span className="badge">💤 {alarm.snoozeMinutes}min</span>
                  {alarm.vibrate && <span className="badge">📳 Vibrate</span>}
                </div>

                {alarm.repeatDays && alarm.repeatDays.length > 0 && (
                  <div className="repeat-days">
                    {alarm.repeatDays.map(day => (
                      <span key={day} className="day-badge">
                        {day.slice(0, 3)}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="alarm-actions">
                <button 
                  className="btn-icon"
                  onClick={() => toggleAlarm(alarm._id)}
                  title={alarm.enabled ? 'Disable alarm' : 'Enable alarm'}
                >
                  {alarm.enabled ? '🔔' : '🔕'}
                </button>
                <button 
                  className="btn-icon btn-delete"
                  onClick={() => deleteAlarm(alarm._id)}
                  title="Delete alarm"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <footer className="app-footer">
        <p>Smart Alarm - DevOps Learning Project</p>
      </footer>
    </div>
  );
}

export default App;