import React from 'react';
import lesson from './lesson';
import test from './test';
import quiz from './quiz';
import start from './start';

const icons = {
    lesson,
    test,
    quiz,
    start,
} 

const SVGIcon = (props) => {
    const Icon = icons[props.icon]
    return (
        <div style={{ width: props.width, height: props.height, marginLeft: props.marginLeft, marginRight: props.marginRight }}>
            <Icon />
        </div>
    )
}

SVGIcon.defaultProps = {
    width: '200px',
    height: '200px',
    marginLeft: '0px',
    marginRight: '0px',
}

export default SVGIcon;