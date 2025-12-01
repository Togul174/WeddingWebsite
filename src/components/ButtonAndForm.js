import React from 'react';
 
class ButtonAndForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false
    };
  }

  toggleDiv = () => {
    this.setState(prevState => ({
      isVisible: !prevState.isVisible
    }));
  };

  render() {
    return (
      <div>
        <button onClick={this.toggleDiv}>
          Показать/Скрыть див
        </button>

        {this.state.isVisible && (
          <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f0f0f0' }}>
            Это скрытый див, который появился!
          </div>
        )}
      </div>
    );
  }
}

export default ButtonAndForm;