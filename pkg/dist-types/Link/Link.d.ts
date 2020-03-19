import React from 'react';
import { LinkProps } from '../types';
declare const Link: (props: LinkProps & {
    Component?: React.FunctionComponent<LinkProps> | undefined;
    onClick: (link: string | number) => void;
}) => JSX.Element;
export default Link;
