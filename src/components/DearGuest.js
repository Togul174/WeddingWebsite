import React from 'react';
 
class DearGuest extends React.Component {
    render() {
        return (
        <div className="dearGuest">{this.props.dearGuest}</div>
        ) 
    }
}

export default DearGuest;