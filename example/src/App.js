import React, { Component } from 'react'
import { diff, applyChange, observableDiff } from 'deep-diff'
import set from 'lodash/set'
import get from 'lodash/get'
import isArray from 'lodash/isArray'
import takeWhile from 'lodash/takeWhile'
import { serialize, render } from 'react-component-tree'
import ExampleComponent from 'react-deep-diff'

const last = array => array[array.length - 1]
const first = array => array[0]
const second = array => array[1]
const beforeLast = array => array[array.length - 2]

const el1 = <div className="boing">
  Hello
  <span>Wor<span>What up</span></span>
</div>


console.log('wat', serialize(el1))

const serialized = serialize(el1)

// console.log('json react', JSON.stringify(el1))
// 
// const el2 = <div className="boooom">
//   Hello
//   <span>World<span>how do you do</span></span>
//   <div>
//     <h1>This is a new Element</h1>
//   </div>
// </div>
// 
// // path be like ["props", "children", 1, "props", "children", 1, "props", "children"]
// const changeReactElement = (element, path, change, renderChange) => {
//   // first path has to always be props, if not return element
//   console.log('path', path)
//   if (path[0] !== 'props') {
//     return element
//   }
// 
//   // get next nested element that'd be at ["props", "children", 1] for the first recursion
//   const nextPath = takeWhile(path.slice(1), name => name !== 'props')
// 
//   // if nextPath === path then we've come to the end of our journey and want to affect change :)
//   if (nextPath.length === 1) {
//     return React.cloneElement(
//       element,
//       {
//         [nextPath[0]]: renderChange(element, change)
//       }
//     )
//   } else if (nextPath[0] === 'children') {
//     const children = get(element.props, 'children')
//     let newChildren = children
// 
//     if (children.map != null) {
//       // console.log('new children', path, change, children)
//       newChildren = children.map((child, index) => {
//         const type = child['$$typeof']
//         if (type && type.toString() === 'Symbol(react.element)' && last(nextPath) === index) {
//           return changeReactElement(child, path.slice(nextPath.length + 1), change, renderChange)
//         } else if (typeof child === 'string' && nextPath.length === 2 && nextPath[1] === index) {
//           return renderChange(element, change)
//         } else {
//           return child
//         }
//       })
//     } else {
//       const child = children
//       const type = child['$$typeof']
//       // console.log('child', child)
//       // console.log('child type', type)
//       // console.log('change', change)
//       // console.log('next path', nextPath)
//       // console.log('new path', path.slice(nextPath.length + 1))
//       // console.log('path', path)
// 
//       if (type && type.toString() === 'Symbol(react.element)') {
//         console.log(1)
//         newChildren = changeReactElement(child, path.slice(nextPath.length + 1), change, renderChange)
//       } else if (typeof child === 'string' && nextPath.length === 2) {
//         console.log(2)
//         newChildren = renderChange(element, change)
//       } else {
//         console.log(3)
//         newChildren = children
//       }
//     }
// 
//     console.log('new children?', newChildren)
//     // const elProps = get(element, 'props')
//     return React.cloneElement(
//       element,
//       {
//         children: newChildren
//       }
//     )
//   }
// }
// 
// const _renderChange = (node, change) => {
//   if (change.kind === 'A') {
//     console.log('render change', change)
//     console.log(node)
//     return <span style={{background: 'green', color: '#fff'}}>
//       {change.item.rhs}
//     </span>
//     // change.index,
//     // change.item.rhs
//     // return 
//   }
//   return <span>
//     <span style={{background: 'red', color: '#fff'}}>{change.lhs}</span>
//     <span style={{background: 'green', color: '#fff'}}>{change.rhs}</span>
//   </span>
// }
// 
// const differ = (lhs, rhs, renderChange = _renderChange) => {
//   return diff(lhs, rhs).reduce(
//     (acc, change) => {
//       if (first(change.path) === 'props') {
//         return changeReactElement(
//           acc,
//           change.path,
//           change,
//           renderChange
//         )
//       } else {
//         return acc
//       }
//     }, lhs
//   )
// }
// 
// const newObj = differ(el1, el2)
// 
// console.log('new obj', newObj)
// 
export default class App extends Component {
  render () {
    return (
      <div>
        {render({ component: serialized })}
      </div>
    )
  }
}
