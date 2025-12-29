
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GuestList = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingGuests, setLoadingGuests] = useState(false);

  // Базовый URL API
  const API_URL = 'http://localhost:3001';

  // Функция для загрузки всех гостей
  const fetchGuests = async () => {
    setLoadingGuests(true);
    try {
      console.log('Загружаю список гостей...');
      
      const response = await axios.get(`${API_URL}/guests`);
      
      if (response.data.success) {
        setGuests(response.data.guests);
        setError('');
      } else {
        setError('Не удалось загрузить список гостей');
      }
    } catch (err) {
      console.error('Ошибка при загрузке гостей:', err);
      
      if (err.response) {
        setError(`Ошибка ${err.response.status}: ${err.response.data.error || 'Неизвестная ошибка'}`);
      } else if (err.request) {
        setError('Нет ответа от сервера. Проверьте подключение.');
      } else {
        setError('Ошибка при настройке запроса');
      }
    } finally {
      setLoadingGuests(false);
    }
  };

  // Загружаем гостей при монтировании компонента
  useEffect(() => {
    fetchGuests();
  }, []);

  // Обработчик изменения полей формы
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Очищаем сообщения при изменении формы
    setMessage('');
    setError('');
  };

  // Валидация формы на клиенте
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

  // Обработчик отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setMessage('');
    setError('');

    // Подготовка данных согласно требованиям
    const guestData = {
      name: formData.name.trim(),
      phone: formData.phone.trim()
    };

    console.log('Отправляю данные:', guestData);

    try {
      const response = await axios.post(
        `${API_URL}/create-guest`,
        guestData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Ответ сервера:', response.data);
      
      if (response.data.success) {
        // Показываем успешное сообщение
        setMessage(response.data.message);
        
        // Очищаем форму
        setFormData({
          name: '',
          phone: ''
        });

        // Обновляем список гостей
        fetchGuests();
      } else {
        setError(response.data.error || 'Неизвестная ошибка сервера');
      }

    } catch (err) {
      console.error('Ошибка при отправке формы:', err);
      
      if (err.response) {
        // Сервер ответил с ошибкой
        const errorData = err.response.data;
        setError(errorData.error || `Ошибка ${err.response.status}`);
      } else if (err.request) {
        // Запрос был сделан, но ответа нет
        setError('Нет ответа от сервера. Проверьте, запущен ли сервер на порту 3001');
      } else {
        // Что-то пошло не так при настройке запроса
        setError('Ошибка при отправке запроса: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Форматирование даты
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

  return (
    <div className="guest-list-container">
      <h1>Регистрация гостей</h1>
      
      {/* Форма регистрации */}
      <div className="card">
        <h2>Добавить нового гостя</h2>
        
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
          <h2>Зарегистрированные гости</h2>
          <button 
            onClick={fetchGuests} 
            disabled={loadingGuests}
            className="refresh-button"
          >
            {loadingGuests ? 'Обновление...' : '🔄 Обновить'}
          </button>
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
                    <td>{formatDate(guest.created_at)}</td>
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
          color: #721c24;
          border: 1px solid #f5c6cb;
        }
        
        .guests-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
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
          font-weight: 600;
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