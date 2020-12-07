import React, { Component } from 'react';
import Chat from '../ChatPlus/index';


class AlarmChat extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return (
            <>
                < Chat {...this.props} />
            </>
        )
    }
}

export default AlarmChat;