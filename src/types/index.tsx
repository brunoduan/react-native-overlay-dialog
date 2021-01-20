import React, { ReactElement, ReactNode } from 'react';
import DialogAction from '../view/DialogAction';
import Animation from '../anim/AnimationAbstract'

export type SwipeDirection = 'up' | 'down' | 'left' | 'right'
export type DialogAlignType = 'left' | 'center' | 'right'

export type DialogProps = {
  visible: boolean;
  width?: number;
  height?: number;
  hasOverlay?: boolean;
  overlayBackgroundColor?: string;
  overlayOpacity?: number;
  title?: ReactElement<any>;
  body?: any;
  footer?: ReactNode;
  children?: any;
  dialogAnimation?: Animation;
  dialogStyle?: any;
  style?: any;
  animationDuration?: number;
  onShow?: () => void;
  onMove?: (event: SwipeEvent) => void,
  onSwiping?: (event :SwipeEvent) => void,
  onSwipingOut?: (event: SwipeEvent) => void,
  onSwipeOut?: (event: SwipeEvent) => void,
  onTapOut?: () => void;
  swipeDirection?: SwipeDirection | Array<SwipeDirection>;
  swipeThreshold?: number;
  useNativeDriver?: boolean;
}

export type DialogTitleProps = {
  title: any;
  style?: any;
  textStyle?: any;
  align?: string;
}

export type DialogBodyProps = {
  children: any,
  style?: any,
}

export type DialogFooterProps = {
  children: DialogFooterActionList;
  style?: any;
}

export type DialogFooterActionList = Array<ReactElement<typeof DialogAction>>;

export type DialogActionProps = {
  text: string;
  textStyle?: any;
  onPress: () => void;
  align?: DialogAlignType;
  style?: any;
  disabled?: boolean;
  activeOpacity?: number;
}

export type OverlayProps = {
  visible: boolean;
  opacity: number;
  onPress?: () => void;
  backgroundColor?: string;
  animationDuration?: number;
  pointerEvents?: 'box-none' | 'none' | 'box-only' | 'auto';
  useNativeDriver?: boolean;
}

export type Point = {
  x: number;
  y: number;
}

export type Layout = {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type SwipeEvent = {
  point: Point,
  layout: Layout,
  swipeDirection: string | null;
}
