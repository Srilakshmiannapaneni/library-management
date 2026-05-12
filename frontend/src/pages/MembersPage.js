import React, { useState, useEffect } from 'react';
import api from '../api';
import { UserPlus, Trash2 } from 'lucide-react';

const MembersPage = () => {
  const [members, setMembers] = useState([]);
  const [newMember, setNewMember] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(false);

  const fetchMembers = async () => {
    try {
      const res = await api.get('/members');
      setMembers(res.data);
    } catch (error) {
      console.error("Failed to fetch members", error);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleRegisterMember = async (e) => {
    e.preventDefault();
    if (!newMember.name || !newMember.email) return;
    
    setLoading(true);
    try {
      await api.post('/members', newMember);
      setNewMember({ name: '', email: '' });
      fetchMembers();
    } catch (error) {
      console.error("Failed to register member", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/members/${id}`);
      fetchMembers();
    } catch (error) {
      console.error("Failed to delete member", error);
    }
  };

  return (
    <div>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>Members Management</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        {/* Register Member Form */}
        <div className="glass-panel" style={{ padding: '2rem', height: 'fit-content' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Register Member</h2>
          <form onSubmit={handleRegisterMember} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Name</label>
              <input 
                type="text" 
                className="input-field" 
                value={newMember.name}
                onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                placeholder="Enter member name"
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Email</label>
              <input 
                type="email" 
                className="input-field" 
                value={newMember.email}
                onChange={(e) => setNewMember({...newMember, email: e.target.value})}
                placeholder="Enter member email"
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', justifyContent: 'center' }} disabled={loading}>
              <UserPlus size={18} /> {loading ? 'Registering...' : 'Register'}
            </button>
          </form>
        </div>

        {/* Members List */}
        <div className="glass-panel" style={{ overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {members.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No members found.</td>
                  </tr>
                ) : (
                  members.map((member) => (
                    <tr key={member.id}>
                      <td>#{member.id}</td>
                      <td style={{ fontWeight: '500' }}>{member.name}</td>
                      <td>{member.email}</td>
                      <td>
                        <button onClick={() => handleDelete(member.id)} className="btn btn-danger" style={{ padding: '0.4rem', borderRadius: '6px' }}>
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembersPage;
