import React, { useCallback } from 'react';
import DefaultLink from './DefaultLink/DefaultLink';
const Link = (props) => {
    const { Component, onClick, id, ...restProps } = props;
    const innerOnClick = useCallback(() => {
        if (onClick)
            return onClick(id);
        return undefined;
    }, [onClick, id]);
    return (React.createElement("g", { onClick: innerOnClick }, React.createElement(Component || DefaultLink, {
        ...restProps,
        id,
    })));
};
export default Link;
