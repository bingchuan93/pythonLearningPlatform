import React, { Component } from 'react';
import { Button } from 'reactstrap';
import { connect } from 'react-redux';

class Header extends Component {
    render() {
        return (
            <div className="header">
                <Button
                    color="secondary"
                    onClick={() => this.props.dispatch({ type: 'USER/RESET' })}
                >
                    Sign out
                </Button>
            </div>
        );
    }
}

export default connect(
    ({ userState }) => ({
        userState
    })
)(Header);