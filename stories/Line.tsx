import React, { memo } from 'react'
import { ChartNode, WithCoords } from '../src/types'

type PropTypes = {
  id: number | string
  d: string
  strokeWidth: number
  stroke: string
  markerEnd?: string
  source: ChartNode
  target: ChartNode
  hover: boolean
  label: string
  labelPosition: WithCoords
  onClick: any
}

const Line = (props: PropTypes) => {
  const { id, label, source, target, hover, labelPosition } = props

  return (
    <g>
      <line
        id={`${id}`}
        x1={source.x}
        y1={source.y}
        x2={target.x}
        y2={target.y}
        strokeWidth={hover ? 5 : 1}
        stroke={source.color}
      />
      <foreignObject {...labelPosition} width={50} height={100}>
        <div
          style={{
            textAlign: 'center',
            color: source.color,
            fontWeight: hover ? 'bold' : 'lighter',
          }}
        >
          {label}
        </div>
      </foreignObject>
    </g>
  )
}

export default memo(
  Line,
  (prevProps: PropTypes, nextProps: PropTypes): boolean =>
    !Object.entries(prevProps).some(([key, value]) => {
      return (
        // @ts-ignore TODO:
        ['id', 'hover', 'd', 'label'].includes(key) && nextProps[key] !== value
      )
    }),
)
