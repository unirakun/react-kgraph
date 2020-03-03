import { ChartNode, SimplifiedLayout } from '../types';
declare const useHoverNode: (layout: SimplifiedLayout, { getMarkerColors }: {
    getMarkerColors: () => void;
}) => [ChartNode | undefined, ChartNode[], (nodeId: string | number) => void, () => void];
export default useHoverNode;
