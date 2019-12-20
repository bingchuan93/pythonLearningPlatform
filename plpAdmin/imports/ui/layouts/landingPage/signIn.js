import React, { Component } from 'react';
import { Card, Form, FormGroup, FormText, Input, Button, Label } from 'reactstrap';
import { Link } from 'react-router-dom';
import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import Page from './page';

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
        console.log('signing in');
        const { username, password } = this.state;
        if (username && password) {
            this.setState({ isSigningIn: true });
            Meteor.loginWithPassword({ username }, password, (error) => {
                console.log(error);
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
                // title='Python Learning Platform Admin'
                title={
                    <div className="d-flex flex-column">
                        <img src="/img/logo.png" style={{ height: 300, marginTop: -80 }}/>
                        <h1>Admin Panel</h1>
                    </div>
                }
                // headerClass="d-flex justify-content-center"
                // headerContents={
                //     <img src="/img/logo.png" style={{ height: 125, marginTop: -10 }}/>
                // }
            >
                <div className='sign-in'>
                    <Card body>
                        <Form>
                            <FormGroup>
                                <Label className="font-sm">Username</Label>
                                <Input type="text" name="username" value={username} autoComplete="off" onKeyPress={(e) => this.handleInputEnter(e)} onChange={(e) => this.setState({ username: e.target.value })} />
                            </FormGroup>
                            <FormGroup>
                                <Label className="font-sm">Password</Label>
                                <Input type="password" name="password" value={password} autoComplete="off" onKeyPress={(e) => this.handleInputEnter(e)} onChange={(e) => this.setState({ password: e.target.value })} />
                            </FormGroup>
                            <FormText className="mt-4 mb-2 text-center">
                                <Link to='/'>Forgot password?</Link>
                            </FormText>
                            <div className="d-flex justify-content-center">
                                <Button color="secondary" style={{ width: 100 }} onClick={this.signIn} >Log in</Button>
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