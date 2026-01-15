import React from 'react';
import SharedPhoto1 from '../images/ourPhotos/Img1.jpg'
import SharedPhoto2 from '../images/ourPhotos/Img2.jpg'
import SharedPhoto3 from '../images/ourPhotos/Img3.jpg'

class SharedPhoto extends React.Component {
    render() {
        return (
            <div className='ourSharedPhoto'>
                <div>
                    <img className='sharedPhotoRight' src={SharedPhoto1} alt='' />
                    <img className='sharedPhotoLeft' src={SharedPhoto2} alt='' />
                    <img className='sharedPhotoRight' src={SharedPhoto3} alt='' />
                </div>
            </div>
        )
    }
}

export default SharedPhoto;