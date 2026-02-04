import React from 'react';
import '../css/AdminPage.css';

class AdminPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuthenticated: false,
      login: '',
      password: '',
      guests: [],
      loading: false,
      error: '',
      authLoading: true // Добавим состояние загрузки проверки авторизации
    };
  }

  componentDidMount() {
    this.checkAuth();
  }

  checkAuth = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/admin/profile', {
        method: 'GET',
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        this.setState({ 
          isAuthenticated: true,
          authLoading: false
        }, () => {
          this.fetchGuests();
        });
      } else {
        this.setState({ 
          isAuthenticated: false,
          authLoading: false
        });
      }
    } catch (error) {
      console.log('Не авторизован:', error);
      this.setState({ 
        isAuthenticated: false,
        authLoading: false
      });
    }
  };

  handleLogin = async (e) => {
    e.preventDefault();
    
    const { login, password } = this.state;
    
    if (!login || !password) {
      this.setState({ error: 'Введите логин и пароль' });
      return;
    }
    
    this.setState({ loading: true, error: '' });
    
    try {
      const response = await fetch('http://localhost:3001/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ login, password }),
        credentials: 'include'
      });
      
      const data = await response.json();
      
      if (data.success) {
        this.setState({
          isAuthenticated: true,
          loading: false,
          error: ''
        }, () => {
          this.fetchGuests();
        });
      } else {
        this.setState({
          error: data.error || 'Ошибка авторизации',
          loading: false
        });
      }
    } catch (error) {
      console.error('Ошибка входа:', error);
      this.setState({
        error: 'Ошибка подключения к серверу',
        loading: false
      });
    }
  };

  handleLogout = async () => {
    try {
      await fetch('http://localhost:3001/api/admin/logout', {
        method: 'POST',
        credentials: 'include'
      });
      
      this.setState({
        isAuthenticated: false,
        guests: [],
        login: '',
        password: ''
      });
    } catch (error) {
      console.error('Ошибка выхода:', error);
    }
  };

  fetchGuests = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/guests', {
        method: 'GET',
        credentials: 'include'
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          this.setState({ 
            isAuthenticated: false,
            error: 'Требуется авторизация'
          });
          return;
        }
        throw new Error(`Ошибка загрузки: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Проверяем, что data существует и это массив
      if (data && Array.isArray(data)) {
        this.setState({ 
          guests: data,
          error: ''
        });
      } else if (data && data.guests && Array.isArray(data.guests)) {
        // Если сервер возвращает объект {guests: [...]}
        this.setState({ 
          guests: data.guests,
          error: ''
        });
      } else {
        console.error('Некорректный формат данных:', data);
        this.setState({ 
          guests: [],
          error: 'Некорректный формат данных от сервера'
        });
      }
    } catch (err) {
      console.error('Ошибка загрузки гостей:', err);
      this.setState({ 
        guests: [],
        error: 'Ошибка загрузки: ' + err.message 
      });
    }
  };

  handleDeleteGuest = async (id) => {
    if (!window.confirm('Вы уверены, что хотите удалить этого гостя?')) {
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:3001/api/guests/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      
      if (response.ok) {
        this.fetchGuests();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Ошибка удаления');
      }
    } catch (error) {
      console.error('Ошибка удаления:', error);
      alert('Ошибка при удалении: ' + error.message);
    }
  };

  renderLoginForm() {
    const { login, password, loading, error } = this.state;
    
    return (
      <div className="admin-login-container">
        <div className="login-card">
          <h1>🔐 Вход в админ-панель</h1>
          <form onSubmit={this.handleLogin} className="login-form">
            <div className="form-group">
              <label>Логин:</label>
              <input
                type="text"
                value={login}
                onChange={(e) => this.setState({ login: e.target.value })}
                placeholder="Введите логин"
                required
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label>Пароль:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => this.setState({ password: e.target.value })}
                placeholder="Введите пароль"
                required
                disabled={loading}
              />
            </div>
            
            {error && <div className="error-message">{error}</div>}
            
            <button 
              type="submit" 
              className="login-button"
              disabled={loading}
            >
              {loading ? '⏳ Вход...' : 'Войти'}
            </button>
          </form>
          
          <div className="test-credentials">
            <h4>Тестовые данные:</h4>
            <p><strong>Логин:</strong> admin</p>
            <p><strong>Пароль:</strong> admin123</p>
          </div>
          
          <button 
            onClick={() => window.history.back()} 
            className="back-button"
          >
            ← Назад на сайт
          </button>
        </div>
      </div>
    );
  }

  renderAdminPanel() {
    const { guests, error } = this.state;
    
    // Безопасное получение guests как массива
    const guestsArray = Array.isArray(guests) ? guests : [];
    
    // Статистика
    const totalGuests = guestsArray.length;
    const attendingGuests = guestsArray.filter(g => g.attendance === 'yes').length;
    const needingTransfer = guestsArray.filter(g => g.transferNeeded === 'yes').length;
    
    return (
      <div className="admin-container">
        {/* Заголовок */}
        <div className="admin-header">
          <div>
            <h1>👑 Админ-панель</h1>
            <p>Управление списком гостей</p>
          </div>
          <div className="admin-controls">
            <button 
              onClick={this.fetchGuests} 
              className="refresh-button"
            >
              🔄 Обновить
            </button>
            <button 
              onClick={this.handleLogout} 
              className="logout-button"
            >
              👋 Выйти
            </button>
          </div>
        </div>
        
        {/* Сообщения об ошибках */}
        {error && <div className="error-message">{error}</div>}
        
        {/* Статистика */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">{totalGuests}</div>
            <div className="stat-label">Всего гостей</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{attendingGuests}</div>
            <div className="stat-label">Придут</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{needingTransfer}</div>
            <div className="stat-label">Нужен трансфер</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">
              {totalGuests > 0 ? Math.round((attendingGuests / totalGuests) * 100) : 0}%
            </div>
            <div className="stat-label">Процент присутствия</div>
          </div>
        </div>
        
        {/* Таблица гостей */}
        <div className="guests-table-container">
          <div className="table-header">
            <h2>📋 Список гостей ({totalGuests})</h2>
            <button 
              onClick={this.fetchGuests} 
              className="small-refresh"
            >
              ↻ Обновить список
            </button>
          </div>
          
          {guestsArray.length === 0 ? (
            <div className="no-guests">
              <p>😔 Нет данных о гостях</p>
              <button 
                onClick={this.fetchGuests} 
                className="login-button"
                style={{marginTop: '20px', maxWidth: '200px'}}
              >
                Попробовать загрузить
              </button>
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="guests-table">
                <thead>
                  <tr>
                    <th>Имя</th>
                    <th>Телефон</th>
                    <th>Присутствие</th>
                    <th>Трансфер</th>
                    <th>Горячее</th>
                    <th>Алкоголь</th>
                    <th>Напитки</th>
                    <th>Дата</th>
                    <th>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {guestsArray.map(guest => (
                    <tr key={guest.id || guest._id}>
                      <td><strong>{guest.userName || 'Не указано'}</strong></td>
                      <td>{guest.phone || 'Не указано'}</td>
                      <td className={guest.attendance === 'yes' ? 'attendance-yes' : 'attendance-no'}>
                        {guest.attendance === 'yes' ? '✅ Да' : '❌ Нет'}
                      </td>
                      <td className={guest.transferNeeded === 'yes' ? 'transfer-yes' : 'transfer-no'}>
                        {guest.transferNeeded === 'yes' ? '🚗 Да' : '🚶 Нет'}
                      </td>
                      <td>{guest.hotDish || 'Не указано'}</td>
                      <td>{guest.alcohol || 'Не указано'}</td>
                      <td>{guest.nonAlcohol || 'Не указано'}</td>
                      <td>
                        {guest.createdAt ? 
                          new Date(guest.createdAt).toLocaleDateString('ru-RU', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric'
                          }) : 
                          'Не указано'}
                      </td>
                      <td>
                        <button 
                          onClick={() => this.handleDeleteGuest(guest.id || guest._id)}
                          className="delete-button"
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
  }

  render() {
    const { isAuthenticated, authLoading } = this.state;
    
    // Показываем загрузку при проверке авторизации
    if (authLoading) {
      return (
        <div className="admin-loading">
          <div className="spinner"></div>
          <p>Проверка авторизации...</p>
        </div>
      );
    }
    
    return (
      <div className="admin-page">
        {isAuthenticated ? this.renderAdminPanel() : this.renderLoginForm()}
      </div>
    );
  }
}

export default AdminPage;