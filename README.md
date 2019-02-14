# react-visual-diff

> A React Component that renders the structural differences of two React Elements

[![NPM](https://img.shields.io/npm/v/react-visual-diff.svg)](https://www.npmjs.com/package/react-visual-diff) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

This module provides a way of visually rendering differences between React Elements. It was originally developed for [tettra](http://tettra.co/) to visualize differences between two documents. It uses the [`deep-diff` module](https://www.npmjs.com/package/deep-diff) under the hood.

##### Limitations:
- All function props, such as onClick handlers are discarded when rendering a diff (However, you can make the diff interactive via the `renderChange` prop)
- We're diffing the structure of two React Elements. react-visual-diff is not a visual regression tool.

## Install

```bash
npm install --save react-visual-diff
```

## Basic Usage

The most simple form of using the VisualDiff component is to just define two props - `left` and `right`:

```jsx
import VisualDiff from 'react-visual-diff'

...

<VisualDiff
  left={<span>This is the left side</span>}
  right={<span>This is the left side</span>}
/>
```

## Rendering changes

The default style for rendering changes is ok for basic needs, but usually you'll want to control this.

The `renderChange` prop lets you do this:


```jsx
<VisualDiff
  left={<span>This is the left side</span>}
  right={<span>This is the right side</span>}
  renderChange={({ type, children }) => 
    type === 'added'
    ? <Added>{children}</Added>
    : type === 'removed' 
      ?<Removed>{children}</Removed>}
      : children
  />
```

## Diffing only certain props

Basically, when two react elements are compared, they're first being serialized to objects and then diffed. By default the following props are diffed:

```
const diffProps = ['children', 'type', 'className', 'style']
```

If you'd like to restrict this to a different set, simply set the `diffProps` prop

For example:

```jsx
<VisualDiff
  left={<span>This is the left side</span>}
  right={<span>This is the left side</span>}
  diffProps={['children']}
  />
```

This would only render differences of the children prop.

### `<VisualDiff>` Props:

| Property | Type | required? | Description |
| - | - | - | - |
| `left` | `React.Element` | required | Pass React.Element or just jsx `left={<MyFancyComponent>}` |
| `right` | `React.Element` | required | Pass React.Element or just jsx `right={<MyOtherFancyComponent>}` |
| `renderChange` | `Component<{ type: 'added' | 'removed' | undefined, children: React$Children }>` | optional | A react component (can be just a function) that takes two props, `type` is the type of change (`"added"`, `"removed"`, or `undefined`), `children` is just the content of the change |
| `diffProps` | `Array<string>` | optional | An array of prop names that will be diffed. defaults to `['children', 'type', 'className', 'style']` |

### Roadmap

- An example with draft js documents
- Examples with various open source components
- An example with interaction
- Reduce file size (currently it's pretty big)
- react-native support

## License

MIT © [Tettra](https://github.com/tettra)
