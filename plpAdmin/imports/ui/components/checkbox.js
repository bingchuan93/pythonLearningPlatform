import React, { Component } from 'react';

export default class CheckBox extends Component {
    render() {
        const { id, title, label, value, onChange, checked, disabled } = this.props;

        return (
            <label className={disabled ? "checkbox-input disabled" : "checkbox-input"} title={title}>
                <input id={id} type="checkbox" value={value} onChange={onChange} checked={checked} disabled={disabled} />
                <span>{label}</span>
            </label>
        );
    }
}