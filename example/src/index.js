import React from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'
import { serializeElement, renderElement } from 'react-deep-diff'

const Wrapper = styled.div`
  background: black;
  margin: 1em;
  color: #fff;
  font-size: 1em;
`

const Title = styled.h1`
  margin: .5em;
  border: 1px solid #ccc;
`

const el = <Wrapper>3213
  <Title>What a title yo</Title>
  <span className="dwdwq">Hello</span>
</Wrapper>

const obj = serializeElement(el)

console.log('serialized el1', obj)
console.log('render el1', renderElement(obj))

ReactDOM.render(renderElement(obj), document.getElementById('root'))
