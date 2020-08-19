import React, { Component } from 'react';
import { connect } from 'react-redux';

class StartQuiz extends Component {
    constructor(props) {
        super(props);

        this.state = {
            progress: 0,
        }
    }

    //show timer function
    //auto exit when timer up function
    render() {
        return (

        );
    }
}

export default connect()(StartQuiz);