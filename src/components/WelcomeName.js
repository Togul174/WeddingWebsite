import React from 'react';

class WelcomeName extends React.Component {
    render() {
        return (
            <div className='ourName'>{this.props.ourName}</div>
        )
    }
}

export default WelcomeName;