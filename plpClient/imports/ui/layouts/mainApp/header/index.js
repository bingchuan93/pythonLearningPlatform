import React, { Component } from 'react';
import { Nav, Dropdown, DropdownItem, DropdownToggle, DropdownMenu } from 'reactstrap';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
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
                <div className="header">
                    <div className="side-menu-toggle d-flex flex-column justify-content-center align-items-center clickable" onClick={() => this.props.dispatch({ type: 'SIDE_MENU/SET', payload: { isSideMenuOpen: !this.props.appState.isSideMenuOpen }})}>
                        <span className="font-weight-bold">☰</span>
                    </div>
                    <div className="header-logo d-flex justify-content-center clickable" onClick={() => this.props.dispatch(push('/main'))}>
                        <div>
                            <img className="logo mr-1" src="/img/logo.png" />
                        </div>
                        <span className="align-self-center" >{config.appName}</span>
                    </div>
                    <Nav className="header-menu d-flex flex-column justify-content-center mr-2">
                        <Dropdown nav isOpen={this.state.isDropDownOpen} toggle={() => this.setState({ isDropDownOpen: !this.state.isDropDownOpen })}>
                            <DropdownToggle nav caret>Account</DropdownToggle>
                            <DropdownMenu>
                                <DropdownItem header>Hi, {Meteor.user().username}</DropdownItem>
                                <DropdownItem divider />
                                <DropdownItem onClick={() => this.props.dispatch({ type: 'USER/RESET' })} >Sign out</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </Nav>
                </div>
            </React.Fragment>
        );
    }
}

export default connect(
    ({ appState }) => ({
        appState
    })
)(Header);