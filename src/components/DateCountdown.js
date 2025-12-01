import React from 'react';

class DateCountdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      weeks: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      finished: false,
    };

    this.targetDate = new Date('2026-08-25T00:00:00');
  }

  componentDidMount() {
    this.interval = setInterval(this.updateCountdown, 1000);
    this.updateCountdown();
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  updateCountdown = () => {
    const now = new Date();
    const diff = this.targetDate - now;

    if (diff <= 0) {
      clearInterval(this.interval);
      this.setState({ finished: true });
      return;
    }

    let seconds = Math.floor(diff / 1000);
    const weeks = Math.floor(seconds / (7 * 24 * 3600));
    seconds -= weeks * 7 * 24 * 3600;
    const days = Math.floor(seconds / (24 * 3600));
    seconds -= days * 24 * 3600;
    const hours = Math.floor(seconds / 3600);
    seconds -= hours * 3600;
    const minutes = Math.floor(seconds / 60);
    seconds -= minutes * 60;

    this.setState({
      weeks,
      days,
      hours,
      minutes,
      seconds,
      finished: false,
    });
  };

  renderTimeBlock(value, label) {
    return (
      <div>
        <div className='dateCountdown'>{value}</div>
        <div className='dateCountdown'>{label}</div>
      </div>
    );
  }

  render() {
    const { weeks, days, hours, minutes, seconds, finished } = this.state;

    if (finished) {
      return <div>Событие наступило!</div>;
    }

    return (
      <div className="countdown">
        {this.renderTimeBlock(weeks, 'недель')}
        {this.renderTimeBlock(days, 'дней')}
        {this.renderTimeBlock(hours, 'часов')}
        {this.renderTimeBlock(minutes, 'минут')}
        {this.renderTimeBlock(seconds, 'секунд')}
      </div>
    );
  }
}

export default DateCountdown;
