import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header.js';
import Welcome from './components/Welcome.js';
import Footer from './components/Footer.js';
import WelcomeName from './components/WelcomeName.js';
import DateCountdown from './components/DateCountdown.jsx';
import DearGuest from './components/DearGuest.js';
import RepeatText from './components/RepeatText.js';
import OurPhotoMasha from './images/ourPhotos/masha.jpg';
import OurPhotoIgor from './images/ourPhotos/igor.jpg';
import OurPhoto from './components/OurPhoto.js';
import SharedPhoto from './components/SharedPhotos.js';
import Palette from './components/Palette.js';
import PalacePhotoSlider from './components/PalacePhotoSlider.jsx'
import BanquetHallPhotoSlider from './components/BanquetHallPhotoSlider.jsx'
import Timetable from './components/Timetable.js';
import YandexMapClass from './components/YandexMap.jsx';
import Acception from './components/Acception.jsx';
import GuestList from './components/GuestList.jsx';
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
        <RepeatText repeatText={<>Мы рады сообщить Вам, что 25.08.2026 состоится самое главное торжество в нашей жизни - день нашей свадьбы!<br />Приглашаем Вас разделить с нами радость этого незабываемого дня.</>} />
        <RepeatText titleRepeatText={<>25.08.2026 в 17:00</>} />
        <SharedPhoto/>
        <DearGuest dearGuest={<>Там, где посеяна любовь,<br /> растёт радость.</>} />
        <OurPhoto ourPhoto={OurPhotoIgor} />
        <DearGuest dearGuest="Жених" />
        <OurPhoto ourPhoto={OurPhotoMasha} />
        <DearGuest dearGuest="Невеста" />
        <RepeatText titleRepeatText="Меню" />
        <RepeatText repeatText={<>Меню разнообразно, поэтому сообщите нам заранее, если у вас есть какие-либо предпочтения или диетические ограничения. После подтверждения вы сможете пройти опрос о своих вкусовых предпочтениях и напитках.</>} />
        <RepeatText titleRepeatText="Пожелания по подаркам" />
        <RepeatText repeatText={<>Ваше присутствие в день нашей свадьбы - самый значимый подарок для нас! Мы понимаем, что дарить цветы на свадьбу - это традиция, но мы не сможем насладиться их красотой в полной мере... Будем рады любой другой альтернативе (вино или в денежном эквиваленте).</>} />
        <RepeatText titleRepeatText="Примечание" />
        <RepeatText repeatText={<>Будем благодарны, если вы воздержитесь от криков "Горько" на празднике, ведь поцелуй — это знак выражения чувств, он не может быть по заказу.</>} />
        <DearGuest dearGuest="Ждем Вас на свадьбе!" />
        <RepeatText repeatText={<>Будем благодарны, если при выборе нарядов на наше торжество вы придержитесь следующей палитры.</>} />
        <Palette />
        <Timetable />
        <RepeatText titleRepeatText="Зал бракосочетания" />
        <PalacePhotoSlider/>
        <YandexMapClass coords={[59.93396, 30.293878]} />
        <RepeatText titleRepeatText="Банкетный зал" />
        <BanquetHallPhotoSlider/>
        <YandexMapClass coords={[59.95959, 30.414220]} />
        <RepeatText titleRepeatText="Подтверждение" />
        <RepeatText repeatText={<>Пожалуйста подтвердите свое присутствие до 01.01.2025</>} />
        <Acception />
        <GuestList/>
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