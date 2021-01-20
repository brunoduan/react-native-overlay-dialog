import { Animated } from 'react-native';

export type AnimationConfig = {
  initialValue?: number;
  useNativeDriver?: boolean;
};

export default class AnimationAbstract {
  useNativeDriver: boolean
  animate: Animated.Value

  constructor({
    initialValue = 0,
    useNativeDriver = true,
  }: AnimationConfig = {}) {
    this.animate = new Animated.Value(initialValue);
    this.useNativeDriver = useNativeDriver;
  }

  in(onComplete?: Animated.EndCallback): void {
    throw Error('No implementation for this class');
  }

  out(onComplete?: Animated.EndCallback): void {
    throw Error('No implementation for this class');
  }

  getAnimations(): Object {
    throw Error('No implementation for this class');
  }
}
