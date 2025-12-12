import React from 'react';
import FormForUser from './FormForUser';

class Acception extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isConfirmed: false,
      userName: '',
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
    const { userName, hotDish, alcohol, nonAlcohol } = this.state;

    if (!userName || !hotDish || !alcohol || !nonAlcohol) {
      alert('Пожалуйста, заполните все поля');
      return;
    }

    this.setState({
      submittedData: { userName, hotDish, alcohol, nonAlcohol },
      isFormSubmitted: true,
    });
  };

  render() {
    const {
      isConfirmed,
      isFormSubmitted,
      submittedData,
      userName,
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
        <h4>Ваши данные:</h4>
        <p><b>Имя:</b> {submittedData.userName}</p>
        <p><b>Горячее блюдо:</b> {submittedData.hotDish}</p>
        <p><b>Алкоголь:</b> {submittedData.alcohol}</p>
        <p><b>Безалкогольные напитки:</b> {submittedData.nonAlcohol}</p>
      </div>
    );
  }
}

export default Acception;