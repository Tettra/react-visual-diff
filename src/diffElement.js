const isString = obj => typeof obj === 'string'
import pick from 'lodash/pick'
import isObject from 'lodash/isObject'
import CircularJSON from 'flatted/cjs'

const stringify = (obj) => CircularJSON.stringify(obj)

var toType = function(obj) {
  return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
}

const diffChildren = (left, right, changes, leftPath, rightPath) => {
  if (![left, right].every(Array.isArray)) {
    return diff(left, right, changes, leftPath, rightPath)
  }

  const leftSide = left.map(stringify)
  const rightSide = right.map(stringify)
  const leftChanges = []
  let rightChanges = []
  const change = {}

  leftSide.forEach((item, index) => {
    if (!rightSide.includes(item)) {
      leftChanges.push(index)
    }
  })

  rightSide.forEach((item, index) => {
    if (!leftSide.includes(item)) {
      rightChanges.push(index)
    }
  })

  const lengthDifference = rightChanges.length - leftChanges.length

  // if there are more left side changes than right side change just make the right side longer :)
  if (lengthDifference < 0) {
    rightChanges = rightChanges.concat(Array(Math.abs(lengthDifference)).fill(null))
  }


  rightChanges.forEach((_, index) => {
    diff(
      left[leftChanges[index]],
      right[rightChanges[index]],
      changes,
      leftPath.concat([leftChanges[index]]),
      rightPath.concat([rightChanges[index]])
    )
  })

  return changes
}

const diffProps = ['className', 'src', 'style']

const makeElementString = (element) => Array.isArray(element) ? stringify(element) : stringify({
  type: element.type,
  props: {
    ...pick(element.props, diffProps),
    children: toType(element.props.children)
  }
})

const diff = (left, right, changes = [], leftPath = [], rightPath = []) => {
  // We use the last position of the leftPath instead here, to position it correctly.
  const newLeftPath = rightPath.slice(0, -1).concat(leftPath.slice(-1))

  if ([left, right].every(Array.isArray)) {
    diffChildren(left, right, changes, leftPath, rightPath)
  } else if (isObject(left) && isObject(right)) {
    const leftString = makeElementString(left)
    const rightString = makeElementString(right)

    if (leftString !== rightString) {
      if (left) changes.push({
        path: newLeftPath,
        diffType: 'removed',
        value: left
      })
      if (right) changes.push({
        path: rightPath,
        diffType: 'added',
        value: right
      })
    } else {
      diffChildren(
        left.props.children,
        right.props.children,
        changes,
        leftPath.concat(['props', 'children']),
        rightPath.concat(['props', 'children'])
      )
    }
  } else if (left !== right) {
    if ([left, right].every(isString)) {
      changes.push({ path: rightPath, diffType: 'updated', left, right })
    } else {
      if (left) changes.push({ path: newLeftPath, diffType: 'removed', value: left })
      if (right) changes.push({ path: rightPath, diffType: 'added', value: right })
    }
  }

  return changes
}

export default diff
