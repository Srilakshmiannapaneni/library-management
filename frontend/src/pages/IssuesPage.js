import React, { useState, useEffect } from 'react';
import api from '../api';
import { BookOpenCheck, ArrowLeftRight } from 'lucide-react';

const IssuesPage = () => {
  const [issues, setIssues] = useState([]);
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  
  const [issueData, setIssueData] = useState({ bookId: '', memberId: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const [issuesRes, booksRes, membersRes] = await Promise.all([
        api.get('/issues/active'),
        api.get('/books/available'),
        api.get('/members')
      ]);
      setIssues(issuesRes.data);
      setBooks(booksRes.data);
      setMembers(membersRes.data);
    } catch (error) {
      console.error("Failed to fetch data", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleIssueBook = async (e) => {
    e.preventDefault();
    if (!issueData.bookId || !issueData.memberId) return;
    
    setLoading(true);
    setError(null);
    try {
      await api.post('/issues/issue', {
        bookId: Number(issueData.bookId),
        memberId: Number(issueData.memberId)
      });
      setIssueData({ bookId: '', memberId: '' });
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to issue book");
    } finally {
      setLoading(false);
    }
  };

  const handleReturnBook = async (issueId) => {
    try {
      await api.put(`/issues/return/${issueId}`);
      fetchData();
    } catch (error) {
      console.error("Failed to return book", error);
    }
  };

  return (
    <div>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>Book Issues Management</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        {/* Issue Book Form */}
        <div className="glass-panel" style={{ padding: '2rem', height: 'fit-content' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Issue a Book</h2>
          
          {error && (
            <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.875rem' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleIssueBook} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Select Book</label>
              <select 
                className="input-field" 
                value={issueData.bookId}
                onChange={(e) => setIssueData({...issueData, bookId: e.target.value})}
              >
                <option value="">-- Select an Available Book --</option>
                {books.map(book => (
                  <option key={book.id} value={book.id}>{book.title} (by {book.author})</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Select Member</label>
              <select 
                className="input-field" 
                value={issueData.memberId}
                onChange={(e) => setIssueData({...issueData, memberId: e.target.value})}
              >
                <option value="">-- Select a Member --</option>
                {members.map(member => (
                  <option key={member.id} value={member.id}>{member.name} ({member.email})</option>
                ))}
              </select>
            </div>
            <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', justifyContent: 'center' }} disabled={loading || books.length === 0}>
              <BookOpenCheck size={18} /> {loading ? 'Issuing...' : 'Issue Book'}
            </button>
          </form>
        </div>

        {/* Active Issues List */}
        <div className="glass-panel" style={{ overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Issue ID</th>
                  <th>Book Title</th>
                  <th>Member Name</th>
                  <th>Issue Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {issues.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No active issues found.</td>
                  </tr>
                ) : (
                  issues.map((issue) => (
                    <tr key={issue.issueId}>
                      <td>#{issue.issueId}</td>
                      <td style={{ fontWeight: '500' }}>{issue.book.title}</td>
                      <td>{issue.member.name}</td>
                      <td>{new Date(issue.issueDate).toLocaleDateString()}</td>
                      <td>
                        <button onClick={() => handleReturnBook(issue.issueId)} className="btn" style={{ backgroundColor: 'var(--success)', color: 'white', padding: '0.4rem 0.8rem', borderRadius: '6px', fontSize: '0.875rem' }}>
                          <ArrowLeftRight size={16} /> Return
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

export default IssuesPage;
