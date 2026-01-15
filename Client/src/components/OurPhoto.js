import React from 'react';

class OurPhoto extends React.Component {
    render() {
        return (
            <div>
                <img className='ourPhoto' src={this.props.ourPhoto} alt=''/>
            </div>


        )
    }
}

export default OurPhoto;