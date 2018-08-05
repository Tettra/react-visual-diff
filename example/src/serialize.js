// @flow

import toPlainObject from 'lodash/toPlainObject'

type SerializedElement = {
  props: {
    [string]: number | string,
    children?: Array<Child>,
  }
}

type Child = number | string | SerializedElement

export const serializeNode = (React$Node) => {
}

export const serialize = (element: React$Element): SerializedElement => {
  return toPlainObject(element)
}

export cosnt render = (SerializedElement): React$Element => {

}
