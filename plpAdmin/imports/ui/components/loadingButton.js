import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button } from 'reactstrap';
import Loader from '/imports/ui/components/icons/loader';

class LoadingButton extends Component {
    constructor(props) {
        super(props);
        this.buttonContentRef = React.createRef();
    }

    autoUpdateWidth = () => {
        this.buttonContentRef.current.style.width = 'auto';
        if (!this.props.appState.isMobile) {
            this.buttonContentRef.current.style.width = Math.ceil(this.buttonContentRef.current.getBoundingClientRect().width) + 'px';
        }
    }

    componentDidMount() {
        this.autoUpdateWidth();
    }

    componentDidUpdate(prevProps) {
        this.autoUpdateWidth();
    }

    render() {
        const { children, isLoading, appState, dispatch, ...restProps } = this.props;
        return (
            <Button {...restProps} disabled={isLoading}>
                <div ref={this.buttonContentRef} style={{ minWidth: '50px', display: 'inline-flex', justifyContent: 'center', alignItems: 'center' }}>
                    {isLoading ? (
                        <Loader height={10} fill={this.props.fill} />
                    ) : (
                            children
                        )}
                </div>
            </Button>
        );
    }
}

LoadingButton.defaultProps = {
    isLoading: false,
    fill: '#fff'
}

export default connect(
    ({ appState }) => ({
        appState
    })
)(LoadingButton);