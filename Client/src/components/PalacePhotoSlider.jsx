import React, { useState } from 'react';

import Photo1 from '../images/palacePhotos/1.jpg';
import Photo2 from '../images/palacePhotos/2.jpg';
import Photo3 from '../images/palacePhotos/3.jpg';
import Photo4 from '../images/palacePhotos/4.jpg';
import Photo5 from '../images/palacePhotos/5.jpg';
import Photo6 from '../images/palacePhotos/6.jpg';


const PalacePhotoSlider = () => {
    const photos = [Photo1, Photo2, Photo3, Photo4, Photo5, Photo6];
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

export default PalacePhotoSlider;