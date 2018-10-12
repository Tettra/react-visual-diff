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
  <div>Boing</div>
  <div><span>Hel</span><span>lo</span></div>
  <div>World</div>
</div>

const el2 = <div>
  <div><span>World</span></div>
  <div></div>
  <div>Boing</div>
</div>

ReactDOM.render(
  <div>
    <VisualDiff left={el} right={el2} />
  </div>, document.getElementById('root'))
