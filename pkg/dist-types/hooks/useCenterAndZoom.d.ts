/// <reference types="react" />
import { SimplifiedLayout, ChartNode } from '../types';
declare const useCenterAndZoom: (layout: SimplifiedLayout, { size, padding, width, height, }: {
    size: number;
    padding: number;
    width: number;
    height: number;
}) => [number, {
    x: number;
    y: number;
}, (nodes: ChartNode[]) => void, (e: import("react").MouseEvent<Element, MouseEvent>) => void, (e: import("react").MouseEvent<Element, MouseEvent>) => void, (e: import("react").MouseEvent<Element, MouseEvent>) => void, (e: import("react").MouseEvent<Element, MouseEvent>) => void, (block: boolean) => void];
export default useCenterAndZoom;
