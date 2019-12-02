import React, { Component } from 'react';
import { Button, Nav, Dropdown, DropdownItem, DropdownToggle, DropdownMenu } from 'reactstrap';
import { connect } from 'react-redux';
import config from '/imports/config';

class Header extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isDropDownOpen: false,
        }
    }
    render() {
        return (
            <React.Fragment>
                <div className="header d-flex justify-content-center align-content-center">
                    <div>
                        <img className="logo mr-1" src="/img/logo.png" />
                    </div>
                    <span className="align-self-center" >{config.appName}</span>
                </div>
                <Nav className="header-menu d-flex justify-content-center">
                    <Dropdown nav isOpen={this.state.isDropDownOpen} toggle={() => this.setState({ isDropDownOpen: !this.state.isDropDownOpen })}>
                        <DropdownToggle nav caret>Account</DropdownToggle>
                        <DropdownMenu>
                            <DropdownItem header>Hi, {Meteor.user().username}</DropdownItem>
                            <DropdownItem divider />
                            <DropdownItem onClick={() => this.props.dispatch({ type: 'USER/RESET' })} >Sign out</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </Nav>
            </React.Fragment>
        );
    }
}

export default connect(
    ({ userState }) => ({
        userState
    })
)(Header);