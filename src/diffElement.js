const stringify = (...args) => JSON.stringify(...args)
const isString = obj => typeof obj === 'string'

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
    change[rightChanges[index]] = diff(left[leftChanges[index]], right[rightChanges[index]], changes, leftPath.concat([leftChanges[index]]), rightPath.concat([rightChanges[index]]))
  })

  return changes
}

const makeElementString = (element) => stringify({
  type: element.type,
  props: {
    ...element.props,
    children: typeof element.props.children
  }
})

const diff = (left, right, changes = [], leftPath = [], rightPath = []) => {
  if ([left, right].every(Array.isArray)) {
    diffChildren(left, right, changes, leftPath, rightPath)
  } else if (typeof left === 'object' && typeof right === 'object') {
    const leftString = makeElementString(left)
    const rightString = makeElementString(right)

    if (leftString !== rightString) {
      if (left) changes.push({ path: leftPath, diffType: 'removed', value: left })
      if (right) changes.push({ path: rightPath, diffType: 'added', value: right })
    } else {
      diffChildren(left.props.children, right.props.children, changes, leftPath.concat(['props', 'children']), rightPath.concat(['props', 'children']))
    }
  } else if (left !== right) {
    if ([left, right].every(isString)) {
      changes.push({ path: rightPath, diffType: 'updated', left, right })
    } else {
      if (left) changes.push({ path: leftPath, diffType: 'removed', value: left })
      if (right) changes.push({ path: rightPath, diffType: 'added', value: right })
    }
  }

  return changes
}

export default diff
