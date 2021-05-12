import React, { Component } from 'react';
import SOSview from '../SOSview';

class ChatTracking extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return <SOSview {...this.props} />;
	}
}

export default ChatTracking;
