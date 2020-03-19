import React, { memo } from 'react'
import { NodeProps } from '../src/types'

const Node = (props: NodeProps) => {
  const { label, color, outerSize } = props

  return (
    <g>
      <foreignObject
        width={200}
        height={50}
        x={-200 / 2}
        y={(-outerSize - 100) / 2}
      >
        <div>{label}</div>
      </foreignObject>
      <foreignObject
        x={-outerSize / 2}
        y={-outerSize / 2}
        width={outerSize}
        height={outerSize}
      >
        <div
          style={{
            width: outerSize,
            height: outerSize,
            backgroundColor: color || 'grey',
          }}
        />
      </foreignObject>
    </g>
  )
}

export default memo(Node)
