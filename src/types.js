// @flow

// patch React$Node because some of the types in React$Node seem to be impossible to refine :/
export type React$Node =
  | null
  | boolean
  | number
  | string
  | React$Element<any>
  | Array<React$Node>;

export type SerializedElement = {
  type: string,
  props: {
    [string]: number | string,
    children: SerializedChildren,
  }
}

export type SerializedChild = boolean | null | number | string | SerializedElement

export type ChangeN = {
  kind: 'N',
  path: Array<string>,
  rhs: SerializedChild,
}

export type ChangeD = {
  kind: 'D',
  path: Array<string>,
  lhs: SerializedChild,
}

export type ChangeE = {
  kind: 'E',
  path: Array<string>,
  lhs: SerializedChild,
  rhs: SerializedChild
}

export type Change =  ChangeE | ChangeN | ChangeD

export type SerializedChildren = Array<SerializedChild> | SerializedChild

export type TextDiff = Array<{
  value: string,
  added?: boolean,
  removed?: boolean,
  count: number
}>
