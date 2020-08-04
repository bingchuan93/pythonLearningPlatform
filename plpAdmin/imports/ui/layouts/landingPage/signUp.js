import React, { Component } from 'react';
import { Card, Form, FormGroup, FormText, Input, Button, Label } from 'reactstrap';
import { Link } from 'react-router-dom';
import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import Page from './page';

class SignUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            form: {
                username: '',
                password: '',
                tutorialGroup: '',
            },
            isSigningUp: false
        }
    }

    handleSignUp = () => {
        const { username, password, tutorialGroup } = this.state.form;
        const profile = { tutorialGroup };
        let errorMsg = null;

        if (username && password) {
            this.setState({ isSigningUp: true });
            Accounts.createUser({ username, password, profile }, (error) => {
                this.setState({ isSigningUp: false });
                if (!error) {
                    this.props.dispatch({ type: 'USER/SET', payload: { user: Meteor.user() }});
                    this.props.dispatch(push('/')); // bc: Redirect immediately or requeste for sign in again?
                }
                else {

                }
            })
        }
        else {
            errorMsg = 'Please enter your preferred username and password';
        }

        if (errorMsg) {

        }
    }

    render() {
        const { form } = this.state;
        return (
            <Page
                title='Sign up with us!'
                headerContents={
                    <Button className="m-3" color="primary" size="sm" onClick={() => this.props.dispatch(push('/'))}>Home</Button>
                }
            >
                <div className="sign-up">
                    <Card body>
                        <Form>
                            <FormGroup>
                                <Label className="font-sm">Username</Label>
                                <Input
                                    type="text"
                                    name="username"
                                    value={form.username}
                                    onChange={(e) => {
                                        this.setState({
                                            form: {
                                                ...form,
                                                username: e.target.value.trim()
                                            }
                                        })
                                    }}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label className="font-sm">Password</Label>
                                <Input
                                    type="password"
                                    name="password"
                                    value={form.password}
                                    onChange={(e) => {
                                        this.setState({
                                            form: {
                                                ...form,
                                                password: e.target.value
                                            }
                                        })
                                    }}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label className="font-sm">Tutorial Group</Label>
                                <Input
                                    type="text"
                                    name="group"
                                    value={form.tutorialGroup}
                                    onChange={(e) => {
                                        this.setState({
                                            form: {
                                                ...form,
                                                tutorialGroup: e.target.value.trim()
                                            }
                                        })
                                    }}
                                />
                            </FormGroup>
                            <div className="d-flex justify-content-center mt-4">
                                <Button color="primary" style={{ width: 100 }} onClick={this.handleSignUp}>Sign up</Button>
                            </div>
                        </Form>
                    </Card>
                </div>
            </Page>
        );
    }
}

export default connect()(SignUp);