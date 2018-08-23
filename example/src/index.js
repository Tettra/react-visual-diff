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

const el = <Wrapper>3213
  <Title data-editor-key="dqw">What a title yo</Title>
  <span className="dwdwq">
    Hello
    <span>Wat</span>
  </span>
  <span className="dwdwq">
    Goodbye
    <span>Boing</span>
  </span>
  <hr />
</Wrapper>

const el2 = <Wrapper>3224
  <Title data-editor-key="h30k">What a boing</Title>
  <div>
    <h1>Another thing</h1>
  </div>
  <span className="dwdwq">
    Hello
    <span>Boing</span>
  </span>
</Wrapper>

// ReactDOM.render(<VisualDiff left={el} right={el2} />, document.getElementById('root'))

// const el1 = <Editor content={content1} />
// const el2 = <Editor content={content2} />
// 

ReactDOM.render(<VisualDiff left={el} right={el2} />, document.getElementById('root'))
