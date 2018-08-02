import React, { Component } from 'react'
import { diff, applyChange, observableDiff } from 'deep-diff'
import set from 'lodash/set'
import get from 'lodash/get'
import takeWhile from 'lodash/takeWhile'
import ExampleComponent from 'react-deep-diff'


const last = array => array[array.length - 1]
const first = array => array[0]
const second = array => array[1]
const beforeLast = array => array[array.length - 2]

const el1 = <div className="boing">
  Hello
  <span>Boing<span>What up</span></span>
</div>

const el2 = <div className="dwq">
  Hello
  <span>World<span>how do you do</span></span>
</div>

// path be like ["props", "children", 1, "props", "children", 1, "props", "children"]
const changeReactElement = (element, path, change, renderChange) => {
  // first path has to always be props, if not return element
  if (path[0] !== 'props') {
    return element
  }

  // get next nested element that'd be at ["props", "children", 1] for the first recursion
  const nextPath = takeWhile(path.slice(1), name => name !== 'props')
  console.log('change', change, nextPath, path)

  // if nextPath === path then we've come to the end of our journey and want to affect change :)
  if (nextPath.length === 1) {
    return React.cloneElement(
      element,
      {
        [nextPath[0]]: renderChange(element, change)
      }
    )
  } else if (nextPath[0] === 'children') {
    const newChildren = get(element.props, 'children').map((child, index) => {
      const type = child['$$typeof']
      if (type && type.toString() === 'Symbol(react.element)' && last(nextPath) === index) {
        return changeReactElement(child, path.slice(nextPath.length + 1), change, renderChange)
      } else {
        return child
      }
    })

    // const elProps = get(element, 'props')
    return React.cloneElement(
      element,
      {
        children: newChildren
      }
    )
  }
}

const _renderChange = (node, change) => {
  console.log('render change', change)
  return <span>
    <span style={{background: 'red', color: '#fff'}}>{change.lhs}</span>
    <span style={{background: 'green', color: '#fff'}}>{change.rhs}</span>
  </span>
}

const differ = (lhs, rhs, renderChange = _renderChange) => {
  return diff(lhs, rhs).reduce(
    (acc, change) => {
      if (first(change.path) === 'props') {
        return changeReactElement(
          acc,
          change.path,
          change,
          renderChange
        )
      } else {
        return acc
      }
    }, lhs
  )
}

const newObj = differ(el1, el2)

console.log('new obj', newObj)

export default class App extends Component {
  render () {
    return (
      <div>
        {newObj}
      </div>
    )
  }
}
