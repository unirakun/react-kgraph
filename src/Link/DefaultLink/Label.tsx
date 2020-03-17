import React, { useState, useLayoutEffect } from 'react'

type LabelTypes = {
  label: string
  x: number
  y: number
  sweep: number
  width: number
  height: number
}
const Label = (props: LabelTypes) => {
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

export default Label
