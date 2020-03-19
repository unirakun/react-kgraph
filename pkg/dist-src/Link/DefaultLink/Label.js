import React, { useState, useLayoutEffect } from 'react';
const Label = (props) => {
    const { label, x, y, sweep, width, height } = props;
    const [position, setPosition] = useState({ x, y });
    useLayoutEffect(() => {
        if (sweep > 0) {
            setPosition({
                x: x - width / 2,
                y: y - height / 2,
            });
        }
        setPosition({
            x: x - width / 2,
            y,
        });
    }, [x, y, sweep, width, height]);
    return (React.createElement("foreignObject", Object.assign({}, position, { width: width, height: height }),
        React.createElement("div", { style: {
                borderRadius: '5px',
                backgroundColor: 'rgba(100, 100, 100, 0.2)',
                textAlign: 'center',
                padding: '1em',
                border: '1px solid rgba(50, 50, 50, 0.2)',
            } }, label)));
};
export default Label;
