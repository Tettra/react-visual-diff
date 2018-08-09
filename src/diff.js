// @flow
/* eslint-disable no-use-before-define */

import React from 'react'
import toPlainObject from 'lodash/toPlainObject'
import isString from 'lodash/isString'
import jsdiff from 'diff'
import type {
  React$Node,
  SerializedElement,
  SerializedChild,
  Change,
  SerializedChildren,
  TextDiff,
} from './types'

const serializeChild = (child: React$Node): SerializedChild => {
  if (child != null && typeof child === 'object' && !Array.isArray(child) && React.isValidElement(child)) {
    return serializeElement(child)
  } else if (typeof child === 'number' || typeof child === 'string') {
    return child;
  } else {
    throw new Error('Child must be a react element')
  }
}

const serializeChildren = (children: React$Node): SerializedChildren => {
  if (Array.isArray(children)) {
    return children.map(serializeChild)
  } else {
    return serializeChild(children)
  }
}

export const serializeElement = (element: React$Element<any>): SerializedElement => {
  const { props: { children, ...restProps }, type } = element
  return {
    type,
    props: {
      ...toPlainObject(restProps),
      children: serializeChildren(children)
    }
  }
}

const Added = ({children}) => <span style={{border: '1px solid green'}}>{children}</span>
const Removed = ({children}) => <span style={{border: '1px solid red'}}>{children}</span>

const renderTextDiff = (textDiff: TextDiff): React$Node => textDiff.map(
  ({ removed, added, value }) => {
    if (removed === true) {
      return <Removed>{value}</Removed>
    } else if (added === true) {
      return <Added>{value}</Added>
    }
    return value
  }
)

const renderChange = (change: Change): React$Node => {
  switch(change.kind) {
    case 'N':
      return <Added>{renderChild(change.rhs)}</Added>
    case 'E':
      if (isString(change.lhs) && isString(change.rhs)) {
        return renderTextDiff(jsdiff.diffWords(change.lhs, change.rhs))
      }
      return <div>
        <Removed>{renderChild(change.lhs)}</Removed>
        <Added>{renderChild(change.rhs)}</Added>
      </div>
    case 'D':
      return <Removed>{renderChild(change.lhs)}</Removed>
    default:
      throw new Error('change not handled')
  }
}

// $FlowFixMe
const renderChild = (child: Change | SerializedChild): React$Node => {
  if (child != null && child.kind != null) {
    return renderChange(child)
  } else if (child != null && child.type != null) {
    return renderElement(child)
  } else {
    return child
  }
}

const renderChildren = (children: SerializedChildren): React$Node => {
  if (Array.isArray(children)) {
    return children.map(renderChild)
  } else {
    return renderChild(children)
  }
}

export const renderElement = (serializedElement: SerializedElement): React$Element<any> => {
  const { type, props: { children, ...restProps } } = serializedElement

  return React.createElement(
    type,
    {
      ...restProps,
      children: renderChildren(children)
    }
  )
}
