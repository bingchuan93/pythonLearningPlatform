import React from 'react';
import Select from 'react-select';
import { ValidatorComponent } from 'react-form-validator-core';

class SelectValidator extends ValidatorComponent {
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
        const { errorMessages, validators, requiredError, validatorListener, styles, isDisabled, ...rest } = this.props;
        let newStyles = { ...styles };

        if (isDisabled) {
            newStyles = {
                multiValueRemove: base => ({
                    ...base,
                    width: 0,
                    padding: '2px !important'
                }),
                ...styles
            }
        }
        
        return (
            <React.Fragment>
                <Select
                    {...rest}
                    placeholder={isDisabled ? '' : 'Select...'}
                    innerRef={(r) => { this.input = r; }}
                    styles={{ ...newStyles }}
                    isDisabled={isDisabled}
                />
                {this.errorText()}
            </React.Fragment>
        );
    }
}

export default SelectValidator;