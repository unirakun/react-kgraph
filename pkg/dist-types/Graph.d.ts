import React, { CSSProperties } from 'react';
import { LinkProps, NodeProps } from './types';
interface GraphNode {
    id: string;
    group?: string;
    label?: string;
    color?: string;
    Component?: React.Component<NodeProps> | React.FunctionComponent<NodeProps>;
    [key: string]: any;
}
export interface GraphLink {
    source: number;
    target: number;
    label?: string;
    Component?: React.Component<LinkProps> | React.FunctionComponent<LinkProps>;
}
interface TreeNode extends GraphNode {
    children: GraphNode[];
}
interface GraphProps {
    style?: CSSProperties;
    className?: string;
    noZoom?: boolean;
    noViewportMove?: boolean;
    noDrag?: boolean;
    onNodeClick?: (node: any) => void;
    onLinkClick?: (link: any) => void;
}
interface TreeGraphProps extends GraphProps {
    nodes: TreeNode[];
    type: 'tree';
}
interface GraphGraphProps extends GraphProps {
    nodes: GraphNode[];
    links?: GraphLink[];
    type: 'graph';
}
declare const Graph: (props: TreeGraphProps | GraphGraphProps) => JSX.Element | null;
export default Graph;
