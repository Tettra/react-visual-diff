import React, { Component } from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  background: black;
  margin: 1em;
  color: #fff;
  font-size: 1em;
`

export const el = <Wrapper>
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

export const el2 = <Wrapper>
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
