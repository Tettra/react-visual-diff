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


const _renderAdded = ({children}) => <span style={{border: '1px solid green'}}>{children}</span>
const _renderRemoved = ({children}) => <span style={{border: '1px solid red'}}>{children}</span>

export default (renderAdded = _renderAdded, renderRemoved = _renderRemoved, filterProps) => {
  const serializeChild = (child: React$Node): SerializedChild => {
    if (Array.isArray(child)) {
      return serializeChildren(child)
    } else if (child != null && !Array.isArray(child) && React.isValidElement(child)) {
      return serializeElement(child)
    } else {
      return child
    }
  }

  const serializeChildren = (children: React$Node): SerializedChildren => {
    if (Array.isArray(children)) {
      return children.map(serializeChild)
    } else {
      return serializeChild(children)
    }
  }

  const serializeElement = (element: React$Element<any>): SerializedElement => {
    let el = element
    if (el != null) {
      while (el !== null && typeof el.type === 'function') {
        const newEl = new el.type(el.props)
        if (newEl.render != null) {
          el = newEl.render()
        } else {
          el = newEl
          break;
        }
      }
    }

    if (el == null) {
      return el
    }

    const { props: { children, ...restProps }, type, key } = el

    return {
      type,
      props: {
        ...restProps,
        children: serializeChildren(children),
      }
    }
  }


  const renderTextDiff = (textDiff: TextDiff): React$Node => textDiff.map(
    ({ removed, added, value }) => {
      if (removed === true) {
        return renderRemoved({children: value})
      } else if (added === true) {
        return renderAdded({children: value })
      }
      return value
    }
  )

  const renderChange = (change: Change): React$Node => {
    switch(change.kind) {
      case 'N':
        return renderAdded({children: renderChild(change.rhs) })
      case 'E':
        if (isString(change.lhs) && isString(change.rhs)) {
          return renderTextDiff(jsdiff.diffWords(change.lhs, change.rhs))
        }

        return <Fragment>
          {renderRemoved({children: renderChild(change.lhs) })}
          {renderAdded({children: renderChild(change.rhs) })}
        </Fragment>
      case 'D':
        return renderRemoved({children: renderChild(change.lhs) })
      default:
        throw new Error('change not handled')
    }
  }

  // $FlowFixMe
  const renderChild = (child: Change | SerializedChild): React$Node => {
    if (child != null && child.kind != null) {
      return renderChange(child)
    } else if (child != null && child.props != null) {
      return renderElement(child)
    } else if (Array.isArray(child)) {
      return renderChildren(child)
    } else {
      return child
    }
  }

  const renderChildren = (children: SerializedChildren): React$Node => {
    if (Array.isArray(children)) {
      return children.map((child, index) => {
        if (child != null && child.props != null) {
          // hack to ensure all elements have keys :/
          return {
            ...child,
            props: {
              ...child.props,
              key: `key-fix-${index}`
            }
          }
        }
        return child;
      }).map(renderChild)
    } else {
      return renderChild(children)
    }
  }

  const renderElement = (serializedElement: SerializedElement): React$Element<any> => {
    const { type, props: { children, ...restProps } } = serializedElement

    return React.createElement(
      type,
      {
        ...restProps,
        children: renderChildren(children)
      }
    )
  }

  return {
    renderElement,
    serializeElement
  }
}
