import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Animated
} from 'react-native';

import SwipeView, { SwipeViewChildrenProps } from './SwipeView'
import OverlayView, { OverlayViewHandle } from './OverlayView'
import { ScreenWidth, ScreenHeight } from '../util/Style'
import { DialogProps, SwipeEvent } from '../types';
import Animation from '../anim/AnimationAbstract';
import AnimationFade from '../anim/AnimationFade';

const DIALOG_SHOWING: string = 'showing';
const DIALOG_SHOW: string = 'show';
const DIALOG_DISMISSING: string = 'dismissing';
const DIALOG_DISMISS: string = 'dismiss';

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 99,
    elevation: 99,
  },
  dialog: {
    overflow: 'hidden',
    backgroundColor: '#ffffff',
  },
  dialogRadius: {
    borderRadius: 8,
  },
  swipeView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

type DialogState =
 | typeof DIALOG_SHOWING
 | typeof DIALOG_SHOW
 | typeof DIALOG_DISMISSING
 | typeof DIALOG_DISMISS

type State = {
  dialogAnimation: Animation;
  dialogState: DialogState;
}

class DialogBase extends Component<DialogProps, State> {
  static defaultProps = {
    title: null,
    body: null,
    footer: null,
    visible: false,
    style: null,
    animationDuration: 80,
    dialogStyle: null,
    width: null,
    height: null,
    hasOverlay: true,
    overlayOpacity: 0.5,
    overlayBackgroundColor: 'rgb(0, 0, 0)',
    onShow: () => {},
    onTapOut: (event: SwipeEvent) => {},
    onMove: (event: SwipeEvent) => {},
    onSwiping: (event: SwipeEvent) => {},
    onSwipingOut: (event: SwipeEvent) => {},
    useNativeDriver: true,
  }

  private handleRef = React.createRef<OverlayViewHandle>();
  private isSwipingOut = true;
  private lastMoveEvent: SwipeEvent | null = null;

  constructor(props: DialogProps) {
    super(props);

    this.state = {
      dialogAnimation: props.dialogAnimation || new AnimationFade({
        animationDuration: props.animationDuration,
      }),
      dialogState: DIALOG_DISMISS,
    };
  }

  componentDidMount() {
    if (this.props.visible) {
      this.show();
    }
  }

  componentWillUnmount() {
    this.setState = () => false;
  }

  componentDidUpdate(prevProps: DialogProps) {
    if (this.props.visible !== prevProps.visible) {
      if (this.props.visible) {
        this.show();
        return;
      }
      this.dismiss();
    }
  }

  get dialogSize(): Object {
    let { width, height } = this.props;
    if (width && width > 0.0 && width <= 1.0) {
      width *= ScreenWidth;
    }
    if (height && height > 0.0 && height <= 1.0) {
      height *= ScreenHeight;
    }
    return { width, height };
  }

  show(): void {
    this.setState({ dialogState: DIALOG_SHOWING }, () => {
      this.state.dialogAnimation.in(() => {
        this.setState({ dialogState: DIALOG_SHOW }, this.props.onShow);
      });
    });
  }

  dismiss(): void {
    this.setState({ dialogState: DIALOG_DISMISSING }, () => {
      if (this.isSwipingOut) {
        this.setState({ dialogState: DIALOG_DISMISS });
        return;
      }
      this.state.dialogAnimation.out(() => {
        this.setState({ dialogState: DIALOG_DISMISS });
      });
    });
  }

  onMove = (event: SwipeEvent): void => {
    const { hasOverlay } = this.props;

    if (!hasOverlay) {
      return;
    }
    if (this.state.dialogState === DIALOG_DISMISSING) {
      return;
    }
    if (!this.lastMoveEvent) {
      this.lastMoveEvent = event;
    }
    let newOpacity = 0;
    const opacity = this.props.overlayOpacity || 0;
    if (Math.abs(event.point.y)) {
      const lastPoint = Math.abs(this.lastMoveEvent.layout.y);
      const currPoint = Math.abs(event.point.y);
      newOpacity = opacity - ((opacity * currPoint) / (ScreenHeight - lastPoint));
    } else {
      const lastPoint = Math.abs(this.lastMoveEvent.layout.x);
      const currPoint = Math.abs(event.point.x);
      newOpacity = opacity - ((opacity * currPoint) / (ScreenWidth - lastPoint));
    }
    if (this.handleRef.current) {
      this.handleRef.current.setOpacity(newOpacity);
    }
  }

  handleSwipingOut = (event: SwipeEvent) => {
    this.isSwipingOut = true;
    this.props.onSwipingOut && this.props.onSwipingOut(event);
  }

  render() {
    const { dialogState, dialogAnimation } = this.state;
    const {
      title,
      body,
      children,
      footer,
      onTapOut,
      hasOverlay,
      dialogStyle,
      animationDuration,
      overlayOpacity = 0.5,
      useNativeDriver,
      overlayBackgroundColor,
      style,
      onSwiping,
      onSwipeOut,
      swipeDirection,
      swipeThreshold,
    } = this.props;

    const overlayVisible = hasOverlay && [DIALOG_SHOWING, DIALOG_SHOW].includes(dialogState) || false;
    const inner = ({ panGesture, onLayout }: SwipeViewChildrenProps) => (
      <>
        <OverlayView
          ref={this.handleRef}
          pointerEvents={dialogState === DIALOG_SHOW ? 'auto' : 'none'}
          visible={overlayVisible}
          onPress={onTapOut}
          backgroundColor={overlayBackgroundColor}
          opacity={overlayOpacity}
          animationDuration={animationDuration}
          useNativeDriver={useNativeDriver}
        />
        <Animated.View
          style={panGesture.getLayout()}
          onLayout={onLayout}
        >
          <Animated.View
            style={[
              styles.dialog,
              styles.dialogRadius,
              this.dialogSize,
              dialogStyle,
              dialogAnimation.getAnimations(),
            ]}
          >
            {title}
            {children ? children : body}
            {footer}
          </Animated.View>
        </Animated.View>
      </>
    );

    return (
        <View style={[styles.container]}>
          <SwipeView
            style={StyleSheet.flatten([styles.swipeView, style])}
            onMove={this.onMove}
            onSwiping={onSwiping}
            onSwipingOut={this.handleSwipingOut}
            onSwipeOut={onSwipeOut}
            swipeDirection={swipeDirection}
            swipeThreshold={swipeThreshold}
          >
            {inner}      
          </SwipeView>
        </View>
    );
  }
}

export default DialogBase;