/* eslint-disable no-use-before-define */

import { Component } from 'react'
import createDiffer from './diff'
import DeepDiff from 'deep-diff'
import set from 'lodash/set'
import get from 'lodash/get'

const { diff } = DeepDiff

export default (renderChange, omitProp) => {
  const { serializeElement, renderElement } = createDiffer(renderChange, omitProp)

  return class ReactVisualDiff extends Component {
    render() {
      const left = serializeElement(this.props.left)
      const right = serializeElement(this.props.right)

      const changes = diff({...left}, {...right}).map(change => {
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

      return renderElement(mixed)
    }
  }
}
