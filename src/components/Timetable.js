import React from 'react';

class Timetable extends React.Component {
    render() {
        return (<div className='timetable'>
            <h1 className='wedTimetable'>Свадебное расписание</h1>
            <div className='elTimetable'>
                <div className='timeOfTable'>17:00<br />25.08.26</div>
                <div className='inviteOfTable'>
                    <h2>Тожественная роспись в ЗАГСе</h2>
                    <div>Приглашаем вас разделить вместе с нами радость создания новой семьи. Регистрация брака будет происходить во Дворце бракосочетаний №1. </div>
                </div>
            </div>
            <div className='elTimetable'>
                <div className='timeOfTable'>18:00<br />25.08.26</div>
                <div className='inviteOfTable'>
                    <h2>Фуршет в банкетном зале</h2>
                    <div>Фуршет состоится в банкетном зале "Нева Гарден". Именно здесь мы отметим наш незабываемый день.</div>
                </div>

            </div>

        </div>

        )
    }
}

export default Timetable;