import { LayoutEngine } from "./layoutEngine";
declare const createGraphLayout: ({ width, height }: {
    width: number;
    height: number;
}) => LayoutEngine;
export default createGraphLayout;
