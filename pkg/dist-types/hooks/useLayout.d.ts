import { SimplifiedLayout, ChartNode, WithCoords } from "../types";
import { Link } from "./layoutEngines/index";
declare const useLayout: (nodes: ChartNode[], links: Link[], { width, height, size, type }: {
    width: number;
    height: number;
    size: number;
    type: "graph" | "tree";
}) => [SimplifiedLayout, {
    restart: () => void;
    dragStart: (node: ChartNode) => void;
    drag: (node: ChartNode, newPos: WithCoords) => void;
    dragEnd: (node: ChartNode) => void;
}];
export default useLayout;
