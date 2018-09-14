/* eslint-disable no-use-before-define */

import React, { Component } from 'react'
import { serializeElement, renderElement } from './diff'
import set from 'lodash/set'
import get from 'lodash/get'
import omit from 'lodash/omit';
import update from 'lodash/update';
import flatten from 'lodash/flatten';
import isObject from 'lodash/isObject';
import last from 'lodash/last'
import { create } from 'jsondiffpatch';
const jsdiff = require('diff');

const transformMetaPath = (path) => path.map(item => item[0] === '_' ? item.slice(1) : item)

const differ = create({
  textDiff: {
    minLength: 99999999999999999999999999,
  },
  objectHash: obj => {
    if (obj && obj.props && Array.isArray(obj.props.children)) {
      return JSON.stringify({...obj, props: omit(obj.props, 'children')})
    } else if (obj && obj.props && typeof obj.props.children === 'string') {
      return JSON.stringify({
        ...obj,
        props: {
          ...obj.props,
          children: 'compare-this-text'
        }
      })
    } else {
      return ''
      return JSON.stringify(obj)
    }
  }
})

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

// For now we use this to detect an infinite loop
var i = 0;

// what we need is:
// [{ path: PathArray, type: 'added' | 'removed' | 'updated' }]

const getChanges = (obj, _paths = [], path = []) => {
  let paths = _paths, value;
  const searchObj = path.length > 0 ? get(obj, path) : obj;
  i++

  if (i > 500) {
    throw new Error(`Stack is longer than ${500}, looks like an infinite loop? Here are the arguments:\n\n${JSON.stringify({ obj, path, searchObj }, null, 2)}`)
  }

  Object.keys(searchObj).forEach(key => {
    const newPath = [...path, key]
    if (Array.isArray(searchObj[key])) {
      // Change types are arrays
      // Different types have a different length
      switch (searchObj[key].length) {
        case 1:
          // Item added
          value = get(obj, newPath)[0]
          paths.push({
            path: transformMetaPath(newPath),
            type: 'added',
            value: isObject(value) ? value : { type: 'span', props: { children: value } }
          })
          break;
        case 2:
          // Item updated
          value = get(obj, newPath)
          if (value.every(item => typeof item === 'string')) {
            paths.push({
              path: transformMetaPath(newPath),
              type: 'updated',
              value: {
                type: 'span',
                props: {
                  children: jsdiff.diffWords(...value).map(item => {
                    if (item.added === true) {
                      return {
                        kind: 'added',
                        type: 'span',
                        props: {
                          children: item.value
                        }
                      }
                    } else if (item.removed === true) {
                      return {
                        kind: 'removed',
                        type: 'span',
                        props: {
                          children: item.value
                        }
                      }
                    } else {
                      return item.value
                    }
                  })
                }
              }
            })
          } else {
            paths = paths.concat(flatten(value).map((item, index) => {
              item = Array.isArray(item) ? item[0] : item
              console.log('item?', item)
              return {
                path: transformMetaPath(newPath).concat([index]),
                type: index === 0 ? 'removed' : 'added',
                value: item
              }
            }))
          }
          
          break;
        case 3:
          // this means that we've encountered a text diff
          value = get(obj, newPath)[0]
          if (searchObj[key][2] === 2) {
            paths.push({
              path: transformMetaPath(newPath),
              type: 'updated',
              value: isObject(value) ? value : { type: 'span', props: { children: value } }
            })
          } else {
            // Item removed
            if (Array.isArray(value)) {
              value = value[0]
            }
            paths.push({
              path: transformMetaPath(newPath),
              type: 'removed',
              value //isObject(value) ? value : { type: 'span', props: { children: value } }
            })
          }
          break;
      }

      // if the array is 1 item long it's an add
    } else if (isObject(searchObj)){
      paths = getChanges(obj, paths, newPath);
    } else {
      //paths[newPath.join('.')] = searchObj
    }
  })
  return paths
}

const reduceChange = (acc, change) => {
  const { path, type, value } = change
  const [prev, last] = path.slice(-2)
  if (type === 'added' && prev === 'children') {
    acc = update(
      acc,
      path,
      val => {
        return {
          ...value,
          kind: 'added'
        }
      }
    )
  } else if(type === 'removed' && prev === 'children' && Array.isArray(get(acc, path.slice(0, -1)))) {
    // console.log('type', type)
    // console.log('path', path)
    // console.log('get(acc, path.slice(0, -1))', get(acc, path.slice(0, -1)))
    // console.log('value', value)
    acc = update(
      acc,
      path.slice(0, -1),
      val => {
        return [
        ...val.slice(0, last),
        {
          ...value,
          kind: 'removed'
        },
        ...val.slice(last)
        ]
      }
    )
  } else if (type === 'updated') {
    acc = set(
      acc,
      path,
      value
    )
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
    console.log('left', left)
    console.log('right', right)

    const _changes = differ.diff(left, right)
    const changes = getChanges(_changes)
    console.log('_changes', _changes)
    console.log('changes', changes.map(change => ({ type: change.type, lastPath: change.path.slice(-1)[0], value: change.value })))

    let merged = changes.reverse().filter(change => change.type === 'added').reduce(reduceChange, right)
    changes.reverse().filter(change => change.type === 'updated').reduce(reduceChange, right)
    merged = changes.reverse().filter(change => change.type === 'removed').reduce(reduceChange, merged)

    console.log('mergedyo', merged)
    // console.log('mergedyo', JSON.stringify(merged, null, 2))
    return renderElement(merged, this.props.renderChange)
  }
}
