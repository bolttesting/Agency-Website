import { useState, useEffect } from 'react';
import { useSiteData } from '../../context/SiteDataContext';
import { adminApi } from '../../lib/adminApi';
import './Admin.css';

export default function ContactsAdmin() {
  const { contactSubmissions, loadContactSubmissions } = useSiteData();
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(contactSubmissions || []);
  }, [contactSubmissions]);

  const handleDelete = async (id) => {
    if (!confirm('Delete this submission?')) return;
    try {
      await adminApi.contacts.delete(id);
      await loadContactSubmissions();
    } catch (e) {
      alert('Error: ' + e.message);
    }
  };

  const formatDate = (d) => {
    if (!d) return '-';
    const dt = new Date(d);
    return dt.toLocaleDateString() + ' ' + dt.toLocaleTimeString();
  };

  return (
    <div>
      <div className="admin-header">
        <h1>Contact Submissions</h1>
        <button type="button" className="admin-btn admin-btn--secondary" onClick={() => void loadContactSubmissions()}>
          Refresh
        </button>
      </div>
      <div className="admin-card">
        <h2>Messages ({items.length})</h2>
        <p style={{ color: '#a1a1aa', marginBottom: '1rem' }}>Form submissions from the Contact page.</p>
        {items.length === 0 ? (
          <div className="admin-empty">No submissions yet.</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Name</th>
                <th>Email</th>
                <th>Subject</th>
                <th>Message</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td style={{ whiteSpace: 'nowrap' }}>{formatDate(item.created_at)}</td>
                  <td>{item.name}</td>
                  <td><a href={`mailto:${item.email}`} style={{ color: '#14b8a6' }}>{item.email}</a></td>
                  <td>{item.subject || '-'}</td>
                  <td style={{ maxWidth: 200 }}>{item.message?.slice(0, 60)}...</td>
                  <td>
                    <button className="admin-btn admin-btn--danger" onClick={() => handleDelete(item.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
