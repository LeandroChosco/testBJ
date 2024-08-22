import React, { Component } from 'react';
import ChatAlarm from '../ChatPlusAlarm';

class AlarmChat extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return <ChatAlarm {...this.props} />;
  }
}

export default AlarmChat;
