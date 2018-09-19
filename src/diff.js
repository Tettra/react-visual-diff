/* eslint-disable no-use-before-define */
import React from 'react'
import isString from 'lodash/isString'
import pick from 'lodash/pick'
import isFunction from 'lodash/isFunction'
import type {
  React$Node,
  SerializedElement,
  SerializedChild,
  Change,
  SerializedChildren,
  TextDiff
} from './types'

const allowedProps = ['children', 'type', 'className', 'style']

var i = 0;

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
  children = !Array.isArray(children) ? [children] : children
  return children.filter(child => child != null).map(serializeChild)
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
      ...pick(restProps, allowedProps),
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
          ...pick(value.props, allowedProps),
          key: `same-${index}`
        }
      )
    }

    return value
  }
)

const renderChild = (child, renderChange) => {
  if (child != null && (child.diffType != null)) {
    const { diffType, ...children } = child
    return React.createElement(
      renderChange,
      {
        type: diffType,
        children: renderChild(children, renderChange),
        key: `key-child-${i++}`
      }
    )
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
            ...pick(child.props, allowedProps),
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
