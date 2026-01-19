import React, { useState } from 'react';
import '../css/simplePhotoSlider.css';

import Photo1 from '../images/banquetHall/1.jpg';
import Photo2 from '../images/banquetHall/2.jpg';
import Photo3 from '../images/banquetHall/3.jpg';
import Photo4 from '../images/banquetHall/4.jpg';

const BanquetHallPhotoSlider = () => {
    const photos = [Photo1, Photo2, Photo3, Photo4];
    const [currentIndex, setCurrentIndex] = useState(0);

    const next = () => {
        if (currentIndex < photos.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const prev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    return (
        <div className="simple-slider">
            <div className="slider-content">
                <img 
                    src={photos[currentIndex]} 
                    alt={`Фото ${currentIndex + 1}`}
                    className="slider-photo"
                />
            </div>
            
            <div className="slider-controls">
                <button onClick={prev} className="control-btn">
                    ←
                </button>
                
                <span className="slider-info">
                    {currentIndex + 1} / {photos.length}
                </span>
                
                <button onClick={next} className="control-btn">
                    →
                </button>
            </div>
        </div>
    );
};

export default BanquetHallPhotoSlider;