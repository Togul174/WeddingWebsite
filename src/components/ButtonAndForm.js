import React from 'react';

class ButtonAndForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
      userName: '',
      hotDish: '',
      alcohol: '',
      nonAlcohol: '',
      submittedData: null,
    };
  }

  toggleDiv = () => {
    this.setState(prevState => ({
      isVisible: !prevState.isVisible,
      submittedData: null,
      userName: '',
      hotDish: '',
      alcohol: '',
      nonAlcohol: '',
    }));
  };

  handleInputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = () => {
    const { userName, hotDish, alcohol, nonAlcohol } = this.state;


    if (!userName || !hotDish || !alcohol || !nonAlcohol) {
      alert('Пожалуйста, заполните все поля');
      return;
    }

    this.setState({
      submittedData: { userName, hotDish, alcohol, nonAlcohol },
    });
  };

  render() {
    const { isVisible, userName, hotDish, alcohol, nonAlcohol, submittedData } = this.state;

    return (
      <div className='formAndButton'>
        {!isVisible ? (
          <button onClick={this.toggleDiv} className='confirmationButton'>
            Подтвердить
          </button>
        ) : (
          <div className="formBackground">
            <div className='form'>
              <h3>Введите ваше имя и фамилию</h3>
              <input
                type="text"
                name="userName"
                placeholder="Ваше имя"
                value={userName}
                onChange={this.handleInputChange}
              />

              <h3>Какое горячее блюдо предпочитаете?</h3>
              <form>
                <label>
                  <input
                    type="radio"
                    name="hotDish"
                    value="Мясо"
                    checked={hotDish === "Мясо"}
                    onChange={this.handleInputChange}
                  /> Мясо
                </label><br />
                <label>
                  <input
                    type="radio"
                    name="hotDish"
                    value="Рыба"
                    checked={hotDish === "Рыба"}
                    onChange={this.handleInputChange}
                  /> Рыба
                </label><br />
                <label>
                  <input
                    type="radio"
                    name="hotDish"
                    value="Вегетарианец"
                    checked={hotDish === "Вегетарианец"}
                    onChange={this.handleInputChange}
                  /> Вегетарианец
                </label>
              </form>

              <h3>Какой алкоголь предпочитаете?</h3>
              <form>
                <label>
                  <input
                    type="radio"
                    name="alcohol"
                    value="Красное вино"
                    checked={alcohol === "Красное вино"}
                    onChange={this.handleInputChange}
                  /> Красное вино
                </label><br />
                <label>
                  <input
                    type="radio"
                    name="alcohol"
                    value="Белое вино"
                    checked={alcohol === "Белое вино"}
                    onChange={this.handleInputChange}
                  /> Белое вино
                </label><br />
                <label>
                  <input
                    type="radio"
                    name="alcohol"
                    value="Водка"
                    checked={alcohol === "Водка"}
                    onChange={this.handleInputChange}
                  /> Водка
                </label><br />
                <label>
                  <input
                    type="radio"
                    name="alcohol"
                    value="Виски"
                    checked={alcohol === "Виски"}
                    onChange={this.handleInputChange}
                  /> Виски
                </label><br />
                <label>
                  <input
                    type="radio"
                    name="alcohol"
                    value="Не буду пить алкоголь"
                    checked={alcohol === "Не буду пить алкоголь"}
                    onChange={this.handleInputChange}
                  /> Не буду пить алкоголь
                </label>
              </form>

              <h3>Какие безалкогольные напитки предпочитаете?</h3>
              <form>
                <label>
                  <input
                    type="radio"
                    name="nonAlcohol"
                    value="Сок"
                    checked={nonAlcohol === "Сок"}
                    onChange={this.handleInputChange}
                  /> Сок
                </label><br />
                <label>
                  <input
                    type="radio"
                    name="nonAlcohol"
                    value="Газированные лимонады"
                    checked={nonAlcohol === "Газированные лимонады"}
                    onChange={this.handleInputChange}
                  /> Газированные лимонады
                </label><br />
                <label>
                  <input
                    type="radio"
                    name="nonAlcohol"
                    value="Водка"
                    checked={nonAlcohol === "Газированная вода"}
                    onChange={this.handleInputChange}
                  /> Газированная вода
                </label><br />
              </form>

              <button onClick={this.handleSubmit} className='serverButton'>
                Отправить ответ
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
          </div>
        )}
      </div>
    );
  }
}

export default ButtonAndForm;