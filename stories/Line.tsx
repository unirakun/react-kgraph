import React from 'react'
import { LinkProps } from '../src/types'

const Line = (props: LinkProps) => {
  const { id, label, source, target, hover, quadraticPoint, size } = props

  return (
    <g>
      <line
        id={`${id}`}
        x1={source.x * size}
        y1={source.y * size}
        x2={target.x * size}
        y2={target.y * size}
        strokeWidth={hover ? 5 : 1}
        stroke={source.color}
      />
      <foreignObject {...quadraticPoint} width={50} height={100}>
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
