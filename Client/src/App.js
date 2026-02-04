import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header.js';
import Welcome from './components/Welcome.js';
import Footer from './components/Footer.js';
import WelcomeName from './components/WelcomeName.js';
import DateCountdown from './components/DateCountdown.jsx';
import DearGuest from './components/DearGuest.js';
import RepeatText from './components/RepeatText.js';
import OurPhoto from './components/OurPhoto.js';
import SharedPhoto from './components/SharedPhotos.js';
import Palette from './components/Palette.js';
import PalacePhotoSlider from './components/PalacePhotoSlider.jsx'
import BanquetHallPhotoSlider from './components/BanquetHallPhotoSlider.jsx'
import Timetable from './components/Timetable.js';
import YandexMapClass from './components/YandexMap.jsx';
import Acception from './components/Acception.jsx';
import AdminPage from './components/AdminPage.jsx';

const WeddingPage = () => {
  return (
    <div className='main'>
      <div className="mainWelcomePage">
        <Header headerText={<>Приглашаем <br /> вас на нашу свадьбу!</>} />
        <Welcome ourWedding={<>Наша<br />Сва<br />дьба</>} />
        <WelcomeName ourName={<>Игорь<br /><p className='nameAnd'>and</p><br />Мария</>} />
        <Footer ourDate="25 августа 2026" ourHappines="Будем рады разделить этот день с вами" />
        <DateCountdown />
      </div>
      <div className='mainDiscrPage'>
        <DearGuest dearGuest={<>Дорогие <br />родные и близкие!</>} />
        <RepeatText repeatText={<>Один день в этом году будет для нас особенным, и мы хотим разделить его с вами!<br />Приглашаем Вас на торжество, посвященное дню нашего бракосочетания, которое состится:</>} />
        <RepeatText dateWed={<>25 августа 2026</>} />
        <SharedPhoto />
        <DearGuest dearGuest={<>Свадьба - это момент,<br />  когда две судьбы становятся одной!</>} />
        <OurPhoto/>
        <RepeatText titleRepeatText="Детали" />        
        <RepeatText repeatText={<>Мы не хотим обременять Вас выбором подарка, поэтому будем рады вкладу в бюджет нашей молодой семьи.</>} />
        <RepeatText repeatText={<>Мы понимаем, что дарить цветы на свадьбу - это традиция, но мы не сможем насладиться их красотой в полной мере...Будем рады, если вместо цветов Вы подарите нам немного азарта. В качестве дополнения к подарку мы будем искренне благодарны за лотерейные билеты, зарегистрированные на наши номера телефонов: <br/>+7 964 378-24-65 или +7 950 251-45-73.</>} />
        <RepeatText repeatText={<>Обращаем внимание, что формат мероприятия не предполагает детской площадки и аниматоров. Пожалуйста, позаботьтесь о том, чтобы провести этот вечер без детей.</>} />
        <RepeatText repeatText={<>От всего сердца просим Вас воздержаться от криков "Горько" и сохранить атмосферу уютного семейного праздника.</>} />        
        <DearGuest dearGuest="Ждем Вас на свадьбе!" />
        <RepeatText repeatText={<>Будем благодарны, если при выборе нарядов на наше торжество вы придержитесь следующей палитры.</>} />
        <Palette />
        <Timetable />
        <RepeatText titleRepeatText={<>Дворец Бракосочетания</>} />
        <PalacePhotoSlider />
        <YandexMapClass coords={[59.93396, 30.293878]} />
        <RepeatText titleRepeatText={<>Банкетный зал</>} />
        <BanquetHallPhotoSlider />
        <YandexMapClass coords={[59.95959, 30.414220]} />
        <DearGuest dearGuest="Ждем Вас на свадьбе!" />
        <RepeatText titleRepeatText="Подтверждение" />
        <RepeatText repeatText={<>Пожалуйста, подтвердите свое присутствие до 01.07.2026. <br/> Если вы придете с вашей второй половинкой, необходимо повторно заполнить анкету от его/её имени. </>} />

        <Acception />
      </div>
    </div>
  );
};

class App extends React.Component {
  render() {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<WeddingPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </Router>
    );
  }
}

export default App;