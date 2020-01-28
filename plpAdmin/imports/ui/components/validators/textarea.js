import React from 'react';
import { ValidatorComponent } from 'react-form-validator-core';

class TextAreaValidator extends ValidatorComponent {
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

    render() {
        const { errorMessages, validators, requiredError, validatorListener, style, ...rest } = this.props;

        return (
            <>
                <textarea
                    {...rest}
                    style={{resize: "none"}}
                    ref={(r) => { this.input = r; }}
                />
                {this.errorText()}
            </>
        );
    }

}

export default TextAreaValidator;