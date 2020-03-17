export type WithCoords = { x: number; y: number }

export interface ChartNode extends WithCoords {
  id: any
  [key: string]: any
}

export interface TreeNode extends ChartNode {
  [key: string]: any
  children?: TreeNode[]
}

export interface SimplifiedLayout {
  nodes: (ChartNode | TreeNode)[]
  links: any[]
}

export interface LinkProps {
  id: string | number
  d: string
  quadraticPoint: WithCoords
  sweep: number
  length: number
  label?: string
  size: number
  hover: boolean
  source: ChartNode
  target: ChartNode
}
