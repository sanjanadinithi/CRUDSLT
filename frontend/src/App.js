import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState({ title: '', author: '', publishedYear: '' });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch books from backend
  const fetchBooks = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/books');
      console.log("Fetched books:", res.data); // Debug log
      setBooks(res.data);
    } catch (err) {
      setError('Failed to fetch books');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // Add or update book
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload = {
        title: form.title.trim(),
        author: form.author.trim(),
        publishedYear: parseInt(form.publishedYear, 10),
      };

      if (!payload.title || !payload.author || isNaN(payload.publishedYear)) {
        setError("All fields are required.");
        setLoading(false);
        return;
      }

      if (editingId) {
        await axios.put(`http://localhost:5000/api/books/${editingId}`, payload);
      } else {
        await axios.post('http://localhost:5000/api/books', payload);
      }

      setForm({ title: '', author: '', publishedYear: '' });
      setEditingId(null);
      setError(null);
      await fetchBooks();
    } catch (err) {
      setError(editingId ? 'Failed to update book' : 'Failed to add book');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (book) => {
    setForm({
      title: book.title || '',
      author: book.author || '',
      publishedYear: book.publishedYear || '',
    });
    setEditingId(book._id);
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`http://localhost:5000/api/books/${id}`);
      await fetchBooks();
    } catch (err) {
      setError('Failed to delete book');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Book Manager</h1>

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <input
          placeholder="Title"
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}
          style={{ padding: '8px', marginRight: '10px' }}
          required
        />
        <input
          placeholder="Author"
          value={form.author}
          onChange={e => setForm({ ...form, author: e.target.value })}
          style={{ padding: '8px', marginRight: '10px' }}
          required
        />
        <input
          placeholder="Published Year"
          type="number"
          value={form.publishedYear}
          onChange={e => setForm({ ...form, publishedYear: e.target.value })}
          style={{ padding: '8px', marginRight: '10px' }}
          required
        />
        <button
          type="submit"
          style={{
            padding: '8px 15px',
            backgroundColor: editingId ? '#4CAF50' : '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          {editingId ? 'Update Book' : 'Add Book'}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={() => {
              setForm({ title: '', author: '', publishedYear: '' });
              setEditingId(null);
              setError(null);
            }}
            style={{
              padding: '8px 15px',
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              marginLeft: '10px',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
        )}
      </form>

      {/* Error Message */}
      {error && <div style={{ color: 'red', marginBottom: '10px' }}>Error: {error}</div>}

      {/* Table */}
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          marginTop: '20px',
          boxShadow: '0 0 10px rgba(0,0,0,0.1)',
        }}
      >
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Title</th>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Author</th>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Published Year</th>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ padding: '12px', textAlign: 'center' }}>
                No books found
              </td>
            </tr>
          ) : (
            books.map((book) => (
              <tr key={book._id} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '12px' }}>{book.title || <i style={{ color: 'gray' }}>No title</i>}</td>
                <td style={{ padding: '12px' }}>{book.author || <i style={{ color: 'gray' }}>No author</i>}</td>
                <td style={{ padding: '12px' }}>{book.publishedYear || <i style={{ color: 'gray' }}>No year</i>}</td>
                <td style={{ padding: '12px' }}>
                  <button
                    onClick={() => handleEdit(book)}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#FFC107',
                      color: 'black',
                      border: 'none',
                      borderRadius: '4px',
                      marginRight: '5px',
                      cursor: 'pointer',
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(book._id)}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#f44336',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;
