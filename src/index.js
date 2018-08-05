// @flow
/* eslint-disable no-use-before-define */

import React, { Component } from 'react'
import toPlainObject from 'lodash/toPlainObject'
import { serializeElement, renderElement } from './serialize'
import { diff } from 'deep-diff'
import set from 'lodash/set'
import get from 'lodash/get'

// diff()

type Props = {
  left: React.Node,
  right: React.Node,
  renderChange: any => React.Node,
}

class ReactVisualDiff extends Component<Props> {
  render() {
    const left = serializeElement(this.props.left)
    const right = serializeElement(this.props.right)
    const changes = diff(left, right)

    changes.reduce()
  }
}



export {
  serializeElement,
  renderElement
}
