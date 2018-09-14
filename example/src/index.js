import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'
import VisualDiff from 'react-deep-diff'
import { diff } from 'deep-diff'
import './index.css'
import Editor from './Editor'
import content1 from './content1'
import content2 from './content2'
import { convertToObject } from 'react-json-renderer'

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

const el = <Wrapper>
  <h1>Headline 1</h1>
  <h2>Headline 2</h2>
  <h3>Headline 3</h3>
  <p>Paragraph</p>
  <ul>
    <li>Item 1</li>
    <li>Item 2</li>
    <li>Item 3</li>
  </ul>
</Wrapper>

const el2 = <Wrapper>
  <h1>Headline</h1>
  <h2>Headline 2</h2>
  <p>Headline 3</p>
  <p>Headline 3</p>
  <p>Paragraph</p>
  <ul>
    <li>Item 1</li>
    <li>Item 4</li>
    <li>Item 5</li>
    <li>Item 2</li>
    <li>Item 3</li>
  </ul>
</Wrapper>

ReactDOM.render(
  <div>
    <div style={{ display: 'flex', borderBottom: '2px solid #000' }}>
      <div>{el}</div>
      <div>{el2}</div>
    </div>
    <VisualDiff left={el} right={el2} />
  </div>, document.getElementById('root'))
