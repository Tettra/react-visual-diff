import React from 'react';
import 'medium-draft/lib/index.css';
import {
  Editor,
  createEditorState,
} from 'medium-draft';
import { convertToRaw } from 'draft-js'

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editorState: createEditorState(this.props.content), // for empty content
    };

    this.onChange = (editorState) => {
      this.setState({ editorState });
    };
  }

  componentDidMount() {
    this.refs.editor.focus();
  }

  render() {
    const { editorState } = this.state;
    return (
      <Editor
        ref="editor"
        editorState={editorState}
        onChange={this.onChange} />
    );
  }
};
