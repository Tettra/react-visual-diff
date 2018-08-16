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
  right={<span>This is the left side</span>}
  renderChange={({ type, children }) => 
    type === 'added'
    ? <Added>{children}</Added>
    : <Removed>{children}</Removed>}
  />
```

## Omitting changes

Basically, when two react elements are compared, they're first being serialized to objects and then diffed with the [`deep-diff`](https://www.npmjs.com/package/deep-diff) module. With the `omitChange` prop you can filter out differences that you don't want to render.

For example:

```jsx
<VisualDiff
  left={<span>This is the left side</span>}
  right={<span>This is the left side</span>}
  omitChange={(change) => change.path.includes('style')}
  />
```

This would omit rendering any differences whose paths include the style prop.

### `<VisualDiff>` Props:

| Property | Type | required? | Description |
| - | - | - | - |
| `left` | `React.Element` | required | Pass React.Element or just jsx `left={<MyFancyComponent>}` |
| `right` | `React.Element` | required | Pass React.Element or just jsx `right={<MyOtherFancyComponent>}` |
| `renderChange` | `Component<{ type: 'added' | 'removed', children: React$Children }>` | optional | A react component (can be just a function) that takes two props, `type` is the type of change (`"added"` or `"removed"`), `children` is just the content of the change |
| `omitChange` | `(change: Object) => boolean` | optional | a method to let you filter the changes applied to the diff. Changes are objects defined by the [`deep-diff`](https://www.npmjs.com/package/deep-diff) module. |

### Roadmap

- An example with draft js documents
- Examples with various open source components
- An example with interaction
- Reduce file size (currently it's pretty big)
- react-native support

## License

MIT © [Tettra](https://github.com/tettra)
