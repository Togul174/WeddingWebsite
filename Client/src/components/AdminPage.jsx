import React from 'react';
import '../css/AdminPage.css';
import API_BASE_URL from '../config/api';

const attendanceReverseMap = {
  1: "ЗАГС",
  2: "Ресторан",
  3: "ЗАГС и Ресторан"
};

const transferReverseMap = {
  1: "Да",
  2: "Нет"
};

const hotDishReverseMap = {
  1: "Мясо",
  2: "Рыба",
  3: "Вегетарианец"
};

const alcoholReverseMap = {
  1: "Красное вино",
  2: "Белое вино",
  3: "Виски",
  4: "Водка",
  5: "Джин",
  6: "Не буду употреблять алкоголь"
};

const nonAlcoholReverseMap = {
  1: "Соки",
  2: "Вода",
  3: "Лимонады"
};

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
      authLoading: true
    };
  }

  componentDidMount() {
    this.checkAuth();
  }

  checkAuth = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/profile`, {
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
      const response = await fetch(`${API_BASE_URL}/admin/login`, {
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
      await fetch(`${API_BASE_URL}/admin/logout`, {
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
      const response = await fetch(`${API_BASE_URL}/guests`, {
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

      // Преобразуем полученные данные - заменяем числа на текст для отображения
      let guestsData = [];
      if (data && Array.isArray(data)) {
        guestsData = data;
      } else if (data && data.guests && Array.isArray(data.guests)) {
        guestsData = data.guests;
      }

      // Преобразуем числовые значения в текст для отображения
      const formattedGuests = guestsData.map(guest => ({
        ...guest,
        attendance: attendanceReverseMap[guest.attendance] || 'Не указано',
        transferNeeded: transferReverseMap[guest.transferNeeded] || 'Не указано',
        hotDish: hotDishReverseMap[guest.hotDish] || 'Не указано',
        alcohol: alcoholReverseMap[guest.alcohol] || 'Не указано',
        nonAlcohol: nonAlcoholReverseMap[guest.nonAlcohol] || 'Не указано'
      }));

      this.setState({
        guests: formattedGuests,
        error: ''
      });
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
      const response = await fetch(`${API_BASE_URL}/guests/${id}`, { 
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

    const guestsArray = Array.isArray(guests) ? guests : [];

    // Статистика (проверяем attendance в текстовом формате)
    const totalGuests = guestsArray.length;
    const attendingGuests = guestsArray.filter(g =>
      g.attendance === 'ЗАГС' ||
      g.attendance === 'Ресторан' ||
      g.attendance === 'ЗАГС и Ресторан'
    ).length;
    const needingTransfer = guestsArray.filter(g => g.transferNeeded === 'Да').length;

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
                style={{ marginTop: '20px', maxWidth: '200px' }}
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
                      <td><strong>{guest.userName || guest.name || 'Не указано'}</strong></td>
                      <td>{guest.phone || 'Не указано'}</td>
                      <td className={
                        guest.attendance === 'ЗАГС' ||
                          guest.attendance === 'Ресторан' ||
                          guest.attendance === 'ЗАГС и Ресторан'
                          ? 'attendance-yes'
                          : 'attendance-no'
                      }>
                        {guest.attendance === 'ЗАГС' ? '🏛️ ЗАГС' :
                          guest.attendance === 'Ресторан' ? '🍽️ Ресторан' :
                            guest.attendance === 'ЗАГС и Ресторан' ? '🏛️🍽️ Оба' :
                              guest.attendance}
                      </td>
                      <td className={guest.transferNeeded === 'Да' ? 'transfer-yes' : 'transfer-no'}>
                        {guest.transferNeeded === 'Да' ? '🚗 Да' :
                          guest.transferNeeded === 'Нет' ? '🚶 Нет' :
                            guest.transferNeeded}
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