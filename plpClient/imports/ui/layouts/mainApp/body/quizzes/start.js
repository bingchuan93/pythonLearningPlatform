import React, { Component } from 'react';
import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import { Button } from 'reactstrap';
import moment from 'moment';

class StartQuiz extends Component {
    constructor(props) {
        super(props);

        this.state = {
            progress: 0,
            quiz: null,
            seconds: 0
        }
    }

    componentDidMount() {
        if (this.props.match.params.id) {
            this.getQuiz(this.props.match.params.id);
        }
    }

    getQuiz = (id) => {
        Meteor.call('Assessment.getQuizById', id, (error, result) => {
            if (!error) {
                this.setState({ quiz: result, seconds: result.duration * 60 });
            } else {
                this.props.dispatch(push('/'));
            }
        });
    }

    componentDidUpdate(prevProps, prevState) {
        if (!prevProps.assessmentState.endTime && this.props.assessmentState.endTime) {
            // this.startTimer();
        }
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    startTimer = () => {
        this.timer = setInterval(() => {
            this.setState({
                seconds: this.state.seconds - 1
            });
        }, 1000);
    }

    //show timer function
    //auto exit when timer up function
    render() {
        const { quiz } = this.state;
        // console.log(quiz);
        console.log(this.props.assessmentState.endTime);
        return (
            <>
                {this.props.assessmentState.endTime ? (
                    <div>
                        <div>
                            Quiz Started
                        </div>
                        <div>
                            {(this.state.seconds/60).toFixed(0)}:{this.state.seconds%60} Fix minutes bug
                        </div>
                    </div>
                    //questions viewer component. pass in questions. and return any selected answer's and question's id. Question viewer will contain components for displaying different types of questions.
                ) : (
                        <div className="pt-3">
                            <div>
                                By click the button below, you have agreed to the school's term and condition in undertaking an assessment.
                                Any cheating will be dealt with seriously.
                            </div>
                            <Button
                                className="mt-3"
                                color="success"
                                onClick={() => {
                                    this.props.dispatch({ type: "ASSESSMENT_MODE/START", payload: { duration: quiz.duration } });
                                    this.startTimer();
                                }}
                            >Start Quiz</Button>
                        </div>
                    )
                }
            </>
        );
    }
}

export default connect(
    ({ assessmentState }) => ({
        assessmentState
    })
)(StartQuiz);