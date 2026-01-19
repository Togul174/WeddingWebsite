import React from 'react';

class FormForUser extends React.Component {
    render() {
        const { 
            userName, 
            phone, 
            attendance,
            transferNeeded,
            hotDish, 
            alcohol, 
            nonAlcohol, 
            onInputChange 
        } = this.props;

        return (
            <div className="formBackground">
                <div className='form'>
                    <h3>Ваши имя и фамилия</h3>
                    <input
                        type="text"
                        name="userName"
                        placeholder="Имя и фамилия"
                        value={userName}
                        onChange={onInputChange}
                    />
                    
                    <h3>Ваш номер телефона</h3>
                    <input
                        type="tel"
                        name="phone"
                        placeholder="+7..."
                        value={phone}
                        onChange={onInputChange}
                    />

                    <h3>Будете присутствовать на:</h3>
                    <form>
                        <label>
                            <input
                                type="radio"
                                name="attendance"
                                value="Загс"
                                checked={attendance === "Загс"}
                                onChange={onInputChange}
                            /> На церемонии бракосочетания
                        </label><br />
                        <label>
                            <input
                                type="radio"
                                name="attendance"
                                value="Ресторан"
                                checked={attendance === "Ресторан"}
                                onChange={onInputChange}
                            /> На банкете
                        </label><br />
                        <label>
                            <input
                                type="radio"
                                name="attendance"
                                value="Загс и Ресторан"
                                checked={attendance === "Загс и Ресторан"}
                                onChange={onInputChange}
                            /> На церемонии и банкете
                        </label>
                    </form>

                    <h3>Требуется ли вам трансфер от ЗАГСа до ресторана?</h3>
                    <form>
                        <label>
                            <input
                                type="radio"
                                name="transferNeeded"
                                value="Да"
                                checked={transferNeeded === "Да"}
                                onChange={onInputChange}
                            /> Да
                        </label><br />
                        <label>
                            <input
                                type="radio"
                                name="transferNeeded"
                                value="Нет"
                                checked={transferNeeded === "Нет"}
                                onChange={onInputChange}
                            /> Нет
                        </label>
                    </form>
                    

                    <h3>Какое горячее блюдо предпочитаете?</h3>
                    <form>
                        <label>
                            <input
                                type="radio"
                                name="hotDish"
                                value="Мясо"
                                checked={hotDish === "Мясо"}
                                onChange={onInputChange}
                            /> Свиные медальоны с картофелем черри и перечным соусом
                        </label><br />
                        <label>
                            <input
                                type="radio"
                                name="hotDish"
                                value="Рыба"
                                checked={hotDish === "Рыба"}
                                onChange={onInputChange}
                            /> Стейк из трески с картофельным муссом с сыром горгонзола, беконом и луком, соус "Белое вино"
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

                    <h3>Предпочтительные безалкогольные напитки</h3>
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
                                value="Вода"
                                checked={nonAlcohol === "Вода"}
                                onChange={onInputChange}
                            /> Минеральная вода
                        </label><br />
                        <label>
                            <input
                                type="radio"
                                name="nonAlcohol"
                                value="Лимонады"
                                checked={nonAlcohol === "Лимонады"}
                                onChange={onInputChange}
                            />  Лимонады
                        </label>
                    </form>
                </div>
            </div>
        );
    }
}

export default FormForUser;