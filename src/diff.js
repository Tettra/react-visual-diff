/* eslint-disable no-use-before-define */
import React from 'react'
import isString from 'lodash/isString'
import omitBy from 'lodash/omitBy'
import isFunction from 'lodash/isFunction'
import type {
  React$Node,
  SerializedElement,
  SerializedChild,
  Change,
  SerializedChildren,
  TextDiff
} from './types'
const jsdiff = require('diff');

const omitProp = val => isFunction(val)

const serializeChild = (child) => {
  if (Array.isArray(child)) {
    return serializeChildren(child)
  } else if (child != null && !Array.isArray(child) && React.isValidElement(child)) {
    return serializeElement(child)
  } else {
    return child
  }
}

const serializeChildren = (children) => {
  if (Array.isArray(children)) {
    return children.filter(child => child != null).map(serializeChild)
  } else {
    return serializeChild(children)
  }
}

export const serializeElement = (element) => {
  let el = element

  while (el !== null && typeof el.type === 'function') {
    if (el.type.name === 'Portal') {
      el = null;
      break;
    }
    const newEl = new el.type(el.props)
    if (newEl.render != null) {
      el = newEl.render()
    } else {
      el = newEl
    }
  }

  if (el == null || el.props == null) {
    return el
  }

  const { props: { children, ...restProps }, type, key } = el

  return {
    type,
    props: {
      ...omitBy(restProps, omitProp),
      children: serializeChildren(children)
    }
  }
}

const renderTextDiff = (textDiff, renderChange) => textDiff.map(
  ({ removed, added, value }, index) => {
    if (removed === true) {
      return React.createElement(renderChange, {
        type: 'removed',
        children: value,
        key: `removed-${index}`
      })
    } else if (added === true) {
      return React.createElement(renderChange, {
        type: 'added',
        children: value,
        key: `added-${index}`
      })
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

const renderChangeNode = (change, renderChange) => {
  switch(change.kind) {
    case 'N':
      return React.createElement(renderChange, {
        type: 'added',
        children: renderChild(change.rhs)
      })
    case 'E':
      if (isString(change.lhs) && isString(change.rhs)) {
        return renderTextDiff(jsdiff.diffWords(change.lhs, change.rhs), renderChange)
      }

      return [
        React.createElement(renderChange, {type: 'removed', children: renderChild(change.lhs, renderChange) }),
        React.createElement(renderChange, {type: 'added', children: renderChild(change.rhs, renderChange) }),
      ]
    case 'D':
      return React.createElement(renderChange, {type: 'removed', children: renderChild(change.lhs, renderChange) })
    default:
      throw new Error('change not handled')
  }
}

const renderChild = (child, renderChange) => {
  if (child != null && child.kind != null) {
    return renderChangeNode(child, renderChange)
  } else if (child != null && child.props != null) {
    return renderElement(child, renderChange)
  } else if (Array.isArray(child)) {
    return renderChildren(child, renderChange)
  } else {
    return child
  }
}

const renderChildren = (children, renderChange) => {
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
    }).map(val => renderChild(val, renderChange))
  } else {
    return renderChild(children, renderChange)
  }
}

var i = 0;

export const renderElement = (serializedElement, renderChange) => {
  const { type, props: { children, ...restProps } } = serializedElement

  const newProps = {
    key: `key-fix-${i++}`,
    ...restProps
  }

  if (children != null) {
    newProps.children = renderChildren(children, renderChange)
  }

  return React.createElement(
    type,
    newProps
  )
}
