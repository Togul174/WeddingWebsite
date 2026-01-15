import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/AdminPage.css';

const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [guests, setGuests] = useState([]);
  const [loginData, setLoginData] = useState({ login: 'admin', password: 'admin123' });
  const [error, setError] = useState('');
  const [stats, setStats] = useState({ total: 0 });
  
  const navigate = useNavigate();
  const API_URL = 'http://localhost:3001';

  // Проверяем авторизацию при загрузке
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/profile`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        setIsAuthenticated(true);
        fetchAdminGuests();
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Ошибка проверки авторизации:', error);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(`${API_URL}/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData),
        credentials: 'include'
      });

      const data = await response.json();

      if (data.success) {
        setIsAuthenticated(true);
        fetchAdminGuests();
      } else {
        setError(data.error || 'Ошибка авторизации');
      }
    } catch (error) {
      console.error('Ошибка входа:', error);
      setError('Ошибка подключения к серверу');
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(`${API_URL}/admin/logout`, {
        method: 'POST',
        credentials: 'include'
      });
      setIsAuthenticated(false);
      setGuests([]);
    } catch (error) {
      console.error('Ошибка выхода:', error);
    }
  };

  // Функция для получения гостей через защищенный эндпоинт
  const fetchAdminGuests = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/admin/guests`, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          setIsAuthenticated(false);
          return;
        }
        throw new Error('Ошибка загрузки');
      }

      const data = await response.json();
      setGuests(data.guests || []);
      setStats({ total: data.count || 0 });
    } catch (error) {
      console.error('Ошибка загрузки гостей:', error);
      setError('Не удалось загрузить список гостей');
    } finally {
      setLoading(false);
    }
  };

  // Или используем публичный эндпоинт для админки (если не работает защищенный)
  const fetchPublicGuests = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/guests`);
      
      if (!response.ok) {
        throw new Error('Ошибка загрузки');
      }

      const data = await response.json();
      setGuests(data.guests || []);
      setStats({ total: data.count || 0 });
    } catch (error) {
      console.error('Ошибка загрузки гостей:', error);
      setError('Не удалось загрузить список гостей');
    } finally {
      setLoading(false);
    }
  };

  const deleteGuest = async (id, name) => {
    if (!window.confirm(`Удалить гостя "${name}"?`)) return;

    try {
      // Пока используем публичный эндпоинт для удаления
      const response = await fetch(`${API_URL}/api/guests/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setGuests(guests.filter(guest => guest.id !== id));
        alert('Гость успешно удален');
      } else {
        alert('Ошибка удаления гостя');
      }
    } catch (error) {
      console.error('Ошибка удаления:', error);
      alert('Ошибка удаления гостя');
    }
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <p>Загрузка...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="admin-login-container">
        <div className="login-card">
          <h1>🔐 Вход в админ-панель</h1>
          
          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label htmlFor="login">Логин</label>
              <input
                type="text"
                id="login"
                value={loginData.login}
                onChange={(e) => setLoginData({...loginData, login: e.target.value})}
                placeholder="Введите логин"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Пароль</label>
              <input
                type="password"
                id="password"
                value={loginData.password}
                onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                placeholder="Введите пароль"
                required
              />
            </div>
            
            {error && <div className="error-message">{error}</div>}
            
            <button type="submit" className="login-button">
              Войти
            </button>
          </form>
          
          <div className="login-hint">
            <p>Демо доступ:</p>
            <p>Логин: <strong>admin</strong></p>
            <p>Пароль: <strong>admin123</strong></p>
          </div>
          
          <button 
            onClick={() => navigate('/')} 
            className="back-button"
          >
            ← На главную
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <header className="admin-header">
        <div>
          <h1>📊 Панель администратора</h1>
          <p>Управление списком гостей на свадьбу</p>
        </div>
        <div className="admin-controls">
          <button onClick={fetchAdminGuests} className="refresh-button">
            🔄 Обновить
          </button>
          <button onClick={handleLogout} className="logout-button">
            🚪 Выйти
          </button>
          <button onClick={() => navigate('/')} className="back-button">
            ← На сайт
          </button>
        </div>
      </header>

      {/* Статистика */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{stats.total}</div>
          <div className="stat-label">Всего гостей</div>
        </div>
      </div>

      {/* Таблица гостей */}
      <div className="guests-table-container">
        <div className="table-header">
          <h2>Список гостей</h2>
          <button onClick={fetchAdminGuests} className="small-refresh">
            Обновить
          </button>
        </div>
        
        {guests.length === 0 ? (
          <div className="no-guests">
            <p>Нет зарегистрированных гостей</p>
            <button onClick={fetchPublicGuests} style={{ marginTop: '10px' }}>
              Загрузить через публичный API
            </button>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="guests-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Имя</th>
                  <th>Телефон</th>
                  <th>Дата регистрации</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {guests.map(guest => (
                  <tr key={guest.id}>
                    <td>{guest.id}</td>
                    <td><strong>{guest.name}</strong></td>
                    <td>{guest.phone}</td>
                    <td>
                      {new Date(guest.created_at).toLocaleDateString('ru-RU', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td>
                      <button
                        onClick={() => deleteGuest(guest.id, guest.name)}
                        className="delete-button"
                        title="Удалить"
                      >
                        🗑️ Удалить
                      </button>
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