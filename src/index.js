/* eslint-disable no-use-before-define */

import React, { Component } from 'react'
import set from 'lodash/set'
import get from 'lodash/get'
import flatten from 'lodash/flatten';
const jsdiff = require('diff');

import { serializeElement, renderElement } from './serialize'
import diffElement from './diffElement';
const addedBlock = { padding: '0.3em', background: 'green', color: '#fff' }
const removedBlock = { background: 'red', color: '#fff', padding: '0.3em' }
const addedInline = { ...addedBlock, display: 'inline-block'}
const removedInline = { ...removedBlock, display: 'inline-block'}

const blockElements = ['div', 'hr', 'ul', 'li', 'h1', 'h2', 'h3', 'h4', 'p']

const differMap = {
  'chars': jsdiff.diffChars,
  'words': jsdiff.diffWords,
  'wordsWithSpace': jsdiff.diffWordsWithSpace,
  'lines': jsdiff.diffLines,
  'trimmedLines': jsdiff.diffTrimmedLines,
  'sentences': jsdiff.diffSentences
}


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

const reduceChange = (differ) => {
  return (acc, {path, diffType, value, left, right}) => {
    if (diffType === 'updated') {
      value = differ(left, right).map(item => {
        if (item.added === true) {
          return {
            type: 'span',
            diffType: 'added',
            props: {
              children: item.value
            }
          }
        } else if (item.removed == true) {
          return {
            type: 'span',
            diffType: 'removed',
            props: {
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
        const children = get(acc, path.slice(0, -1)) || []

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
}

const filterNumbers = arr => arr.filter(item => typeof item === 'number')

export default class ReactVisualDiff extends Component {
  static defaultProps = {
    renderChange,
    differ: 'words'
  }

  render() {
    const left = serializeElement(this.props.left)
    const right = serializeElement(this.props.right)

    const changes = diffElement(left, right)
    .sort((changeA, changeB) => {
      const pathA = filterNumbers(changeA.path)
      const pathB = filterNumbers(changeB.path)
      for (var i = 0; i < pathA.length; i++) {
        if (pathA[i] > pathB[i]) {
          return -1;
        } else if (pathA[i] < pathB[i]){
          return 1;
        } else if (changeA.diffType === 'added') {
          return -1;
        } else if (changeB.diffType === 'added') {
          return 1;
        }
      }

      return 0;
    })

    let merged = changes
      .reduce(reduceChange(differMap[this.props.differ]), right)

    return renderElement(merged, this.props.renderChange)
  }
}
