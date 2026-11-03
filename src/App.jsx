import React, { useState, useEffect } from 'react';
import './App.css';

const API_BASE_URL = 'https://rest-api-demo-sssp.onrender.com/api/items';

function App() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    ticketType: 'Standard',
    agreeTerms: false,
  });

  const [errors, setErrors] = useState({});
  const [submittedData, setSubmittedData] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // API Demo State
  const [apiLogs, setApiLogs] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const logAction = (action, result) => {
    setApiLogs((prev) => [
      { id: Date.now(), timestamp: new Date().toLocaleTimeString(), action, result },
      ...prev,
    ]);
  };

  // 1. GET ALL ITEMS
  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_BASE_URL);
      const data = await res.json();
      setItems(data.data || []);
      logAction('GET /api/items', `Fetched ${data.count || (data.data ? data.data.length : 0)} items successfully.`);
    } catch (err) {
      logAction('GET /api/items (ERROR)', err.message);
    } finally {
      setLoading(false);
    }
  };

  // 2. CREATE ITEM (POST)
  const handleCreateDemoItem = async () => {
    setLoading(true);
    const demoPayload = {
      name: `Ticket Holder #${Math.floor(Math.random() * 1000)}`,
      category: 'Conference Pass',
      price: 50,
      quantity: 1,
      description: 'Demo item created directly from GitHub Pages client app.'
    };

    try {
      const res = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(demoPayload)
      });
      const data = await res.json();
      logAction('POST /api/items', `Created item ID: ${data.data?._id || 'Success'}`);
      fetchItems();
    } catch (err) {
      logAction('POST /api/items (ERROR)', err.message);
    } finally {
      setLoading(false);
    }
  };

  // 3. UPDATE ITEM (PUT)
  const handleUpdateItem = async (id) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ price: 150, category: 'VIP Upgrade Pass' })
      });
      const data = await res.json();
      logAction(`PUT /api/items/${id}`, `Updated pass type to VIP ($150)`);
      fetchItems();
    } catch (err) {
      logAction(`PUT /api/items/${id} (ERROR)`, err.message);
    } finally {
      setLoading(false);
    }
  };

  // 4. DELETE ITEM (DELETE)
  const handleDeleteItem = async (id) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      logAction(`DELETE /api/items/${id}`, `Successfully deleted record.`);
      fetchItems();
    } catch (err) {
      logAction(`DELETE /api/items/${id} (ERROR)`, err.message);
    } finally {
      setLoading(false);
    }
  };

  // Load items on mount
  useEffect(() => {
    fetchItems();
  }, []);

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    setFormData((prev) => ({ ...prev, [name]: val }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Client-Side Validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full Name is required.';
    } else if (formData.fullName.trim().length < 3) {
      newErrors.fullName = 'Name must be at least 3 characters.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'Email address is required.';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Enter a valid email address.';
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required.';
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Phone number must be exactly 10 digits.';
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the terms and conditions.';
    }

    return newErrors;
  };

  // Form Submission (Calls Live POST API)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSuccessMessage('');
      setSubmittedData(null);
    } else {
      setErrors({});
      setSubmittedData({ ...formData });
      
      // Also register into database via API
      try {
        await fetch(API_BASE_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.fullName,
            category: formData.ticketType,
            price: formData.ticketType === 'VIP' ? 150 : formData.ticketType === 'Student' ? 25 : 50,
            description: `Registered Email: ${formData.email}, Phone: ${formData.phone}`
          })
        });
        fetchItems();
      } catch (err) {
        console.error('API Sync Error:', err);
      }

      setSuccessMessage('Registration successful! Record persisted to MongoDB.');

      setFormData({
        fullName: '',
        email: '',
        phone: '',
        ticketType: 'Standard',
        agreeTerms: false,
      });
    }
  };

  return (
    <div className="container">
      <h2>Tech Summit 2026 Portal & API Console</h2>
      <p className="api-notice">
        Connected Backend: <code>https://rest-api-demo-sssp.onrender.com/api/items</code>
      </p>

      {successMessage && (
        <div className="alert success-alert">{successMessage}</div>
      )}

      {/* Form Section */}
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="fullName">Full Name:</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className={errors.fullName ? 'input-error' : ''}
          />
          {errors.fullName && <span className="error-text">{errors.fullName}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email Address:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? 'input-error' : ''}
          />
          {errors.email && <span className="error-text">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone Number (10 Digits):</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={errors.phone ? 'input-error' : ''}
          />
          {errors.phone && <span className="error-text">{errors.phone}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="ticketType">Ticket Pass Type:</label>
          <select
            id="ticketType"
            name="ticketType"
            value={formData.ticketType}
            onChange={handleChange}
          >
            <option value="Standard">Standard Pass ($50)</option>
            <option value="VIP">VIP Access Pass ($150)</option>
            <option value="Student">Student Pass ($25)</option>
          </select>
        </div>

        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleChange}
            />
            I agree to the terms and conditions
          </label>
          {errors.agreeTerms && (
            <span className="error-text block-error">{errors.agreeTerms}</span>
          )}
        </div>

        <button type="submit" className="submit-btn">Register & Save to DB</button>
      </form>

      {submittedData && (
        <div className="confirmation-card">
          <h3>Registration Details Summary</h3>
          <p><strong>Name:</strong> {submittedData.fullName}</p>
          <p><strong>Email:</strong> {submittedData.email}</p>
          <p><strong>Phone:</strong> {submittedData.phone}</p>
          <p><strong>Pass Type:</strong> {submittedData.ticketType}</p>
        </div>
      )}

      {/* Interactive REST API Testing Console */}
      <div className="api-tester-section">
        <h3>Live REST API Interactive Controls</h3>
        <p className="section-desc">Click any button below to trigger live HTTP requests to your Render deployment:</p>
        
        <div className="button-toolbar">
          <button onClick={fetchItems} disabled={loading} className="btn btn-get">
            GET (Refresh Items)
          </button>
          <button onClick={handleCreateDemoItem} disabled={loading} className="btn btn-post">
            POST (Create Item)
          </button>
        </div>

        {/* Database Record List with inline PUT & DELETE controls */}
        <h4>Current DB Records ({items.length}):</h4>
        {loading && <p className="loading-text">Communicating with backend...</p>}
        <div className="items-list">
          {items.length === 0 ? (
            <p className="no-items">No items found in database.</p>
          ) : (
            items.map((item) => (
              <div key={item._id} className="item-card">
                <div>
                  <strong>{item.name}</strong> ({item.category}) - ${item.price}
                  <br />
                  <small>ID: {item._id}</small>
                </div>
                <div className="item-actions">
                  <button onClick={() => handleUpdateItem(item._id)} className="btn btn-put-sm">
                    PUT (Upgrade)
                  </button>
                  <button onClick={() => handleDeleteItem(item._id)} className="btn btn-delete-sm">
                    DELETE
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Console Execution Log */}
        <h4>Execution Console Log:</h4>
        <div className="console-log">
          {apiLogs.length === 0 ? (
            <p className="log-empty">No requests executed yet.</p>
          ) : (
            apiLogs.map((log) => (
              <div key={log.id} className="log-entry">
                <span className="log-time">[{log.timestamp}]</span> <strong>{log.action}:</strong> {log.result}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
