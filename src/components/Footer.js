import React from 'react';

class Footer extends React.Component {
    render() {
        return (
            <div className='footer'>
                <p className='date'>{this.props.ourDate}</p>
                <p>{this.props.ourHappines}</p>
            </div>
        )
    }
}

export default Footer;