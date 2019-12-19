import React, { Component } from 'react';
import { Button } from 'reactstrap';
import { connect } from 'react-redux';


class Header extends Component {
    render() {
        return (
            <div className="header w-100 flex-fill">
                <div className="header-logo d-flex align-items-center pl-2">
                    <img src="/img/logo-dark.png" style={{ height: 40 }}/>
                    <div>Admin Panel</div>
                </div>
                <div className="header-menu d-flex align-items-center mr-2">
                    <Button color="secondary" size="sm" onClick={() => this.props.dispatch({ type: 'USER/RESET' })}>Sign out</Button>
                </div>
            </div>
        );
    }
}

export default connect()(Header);