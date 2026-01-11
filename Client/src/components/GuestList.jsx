import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GuestList = () => {
  const [formData, setFormData] = useState({ name: '', phone: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingGuests, setLoadingGuests] = useState(false);
  const [showAdminMode, setShowAdminMode] = useState(false);
  const [adminStats, setAdminStats] = useState({ total: 0 });

  const API_URL = 'http://localhost:3001';

  // 1. Обработчик изменения полей формы
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    setMessage('');
    setError('');
  };

  // 2. Валидация формы
  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Введите имя гостя');
      return false;
    }
    if (!formData.phone.trim()) {
      setError('Введите номер телефона');
      return false;
    }
    return true;
  };

  // 3. Функция загрузки гостей - ИСПРАВЛЕННЫЙ URL
  const fetchGuests = async () => {
    setLoadingGuests(true);
    try {
      console.log('Загружаю список гостей...');
      
      // Пробуем разные эндпоинты
      const endpoints = [
        `${API_URL}/api/guests`,    // Основной
        `${API_URL}/guests`,        // Запасной
        `${API_URL}/api/admin/guests` // Админский (если нужно)
      ];
      
      let response;
      let lastError;
      
      for (const endpoint of endpoints) {
        try {
          console.log(`Пробую эндпоинт: ${endpoint}`);
          response = await axios.get(endpoint, {
            timeout: 5000
          });
          
          if (response.data) {
            console.log(`✅ Ответ от ${endpoint}:`, response.data);
            break;
          }
        } catch (err) {
          lastError = err;
          console.log(`❌ Ошибка для ${endpoint}:`, err.message);
        }
      }
      
      if (!response) {
        throw lastError || new Error('Нет ответа от сервера');
      }
      
      if (response.data) {
        if (response.data.success && Array.isArray(response.data.guests)) {
          setGuests(response.data.guests);
          setAdminStats({ total: response.data.guests.length });
        } else if (Array.isArray(response.data.guests)) {
          setGuests(response.data.guests);
          setAdminStats({ total: response.data.guests.length });
        } else if (Array.isArray(response.data.guest)) {
          setGuests(response.data.guest);
          setAdminStats({ total: response.data.guest.length });
        } else if (Array.isArray(response.data)) {
          setGuests(response.data);
          setAdminStats({ total: response.data.length });
        } else {
          console.warn('Неожиданный формат данных:', response.data);
          setError('Неизвестный формат данных от сервера');
        }
        setError('');
      } else {
        setError('Пустой ответ от сервера');
      }
    } catch (err) {
      console.error('Ошибка при загрузке гостей:', err);
      if (err.response) {
        setError(`Ошибка ${err.response.status}: ${err.response.data?.error || 'Неизвестная ошибка'}`);
      } else if (err.request) {
        setError('Нет ответа от сервера. Проверьте: 1) Сервер запущен на порту 3001? 2) CORS настроен?');
      } else {
        setError('Ошибка при настройке запроса: ' + err.message);
      }
    } finally {
      setLoadingGuests(false);
    }
  };

  // 4. Обработчик отправки формы - ИСПРАВЛЕННЫЙ URL
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setMessage('');
    setError('');

    const guestData = {
      name: formData.name.trim(),
      phone: formData.phone.trim()
    };

    console.log('Отправляю данные:', guestData);

    try {
      const response = await axios.post(
        `${API_URL}/api/guests/create`, // ИСПРАВЛЕННЫЙ URL
        guestData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Ответ сервера:', response.data);
      
      if (response.status === 201) {
        setMessage(response.data.message || 'Гость успешно зарегистрирован');
        setFormData({ name: '', phone: '' });
        fetchGuests();
      } else {
        setError(response.data.error || 'Неизвестная ошибка сервера');
      }

    } catch (err) {
      console.error('Ошибка при отправке формы:', err);

      if (err.response) {
        const errorData = err.response.data;
        setError(errorData.error || errorData.message || `Ошибка ${err.response.status}`);
      } else if (err.request) {
        setError('Нет ответа от сервера. Проверьте, запущен ли сервер на порту 3001');
      } else {
        setError('Ошибка при отправке запроса: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // 5. Форматирование даты
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // 6. useEffect для начальной загрузки
  useEffect(() => {
    fetchGuests();
  }, []);

  // 7. JSX рендеринг
  return (
    <div className="guest-list-container">
      {/* Кнопка переключения режима */}
      <div style={{ textAlign: 'right', marginBottom: '20px' }}>
        <button
          onClick={() => setShowAdminMode(!showAdminMode)}
          style={{
            padding: '8px 16px',
            background: showAdminMode ? '#dc3545' : '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          {showAdminMode ? '📱 Обычный режим' : '⚙️ Админ-панель'}
        </button>
      </div>

      <h1>{showAdminMode ? '📊 Административная панель' : 'Регистрация гостей'}</h1>

      {/* Статистика для админки */}
      {showAdminMode && (
        <div style={{
          background: '#f8f9fa',
          padding: '20px',
          borderRadius: '10px',
          marginBottom: '20px',
          border: '1px solid #dee2e6'
        }}>
          <h2>Статистика</h2>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <div style={{
              background: 'white',
              padding: '15px',
              borderRadius: '8px',
              minWidth: '150px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#4a90e2' }}>
                {adminStats.total}
              </div>
              <div style={{ color: '#666', fontSize: '14px' }}>
                Всего гостей
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Форма регистрации - показываем всегда */}
      <div className="card">
        <h2>{showAdminMode ? 'Добавить гостя (админ)' : 'Добавить нового гостя'}</h2>

        <form onSubmit={handleSubmit} className="guest-form">
          <div className="form-group">
            <label htmlFor="name">Имя гостя *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Введите имя"
              required
              disabled={loading}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Телефон *</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Введите номер телефона"
              required
              disabled={loading}
              className="form-input"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="submit-button"
          >
            {loading ? 'Регистрация...' : 'Зарегистрировать гостя'}
          </button>
        </form>
      </div>

      {/* Сообщения об ошибке/успехе */}
      {message && (
        <div className="message success">
          ✅ {message}
        </div>
      )}

      {error && (
        <div className="message error">
          ⚠️ {error}
        </div>
      )}

      {/* Список всех гостей */}
      <div className="card">
        <div className="guests-header">
          <h2>{showAdminMode ? 'Все зарегистрированные гости' : 'Зарегистрированные гости'}</h2>
          <div style={{ display: 'flex', gap: '10px' }}>
            {showAdminMode && (
              <button
                onClick={() => {
                  const csvContent = [
                    ['ID', 'Имя', 'Телефон', 'Дата регистрации'].join(','),
                    ...guests.map(guest => [
                      guest.id,
                      `"${guest.name}"`,
                      `"${guest.phone}"`,
                      guest.createdAt || guest.created_at
                    ].join(','))
                  ].join('\n');
                  
                  const blob = new Blob([csvContent], { type: 'text/csv' });
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `guests_${new Date().toISOString().split('T')[0]}.csv`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  window.URL.revokeObjectURL(url);
                }}
                style={{
                  padding: '8px 15px',
                  background: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                📥 Экспорт CSV
              </button>
            )}
            <button
              onClick={fetchGuests}
              disabled={loadingGuests}
              className="refresh-button"
            >
              {loadingGuests ? 'Обновление...' : '🔄 Обновить'}
            </button>
          </div>
        </div>

        {loadingGuests ? (
          <p>Загрузка списка гостей...</p>
        ) : guests.length === 0 ? (
          <p className="no-guests">Нет зарегистрированных гостей</p>
        ) : (
          <div className="table-container">
            <table className="guests-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Имя</th>
                  <th>Телефон</th>
                  <th>Дата регистрации</th>
                </tr>
              </thead>
              <tbody>
                {guests.map(guest => (
                  <tr key={guest.id}>
                    <td>{guest.id}</td>
                    <td>
                      <strong>{guest.name}</strong>
                    </td>
                    <td>{guest.phone}</td>
                    <td>{formatDate(guest.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="guests-count">
              Всего гостей: {guests.length}
            </div>
          </div>
        )}
      </div>

      <style>{`
        .guest-list-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
        }
        
        h1 {
          color: #333;
          text-align: center;
          margin-bottom: 30px;
        }
        
        .card {
          background: white;
          border-radius: 10px;
          padding: 25px;
          margin-bottom: 25px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        h2 {
          color: #444;
          margin-top: 0;
          margin-bottom: 20px;
        }
        
        .guest-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        
        .form-group {
          display: flex;
          flex-direction: column;
        }
        
        label {
          margin-bottom: 8px;
          font-weight: 600;
          color: #555;
        }
        
        .form-input {
          padding: 12px 15px;
          border: 2px solid #ddd;
          border-radius: 6px;
          font-size: 16px;
          transition: border-color 0.3s;
        }
        
        .form-input:focus {
          outline: none;
          border-color: #4a90e2;
        }
        
        .form-input:disabled {
          background-color: #f5f5f5;
          cursor: not-allowed;
        }
        
        .submit-button {
          background: #4a90e2;
          color: white;
          border: none;
          padding: 14px 20px;
          border-radius: 6px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.3s;
        }
        
        .submit-button:hover:not(:disabled) {
          background: #3a7bc8;
        }
        
        .submit-button:disabled {
          background: #a0c1f1;
          cursor: not-allowed;
        }
        
        .refresh-button {
          background: #f0f0f0;
          border: 1px solid #ddd;
          padding: 8px 15px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
        }
        
        .refresh-button:hover:not(:disabled) {
          background: #e0e0e0;
        }
        
        .refresh-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .message {
          padding: 15px;
          border-radius: 6px;
          margin: 20px 0;
          font-weight: 500;
        }
        
        .success {
          background: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        }
        
        .error {
          background: #f8d7da;
          color: '#721c24';
          border: 1px solid #f5c6cb;
        }
        
        .guests-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          flex-wrap: wrap;
          gap: 15px;
        }
        
        .no-guests {
          text-align: center;
          color: #777;
          padding: 30px;
        }
        
        .table-container {
          overflow-x: auto;
        }
        
        .guests-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 15px;
        }
        
        .guests-table th {
          background: #f8f9fa;
          padding: 12px 15px;
          text-align: left;
          font-weight: 600,
          color: #555;
          border-bottom: 2px solid #dee2e6;
        }
        
        .guests-table td {
          padding: 12px 15px;
          border-bottom: 1px solid #eee;
        }
        
        .guests-table tr:hover {
          background: #f8f9fa;
        }
        
        .guests-count {
          text-align: right;
          color: #666;
          font-size: 14px;
          padding-top: 10px;
          border-top: 1px solid #eee;
        }
        
        @media (max-width: 768px) {
          .guest-list-container {
            padding: 10px;
          }
          
          .card {
            padding: 15px;
          }
          
          .guests-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }
        }
      `}</style>
    </div>
  );
};

export default GuestList;