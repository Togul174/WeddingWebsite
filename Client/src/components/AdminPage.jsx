// src/components/AdminPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const AdminPage = () => {
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchGuests = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/guests');
      const data = await response.json();
      setGuests(data.guests || data);
    } catch (error) {
      console.error('Ошибка загрузки:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuests();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '50px', textAlign: 'center' }}>
        <h2>Загрузка списка гостей...</h2>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>Административная панель</h1>
        <div>
          <Link 
            to="/" 
            style={{
              padding: '10px 20px',
              background: '#4a90e2',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '5px',
              marginRight: '10px'
            }}
          >
            На главную
          </Link>
          <button 
            onClick={fetchGuests}
            style={{
              padding: '10px 20px',
              background: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Обновить
          </button>
        </div>
      </div>

      <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '10px', marginBottom: '20px' }}>
        <h2>Статистика</h2>
        <p>Всего гостей: <strong>{guests.length}</strong></p>
      </div>

      <div style={{ background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <h2>Список гостей</h2>
        {guests.length === 0 ? (
          <p>Нет зарегистрированных гостей</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f5f5f5' }}>
                  <th style={{ padding: '10px', textAlign: 'left' }}>ID</th>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Имя</th>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Телефон</th>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Дата регистрации</th>
                </tr>
              </thead>
              <tbody>
                {guests.map(guest => (
                  <tr key={guest.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '10px' }}>{guest.id}</td>
                    <td style={{ padding: '10px' }}><strong>{guest.name}</strong></td>
                    <td style={{ padding: '10px' }}>{guest.phone}</td>
                    <td style={{ padding: '10px' }}>
                      {new Date(guest.createdAt || guest.created_at).toLocaleDateString('ru-RU')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;