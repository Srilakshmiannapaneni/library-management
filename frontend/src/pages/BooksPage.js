import React, { useState, useEffect } from 'react';
import api from '../api';
import { Plus, Trash2 } from 'lucide-react';
import { isAdmin } from '../auth';

const BooksPage = () => {
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({ title: '', author: '', coverImage: '' });
  const [loading, setLoading] = useState(false);
  const [missingCovers, setMissingCovers] = useState({});
  const IMAGE_BASE_URL = 'http://localhost:8082/images';
  const admin = isAdmin();

  const getCoverPath = (book) => {
    if (!book.coverImage) {
      return '';
    }
    return `${IMAGE_BASE_URL}/${book.coverImage}`;
  };

  const fetchBooks = async () => {
    try {
      const res = await api.get('/books');
      setBooks(res.data);
    } catch (error) {
      console.error("Failed to fetch books", error);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleAddBook = async (e) => {
    e.preventDefault();
    if (!newBook.title || !newBook.author) return;
    
    setLoading(true);
    try {
      await api.post('/books', newBook);
      setNewBook({ title: '', author: '', coverImage: '' });
      fetchBooks();
    } catch (error) {
      console.error("Failed to add book", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/books/${id}`);
      fetchBooks();
    } catch (error) {
      console.error("Failed to delete book", error);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="page-title" style={{ marginBottom: 0 }}>{admin ? 'Books Management' : 'Books Catalog'}</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: admin ? '1fr 2fr' : '1fr', gap: '2rem' }}>
        {admin && (
        <div className="glass-panel" style={{ padding: '2rem', height: 'fit-content' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Add New Book</h2>
          <form onSubmit={handleAddBook} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Title</label>
              <input 
                type="text" 
                className="input-field" 
                value={newBook.title}
                onChange={(e) => setNewBook({...newBook, title: e.target.value})}
                placeholder="Enter book title"
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Author</label>
              <input 
                type="text" 
                className="input-field" 
                value={newBook.author}
                onChange={(e) => setNewBook({...newBook, author: e.target.value})}
                placeholder="Enter author name"
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Cover Image File (optional)</label>
              <input
                type="text"
                className="input-field"
                value={newBook.coverImage}
                onChange={(e) => setNewBook({...newBook, coverImage: e.target.value})}
                placeholder="example.jpg (from /images folder)"
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', justifyContent: 'center' }} disabled={loading}>
              <Plus size={18} /> {loading ? 'Adding...' : 'Add Book'}
            </button>
          </form>
        </div>
        )}

        {/* Books List */}
        <div className="glass-panel" style={{ overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Cover</th>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Status</th>
                  {admin && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {books.length === 0 ? (
                  <tr>
                    <td colSpan={admin ? 6 : 5} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No books found in the library.</td>
                  </tr>
                ) : (
                  books.map((book) => (
                    <tr key={book.id}>
                      <td>
                        {missingCovers[book.id] || !book.coverImage ? (
                          <div className="book-cover-fallback">No image in /images</div>
                        ) : (
                          <img
                            src={getCoverPath(book)}
                            alt={`${book.title} cover`}
                            className="book-cover"
                            onError={() =>
                              setMissingCovers((prev) => ({
                                ...prev,
                                [book.id]: true
                              }))
                            }
                          />
                        )}
                      </td>
                      <td>#{book.id}</td>
                      <td style={{ fontWeight: '500' }}>{book.title}</td>
                      <td>{book.author}</td>
                      <td>
                        <span className={`status-badge ${book.availabilityStatus === 'AVAILABLE' ? 'status-available' : 'status-issued'}`}>
                          {book.availabilityStatus}
                        </span>
                      </td>
                      {admin && (
                        <td>
                          <button onClick={() => handleDelete(book.id)} className="btn btn-danger" style={{ padding: '0.4rem', borderRadius: '6px' }}>
                            <Trash2 size={16} />
                          </button>
                        </td>
                      )}
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

export default BooksPage;
