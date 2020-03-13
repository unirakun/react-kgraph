import React, { memo } from 'react'
import Path from './Path'
import Label from './Label'
import { ChartNode, WithCoords } from '../../types'

interface PropTypes {
  id: string | number
  d: string
  label?: string
  labelPosition: WithCoords
  sweep: number
  hover: boolean
  source: ChartNode
  target: ChartNode
  onClick: any // TODO: Types
}

const DefaultLink = (props: PropTypes) => {
  const {
    id,
    d,
    label,
    labelPosition,
    sweep,
    source,
    target,
    hover,
    onClick,
  } = props

  return (
    <g onClick={onClick}>
      <Path
        id={id}
        d={d}
        strokeWidth={5}
        stroke="#d1d1d1"
        markerEnd="url(#arrow-#d1d1d1)"
      />
      {hover && (
        <Path
          id={id}
          d={d}
          strokeWidth={20}
          stroke="rgba(249, 121, 117, 0.5)"
        />
      )}
      {hover && (
        <Label
          {...labelPosition}
          sweep={sweep}
          width={250} // TODO: use zoom
          height={100}
          label={label || `${source.label} -> ${target.label}`}
        />
      )}
    </g>
  )
}

export default memo(
  DefaultLink,
  (prevProps: PropTypes, nextProps: PropTypes): boolean =>
    !Object.entries(prevProps).some(([key, value]) => {
      return (
        // @ts-ignore TODO:
        ['id', 'hover', 'd', 'label'].includes(key) && nextProps[key] !== value
      )
    }),
)
