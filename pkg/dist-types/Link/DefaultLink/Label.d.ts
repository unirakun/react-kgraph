/// <reference types="react" />
declare type LabelTypes = {
    label: string;
    x: number;
    y: number;
    sweep: number;
    width: number;
    height: number;
};
declare const Label: (props: LabelTypes) => JSX.Element;
export default Label;
