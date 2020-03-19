import React, { memo } from 'react'
import { NodeProps } from '../src/types'

const SquareNode = (props: NodeProps) => {
  const { label, color, size } = props

  const innerSize = size * 3

  return (
    <g>
      <foreignObject
        width={200}
        height={50}
        x={-200 / 2}
        y={(-innerSize - 100) / 2}
      >
        <div>{label}</div>
      </foreignObject>
      <foreignObject
        x={-innerSize / 2}
        y={-innerSize / 2}
        width={innerSize}
        height={innerSize}
      >
        <div
          style={{
            width: innerSize,
            height: innerSize,
            backgroundColor: color || 'grey',
          }}
        />
      </foreignObject>
    </g>
  )
}

export default memo(SquareNode)
