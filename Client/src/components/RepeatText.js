import React from 'react';

class RepeatText extends React.Component {
    render() {
        return (<div>
            <div className='titleRepeatText'>{this.props.titleRepeatText}</div>
            <div className="repeatText">{this.props.repeatText}</div>
            <div className='dateWed'>{this.props.dateWed}</div>
        </div>

        )
    }
}

export default RepeatText;