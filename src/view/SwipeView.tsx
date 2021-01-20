import React, { Component, ReactNode } from 'react';
import {
  Animated,
  PanResponder,
  PanResponderGestureState 
} from 'react-native';
import { SwipeDirection, SwipeEvent } from '../types';
import { ScreenHeight } from '../util/Style'
import { Layout, Point } from '../types'

export interface SwipeViewChildrenProps {
  panGesture: Animated.ValueXY;
  onLayout: (event: any) => void;
}

interface AminatedValueXY extends Animated.AnimatedValue {
  _value: number;
}

interface SwipeViewProps {
  style?: any;
  onMove?: (event: SwipeEvent) => void;
  onSwiping?: (event: SwipeEvent) => void;
  onSwipingOut?: (event: SwipeEvent) => void;
  onSwipeOut?: (event: SwipeEvent) => void;
  swipeThreshold?: number;
  swipeDirection?: SwipeDirection | Array<SwipeDirection>;
  children: (event: SwipeViewChildrenProps) => ReactNode;
}

const velocityThreshold = 0.28;
let distanceThreshold: number = 80;

function isValidSwipe(v: number, distance: number) {
  return Math.abs(v) > velocityThreshold && Math.abs(distance) < distanceThreshold;
}

function getSwipeGesture(state: PanResponderGestureState) {
  if (isValidSwipe(state.vx, state.dy)) {
    return (state.dx > 0) ? 'right' : 'left';
  } else if (isValidSwipe(state.vy, state.dx)) {
    return (state.dy > 0) ? 'down' : 'up';
  }
  return null;
}

const checkVerticalGesture = (d: string) => ['up', 'down'].includes(d);
const checkHorizontalGesture = (d: string) => ['left', 'right'].includes(d);

const checkSame = (older: string, newer: string) =>
        checkVerticalGesture(older) === checkVerticalGesture(newer) ||
        checkHorizontalGesture(older) === checkHorizontalGesture(newer)

export default class SwipeView extends Component<SwipeViewProps> {
  static defaultProps = {
    style: null,
    onMove: (e: SwipeEvent) => {},
    onSwiping: (e: SwipeEvent) => {},
    onSwipingOut: (e: SwipeEvent) => {},
    onSwipeOut: (e: SwipeEvent) => {},
    swipeThreshold: 80
  };

  private panGesture = new Animated.ValueXY();
  private layout: Layout = {
    x: 0,
    y: 0,
    width: 0,
    height: 0
  };
  private gesture = "";
  private swipeDirections: Array<SwipeDirection> = []
  private callbackId = "0";

  constructor(props: SwipeViewProps) {
    super(props);
    distanceThreshold = props.swipeThreshold || 80;
    if (this.props.swipeDirection) {
      this.swipeDirections = ([] as Array<SwipeDirection>).concat(this.props.swipeDirection);
    }
  }

  componentDidMount() {
    this.callbackId = this.panGesture.addListener((point: { x: number; y: number }) => {
      this.props.onMove && this.props.onMove(this.createSwipeEvent(point));
    });
  }

  componentWillUnmount() {
    this.panGesture.removeListener(this.callbackId);
  }

  onLayout = (event: any) => {
    this.layout = event.nativeEvent.layout;
  }

  checkValidGesture({ dy }: PanResponderGestureState) {
    const swipDown = dy > 0;
    const swipUp = dy < 0;
    const isUpDown = (gesture: any) => (
      this.gesture === gesture && this.swipeDirections.includes(gesture)
    );
    if (swipDown && isUpDown('down')) {
      return true;
    } else if (swipUp && isUpDown('up')) {
      return true;
    }
    return false;
  }

  toValue() {
    const vertical = ((ScreenHeight / 2) + (this.layout.height / 2));
    let value: Point = {x: 0, y: 0};
    if (this.gesture === 'up') {
      value = {x: 0, y: -ScreenHeight};
    } else if (this.gesture === 'down') {
      value = {x: 0, y: vertical};
    }
    return value;
  }

  createSwipeEvent(point: { x: number; y: number }): SwipeEvent {
    return {
      point,
      layout: this.layout,
      swipeDirection: this.gesture,
    };
  }

  swipeOutAnim = (event: SwipeEvent) => {
    Animated.spring(this.panGesture, {
      toValue: this.toValue(),
      velocity: 0,
      tension: 72,
      friction: 12,
      useNativeDriver: false,
    }).start(() => {
      this.props.onSwipeOut && this.props.onSwipeOut(event);
    });
  }

  swipeCancelAnim = (event: SwipeEvent) => {
    Animated.spring(this.panGesture, {
      toValue: { x: 0, y: 0 },
      velocity: 0,
      tension: 72,
      friction: 12,
      useNativeDriver: false,
    }).start();
    this.gesture = "";
  }

  panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (e, state) => (
      state.dx !== 0 && state.dy !== 0
    ),
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (e, state) => {
      const newGesture = getSwipeGesture(state);
      if (newGesture && checkSame(this.gesture, newGesture)) {
        this.gesture = newGesture;
      }
      if (this.checkValidGesture(state)) {
        let animEvent = null;
        if (checkVerticalGesture(this.gesture)) {
          animEvent = { dy: this.panGesture.y };
        } else if (checkHorizontalGesture(this.gesture)) {
          animEvent = { dx: this.panGesture.x };
        }
        Animated.event([null, animEvent], {useNativeDriver: false})(e, state);
        this.props.onSwiping && this.props.onSwiping(this.createSwipeEvent({
          x: (this.panGesture.x as AminatedValueXY)._value,
          y: (this.panGesture.y as AminatedValueXY)._value,
        }));
      }
    },
    onPanResponderRelease: () => {
      this.panGesture.flattenOffset();
      const event = this.createSwipeEvent({
        x: (this.panGesture.x as AminatedValueXY)._value,
        y: (this.panGesture.y as AminatedValueXY)._value,
      });
      if (
        this.props.onSwipeOut && this.props.swipeThreshold && (
        Math.abs((this.panGesture.y as AminatedValueXY)._value) > this.props.swipeThreshold ||
        Math.abs((this.panGesture.x as AminatedValueXY)._value) > this.props.swipeThreshold)
      ) {
        this.props.onSwipingOut && this.props.onSwipingOut(event);
        this.swipeOutAnim(event);
        return;
      } else {
        this.swipeCancelAnim(event);
      }
    }
  });

  render() {
    const { style, children: renderChildren } = this.props;
    const inner = renderChildren({
      panGesture: this.panGesture,
      onLayout: this.onLayout,
    });

    return (
      <Animated.View
        {...this.panResponder.panHandlers}
        style={style}
      >
        {inner}
      </Animated.View>
    );
  }
}
