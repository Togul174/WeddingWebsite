import React from 'react';

class FormForUser extends React.Component {
    render() {
        const { userName, hotDish, alcohol, nonAlcohol, onInputChange } = this.props;

        return (
            <div className="formBackground">
                <div className='form'>
                    <h3>Введите ваше имя и фамилию</h3>
                    <input
                        type="text"
                        name="userName"
                        placeholder="Ваше имя"
                        value={userName}
                        onChange={onInputChange}
                    />

                    <h3>Какое горячее блюдо предпочитаете?</h3>
                    <form>
                        <label>
                            <input
                                type="radio"
                                name="hotDish"
                                value="Мясо"
                                checked={hotDish === "Мясо"}
                                onChange={onInputChange}
                            /> Мясо
                        </label><br />
                        <label>
                            <input
                                type="radio"
                                name="hotDish"
                                value="Рыба"
                                checked={hotDish === "Рыба"}
                                onChange={onInputChange}
                            /> Рыба
                        </label><br />
                        <label>
                            <input
                                type="radio"
                                name="hotDish"
                                value="Вегетарианец"
                                checked={hotDish === "Вегетарианец"}
                                onChange={onInputChange}
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
                                onChange={onInputChange}
                            /> Красное вино
                        </label><br />
                        <label>
                            <input
                                type="radio"
                                name="alcohol"
                                value="Белое вино"
                                checked={alcohol === "Белое вино"}
                                onChange={onInputChange}
                            /> Белое вино
                        </label><br />
                        <label>
                            <input
                                type="radio"
                                name="alcohol"
                                value="Виски"
                                checked={alcohol === "Виски"}
                                onChange={onInputChange}
                            /> Виски
                        </label><br />
                        <label>
                            <input
                                type="radio"
                                name="alcohol"
                                value="Водка"
                                checked={alcohol === "Водка"}
                                onChange={onInputChange}
                            /> Водка
                        </label><br />
                        <label>
                            <input
                                type="radio"
                                name="alcohol"
                                value="Джин"
                                checked={alcohol === "Джин"}
                                onChange={onInputChange}
                            /> Джин
                        </label><br />
                        <label>
                            <input
                                type="radio"
                                name="alcohol"
                                value="Не буду употреблять алкоголь"
                                checked={alcohol === "Не буду употреблять алкоголь"}
                                onChange={onInputChange}
                            /> Не буду употреблять алкоголь
                        </label>
                    </form>

                    <h3>Безалкогольные напитки</h3>
                    <form>
                        <label>
                            <input
                                type="radio"
                                name="nonAlcohol"
                                value="Соки"
                                checked={nonAlcohol === "Соки"}
                                onChange={onInputChange}
                            /> Соки
                        </label><br />
                        <label>
                            <input
                                type="radio"
                                name="nonAlcohol"
                                value="Газированная вода"
                                checked={nonAlcohol === "Газированная вода"}
                                onChange={onInputChange}
                            /> Газированная вода
                        </label><br />
                        <label>
                            <input
                                type="radio"
                                name="nonAlcohol"
                                value="Газированные лимонады"
                                checked={nonAlcohol === "Газированные лимонады"}
                                onChange={onInputChange}
                            /> Газированные лимонады
                        </label>
                    </form>
                </div>
            </div>
        );
    }
}

export default FormForUser;