import React, { Component, createRef } from 'react';

class YandexMapClass extends Component {
  mapRef = createRef();
  map = null;
  placemark = null;

  componentDidMount() {
    if (!window.ymaps) {
      if (!document.getElementById('yandex-map-script')) {
        const script = document.createElement('script');
        script.id = 'yandex-map-script';
        script.src = 'https://api-maps.yandex.ru/2.1/?lang=ru_RU&apikey=a71d88fb-6cfc-4101-94cd-8356b6560483';
        script.type = 'text/javascript';
        script.onload = () => {
          window.ymaps.ready(this.initMap);
        };
        document.head.appendChild(script);
      } else {
        const checkReady = () => {
          if (window.ymaps && typeof window.ymaps.ready === 'function') {
            window.ymaps.ready(this.initMap);
          } else {
            setTimeout(checkReady, 100);
          }
        };
        checkReady();
      }
    } else {
      window.ymaps.ready(this.initMap);
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.coords !== this.props.coords && this.map && this.placemark) {
      const newCoords = this.props.coords;
      if (Array.isArray(newCoords) && newCoords.length === 2) {
        this.map.setCenter(newCoords);
        this.placemark.geometry.setCoordinates(newCoords);
      }
    }
  }

  initMap = () => {
    const { coords } = this.props;
    const centerCoords = Array.isArray(coords) && coords.length === 2 ? coords : [59.90218, 30.35822];

    if (this.map) {
      this.map.destroy();
      this.map = null;
      this.placemark = null;
    }

    this.map = new window.ymaps.Map(this.mapRef.current, {
      center: centerCoords,
      zoom: 16,
      controls: ['zoomControl', 'fullscreenControl', 'typeSelector'],
    });

    this.placemark = new window.ymaps.Placemark(
      centerCoords,
      {
        hintContent: 'Место на карте',
        balloonContent: `Координаты: ${centerCoords[0]}, ${centerCoords[1]}`,
      },
      {
        preset: 'islands#redDotIcon',
      }
    );

    this.map.geoObjects.add(this.placemark);
  };

  componentWillUnmount() {
    if (this.map) {
      this.map.destroy();
      this.map = null;
      this.placemark = null;
    }
  }

  render() {
    return <div ref={this.mapRef} className="yandexMap" />;
  }
}

export default YandexMapClass;