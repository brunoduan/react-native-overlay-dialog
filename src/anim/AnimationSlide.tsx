import { Animated } from 'react-native';
import Animation, { AnimationConfig } from './AnimationAbstract';
import { ScreenWidth, ScreenHeight } from '../util/Style'

type SlideFrom = 'top' | 'bottom' | 'left' | 'right';
type AnimationSlideConfig = AnimationConfig & {
  slideFrom?: SlideFrom,
}

export default class AnimationSlide extends Animation {
  slideFrom: SlideFrom;

  static SLIDE_FROM_TOP = 'top';
  static SLIDE_FROM_BOTTOM = 'bottom';
  static SLIDE_FROM_LEFT = 'left';
  static SLIDE_FROM_RIGHT = 'right';

  constructor({
    initialValue = 0,
    useNativeDriver = true,
    slideFrom = 'bottom',
  }: AnimationSlideConfig = {}) {
    super({ initialValue, useNativeDriver });
    this.slideFrom = slideFrom;
  }

  in(onComplete?: Animated.EndCallback, options = {}): void {
    Animated.spring(this.animate, {
      toValue: 1,
      velocity: 0,
      tension: 72,
      friction: 12,
      useNativeDriver: this.useNativeDriver,
      ...options,
    }).start(onComplete);
  }

  out(onComplete?: Animated.EndCallback, options = {}): void {
    Animated.spring(this.animate, {
      toValue: 0,
      velocity: 0,
      tension: 72,
      friction: 12,
      useNativeDriver: this.useNativeDriver,
      ...options,
    }).start(onComplete);
  }

  getAnimations(): Object {
    const transform = [];
    if (this.slideFrom === 'top') {
      transform.push({
        translateY: this.animate.interpolate({
          inputRange: [0, 1],
          outputRange: [-ScreenHeight, 0],
        }),
      });
    } else if (this.slideFrom === 'bottom') {
      transform.push({
        translateY: this.animate.interpolate({
          inputRange: [0, 1],
          outputRange: [ScreenHeight, 0],
        }),
      });
    } else {
      throw new Error(`
        slideFrom: ${this.slideFrom} not supported. 'slideFrom' must be 'top' | 'bottom'
      `);
    }
    return {
      transform,
    };
  }
}
