import React from 'react';

class Image extends React.Component {
    render() {
        return (
            <div>
                <img className='sharedPhoto' src={this.props.sharedPhoto} alt=''/>
                <img className='ourPhoto' src={this.props.ourPhoto} alt=''/>
            </div>


        )
    }
}

export default Image;