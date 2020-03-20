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
interface TreeGraphProps {
    style?: CSSProperties;
    className?: string;
    nodes: TreeNode[];
    type: 'tree';
    onNodeClick?: (node: any) => void;
    onLinkClick?: (link: any) => void;
}
interface GraphGraphProps {
    style?: CSSProperties;
    className?: string;
    nodes: GraphNode[];
    links?: GraphLink[];
    type: 'graph';
    onNodeClick?: (node: any) => void;
    onLinkClick?: (link: any) => void;
}
declare const Graph: (props: TreeGraphProps | GraphGraphProps) => JSX.Element | null;
export default Graph;
