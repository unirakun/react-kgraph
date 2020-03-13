import React, { memo, useState, useLayoutEffect } from 'react'
// TODO: should use zoom
const TRESHOLD = 0.1

type PropTypes = {
  label: string
  x: number
  y: number
  sweep: number
  width: number
  height: number
}
const Label = (props: PropTypes) => {
  const { label, x, y, sweep, width, height } = props

  const [position, setPosition] = useState({ x, y })

  useLayoutEffect(() => {
    if (sweep > 0) {
      setPosition({
        x: x - width / 2,
        y: y - height / 2,
      })
    }
    setPosition({
      x: x - width / 2,
      y,
    })
  }, [x, y, sweep, width, height])

  return (
    <foreignObject {...position} width={width} height={height}>
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
