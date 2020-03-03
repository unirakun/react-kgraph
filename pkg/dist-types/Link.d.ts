import React from 'react';
interface LinkProps {
    onClick: any;
    Component: any;
    id: string | number;
    d: string;
    quadraticPoint: any;
    sweep: number;
    length: number;
    label?: string;
    size: number;
    hover: boolean;
    source: {
        x: number;
        y: number;
        label: string;
    };
    target: {
        x: number;
        y: number;
        label: string;
    };
}
declare const _default: React.MemoExoticComponent<({ onClick, ...props }: LinkProps) => JSX.Element>;
export default _default;
