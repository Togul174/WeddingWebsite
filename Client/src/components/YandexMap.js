import React, { Component, createRef } from 'react';

class YandexMapClass extends Component {
  mapRef = createRef();

  componentDidMount() {
    if (!window.ymaps) {
      const script = document.createElement('script');
      script.src = 'https://api-maps.yandex.ru/2.1/?lang=ru_RU&apikey=<ВАШ_API_КЛЮЧ>';
      script.type = 'text/javascript';
      script.onload = this.initMap;
      document.head.appendChild(script);
    } else {
      this.initMap();
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.coords !== this.props.coords && window.ymaps) {
      this.initMap();
    }
  }

  initMap = () => {
    if (this.map) {
      this.map.destroy();
      this.map = null;
    }

    window.ymaps.ready(() => {
      const { coords } = this.props;
      const centerCoords = Array.isArray(coords) && coords.length === 2 ? coords : [59.902180, 30.358221];

      this.map = new window.ymaps.Map(this.mapRef.current, {
        center: centerCoords,
        zoom: 16,
        controls: ['zoomControl', 'fullscreenControl', 'typeSelector'],
      });

      const placemark = new window.ymaps.Placemark(centerCoords, {
        hintContent: 'Место на карте',
        balloonContent: `Координаты: ${centerCoords[0]}, ${centerCoords[1]}`,
      }, {
        preset: 'islands#redDotIcon',
      });

      this.map.geoObjects.add(placemark);
    });
  };

  componentWillUnmount() {
    if (this.map) {
      this.map.destroy();
      this.map = null;
    }
  }

  render() {
    return <div ref={this.mapRef} className='yandexMap' />;
  }
}

export default YandexMapClass;