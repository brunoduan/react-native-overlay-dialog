import React, { Component } from 'react';
import { BackHandler, NativeEventSubscription } from 'react-native';
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
  private static dialogCount = 0;
  private static subscriotion: NativeEventSubscription;

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

  onBackButtonPressAndroid() {
    if (Dialog.dialogCount === 0) {
      return false;
    }

    return true;
  }

  create() {
    if (!this.rootSibling) {
      this.rootSibling = new RootSiblings(
        this.renderView(),
        this.props.rootTag,
        undefined,
        this.props.store);
        if (++Dialog.dialogCount === 1) {
          Dialog.subscriotion = BackHandler.addEventListener(
            'hardwareBackPress',
            this.onBackButtonPressAndroid);
        }
    }
  }

  destroy() {
    if (this.rootSibling) {
      this.rootSibling.destroy();
      this.rootSibling = null;
      if (--Dialog.dialogCount === 0) {
        Dialog.subscriotion.remove();
      }
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
