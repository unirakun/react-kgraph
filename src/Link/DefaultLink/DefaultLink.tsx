import React, { memo } from 'react'
import Path from './Path'
import Label from './Label'
import { LinkProps } from '../../types'

const DefaultLink = (props: LinkProps) => {
  const { id, d, label, quadraticPoint, sweep, source, target, hover } = props

  return (
    <>
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
          {...quadraticPoint}
          sweep={sweep}
          width={250} // TODO: use zoom
          height={100}
          label={label || `${source.label} -> ${target.label}`}
        />
      )}
    </>
  )
}

const PROPS_TO_ALWAYS_COMPARE = ['id', 'hover']

const propsAreEqual = (prevProps: LinkProps, nextProps: LinkProps): boolean => {
  return !Object.entries(prevProps).some(([key, value]) => {
    if (PROPS_TO_ALWAYS_COMPARE.includes(key)) {
      // @ts-ignore TODO:
      const nextValue = nextProps[key]
      const hasChanged = nextValue !== value
      return hasChanged
    }

    if (key === 'target' || key === 'source') {
      const nextValue = nextProps[key]
      // TODO: should use zoom
      const treshold = 0.1

      // there is a difference if we pass the treshold
      if (
        Math.abs(nextValue.x - value.x) > treshold ||
        Math.abs(nextValue.y - value.y) > treshold
      ) {
        return true
      }
    }

    // means this is equal (we have NOT found a difference)
    return false
  })
}

export default memo(DefaultLink, propsAreEqual)
