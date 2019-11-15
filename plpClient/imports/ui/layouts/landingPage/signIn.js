import React, { Component } from 'react';
import { Card, Form, FormGroup, FormText, Input, Button, Label } from 'reactstrap';
import { Link } from 'react-router-dom';
import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import Page from './page';

import './landingPage.scss';

class SignIn extends Component {
    render() {
        return (
            <Page
                title='Welcome to Python Learning Platform'
                headerContents={
                    <Button className="m-3" color="secondary" size="sm" onClick={() => this.props.dispatch(push('/sign-up'))}>Sign up!</Button>
                }
            >
                <div>
                    <Card body>
                        <Form>
                            <FormGroup>
                                <Label className="font-sm">Username</Label>
                                <Input type="text" name="username" placeholder="" />
                            </FormGroup>
                            <FormGroup>
                                <Label className="font-sm">Password</Label>
                                <Input type="password" name="password" placeholder="" />
                            </FormGroup>
                            <FormText className="mt-4 mb-2 text-center">
                                <Link to='/'>Forgot password?</Link>
                            </FormText>
                            <div className="d-flex justify-content-center">
                                <Button color="primary" style={{ width: 100 }}>Log in</Button>
                            </div>
                        </Form>
                    </Card>
                </div>
            </Page>
        )
    }
}

export default connect()(SignIn);