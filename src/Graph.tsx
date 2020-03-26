/* eslint-disable jsx-a11y/anchor-is-valid */
// we disable this a11y rule because it thinks that our Link element is a <a>
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  CSSProperties,
} from 'react'
import makeCurvedLinks from './makeCurvedLinks'
import Node from './Node'
import Link from './Link/Link'
import { useHoverNodes, useCenterAndZoom, useLayout } from './hooks/index'
import { LinkProps, NodeProps } from './types'

function svgPoint(element: SVGSVGElement | null, x: number, y: number) {
  if (!element) return { x, y }

  const pt = element.createSVGPoint()

  pt.x = x
  pt.y = y

  const screenCTM = element.getScreenCTM()
  if (screenCTM) {
    return pt.matrixTransform(screenCTM.inverse())
  }

  return {
    x,
    y,
  }
}

const height = 500
const width = 800
const padding = 20
const size = 35

interface GraphNode {
  id: string
  group?: string
  label?: string
  color?: string
  Component?: React.Component<NodeProps> | React.FunctionComponent<NodeProps>
  [key: string]: any
}

export interface GraphLink {
  source: number
  target: number
  label?: string
  Component?: React.Component<LinkProps> | React.FunctionComponent<LinkProps>
}

interface TreeNode extends GraphNode {
  children: GraphNode[]
}

interface GraphProps {
  style?: CSSProperties
  className?: string
  noZoom?: boolean
  noViewportMove?: boolean
  noDrag?: boolean
  onNodeClick?: (node: any) => void
  onLinkClick?: (link: any) => void
}

interface TreeGraphProps extends GraphProps {
  nodes: TreeNode[]
  type: 'tree'
}

interface GraphGraphProps extends GraphProps {
  nodes: GraphNode[]
  links?: GraphLink[]
  type: 'graph'
}

const Graph = (props: TreeGraphProps | GraphGraphProps) => {
  const {
    style,
    className,
    nodes,
    links,
    type = 'graph',
    onNodeClick,
    onLinkClick,
    noZoom,
    noViewportMove,
    noDrag,
  } = props as GraphGraphProps
  const svgRef = useRef<SVGSVGElement>(null)

  const [layout, { drag, dragStart, dragEnd, restart }] = useLayout(
    nodes as any[],
    links as any[],
    {
      width,
      height,
      size,
      type,
    },
  )

  const [
    zoom,
    offsets,
    centerAndZoom,
    onWheel,
    onMouseMove,
    onMouseDown,
    onMouseUp,
    blockCenterAndZoom,
  ] = useCenterAndZoom(layout, { size, padding, width, height })

  const [lineMarkerColors, setLineMarkerColors] = useState<string[]>(['#999'])
  const getMarkerColors = useCallback(() => {
    if (!svgRef.current) return

    // get all path child from svg
    // to find stroke color and set new colors array
    // @ts-ignore
    const paths = [...svgRef.current.getElementsByTagName('path')]
    const colors = new Set(paths.map((path) => path.getAttribute('stroke')))
    // @ts-ignore
    setLineMarkerColors([...colors.values()].filter(Boolean))
  }, [])
  useEffect(getMarkerColors, [layout, getMarkerColors])

  // TODO: move this to the layout engine?
  const findNode = useCallback(
    (nodeId) => layout.nodes.find((n) => n.id === nodeId),
    [layout.nodes],
  )
  const findLink = useCallback((linkIndex) => layout.links[linkIndex], [
    layout.links,
  ])

  const onDrag = useCallback(
    (nodeId, e: React.MouseEvent) => {
      const node = findNode(nodeId)
      if (!node) return

      const newPos = svgPoint(svgRef.current, e.clientX, e.clientY)
      node.x = newPos.x / size
      node.y = newPos.y / size
      drag(node, { x: newPos.x / size, y: newPos.y / size })
    },
    [findNode, drag],
  )

  const onStart = useCallback(
    (nodeId) => {
      const node = findNode(nodeId)
      if (!node) return

      dragStart(node)
      blockCenterAndZoom(true)
    },
    [findNode, dragStart, blockCenterAndZoom],
  )

  const onEnd = useCallback(
    (nodeId) => {
      const node = findNode(nodeId)
      if (!node) return

      dragEnd(node)

      blockCenterAndZoom(false)
      centerAndZoom(layout.nodes)
    },
    [centerAndZoom, blockCenterAndZoom, layout.nodes, dragEnd, findNode],
  )

  const [
    hoverNode,
    hiddenNodes,
    onOverNode,
    onLeaveNode,
  ] = useHoverNodes(layout, { getMarkerColors })

  const innerOnNodeClick = useCallback(
    (id) => {
      if (!onNodeClick) return undefined
      const node = findNode(id)
      return onNodeClick(node)
    },
    [onNodeClick, findNode],
  )

  const innerOnLinkClick = useCallback(
    (index) => {
      if (!onLinkClick) return undefined
      return onLinkClick(findLink(index))
    },
    [onLinkClick, findLink],
  )

  if (layout.nodes.length === 0) return null

  return (
    <>
      <button // TODO: move it in parent code ?
        onClick={restart}
        type="button"
      >
        Relayout
      </button>
      <svg
        className={className}
        style={style}
        ref={svgRef}
        width={width}
        height={height}
        viewBox={`${offsets.x} ${offsets.y} ${width * zoom} ${height * zoom}`}
        onWheel={noZoom ? undefined : onWheel}
        onMouseMove={noViewportMove ? undefined : onMouseMove}
        onMouseDown={noViewportMove ? undefined : onMouseDown}
        onMouseUp={noViewportMove ? undefined : onMouseUp}
        xmlns="http://www.w3.org/2000/svg"
      >
        {lineMarkerColors.map((color) => (
          <marker
            id={`arrow-${color}`}
            key={`arrow-${color}`}
            viewBox="0 0 10 10"
            refX={size / 2 + 11} // FIXME: find a function to process this number
            refY="2.5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 5 2.5 L 0 5 z" fill={color} />
          </marker>
        ))}

        <g stroke="#999">
          {makeCurvedLinks(layout.links, { size }).map((link: any, index) => {
            const { source, target } = link

            return (
              <Link
                // eslint-disable-next-line react/no-array-index-key
                key={index}
                id={index}
                {...link}
                size={size}
                onClick={innerOnLinkClick}
                hover={hoverNode === source.id || hoverNode === target.id}
              />
            )
          })}
        </g>
        <g stroke="#fff" strokeWidth={1}>
          {layout.nodes.map((node) => {
            const { id, group, x, y, label, Component, color } = node

            return (
              <g key={id} transform={`translate(${x * size} ${y * size})`}>
                <Node
                  key={id}
                  id={id}
                  group={group}
                  label={label}
                  color={color}
                  Component={Component}
                  size={size}
                  hover={hoverNode === id}
                  hidden={hoverNode !== id && hiddenNodes.includes(id)}
                  onClick={innerOnNodeClick}
                  onMouseEnter={onOverNode}
                  onMouseLeave={onLeaveNode}
                  onDrag={noDrag ? undefined : onDrag}
                  onStart={noDrag ? undefined : onStart}
                  onEnd={noDrag ? undefined : onEnd}
                />
              </g>
            )
          })}
        </g>
      </svg>
    </>
  )
}

export default Graph
