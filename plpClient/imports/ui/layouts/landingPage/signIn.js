import React, { Component } from 'react';
import { Card, Form, FormGroup, FormText, Input, Button, Label } from 'reactstrap';
import { Link } from 'react-router-dom';
import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import Page from './page';

import './landingPage.scss';

class SignIn extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: '',
            isSigningIn: false,
        }
    }

    handleInputEnter = (e) => {
        if (e.key === 'Enter') {
            this.signIn();
        }
    }

    signIn = () => {
        const { username, password } = this.state;
        if (username && password) {
            this.setState({ isSigningIn: true });
            Meteor.loginWithPassword({ username }, password, (error) => {
                this.setState({ isSigningIn: false });
                if (!error) {
                    this.props.dispatch({ type: 'USER/SET', payload: { user: Meteor.user() }});
                    this.props.dispatch(push('/'));
                }
                else {

                }
            })
        }
    }

    render() {
        const { username, password } = this.state;
        return (
            <Page
                title='Welcome to Python Learning Platform'
                headerContents={
                    <Button className="m-3" color="secondary" size="sm" onClick={() => this.props.dispatch(push('/sign-up'))}>Sign up!</Button>
                }
            >
                <div className='sign-in'>
                    <Card body>
                        <Form>
                            <FormGroup>
                                <Label className="font-sm">Username</Label>
                                <Input type="text" name="username" value={username} onKeyPress={(e) => this.handleInputEnter(e)} onChange={(e) => this.setState({ username: e.target.value })} />
                            </FormGroup>
                            <FormGroup>
                                <Label className="font-sm">Password</Label>
                                <Input type="password" name="password" value={password} onKeyPress={(e) => this.handleInputEnter(e)} onChange={(e) => this.setState({ password: e.target.value })} />
                            </FormGroup>
                            <FormText className="mt-4 mb-2 text-center">
                                <Link to='/'>Forgot password?</Link>
                            </FormText>
                            <div className="d-flex justify-content-center">
                                <Button color="primary" style={{ width: 100 }} onClick={this.signIn} >Log in</Button>
                            </div>
                        </Form>
                    </Card>
                </div>
            </Page>
        )
    }
}

export default connect(
    ({ userState }) => ({
        userState
    })
)(SignIn);