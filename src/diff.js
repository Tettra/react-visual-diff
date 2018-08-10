// @flow
/* eslint-disable no-use-before-define */

import React from 'react'
import isString from 'lodash/isString'
import omitBy from 'lodash/omitBy'
import isFunction from 'lodash/isFunction'
import jsdiff from 'diff'
import type {
  React$Node,
  SerializedElement,
  SerializedChild,
  Change,
  SerializedChildren,
  TextDiff
} from './types'

const _renderAdded = ({children, key}) => {
  return <span style={{border: '1px solid green'}} key={key}>{children}</span>
}

const _renderRemoved = ({children, key}) => {
  return <span style={{border: '1px solid red'}} key={key}>{children}</span>
}

const _omitProp = val => isFunction(val)

export default (renderAdded = _renderAdded, renderRemoved = _renderRemoved, omitProp = _omitProp) => {
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
      return children.filter(child => child != null).map(serializeChild)
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
        //...restProps,
        ...omitBy(restProps, omitProp),
        children: serializeChildren(children),
      }
    }
  }


  const renderTextDiff = (textDiff: TextDiff): React$Node => textDiff.map(
    ({ removed, added, value }, index) => {
      if (removed === true) {
        return renderRemoved({children: value, key: `removed-${index}`})
      } else if (added === true) {
        return renderAdded({children: value, key: `added-${index}` })
      }

      if (value.type != null && value.props != null) {
        return React.cloneElement(
          value.type,
          {
            ...omitBy(value.props, omitProp),
            key: `same-${index}`
          }
        )
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

        return [
          renderRemoved({children: renderChild(change.lhs) }),
          renderAdded({children: renderChild(change.rhs) }),
        ]
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
      return children.filter(child => child != null).map((child, index) => {
        if (child != null && child.props != null) {
          // hack to ensure all elements have keys :/
          return {
            ...child,
            props: {
              ...omitBy(child.props, omitProp),
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
