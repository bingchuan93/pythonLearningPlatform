import React, { Component } from 'react';
import { Card, Form, FormGroup, FormText, Input, Button, Label } from 'reactstrap';
import { Link } from 'react-router-dom';
import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import Page from './page';

import './landingPage.scss';

class SignUp extends Component {
    render() {
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
                                <Input type="text" name="username" />
                            </FormGroup>
                            <FormGroup>
                                <Label className="font-sm">Password</Label>
                                <Input type="password" name="password" />
                            </FormGroup>
                            <FormGroup>
                                <Label className="font-sm">Group</Label>
                                <Input type="text" name="group" />
                            </FormGroup>
                            <div className="d-flex justify-content-center mt-4">
                                <Button color="primary" style={{ width: 100 }}>Sign up</Button>
                            </div>
                        </Form>
                    </Card>
                </div>
            </Page>
        );
    }
}

export default connect()(SignUp);