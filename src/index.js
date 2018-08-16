/* eslint-disable no-use-before-define */

import React, { Component } from 'react'
import { serializeElement, renderElement } from './diff'
import DeepDiff from 'deep-diff'
import set from 'lodash/set'
import get from 'lodash/get'

const { diff } = DeepDiff

const addedBlock = { padding: '0.3em', background: 'green', color: '#fff' }
const removedBlock = { background: 'red', color: '#fff', padding: '0.3em' }
const addedInline = { ...addedBlock, display: 'inline-block'}
const removedInline = { ...removedBlock, display: 'inline-block'}

const blockElements = ['div', 'hr', 'ul']

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

export default class ReactVisualDiff extends Component {
  static defaultProps = {
    renderChange,
    omitChange: () => false
  }

  render() {
    const left = serializeElement(this.props.left)
    const right = serializeElement(this.props.right)

    const changes = diff({...left}, {...right})
    .filter(this.props.omitChange)
    .map(change => {
      const { path } = change
      const lastItem = path[path.length - 1]

      if (typeof lastItem !== 'number' && lastItem !== 'children') {
        let newPath = path.slice(0, path.length - 1)
        if (lastItem !== 'type') {
          newPath = path.slice(0, path.length - Array.from(path).reverse().indexOf('props') - 1)
        }

        return {
          kind: 'E',
          path: newPath,
          lhs: get(left, newPath),
          rhs: get(right, newPath)
        }
      } else {
        return change
      }
    })

    const mixed = changes.reduce((acc, val, index) => {
      if (val.kind === 'A') {
        return set(acc, val.path.concat([val.index]), val.item)
      }
      return set(acc, val.path, val)
    }, left)

    return renderElement(mixed, this.props.renderChange)
  }
}
