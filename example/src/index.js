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


const Title = styled.h1`
  margin: .5em;
  border: 1px solid #ccc;
`

const el = <div>
  <div>Hello friend</div>
  <div>
    <h1>Headline 1</h1>
  </div>
  <div>
    <h1><span>Headline 6</span> What</h1>
    <h2>Headline 2</h2>
  </div>
</div>

const el2 = <div>
  <div>
    <h1>Headline 1</h1>
  </div>
  <div>
    <h1><span>What is going on</span>Headline 3</h1>
    <h2>Headline 4</h2>
  </div>
</div>

ReactDOM.render(
  <div>
    <div style={{ display: 'flex', borderBottom: '2px solid #000' }}>
      <div>{el}</div>
      <div>{el2}</div>
    </div>
    <VisualDiff left={el} right={el2} />
  </div>, document.getElementById('root'))
