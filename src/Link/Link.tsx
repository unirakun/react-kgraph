import React, { useCallback } from 'react'
import DefaultLink from './DefaultLink'
import { LinkProps } from '../types'

const Link = (
  props: LinkProps & {
    Component?: React.FunctionComponent<LinkProps>
    onClick: (link: string | number) => void
  },
) => {
  const { Component, onClick, id, ...restProps } = props

  const innerOnClick = useCallback(() => {
    if (onClick) return onClick(id)
    return undefined
  }, [onClick, id])

  return (
    <g onClick={innerOnClick}>
      {React.createElement(Component || DefaultLink, {
        ...restProps,
        id,
      })}
    </g>
  )
}

export default Link
