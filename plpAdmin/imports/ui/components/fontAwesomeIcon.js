import React from 'react';

const FontAwesomeIcon = ({ name, type = "fas", size, style = {}, className }) => {
    const classes = [type, 'fa-' + name];
    if (size) {
        classes.push('fa-' + size);
    }
    if (className) {
        classes.push(className);
    }
    return <span aria-hidden="true" style={style} className={classes.join(' ').trim()}></span>
}

export default FontAwesomeIcon;