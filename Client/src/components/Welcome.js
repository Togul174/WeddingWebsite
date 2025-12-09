import React from 'react';

class Welcome extends React.Component {
    render() {
        return (
            <div className='ourWedding'>{this.props.ourWedding}</div>
        )
    }
}

export default Welcome;