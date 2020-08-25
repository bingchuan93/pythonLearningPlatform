import React, { Component } from 'react';
import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import { Button, Badge } from 'reactstrap';
import QuestionViewer from '/imports/ui/components/questionViewer';
import LoadingButton from '/imports/ui/components/loadingButton';
import ActivityIndicator from '/imports/ui/components/icons/activityIndicator';

class StartQuiz extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isQuizFetching: true,
            quiz: null,
            seconds: 0
        }
    }

    componentDidMount() {
        if (this.props.match.params.id) {
            this.getQuiz(this.props.match.params.id);
        } else {
            this.setState({ isQuizFetching: false });
        }
        if (this.props.userState.endTime) {
            this.startTimer();
        }
    }

    getQuiz = (id) => {
        this.setState({ isQuizFetching: true });
        Meteor.call('Assessment.getQuizById', id, (error, result) => {
            if (!error) {
                this.setState({ quiz: result, isQuizFetching: false });
            } else {
                this.setState({ isQuizFetching: false });
                this.props.dispatch(push('/'));
            }
        });
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    startTimer = () => {
        this.timer = setInterval(() => {
            const timeLeft = (new Date(this.props.userState.endTime).getTime() - new Date().getTime()) / 1000;
            if (timeLeft < 0) {
                this.endQuiz();
            }
            this.setState({
                seconds: timeLeft
            });
        }, 1000);
    }

    endQuiz = () => {
        clearInterval(this.timer);
        this.setState({ seconds: 0 });
        this.props.dispatch({ type: "ASSESSMENT_MODE/EXIT" });
        alert('exam ended');
    }

    render() {
        const { quiz } = this.state;
        
        return (
            <>
                {this.props.userState.endTime ? (
                    <div>
                        <div className="d-flex justify-content-end align-items-center">
                            <Badge className="font-md" color="danger" style={{ minWidth: 100 }}>{Math.floor(this.state.seconds / 3600).toString().padStart(2, "0")}:{Math.floor((this.state.seconds % 3600) / 60).toString().padStart(2, "0")}:{Math.floor(this.state.seconds % 60).toString().padStart(2, "0")}</Badge>
                            <Button className="ml-3" size="sm" onClick={this.endQuiz}>End Quiz</Button>
                        </div>
                        {this.state.isQuizFetching ? (
                            <div className="text-center">
                                <ActivityIndicator />
                            </div>
                        ) : (
                                <QuestionViewer assessment={quiz} />
                            )}
                    </div>
                ) : (
                        <div className="pt-3">
                            <div>
                                By click the button below, you have agreed to the school's term and condition in undertaking an assessment.
                                Any cheating will be dealt with seriously.
                            </div>
                            <LoadingButton
                                className="mt-3"
                                color="success"
                                isLoading={this.state.isQuizFetching}
                                onClick={() => {
                                    this.props.dispatch({ type: "ASSESSMENT_MODE/START", payload: { duration: quiz.duration, quizId: quiz._id.valueOf() } });
                                    this.startTimer();
                                }}
                            >Start Quiz</LoadingButton>
                        </div>
                    )
                }
            </>
        );
    }
}

export default connect(
    ({ userState }) => ({
        userState
    })
)(StartQuiz);