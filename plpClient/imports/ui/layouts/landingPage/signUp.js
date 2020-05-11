import React, { Component } from 'react';
import { Card, FormGroup, Row, Col, Button, Label } from 'reactstrap';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import { ValidatorForm } from 'react-form-validator-core';
import TextValidator from '/imports/ui/components/validators/text';
import SelectValidator from '/imports/ui/components/validators/select';
import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import { getTutorialGroupOptions } from '/imports/util';
import Page from './page';

import './landingPage.scss';

ValidatorForm.addValidationRule('isPassword', (password) => {
    if (!password) {
        return true;
    }
    else {
        return /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{6,}$/.test(password);
    }
});
class SignUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            form: {
                username: '',
                password: '',
                tutorialGroupId: '',
            },
            tutorialGroupOptions: [],
            isSigningUp: false
        }
    }

    componentDidMount() {
        getTutorialGroupOptions((tutorialGroupOptions) => {
            this.setState({ tutorialGroupOptions });
        });
    }

    handleSignUp = () => {
        const { username, password, tutorialGroupId } = this.state.form;
        const profile = { tutorialGroupId: new Mongo.ObjectID(tutorialGroupId) };
        // const profile = {}
        let errorMsg = null;
        console.log(profile);
        if (username && password) {
            this.setState({ isSigningUp: true });
            Accounts.createUser({ username, password, profile }, (error) => {
                this.setState({ isSigningUp: false });
                console.log(error);
                if (!error) {
                    this.props.dispatch({ type: 'USER/SET', payload: { user: Meteor.user() } });
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
                        <ValidatorForm
                            id="signup-form"
                            instantValidate={false}
                            onSubmit={() => {
                                this.handleSignUp();
                            }}
                        >
                            <FormGroup>
                                <Label className="font-sm">Username</Label>
                                <TextValidator
                                    className="form-control"
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
                                    validators={['required']}
                                    errorMessages={['Username is required']}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label className="font-sm">Password</Label>
                                <TextValidator
                                    className="form-control"
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
                                    validators={['required']}
                                    errorMessages={['Password is required']}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label className="font-sm">Tutorial Group</Label>
                                <SelectValidator
                                    placeholder="Tutorial group"
                                    validators={['required']}
                                    value={_.find(this.state.tutorialGroupOptions, { value: form.tutorialGroupId })}
                                    onChange={(e) => {
                                        this.setState({
                                            form: {
                                                ...form,
                                                tutorialGroupId: e.value
                                            }
                                        })
                                    }}
                                    options={this.state.tutorialGroupOptions}
                                    errorMessages={['Tutorial group is required']}
                                />
                            </FormGroup>
                        </ValidatorForm>
                        <div className="d-flex justify-content-center mt-4">
                            <Button color="primary" type="submit" form="signup-form" style={{ width: 100 }} onClick={this.handleSignUp}>Sign up</Button>
                        </div>
                    </Card>
                </div>
            </Page>
        );
    }
}

export default connect()(SignUp);