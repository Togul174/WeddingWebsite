import React from 'react';
import FormForUser from './FormForUser';

const attendanceMap = {
  "ЗАГС": 1,
  "Ресторан": 2,
  "ЗАГС и Ресторан": 3
};

const transferMap = {
  "Да": 1,
  "Нет": 2
};

const hotDishMap = {
  "Мясо": 1,
  "Рыба": 2,
  "Вегетарианец": 3
};

const alcoholMap = {
  "Красное вино": 1,
  "Белое вино": 2,
  "Виски": 3,
  "Водка": 4,
  "Джин": 5,
  "Не буду употреблять алкоголь": 6
};

const nonAlcoholMap = {
  "Соки": 1,
  "Вода": 2,
  "Лимонады": 3
};

class Acception extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isConfirmed: false,
      userName: '',
      phone: '',
      attendance: '',
      transferNeeded: '',
      hotDish: '',
      alcohol: '',
      nonAlcohol: '',
      submittedData: null,
      isFormSubmitted: false,
      loading: false,
      error: ''
    };
  }

  handleConfirmPresence = () => {
    this.setState({ isConfirmed: true });
  };

  handleInputChange = (e) => {
    this.setState({ 
      [e.target.name]: e.target.value,
      error: ''
    });
  };

  handleSubmitForm = async () => {
    const { 
      userName, 
      phone, 
      attendance, 
      transferNeeded, 
      hotDish, 
      alcohol, 
      nonAlcohol 
    } = this.state;

    // Проверка обязательных полей
    if (!userName || !phone || !attendance || !transferNeeded || !hotDish || !alcohol || !nonAlcohol) {
      this.setState({ error: 'Пожалуйста, заполните все поля' });
      return;
    }

    this.setState({ loading: true, error: '' });

    try {
      // Отправляем на сервер ЧИСЛА вместо строк
      const response = await fetch('http://localhost:3001/api/guests/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userName,
          phone,
          attendance: attendanceMap[attendance],
          transferNeeded: transferMap[transferNeeded],
          hotDish: hotDishMap[hotDish],
          alcohol: alcoholMap[alcohol],
          nonAlcohol: nonAlcoholMap[nonAlcohol]
        })
      });

      const data = await response.json();

      if (data.success) {
        this.setState({
          submittedData: { 
            userName, 
            phone, 
            attendance, 
            transferNeeded, 
            hotDish, 
            alcohol, 
            nonAlcohol 
          },
          isFormSubmitted: true,
          loading: false
        });
      } else {
        this.setState({
          error: data.error || 'Ошибка сохранения данных',
          loading: false
        });
      }
    } catch (error) {
      console.error('Ошибка отправки:', error);
      this.setState({
        error: 'Ошибка подключения к серверу',
        loading: false
      });
    }
  };

  render() {
    const {
      isConfirmed,
      isFormSubmitted,
      submittedData,
      userName,
      phone,
      attendance,
      transferNeeded,
      hotDish,
      alcohol,
      nonAlcohol,
      loading,
      error
    } = this.state;

    if (!isConfirmed) {
      return (
        <div className="formAndButton">
          <button onClick={this.handleConfirmPresence} className="serverButton">
            Подтвердить присутствие
          </button>
        </div>
      );
    }

    if (!isFormSubmitted) {
      return (
        <div className="formAndButton">
          <FormForUser
            userName={userName}
            phone={phone}
            attendance={attendance}
            transferNeeded={transferNeeded}
            hotDish={hotDish}
            alcohol={alcohol}
            nonAlcohol={nonAlcohol}
            onInputChange={this.handleInputChange}
          />
          
          {error && <div className="error-message">{error}</div>}
          
          <button 
            onClick={this.handleSubmitForm} 
            className="serverButton"
            disabled={loading}
          >
            {loading ? 'Отправка...' : 'Отправить результат'}
          </button>
        </div>
      );
    }

    return (
      <div className="formAndButton">
        <h4>✅ Ваши данные успешно отправлены:</h4>
        <p><b>Имя:</b> {submittedData.userName}</p>
        <p><b>Телефон:</b> {submittedData.phone}</p>
        <p><b>Присутствие на:</b> {submittedData.attendance}</p>
        <p><b>Трансфер:</b> {submittedData.transferNeeded}</p>
        <p><b>Горячее блюдо:</b> {submittedData.hotDish}</p>
        <p><b>Алкоголь:</b> {submittedData.alcohol}</p>
        <p><b>Безалкогольные напитки:</b> {submittedData.nonAlcohol}</p>
      </div>
    );
  }
}

export default Acception;