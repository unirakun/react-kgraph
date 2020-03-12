import React, { memo } from 'react'
// TODO: should use zoom
const TRESHOLD = 0.1

type PropTypes = {
  label: string
  x: number
  y: number
  width: number | string
  height: number | string
}
const Label = (props: PropTypes) => {
  const { label, x, y, width, height } = props
  // console.count(`path - ${label}`)
  return (
    <foreignObject x={x} y={y} width={width} height={height}>
      <div
        style={{
          borderRadius: '5px',
          backgroundColor: 'rgba(100, 100, 100, 0.2)',
          textAlign: 'center',
          padding: '1em',
          border: '1px solid rgba(50, 50, 50, 0.2)',
        }}
      >
        {label}
      </div>
    </foreignObject>
  )
}

export default memo(
  Label,
  (prevProps: PropTypes, nextProps: PropTypes): boolean => {
    // there is a difference if we pass the treshold
    return (
      Math.abs(nextProps.x - prevProps.x) < TRESHOLD ||
      Math.abs(nextProps.y - prevProps.y) < TRESHOLD
    )
  },
)
