import React from 'react';
import OurPhotoMasha from '../images/ourPhotos/masha.jpg';
import OurPhotoIgor from '../images/ourPhotos/igor.jpg';

class OurPhoto extends React.Component {
    render() {
        return (
            <div className='ourPhotoContainer'>
                <div>
                    <img className='ourPhoto' src={OurPhotoIgor} alt='Фото жениха' />
                    <div className='brideRole'>Жених</div>
                </div>
                <div>
                    <img className='ourPhoto' src={OurPhotoMasha} alt='Фото невесты' />
                    <div className='brideRole'>Невеста</div>
                </div>
            </div>
        );
    }
}

export default OurPhoto;