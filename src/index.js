/* eslint-disable no-use-before-define */

import React, { Component } from 'react'
import set from 'lodash/set'
import get from 'lodash/get'
import flatten from 'lodash/flatten';
const jsdiff = require('diff');

import { serializeElement, renderElement } from './diff'
import diffElement from './diffElement';

const addedBlock = { padding: '0.3em', background: 'green', color: '#fff' }
const removedBlock = { background: 'red', color: '#fff', padding: '0.3em' }
const addedInline = { ...addedBlock, display: 'inline-block'}
const removedInline = { ...removedBlock, display: 'inline-block'}

const blockElements = ['div', 'hr', 'ul', 'li', 'h1', 'h2', 'h3', 'h4', 'p']

const renderChange = ({ type, children }) => {
  if (children == null) {
    return null;
  }

  if (children != null && blockElements.includes(children.type)) {
    return <div
      style={type === 'added' ? addedBlock : removedBlock}
    >{children}</div>;
  }

  return <span
    style={type === 'added' ? addedInline : removedInline}
  >{children}</span>;
};

const transformValue = (val, diffType) => {
  if (typeof val === 'string') {
    return { diffType, type: 'span', props: { children: val } }
  } else if (Array.isArray(val)) {
    return val.map(item => transformValue(item, diffType));
  } else {
    return { ...val, diffType }
  }
}

const reduceChange = (acc, { path, diffType, value, left, right}) => {
  if (diffType === 'updated') {
    value = jsdiff.diffWords(left, right).map(item => {
      if (item.added === true) {
        return {
          type: 'span',
          diffType: 'added',
          props:{
            children: item.value
          }
        }
      } else if (item.removed == true) {
        return {
          type: 'span',
          diffType: 'removed',
          props:{
            children: item.value
          }
        }
      } else {
        return item.value
      }
    })
    return set(acc, path, value)
  } else if (diffType === 'removed') {
    const [prevLast, last] = path.slice(-2)
    if (prevLast === 'children') {
      const children = get(acc, path.slice(0, -1))
      console.log('hello children', children, value)

      return set(
        acc,
        path.slice(0, -1),
        flatten([
          ...children.slice(0, last),
          transformValue(value, diffType),
          ...children.slice(last),
        ])
      )
    }

  } else if (diffType === 'added') {
    return set(acc, path, transformValue(value, diffType))
  }

  return acc
}

export default class ReactVisualDiff extends Component {
  static defaultProps = {
    renderChange,
  }

  render() {
    const left = serializeElement(this.props.left)
    const right = serializeElement(this.props.right)
    const changes = diffElement(left, right).reverse()

    let merged = changes
      .filter(change => change.diffType !== 'removed')
      .reduce(reduceChange, right)

    merged = changes
      .filter(change => change.diffType === 'removed')
      .reduce(reduceChange, merged)

    return renderElement(merged, this.props.renderChange)
  }
}
