import { Animated } from 'react-native';
import Animation, { AnimationConfig } from './AnimationAbstract';
 
type FadeAnimationConfig = AnimationConfig & {
  animationDuration?: number,
}
 
export default class AnimationFade extends Animation {
  animationDuration: number
 
  constructor({
    initialValue = 0,
    useNativeDriver = false,
    animationDuration = 80,
  }: FadeAnimationConfig = {}) {
    super({ initialValue, useNativeDriver });
    this.animationDuration = animationDuration;
  }
 
  in(onComplete?: Animated.EndCallback): void {
    Animated.timing(this.animate, {
      toValue: 1,
      duration: this.animationDuration,
      useNativeDriver: this.useNativeDriver,
    }).start(onComplete);
  }
 
  out(onComplete?: Animated.EndCallback): void {
    Animated.timing(this.animate, {
      toValue: 0,
      duration: this.animationDuration,
      useNativeDriver: this.useNativeDriver,
    }).start(onComplete);
  }
 
  getAnimations(): Object {
    return { opacity: this.animate };
  }
}