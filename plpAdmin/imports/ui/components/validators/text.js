import React from 'react';
import { InputGroup, InputGroupAddon } from 'reactstrap'
import { ValidatorComponent } from 'react-form-validator-core';

class TextValidator extends ValidatorComponent {
    errorText() {
        const { isValid } = this.state;

        if (isValid) {
            return null;
        }

        return (
            <div style={{ color: 'red' }}>
                {this.getErrorMessage()}
            </div>
        );
    }

    renderInput = (restProps) => {
        return (
            <input
                {...restProps}
                ref={(r) => { this.input = r; }}
            />
        )
    }

    renderInputGroupAddOn = () => {
        return (
            <InputGroupAddon addonType={this.props.inputGroupAddOnType}>
                {this.props.inputGroupAddOnContent}
            </InputGroupAddon>
        )
    }

    render() {
        const { errorMessages, validators, requiredError, validatorListener, inputGroupAddOnType, inputGroupAddOnContent, ...rest } = this.props;

        return (
            <React.Fragment>
                {inputGroupAddOnType ? (
                    <InputGroup>
                        {inputGroupAddOnType == 'prepend' && this.renderInputGroupAddOn()}
                        {this.renderInput(rest)}
                        {inputGroupAddOnType == 'append' && this.renderInputGroupAddOn()}
                    </InputGroup>
                ) : (
                        <React.Fragment>
                            {this.renderInput(rest)}
                        </React.Fragment>
                    )}
                {this.errorText()}
            </React.Fragment>
        );
    }

}

export default TextValidator;