import React from 'react';
import FormForUser from './FormForUser';

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
    };
  }

  handleConfirmPresence = () => {
    this.setState({ isConfirmed: true });
  };

  handleInputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmitForm = () => {
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
      alert('Пожалуйста, заполните все поля');
      return;
    }

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
    });
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
          <button onClick={this.handleSubmitForm} className="serverButton">
            Отправить результат
          </button>
        </div>
      );
    }

    return (
      <div className="formAndButton">
        <h4>Ваши данные успешно отправлены:</h4>
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