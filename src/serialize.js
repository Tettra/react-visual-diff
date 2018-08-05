// @flow
/* eslint-disable no-use-before-define */

import React from 'react'
import toPlainObject from 'lodash/toPlainObject'

type SerializedElement = {
  type: string,
  props: {
    [string]: number | string,
    children: SerializedChildren,
  }
}

type SerializedChild = number | string | SerializedElement

type SerializedChildren = Array<SerializedChild> | SerializedChild

export const serializeChild = (child: React.Node): SerializedChild => {
  const nodeType = child['$$typeof']

  if (nodeType && nodeType.toString() === 'Symbol(react.element)') {
    return serializeElement(child)
  } else {
    return child
  }
}

export const serializeChildren = (children: React.Children): SerializedChildren => {
  if (Array.isArray(children)) {
    return children.map(serializeChild)
  } else {
    return serializeChild(children)
  }
}

export const serializeElement = (element: React.Element): SerializedElement => {
  const { props: { children, ...restProps }, type } = element
  return {
    type,
    props: {
      ...toPlainObject(restProps),
      children: serializeChildren(children)
    }
  }
}

export const renderChild = (child: SerializedChild): React.Node => {
  if (child.type != null && child.props != null) {
    return renderElement(child)
  } else {
    return child
  }
}

export const renderChildren = (children: SerializedChildren): React.Children => {
  if (Array.isArray(children)) {
    return children.map(renderChild)
  } else {
    return renderChild(children)
  }
}

export const renderElement = (serializedElement: SerializedElement): React.Element => {
  const { type, props: { children, ...restProps } } = serializedElement

  return React.createElement(
    type,
    {
      ...restProps,
      children: renderChildren(children)
    }
  )
}
