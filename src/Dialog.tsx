import React, { Component } from 'react';
import RootSiblings from 'react-native-root-siblings';
import DialogBase from './view/DialogBase';
import type { DialogProps } from './types';

interface State {
  visible: boolean
}

export default class Dialog extends Component<DialogProps, State> {
  constructor(props: DialogProps) {
    super(props);

    this.state = {
      visible: props.visible,
    };
  }

  private rootSibling: RootSiblings | null = null;

  componentDidMount() {
    const { visible } = this.state;
    if (visible) {
      this.create();
    }
  }

  componentDidUpdate(prevProps: DialogProps, prevState: State) {
    if (prevState.visible !== this.props.visible) {
      this.setState({ visible: this.props.visible });
      if (this.state.visible) {
        this.create();
      }
    }
    
    this.udpate();
  }

  create() {
    if (!this.rootSibling) {
      this.rootSibling = new RootSiblings(this.renderView());
    }
  }

  destroy() {
    if (this.rootSibling) {
      this.rootSibling.destroy();
      this.rootSibling = null;
    }
  }

  udpate() {
    if (this.rootSibling) {
      this.rootSibling.update(this.renderView());
    }

    if (!this.state.visible) {
      this.destroy();
    }
  }

  renderView() {
    return (
      <DialogBase
        {...this.props}
        visible={this.state.visible}
      />
    );
  }

  render() {
    return null;
  }
}
