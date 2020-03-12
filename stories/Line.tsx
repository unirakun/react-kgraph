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
  textProps: WithCoords & {
    height: string
    width: string
  }
}

const Line = (props: PropTypes) => {
  const { id, label, source, target, hover, textProps } = props
  console.count(`Line - ${id} ${hover}`)
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
      <foreignObject {...textProps}>
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

export default Line
