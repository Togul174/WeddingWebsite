import React from 'react';
import FormForUser from './FormForUser';

class Acception extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isFormEnabled: false,
      userName: '',
      hotDish: '',
      alcohol: '',
      nonAlcohol: '',
      submittedData: null,
    };
  }

  handleConfirm = () => {
    this.setState({
      isFormEnabled: true,
      submittedData: null,
      userName: '',
      hotDish: '',
      alcohol: '',
      nonAlcohol: '',
    });
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
      isFormEnabled: false,
    });
  };

  render() {
    const { isFormEnabled, submittedData, userName, hotDish, alcohol, nonAlcohol } = this.state;

    return (
      <div className='formAndButton'>
        {!isFormEnabled ? (
          <div>
            <button onClick={this.handleConfirm} className='serverButton'>
              Подтвердить
            </button>

            {submittedData && (
              <div className="submittedData" style={{ marginTop: '20px', borderTop: '1px solid #ccc', paddingTop: '10px' }}>
                <h4>Ваши данные:</h4>
                <p><b>Имя:</b> {submittedData.userName}</p>
                <p><b>Горячее блюдо:</b> {submittedData.hotDish}</p>
                <p><b>Алкоголь:</b> {submittedData.alcohol}</p>
                <p><b>Безалкогольные напитки:</b> {submittedData.nonAlcohol}</p>
              </div>
            )}
          </div>
        ) : (
          <div>
            <FormForUser
              userName={userName}
              hotDish={hotDish}
              alcohol={alcohol}
              nonAlcohol={nonAlcohol}
              onInputChange={this.handleInputChange}
            />
            <button onClick={this.handleSubmitForm} className='serverButton' style={{ marginTop: '10px' }}>
              Отправить результат
            </button>
          </div>
        )}
      </div>
    );
  }
}

export default Acception;
