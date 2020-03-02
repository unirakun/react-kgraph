export type WithCoords = { x: number; y: number };
export interface ChartNode extends WithCoords {
  [key: string]: any;
}

export interface TreeNode extends WithCoords {
  [key: string]: any;
  children?: TreeNode[];
}

export interface SimplifiedLayout {
  nodes: (ChartNode | TreeNode)[];
  links: any[];
}