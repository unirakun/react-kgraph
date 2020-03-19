/// <reference types="react" />
declare type PathTypes = {
    id: number | string;
    d: string;
    strokeWidth: number;
    stroke: string;
    markerEnd?: string;
};
declare const Path: (props: PathTypes) => JSX.Element;
export default Path;
