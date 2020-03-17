import React from 'react'

type PropTypes = {
  id: number | string
  d: string
  strokeWidth: number
  stroke: string
  markerEnd?: string
}

const Path = (props: PropTypes) => {
  const { id, d, strokeWidth, stroke, markerEnd } = props

  return (
    <path
      id={`${id}`}
      d={d}
      strokeWidth={strokeWidth}
      fill="transparent"
      stroke={stroke}
      markerEnd={markerEnd}
    />
  )
}

export default Path
