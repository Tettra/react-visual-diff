// @flow
/* eslint-disable no-use-before-define */

import React, { Component } from 'react'
import { serializeElement, renderElement } from './diff'
import DeepDiff from 'deep-diff'
import set from 'lodash/set'

const { diff } = DeepDiff

type Props = {
  left: React$Element<any>,
  right: React$Element<any>,
  renderChange: any => React$Element<any>,
}

export default class ReactVisualDiff extends Component<Props> {
  render() {
    const left = serializeElement(this.props.left)
    const right = serializeElement(this.props.right)
    const changes = diff(left, right)
    const mixed = changes.reduce((acc, val, index) => {
      if (val.kind === 'A') {
        return set(acc, val.path.concat([val.index]), val.item)
      }
      return set(acc, val.path, val)
    }, left)

    return renderElement(mixed)
  }
}
